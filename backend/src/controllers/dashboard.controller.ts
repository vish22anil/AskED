import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getStudentDashboardData, getTeacherDashboardData, getAdminDashboardData } from '../services/dashboard.service';
import { AppError } from '../utils/errors';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const data = await getStudentDashboardData(userId);
  res.status(200).json({ success: true, message: 'Student dashboard data fetched', data });
};

export const getTeacherDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const data = await getTeacherDashboardData(userId);
  res.status(200).json({ success: true, message: 'Teacher dashboard data fetched', data });
};

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  const data = await getAdminDashboardData();
  res.status(200).json({ success: true, message: 'Admin dashboard data fetched', data });
};
