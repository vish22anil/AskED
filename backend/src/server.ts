import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './utils/prisma';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 3000;

const ensureGuestUser = async () => {
  try {
    const guestEmail = 'guest@asked.local';
    let guestUser = await prisma.user.findUnique({ where: { email: guestEmail } });
    
    if (!guestUser) {
      const passwordHash = await bcrypt.hash('GuestPassword123!', 10);
      guestUser = await prisma.user.create({
        data: {
          fullName: 'Guest User',
          email: guestEmail,
          passwordHash,
          role: 'STUDENT',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          isApproved: true,
          bio: 'I am a guest browsing AskED.',
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=GuestUser`,
        }
      });
      console.log('✅ Shadow Guest User created successfully.');
    } else {
      console.log('✅ Shadow Guest User already exists.');
    }
  } catch (error) {
    console.error('❌ Failed to ensure Guest User:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await ensureGuestUser();
});
