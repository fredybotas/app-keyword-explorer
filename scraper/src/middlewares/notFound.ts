import { RequestHandler } from 'express';
import { HttpError } from '../utils/errors/HttpError';

export function middleware(): RequestHandler {
  return (req, res, next) => {
    const err = new HttpError(404, 'Not found');
    return next(err);
  };
}
