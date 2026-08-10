import express from 'express';
import { getStudentDashboard, getTeacherDashboard, getAdminDashboard } from '../controllers/dashboard.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/student', protect, restrictTo('STUDENT'), getStudentDashboard);
router.get('/teacher', protect, restrictTo('TEACHER'), getTeacherDashboard);
router.get('/admin', protect, restrictTo('ADMIN'), getAdminDashboard);

export default router;
