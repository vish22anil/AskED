import express from 'express';
import { createQuestionHandler, getQuestionsHandler, getQuestionByIdHandler, updateQuestionHandler, deleteQuestionHandler } from '../controllers/question.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getQuestionsHandler);
router.get('/:id', getQuestionByIdHandler);

router.use(protect);

router.post('/', restrictTo('STUDENT'), createQuestionHandler);
router.put('/:id', restrictTo('STUDENT'), updateQuestionHandler);
router.delete('/:id', restrictTo('STUDENT', 'ADMIN'), deleteQuestionHandler);

export default router;
