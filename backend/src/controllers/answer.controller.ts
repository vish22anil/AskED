import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createAnswer, acceptAnswer } from '../services/answer.service';
import { AppError } from '../utils/errors';

export const createAnswerHandler = async (req: AuthRequest, res: Response) => {
  const { questionId, content } = req.body;
  const teacherId = req.user?.id;

  if (!teacherId) {
    throw new AppError('Unauthorized', 401);
  }

  const answer = await createAnswer(teacherId, questionId, content);
  res.status(201).json({ success: true, message: 'Answer posted successfully', data: answer });
};

export const acceptAnswerHandler = async (req: AuthRequest, res: Response) => {
  const answerId = req.params.answerId as string;
  const studentId = req.user?.id;

  if (!studentId) {
    throw new AppError('Unauthorized', 401);
  }

  try {
    const answer = await acceptAnswer(answerId, studentId);
    res.status(200).json({ success: true, message: 'Answer accepted', data: answer });
  } catch (error: any) {
    throw new AppError(error.message, 403);
  }
};
