import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from './email.service';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createAndSendOTP = async (email: string, type: string, data?: any) => {
  // Cooldown check (60 seconds)
  const recentOtp = await prisma.otp.findFirst({
    where: { 
      email, 
      type,
      createdAt: { gte: new Date(Date.now() - 60 * 1000) } 
    }
  });

  if (recentOtp) {
    throw new AppError('Please wait 60 seconds before requesting a new OTP.', 429);
  }

  // Delete older OTPs for this email and type to prevent accumulation
  await prisma.otp.deleteMany({
    where: { email, type }
  });

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.otp.create({
    data: {
      email,
      otpHash,
      type,
      data: data || {},
      expiresAt
    }
  });

  const subject = type === 'REGISTRATION' ? 'Verify your AskED Registration' : 'Password Reset for AskED';
  const html = `
    <h2>Your Verification Code</h2>
    <p>Please use the following 6-digit code to complete your verification.</p>
    <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
    <p>This code will expire in 5 minutes. Do not share it with anyone.</p>
  `;

  await sendEmail(email, subject, html);
};

export const verifyOTP = async (email: string, otp: string, type: string) => {
  const otpRecord = await prisma.otp.findFirst({
    where: { email, type },
    orderBy: { createdAt: 'desc' }
  });

  if (!otpRecord) {
    throw new AppError('No OTP found for this email.', 404);
  }

  if (otpRecord.attempts >= 3) {
    await prisma.otp.delete({ where: { id: otpRecord.id } });
    throw new AppError('Maximum verification attempts exceeded. Please request a new OTP.', 403);
  }

  if (new Date() > otpRecord.expiresAt) {
    await prisma.otp.delete({ where: { id: otpRecord.id } });
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

  if (!isValid) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 }
    });
    throw new AppError('Invalid OTP.', 400);
  }

  // If valid, delete the OTP so it can't be reused
  await prisma.otp.delete({ where: { id: otpRecord.id } });

  return otpRecord;
};
