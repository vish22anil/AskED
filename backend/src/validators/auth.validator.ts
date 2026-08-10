import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const passwordMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailMessage = 'Invalid email address format.';

export const registerStudentSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().regex(emailRegex, emailMessage),
    password: z.string().regex(passwordRegex, passwordMessage),
    confirmPassword: z.string(),
    department: z.string().min(1, 'Department is required'),
    university: z.string().min(1, 'University is required'),
    year: z.coerce.number().min(1, 'Year is required'),
    rollNumber: z.string().min(1, 'Roll Number is required'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
});

export const registerTeacherSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().regex(emailRegex, emailMessage),
    password: z.string().regex(passwordRegex, passwordMessage),
    confirmPassword: z.string(),
    department: z.string().min(1, 'Department is required'),
    university: z.string().min(1, 'University is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, emailMessage),
    password: z.string().min(1, 'Password is required'),
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, emailMessage),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    type: z.enum(['REGISTRATION', 'FORGOT_PASSWORD']),
  })
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, emailMessage),
    type: z.enum(['REGISTRATION', 'FORGOT_PASSWORD']),
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, emailMessage),
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, emailMessage),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    newPassword: z.string().regex(passwordRegex, passwordMessage),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
});
