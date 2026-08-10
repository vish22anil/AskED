import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    if ((e as any).name === 'ZodError') {
      const errObj = e as any;
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: (errObj.errors || errObj.issues || []).map((err: any) => ({ path: err.path ? err.path.join('.') : '', message: err.message }))
      });
    }
    next(e);
  }
};
