import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logAuthEvent = async (userId: string, action: string, metadata?: any) => {
  try {
    if (userId === 'UNKNOWN') {
      console.log(`[AUDIT] Action: ${action} | Metadata:`, metadata);
      return;
    }

    await prisma.activity.create({
      data: {
        userId,
        type: action,
        metadata: metadata || {}
      }
    });
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
};
