/* eslint-disable no-unused-vars */
import { getLogger as log4jsLogger, Logger } from 'log4js';

export const enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

const LOGGERS: {
  [key: string]: Logger;
} = {};

export function getLogger(name: string = 'APP', level: LogLevel = LogLevel.TRACE): Logger {
  if (!LOGGERS[name]) {
    LOGGERS[name] = log4jsLogger(name);
    LOGGERS[name].level = level;
  }

  return LOGGERS[name];
}
