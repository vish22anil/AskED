import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { updateSettings, updateAvatar } from '../controllers/users.controller';

const router = Router();

router.use(protect);

router.put('/settings', updateSettings);
router.put('/avatar', updateAvatar);

export default router;
