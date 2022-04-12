import middy from '@middy/core';
import { createError } from '@middy/util';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import util from 'util';
import Options, { defaultOptions } from './options';

const middleware = (opts: Options): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  let {
    inputSchema,
    inputValidationOptions,
    preserveRawBody,
    inputErrorValidationMessage,
    headersSchema,
    headersValidationOptions,
    preserveRawHeaders,
    headersErrorValidationMessage,
    outputSchema,
    outputValidationOptions,
    outputErrorValidationMessage,
  } = { ...defaultOptions, ...opts }

  const onBefore: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    if (headersSchema) {
      const { error: validationError, value } = headersSchema.validate(request.event.headers, headersValidationOptions);
      if (validationError) {
        // Bad Request
        const error = createError(400, headersErrorValidationMessage ? headersErrorValidationMessage : `Header: ${validationError.message}`);
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
      }
      if (preserveRawHeaders && !util.isDeepStrictEqual(value, request.event.headers)) {
        request.event.rawHeaders = request.event.headers;
      }
      request.event.headers = value;
    }
    if (inputSchema) {
      const { error: validationError, value } = inputSchema.validate(request.event.body, inputValidationOptions);
      if (validationError) {
        // Bad Request
        const error = createError(400, inputErrorValidationMessage ? inputErrorValidationMessage : validationError.message);
        const errorDetails = validationError.details.map(detail => detail.message);
        error.details = errorDetails;
        throw error;
      }
      if (preserveRawBody && !util.isDeepStrictEqual(value, request.event.body)) {
        request.event.rawBody = request.event.body;
      }
      request.event.body = value;
    }
  };

  const onAfter: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    if (outputSchema) {
      const { error: validationError } = outputSchema.validate(request.response, outputValidationOptions);
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
    before: (inputSchema || headersSchema) ? onBefore : undefined,
    after: outputSchema ? onAfter : undefined
  }
}

export default middleware;