import { ErrorObject } from 'ajv';

export type IValidationError = {
  path: string;
  message: string;
};

export function parseErrors(errors: ErrorObject[]): IValidationError[] {
  return errors.map((error) => parseError(error));
}

export function parseError(error: ErrorObject): IValidationError {
  let ePath = error.instancePath;
  let eMessage = error.keyword;

  switch (error.keyword) {
    case 'required': {
      ePath += `/${error.params.missingProperty}`;
      break;
    }
    case 'additionalProperties': {
      ePath += `/${error.params.additionalProperty}`;
      eMessage = 'forbidden';
      break;
    }
    case 'format': {
      eMessage = 'invalid';
      break;
    }
  }

  return {
    path: ePath,
    message: eMessage,
  };
}
