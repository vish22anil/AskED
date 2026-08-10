import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import prisma from '../utils/prisma';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { questionId, answerId } = req.body;
    
    // Check if Cloudinary or Local
    let fileUrl = req.file.path; // Cloudinary returns the full URL in path
    
    // If it's a local upload, path will be an absolute OS path, we need to convert it to a serveable URL
    // Actually, req.file.filename will exist for diskStorage
    if (req.file.filename && !fileUrl.startsWith('http')) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const attachment = await prisma.attachment.create({
      data: {
        url: fileUrl,
        filename: req.file.originalname,
        fileType: req.file.mimetype,
        size: req.file.size,
        uploaderId: (req as any).user.id,
        questionId: questionId || null,
        answerId: answerId || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        attachment
      }
    });
  } catch (error) {
    next(error);
  }
};
