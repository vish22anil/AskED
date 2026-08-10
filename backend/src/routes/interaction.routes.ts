import express from 'express';
import { voteHandler, bookmarkHandler, commentHandler } from '../controllers/interaction.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/vote', protect, voteHandler);
router.post('/bookmark', protect, bookmarkHandler);
router.post('/comment', protect, commentHandler);

export default router;
