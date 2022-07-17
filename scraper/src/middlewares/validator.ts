import { RequestHandler } from 'express';
import { parseErrors } from '../utils/validator/errors';
import { HttpError } from '../utils/errors/HttpError';
import { Validator } from '../utils/validator/validator';

const validator = new Validator();

const defaultSchema = {
  type: 'object',
  properties: {
    query: {},
    params: {},
    body: {},
    headers: {},
  },
};

export function middleware(schema: any): RequestHandler<any, any, any, any> {
  const reqSchema = {
    ...defaultSchema,
    properties: {
      query: schema.query ?? defaultSchema.properties.query,
      params: schema.params ?? defaultSchema.properties.params,
      body: schema.body ?? defaultSchema.properties.body,
      headers: schema.headers ?? defaultSchema.properties.headers,
    },
  };

  const validateFunction = validator.compile(reqSchema);

  return (req, res, next) => {
    const reqData = {
      query: req.query,
      params: req.params,
      body: req.body,
      headers: req.headers,
    };

    validateFunction(reqData);

    const errors = validateFunction.errors ?? [];
    const validationErrors = parseErrors(errors);
    if (validationErrors.length !== 0) {
      const err = new HttpError(400, JSON.stringify(validationErrors));
      return next(err);
    }
    return next();
  };
}
