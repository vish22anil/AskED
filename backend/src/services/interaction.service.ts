import prisma from '../utils/prisma';
import { logActivity } from './activity.service';
import { updateReputation, REPUTATION_SCORES } from './reputation.service';

export const toggleVote = async (userId: string, isUpvote: boolean, questionId?: string, answerId?: string) => {
  if (!questionId && !answerId) throw new Error('Must provide questionId or answerId');

  const existingVote = await prisma.vote.findFirst({
    where: { userId, questionId, answerId }
  });

  let result;
  if (existingVote) {
    if (existingVote.isUpvote === isUpvote) {
      // Remove vote if clicking the same one
      await prisma.vote.delete({ where: { id: existingVote.id } });
      result = { voted: false };
    } else {
      // Change vote
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { isUpvote }
      });
      result = { voted: true, isUpvote };
    }
  } else {
    // New vote
    await prisma.vote.create({
      data: { userId, questionId, answerId, isUpvote }
    });
    
    if (questionId) {
      await logActivity(userId, 'UPVOTED_QUESTION', { questionId });
    }
    result = { voted: true, isUpvote };
  }

  // Calculate new reputation
  if (result.voted) {
    if (answerId) {
      const answer = await prisma.answer.findUnique({ where: { id: answerId } });
      if (answer) {
        await updateReputation(answer.teacherId, isUpvote ? REPUTATION_SCORES.ANSWER_UPVOTED : REPUTATION_SCORES.DOWNVOTED);
        // Create notification for answer author
        await prisma.notification.create({
          data: {
            userId: answer.teacherId,
            type: 'UPVOTE',
            message: `Someone ${isUpvote ? 'upvoted' : 'downvoted'} your answer`,
            link: `/questions/${answer.questionId}`
          }
        });
      }
    } else if (questionId) {
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      if (question) {
        await updateReputation(question.studentId, isUpvote ? REPUTATION_SCORES.QUESTION_UPVOTED : REPUTATION_SCORES.DOWNVOTED);
      }
    }
  }

  return result;
};

export const toggleBookmark = async (userId: string, questionId: string) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: { userId_questionId: { userId, questionId } }
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id }
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: { userId, questionId }
    });
    return { bookmarked: true };
  }
};

export const addComment = async (userId: string, content: string, questionId?: string, answerId?: string) => {
  if (!questionId && !answerId) throw new Error('Must provide questionId or answerId');

  const comment = await prisma.comment.create({
    data: { userId, content, questionId, answerId },
    include: {
      user: { select: { id: true, fullName: true, profileImage: true } }
    }
  });

  return comment;
};
