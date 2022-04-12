import Joi, { ValidationOptions } from 'joi';

export interface Options {
  inputSchema?: Joi.ObjectSchema | undefined;
  inputValidationOptions?: ValidationOptions | undefined;
  inputErrorValidationMessage?: string | undefined;
  headersSchema?: Joi.ObjectSchema | undefined;
  headersValidationOptions?: ValidationOptions | undefined;
  headersErrorValidationMessage?: string | undefined;
  outputSchema?: Joi.ObjectSchema | undefined;
  outputValidationOptions?: ValidationOptions | undefined;
  outputErrorValidationMessage?: string | undefined;
}

const defaultOptions: Options = {
  headersValidationOptions: {
    allowUnknown: true,
  }
}

export default Options;
export { defaultOptions };
