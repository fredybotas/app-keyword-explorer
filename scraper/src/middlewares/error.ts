import { ErrorRequestHandler } from 'express';
import { getLogger } from '../utils/logger';
import { HttpError } from '../utils/errors/HttpError';

const LOGGER = getLogger();

export function middleware(): ErrorRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, req, res, next) => {
    const error: HttpError = err.status ? err : new HttpError(500, 'Internal Server Error');
    const body = {
      status: error.status,
      body: err.message,
    };

    if (err.status >= 500) {
      LOGGER.error(err);
    }
    return res.status(error.status).json(body).end();
  };
}
