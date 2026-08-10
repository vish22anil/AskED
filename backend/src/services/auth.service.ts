import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AppError } from '../utils/errors';
import { Role } from '@prisma/client';
import { createAndSendOTP, verifyOTP } from './otp.service';
import { logAuthEvent } from './audit.service';

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

export const requestRegistrationOTPService = async (data: any, role: Role) => {
  const { email } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new AppError('An account with this email already exists. Please sign in.', 409);
  }

  // Check unique constraints before sending OTP (like rollNumber or employeeId)
  if (data.rollNumber) {
    const existingRoll = await prisma.user.findUnique({ where: { rollNumber: data.rollNumber } });
    if (existingRoll) throw new AppError('Roll number is already registered to another account.', 409);
  }
  if (data.employeeId) {
    const existingEmp = await prisma.user.findUnique({ where: { employeeId: data.employeeId } });
    if (existingEmp) throw new AppError('Employee ID is already registered to another account.', 409);
  }

  // Hash password before temporarily storing it
  const passwordHash = await bcrypt.hash(data.password, 10);
  
  const registrationData = {
    ...data,
    email: normalizedEmail,
    passwordHash,
    role
  };
  delete registrationData.password;
  delete registrationData.confirmPassword;

  await createAndSendOTP(normalizedEmail, 'REGISTRATION', registrationData);
  await logAuthEvent('UNKNOWN', 'REQUESTED_REGISTRATION_OTP', { email: normalizedEmail });
  
  return { message: 'OTP sent successfully to email' };
};

export const verifyRegistrationOTPService = async (email: string, otp: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await verifyOTP(normalizedEmail, otp, 'REGISTRATION');
  
  const data: any = otpRecord.data;

  // Final check just in case
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const newUser = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      role: data.role,
      department: data.department || null,
      university: data.university || null,
      year: data.year ? parseInt(data.year, 10) : null,
      rollNumber: data.rollNumber || null,
      employeeId: data.employeeId || null,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      isApproved: data.role === 'STUDENT' // Students auto-approved, teachers require admin approval
    }
  });

  await logAuthEvent(newUser.id, 'USER_REGISTERED', { email: normalizedEmail });

  return newUser;
};

export const loginUserService = async (data: any) => {
  const { email, password } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    if (user) await logAuthEvent(user.id, 'FAILED_LOGIN', { reason: 'Incorrect password' });
    throw new AppError('Incorrect email or password', 401);
  }

  if (!user.emailVerified) {
    throw new AppError('Please verify your email before logging in.', 403);
  }

  if (user.role === 'TEACHER' && !user.isApproved) {
    throw new AppError('Your teacher account is awaiting administrator approval.', 403);
  }

  await logAuthEvent(user.id, 'SUCCESSFUL_LOGIN');

  return user;
};

export const requestForgotPasswordOTPService = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  
  if (!user) {
    // For security, don't reveal if email exists, just return success
    return { message: 'If that email is registered, an OTP has been sent.' };
  }

  await createAndSendOTP(normalizedEmail, 'FORGOT_PASSWORD');
  await logAuthEvent(user.id, 'REQUESTED_PASSWORD_RESET_OTP');
  
  return { message: 'If that email is registered, an OTP has been sent.' };
};

export const resetPasswordService = async (data: any) => {
  const { email, otp, newPassword } = data;
  const normalizedEmail = email.toLowerCase().trim();
  
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new AppError('Invalid request.', 400);
  }

  await verifyOTP(normalizedEmail, otp, 'FORGOT_PASSWORD');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  await logAuthEvent(user.id, 'PASSWORD_RESET_SUCCESSFUL');

  return { message: 'Password reset successfully' };
};

export const resendOtpService = async (email: string, type: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  // Fetch latest data if REGISTRATION to preserve data
  let data = {};
  if (type === 'REGISTRATION') {
    const existingOtp = await prisma.otp.findFirst({
      where: { email: normalizedEmail, type: 'REGISTRATION' },
      orderBy: { createdAt: 'desc' }
    });
    if (!existingOtp) {
      throw new AppError('No pending registration found to resend OTP for.', 400);
    }
    data = existingOtp.data || {};
  }
  
  await createAndSendOTP(normalizedEmail, type, data);
  return { message: 'OTP resent successfully' };
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true, role: true, profileImage: true, department: true, year: true }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
