import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { toggleVote, toggleBookmark, addComment } from '../services/interaction.service';
import { AppError } from '../utils/errors';

export const voteHandler = async (req: AuthRequest, res: Response) => {
  const { questionId, answerId, isUpvote } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new AppError('Unauthorized', 401);

  const result = await toggleVote(userId, isUpvote, questionId, answerId);
  res.status(200).json({ success: true, message: 'Vote toggled', data: result });
};

export const bookmarkHandler = async (req: AuthRequest, res: Response) => {
  const { questionId } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new AppError('Unauthorized', 401);

  const result = await toggleBookmark(userId, questionId);
  res.status(200).json({ success: true, message: 'Bookmark toggled', data: result });
};

export const commentHandler = async (req: AuthRequest, res: Response) => {
  const { questionId, answerId, content } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new AppError('Unauthorized', 401);

  const comment = await addComment(userId, content, questionId, answerId);
  res.status(201).json({ success: true, message: 'Comment added', data: comment });
};
