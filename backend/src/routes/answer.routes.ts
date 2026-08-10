import express from 'express';
import { createAnswerHandler, acceptAnswerHandler } from '../controllers/answer.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, restrictTo('TEACHER'), createAnswerHandler);
router.patch('/:answerId/accept', protect, restrictTo('STUDENT'), acceptAnswerHandler);

export default router;
