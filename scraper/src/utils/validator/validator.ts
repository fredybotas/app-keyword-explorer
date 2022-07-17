import Ajv, { ValidateFunction } from 'ajv';

export class Validator {
  private readonly ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      coerceTypes: true,
      messages: false,
      useDefaults: true,
    });
  }

  public compile(schema: any): ValidateFunction {
    return this.ajv.compile(schema);
  }

  public validate(schema: any, data: any): boolean {
    return this.ajv.validate(schema, data);
  }
}
