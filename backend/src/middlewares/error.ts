import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/exception';

/**
 * Handles errors thrown by the application and returns a JSON response
 * @param {HttpError} error 
 * @param {Request} req express request
 * @param {Response} res express response
 * @param {NextFunction} next callback
 */
function errorMiddleware(error: HttpError, req: Request, res: Response, next: NextFunction) {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error('[ERROR] ', status, message);

  res.status(status).json({ message });
}

export default errorMiddleware;
