import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { handleAiChatStream, getConversations, getConversationMessages, getHealth } from '../controllers/ai.controller';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Public route
router.get('/health', getHealth);
router.post('/chat', aiRateLimiter, handleAiChatStream);

// Protected routes
router.use(protect);
router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getConversationMessages);

export default router;
