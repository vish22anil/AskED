import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { getUsers, disableUser, enableUser, approveTeacher, deleteQuestion, deleteAnswer } from '../controllers/admin.controller';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/users', getUsers);
router.put('/users/:id/disable', disableUser);
router.put('/users/:id/enable', enableUser);
router.put('/teachers/:id/approve', approveTeacher);

router.delete('/questions/:id', deleteQuestion);
router.delete('/answers/:id', deleteAnswer);

export default router;
