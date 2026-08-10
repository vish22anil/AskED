import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { 
  signToken, 
  loginUserService, 
  getUserByIdService,
  requestRegistrationOTPService,
  verifyRegistrationOTPService,
  requestForgotPasswordOTPService,
  resetPasswordService,
  resendOtpService
} from '../services/auth.service';

const createSendToken = (user: any, statusCode: number, res: Response, message: string) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        department: user.department,
        year: user.year,
      }
    }
  });
};

export const registerStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestRegistrationOTPService(req.body, Role.STUDENT);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const registerTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestRegistrationOTPService(req.body, Role.TEACHER);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, type } = req.body;
    if (type === 'REGISTRATION') {
      const newUser = await verifyRegistrationOTPService(email, otp);
      // Auto login after successful verification
      createSendToken(newUser, 201, res, 'Account created and verified successfully');
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP type for this endpoint' });
    }
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, type } = req.body;
    const result = await resendOtpService(email, type);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestForgotPasswordOTPService(req.body.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await loginUserService(req.body);
    createSendToken(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};
