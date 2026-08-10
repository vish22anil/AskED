import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../utils/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isDisabled: true,
        isApproved: true,
        createdAt: true,
      }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const disableUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: { isDisabled: true }
    });
    res.status(200).json({ success: true, message: 'User disabled', data: user });
  } catch (error) {
    next(error);
  }
};

export const enableUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: { isDisabled: false }
    });
    res.status(200).json({ success: true, message: 'User enabled', data: user });
  } catch (error) {
    next(error);
  }
};

export const approveTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: { isApproved: true }
    });
    res.status(200).json({ success: true, message: 'Teacher approved', data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.question.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (error) {
    next(error);
  }
};

export const deleteAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.answer.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Answer deleted' });
  } catch (error) {
    next(error);
  }
};
