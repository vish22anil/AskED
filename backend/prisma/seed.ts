import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean the database
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1 Admin
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@asked.com',
      passwordHash,
      role: Role.ADMIN,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    }
  });

  // 3 Teachers
  const teacherData = [
    { fullName: 'Prof. Smith', email: 'smith@asked.com', department: 'Computer Science', employeeId: 'EMP001' },
    { fullName: 'Dr. Johnson', email: 'johnson@asked.com', department: 'Mathematics', employeeId: 'EMP002' },
    { fullName: 'Mr. Davis', email: 'davis@asked.com', department: 'Physics', employeeId: 'EMP003' },
  ];

  const teachers = await Promise.all(
    teacherData.map(t => prisma.user.create({
      data: {
        ...t,
        passwordHash,
        role: Role.TEACHER,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.fullName)}`,
      }
    }))
  );

  // 10 Students
  const studentData = Array.from({ length: 10 }).map((_, i) => ({
    fullName: `Student ${i + 1}`,
    email: `student${i + 1}@asked.com`,
    year: 1 + (i % 4), // Years 1-4
    rollNumber: `ROLL${1000 + i}`,
  }));

  const students = await Promise.all(
    studentData.map(s => prisma.user.create({
      data: {
        ...s,
        passwordHash,
        role: Role.STUDENT,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.fullName)}`,
      }
    }))
  );

  // 10 Subjects
  const subjectData = [
    { name: 'Data Structures', code: 'CS201', semester: 3 },
    { name: 'Algorithms', code: 'CS202', semester: 4 },
    { name: 'Database Systems', code: 'CS301', semester: 5 },
    { name: 'Operating Systems', code: 'CS302', semester: 5 },
    { name: 'Calculus I', code: 'MA101', semester: 1 },
    { name: 'Calculus II', code: 'MA102', semester: 2 },
    { name: 'Linear Algebra', code: 'MA201', semester: 3 },
    { name: 'Physics I', code: 'PH101', semester: 1 },
    { name: 'Physics II', code: 'PH102', semester: 2 },
    { name: 'Quantum Mechanics', code: 'PH301', semester: 6 },
  ];

  const subjects = await Promise.all(
    subjectData.map(s => prisma.subject.create({
      data: s
    }))
  );

  // Link Teachers to Subjects
  // Teacher 0 (Smith, CS) -> CS Subjects
  await prisma.teacherSubject.create({ data: { teacherId: teachers[0].id, subjectId: subjects[0].id } });
  await prisma.teacherSubject.create({ data: { teacherId: teachers[0].id, subjectId: subjects[1].id } });
  await prisma.teacherSubject.create({ data: { teacherId: teachers[0].id, subjectId: subjects[2].id } });

  // Teacher 1 (Johnson, Math) -> Math Subjects
  await prisma.teacherSubject.create({ data: { teacherId: teachers[1].id, subjectId: subjects[4].id } });
  await prisma.teacherSubject.create({ data: { teacherId: teachers[1].id, subjectId: subjects[5].id } });

  // Teacher 2 (Davis, Physics) -> Physics Subjects
  await prisma.teacherSubject.create({ data: { teacherId: teachers[2].id, subjectId: subjects[7].id } });
  await prisma.teacherSubject.create({ data: { teacherId: teachers[2].id, subjectId: subjects[8].id } });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
