import express from 'express';
import { getPublicStats } from '../controllers/public.controller';

const router = express.Router();

router.get('/stats', getPublicStats);

export default router;
