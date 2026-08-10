import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getPublicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalStudents, totalTeachers, totalQuestions, totalAnswers] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.question.count(),
      prisma.answer.count(),
    ]);

    // Calculate a naive satisfaction/success rate based on accepted answers
    const acceptedAnswers = await prisma.answer.count({ where: { isAccepted: true } });
    let satisfactionRate = 0;
    if (totalQuestions > 0) {
      satisfactionRate = Math.round((acceptedAnswers / totalQuestions) * 100);
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalQuestions,
        totalAnswers,
        satisfactionRate
      }
    });
  } catch (error) {
    next(error);
  }
};
