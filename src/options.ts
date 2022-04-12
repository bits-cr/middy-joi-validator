import Joi, { ValidationOptions } from 'joi';

export interface Options {
  inputSchema?: Joi.ObjectSchema | undefined;
  inputValidationOptions?: ValidationOptions | undefined;
  preserveRawBody?: boolean | undefined;
  inputErrorValidationMessage?: string | undefined;
  headersSchema?: Joi.ObjectSchema | undefined;
  headersValidationOptions?: ValidationOptions | undefined;
  preserveRawHeaders?: boolean | undefined;
  headersErrorValidationMessage?: string | undefined;
  outputSchema?: Joi.ObjectSchema | undefined;
  outputValidationOptions?: ValidationOptions | undefined;
  outputErrorValidationMessage?: string | undefined;
}

const defaultOptions: Options = {
  headersValidationOptions: {
    allowUnknown: true,
  },
  preserveRawBody: false,
  preserveRawHeaders: false,
}

export default Options;
export { defaultOptions };
