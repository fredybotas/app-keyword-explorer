import { RequestHandler } from 'express';
import { getLogger, LogLevel } from '../utils/logger';
import log4js from 'log4js';

export function middleware(): RequestHandler {
  return log4js.connectLogger(getLogger('HTTP'), {
    level: LogLevel.INFO,
    statusRules: [{ from: 500, to: 599, level: LogLevel.ERROR }],
  });
}
