import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`\n--- 🚨 BACKEND EXCEPTION 🚨 ---`);
  console.error(`Path: ${req.method} ${req.path}`);
  console.error(`Request Body:`, JSON.stringify(req.body, null, 2));
  console.error(`Exact Exception: ${err.name} - ${err.message}`);
  console.error(`Stack Trace:\n${err.stack}`);
  console.error(`--------------------------------\n`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorName: err.name,
      stack: err.stack
    });
  }

  if (err.name === 'ZodError') {
    const zodErr = err as any;
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errorName: 'ZodError',
      errors: zodErr.errors ? zodErr.errors.map((e: any) => ({ path: e.path ? e.path.join('.') : '', message: e.message })) : [],
      stack: err.stack
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    errorName: err.name,
    stack: err.stack
  });
};
