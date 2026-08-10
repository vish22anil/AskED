import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, email: true, fullName: true, role: true, profileImage: true, 
        department: true, year: true, reputation: true, bio: true, 
        userBadges: { select: { badge: true } } 
      }
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError('Invalid token or session expired. Please log in again.', 401));
  }
};

export const restrictTo = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
