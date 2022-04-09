import Joi from 'joi';

export interface Options {
  inputSchema?: Joi.ObjectSchema | undefined;
  inputErrorValidationMessage?: string | undefined;
  outputSchema?: Joi.ObjectSchema | undefined;
  outputErrorValidationMessage?: string | undefined;
}

const defaultOptions: Options = {
  inputSchema: undefined,
  outputSchema: undefined
}

export default Options;
export { defaultOptions };
