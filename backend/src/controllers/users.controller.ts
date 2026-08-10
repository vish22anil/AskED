import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error('Unauthorized');

    const { theme, emailNotifs, bio } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        theme: theme !== undefined ? theme : undefined,
        emailNotifs: emailNotifs !== undefined ? emailNotifs : undefined,
        bio: bio !== undefined ? bio : undefined
      }
    });

    res.status(200).json({ success: true, message: 'Settings updated', data: user });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error('Unauthorized');
    
    const { profileImage } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImage }
    });

    res.status(200).json({ success: true, message: 'Avatar updated', data: user });
  } catch (error) {
    next(error);
  }
};
