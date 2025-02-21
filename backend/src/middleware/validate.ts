import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: Record<string, string> = {};
    errors.array().forEach((error) => {
      if (error.type === 'field') {
        validationErrors[error.path] = error.msg;
      }
    });
    throw new AppError('Validation failed', 400, validationErrors);
  }
  next();
};
