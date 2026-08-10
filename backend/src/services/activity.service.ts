import prisma from '../utils/prisma';

export const logActivity = async (userId: string, type: string, metadata?: any) => {
  return await prisma.activity.create({
    data: {
      userId,
      type,
      metadata: metadata || {}
    }
  });
};

export const getUserActivity = async (userId: string, limit: number = 20) => {
  return await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};
