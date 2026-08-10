import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Endpoint for uploading single attachment
router.post('/', protect, upload.single('file'), uploadFile);

export default router;
