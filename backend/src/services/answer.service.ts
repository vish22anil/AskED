import prisma from '../utils/prisma';
import { logActivity } from './activity.service';
import { updateReputation, REPUTATION_SCORES } from './reputation.service';

export const createAnswer = async (teacherId: string, questionId: string, content: string) => {
  const answer = await prisma.answer.create({
    data: {
      content,
      teacherId,
      questionId
    },
    include: {
      teacher: { select: { id: true, fullName: true, profileImage: true, reputation: true } }
    }
  });

  // increase reputation of teacher for answering
  await updateReputation(teacherId, 5);
  
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  
  // Notification for the student
  if (question) {
    await prisma.notification.create({
      data: {
        userId: question.studentId, 
        type: 'NEW_ANSWER',
        message: `Someone answered your question`,
        link: `/questions/${questionId}`
      }
    });
  }

  await logActivity(teacherId, 'ANSWERED_QUESTION', { answerId: answer.id, questionId });

  return answer;
};

export const acceptAnswer = async (answerId: string, studentId: string) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { question: true }
  });

  if (!answer) throw new Error('Answer not found');
  if (answer.question.studentId !== studentId) throw new Error('Unauthorized');

  const updatedAnswer = await prisma.answer.update({
    where: { id: answerId },
    data: { isAccepted: true }
  });

  await prisma.question.update({
    where: { id: answer.questionId },
    data: { status: 'RESOLVED' }
  });

  // increase reputation of teacher for accepted answer
  await updateReputation(answer.teacherId, REPUTATION_SCORES.ANSWER_ACCEPTED);
  
  // Notification to the teacher
  await prisma.notification.create({
    data: {
      userId: answer.teacherId,
      type: 'ANSWER_ACCEPTED',
      message: `Your answer was accepted!`,
      link: `/questions/${answer.questionId}`
    }
  });

  return updatedAnswer;
};
