import middy from '@middy/core';
import { createError } from '@middy/util';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Options, { defaultOptions } from './options';

const middleware = (opts: Options): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  let {
    inputSchema,
    inputErrorValidationMessage,
    outputSchema,
    outputErrorValidationMessage,
  } = { ...defaultOptions, ...opts }

  const onBefore: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    if (inputSchema) {
      const { error: validationError } = inputSchema.validate(request.event.body);
      if (validationError) {
        // Bad Request
        const error = createError(400, inputErrorValidationMessage ? inputErrorValidationMessage : validationError.message);
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
      }
    }
  };

  const onAfter: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    if (outputSchema) {
      const { error: validationError } = outputSchema.validate(request.response);
      if (validationError) {
        // Internal Server Error
        const error = createError(500, outputErrorValidationMessage ? outputErrorValidationMessage : validationError.message);
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
      }
    }
  };

  return {
    before: inputSchema ? onBefore : undefined,
    after: outputSchema ? onAfter : undefined
  }
}

export default middleware;