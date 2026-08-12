import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { ensureGuestUser } from './services/guestUserService';

const PORT = process.env.PORT || 3000;

/*
 * Local development server
 *
 * This runs only when VERCEL is not set.
 * The Netlify/Vercel serverless function imports app.ts directly,
 * so app.listen() will not run there.
 */
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await ensureGuestUser();
  });
}