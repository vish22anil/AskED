import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registerStudent, registerTeacher, login, logout, getMe, verifyOtp, resendOtp, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { registerStudentSchema, registerTeacherSchema, loginSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const router = Router();

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many registration attempts. Please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Please try again later.' }
});

router.post('/register/student', registerLimiter, validate(registerStudentSchema), registerStudent);
router.post('/register/teacher', registerLimiter, validate(registerTeacherSchema), registerTeacher);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);

router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', otpLimiter, validate(resendOtpSchema), resendOtp);
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

router.use(protect);
router.get('/me', getMe);

export default router;
