import app from '../src/app';
import { ensureGuestUser } from '../src/server';

// Ensure the guest user exists on Vercel initialization
ensureGuestUser().catch(console.error);

export default app;
