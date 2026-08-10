import prisma from '../utils/prisma';

export const getStudentDashboardData = async (studentId: string) => {
  const [questionsAsked, answersReceived, bookmarks, activity] = await Promise.all([
    prisma.question.count({ where: { studentId } }),
    prisma.answer.count({ where: { question: { studentId } } }),
    prisma.bookmark.count({ where: { userId: studentId } }),
    prisma.activity.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  return {
    stats: {
      questionsAsked,
      answersReceived,
      bookmarks
    },
    recentActivity: activity
  };
};

export const getTeacherDashboardData = async (teacherId: string) => {
  const [answersProvided, acceptedAnswers, totalVotes, activity] = await Promise.all([
    prisma.answer.count({ where: { teacherId } }),
    prisma.answer.count({ where: { teacherId, isAccepted: true } }),
    prisma.vote.count({ where: { answer: { teacherId }, isUpvote: true } }),
    prisma.activity.findMany({
      where: { userId: teacherId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  return {
    stats: {
      answersProvided,
      acceptedAnswers,
      totalVotes
    },
    recentActivity: activity
  };
};

export const getAdminDashboardData = async () => {
  const [totalStudents, totalTeachers, totalQuestions, totalAnswers, openQuestions] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.question.count(),
    prisma.answer.count(),
    prisma.question.count({ where: { status: 'OPEN' } }),
  ]);

  return {
    stats: {
      totalStudents,
      totalTeachers,
      totalQuestions,
      totalAnswers,
      openQuestions
    }
  };
};
