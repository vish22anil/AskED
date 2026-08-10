import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion } from '../services/question.service';
import { AppError } from '../utils/errors';

export const createQuestionHandler = async (req: AuthRequest, res: Response) => {
  const { title, description, subjectId, tags, difficulty, isDraft } = req.body;
  const studentId = req.user?.id;

  if (!studentId) {
    throw new AppError('Unauthorized', 401);
  }

  const question = await createQuestion(studentId, title, description, subjectId, tags, difficulty, isDraft);
  res.status(201).json({ success: true, message: isDraft ? 'Draft saved' : 'Question created successfully', data: question });
};

export const updateQuestionHandler = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const studentId = req.user?.id;
  
  if (!studentId) throw new AppError('Unauthorized', 401);

  const existing = await getQuestionById(id);
  if (!existing || existing.studentId !== studentId) {
    throw new AppError('Question not found or unauthorized', 404);
  }

  const { title, description, subjectId, difficulty, isDraft } = req.body;
  const updated = await updateQuestion(id, { title, description, subjectId, difficulty, isDraft });

  res.status(200).json({ success: true, message: 'Question updated', data: updated });
};

export const deleteQuestionHandler = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const studentId = req.user?.id;

  if (!studentId) throw new AppError('Unauthorized', 401);

  const existing = await getQuestionById(id);
  if (!existing || existing.studentId !== studentId) {
    throw new AppError('Question not found or unauthorized', 404);
  }

  await deleteQuestion(id);
  res.status(200).json({ success: true, message: 'Question deleted' });
};

export const getQuestionsHandler = async (req: Request, res: Response) => {
  const { search, subjectId, tag, status, cursor, take, sort } = req.query;

  const filters = {
    search: search ? String(search) : undefined,
    subjectId: subjectId ? String(subjectId) : undefined,
    tag: tag ? String(tag) : undefined,
    status: status ? String(status) : undefined,
    cursor: cursor ? String(cursor) : undefined,
    sort: sort ? String(sort) : undefined,
    take: take ? parseInt(String(take)) : 20,
  };

  const result = await getQuestions(filters);
  res.status(200).json({ success: true, message: 'Questions fetched', data: result });
};

export const getQuestionByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const question = await getQuestionById(id);
  
  if (!question) {
    throw new AppError('Question not found', 404);
  }
  
  res.status(200).json({ success: true, message: 'Question fetched', data: question });
};
