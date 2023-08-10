import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/exception';

function errorMiddleware(error: HttpError, req: Request, res: Response, next: NextFunction) {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error('[ERROR] ', status, message);

  res.status(status).json({ message });
}

export default errorMiddleware;
