import prisma from '../utils/prisma';
import { logActivity } from './activity.service';

export const REPUTATION_SCORES = {
  ANSWER_ACCEPTED: 15,
  ANSWER_UPVOTED: 10,
  QUESTION_UPVOTED: 5,
  DOWNVOTED: -2
};

export const updateReputation = async (userId: string, amount: number) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { reputation: { increment: amount } }
  });

  await checkAndAwardBadges(user);
  return user.reputation;
};

export const checkAndAwardBadges = async (user: any) => {
  // Logic to award reputation-based badges
  if (user.reputation >= 100) {
    await awardBadge(user.id, 'Centurion', 'Reached 100 Reputation', '⭐');
  }
  if (user.reputation >= 500) {
    await awardBadge(user.id, 'Expert', 'Reached 500 Reputation', '🏆');
  }
};

export const awardBadge = async (userId: string, name: string, description: string, iconUrl: string) => {
  // Ensure badge exists in DB
  let badge = await prisma.badge.findUnique({ where: { name } });
  if (!badge) {
    badge = await prisma.badge.create({
      data: { name, description, iconUrl }
    });
  }

  // Check if user already has this badge
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } }
  });

  if (!existing) {
    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id }
    });
    // Create a notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE_EARNED',
        message: `You earned a new badge: ${name}!`,
        link: '/profile'
      }
    });
  }
};
