import prisma from '../utils/prisma';
import { logActivity } from './activity.service';

import { Difficulty } from '@prisma/client';

export const createQuestion = async (studentId: string, title: string, description: string, subjectId: string, tags: string[] = [], difficulty?: Difficulty, isDraft: boolean = false) => {
  const question = await prisma.question.create({
    data: {
      title,
      description,
      studentId,
      subjectId,
      difficulty,
      isDraft,
      tags: {
        create: tags.map(tag => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag }
            }
          }
        }))
      }
    },
    include: {
      subject: true,
      tags: { include: { tag: true } }
    }
  });

  await logActivity(studentId, 'ASKED_QUESTION', { questionId: question.id, title });
  return question;
};

export const getQuestions = async (filters: any) => {
  const { search, subjectId, tag, status, cursor, take = 20, sort = 'newest' } = filters;

  const where: any = { isDraft: false }; // By default don't fetch drafts
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (subjectId) where.subjectId = subjectId;
  if (status) where.status = status;
  if (tag) {
    where.tags = {
      some: { tag: { name: tag } }
    };
  }
  
  // Custom sorting logic
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  if (sort === 'most_viewed') orderBy = { views: 'desc' };
  // Prisma orderBy aggregate for answers or votes can be complex, 
  // keeping it simple for unanswered:
  if (sort === 'unanswered') {
    where.answers = { none: {} };
  }

  const queryArgs: any = {
    where,
    take: Number(take) + 1, // Fetch one extra to determine if there's a next page
    orderBy,
    include: {
      student: { select: { id: true, fullName: true, profileImage: true, reputation: true } },
      subject: true,
      tags: { include: { tag: true } },
      _count: { select: { answers: true, votes: true, comments: true } }
    }
  };

  if (cursor) {
    queryArgs.cursor = { id: cursor };
    queryArgs.skip = 1;
  }

  const questions = await prisma.question.findMany(queryArgs);

  let nextCursor = null;
  if (questions.length > Number(take)) {
    const nextItem = questions.pop();
    nextCursor = nextItem!.id;
  }

  const total = await prisma.question.count({ where });

  return { questions, nextCursor, total };
};

export const getQuestionById = async (id: string) => {
  return await prisma.question.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      student: { select: { id: true, fullName: true, profileImage: true, reputation: true } },
      subject: true,
      tags: { include: { tag: true } },
      answers: {
        include: {
          teacher: { select: { id: true, fullName: true, profileImage: true, reputation: true } },
          comments: { include: { user: { select: { id: true, fullName: true, profileImage: true } } } },
          votes: true
        }
      },
      comments: { include: { user: { select: { id: true, fullName: true, profileImage: true } } } },
      votes: true
    }
  });
};

export const updateQuestion = async (id: string, data: any) => {
  return await prisma.question.update({
    where: { id },
    data
  });
};

export const deleteQuestion = async (id: string) => {
  return await prisma.question.delete({
    where: { id }
  });
};
