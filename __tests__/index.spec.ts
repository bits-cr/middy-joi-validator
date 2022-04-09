import middy from '@middy/core';
import Joi from 'joi';

import { mockLambdaContext } from './mocks/mocked-lambda-context';

import validatorMiddleware from '../src/index';

describe('Middy Joi Validator | inputSchema tests', () => {
  it('should validate the input object with input schema', async () => {
    // given
    const inputSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required()
    });
    const handler = middy(async event => {
      return event.body // propagates the body as a response
    });
    handler.use(
      validatorMiddleware({
        inputSchema: inputSchema
      })
    );

    // when
    // input is valid
    const event = {
      body: {
        name: 'Amelia',
        age: 5
      }
    }
    const response = await handler(event, mockLambdaContext);

    // then
    expect(response).toEqual(event.body);
  });

  it('should return an exception if input is invalid', async () => {
    // given
    const inputSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required()
    });
    const handler = middy((event) => {
      return event.body // propagates the body as a response
    });
    handler.use(
      validatorMiddleware({
        inputSchema: inputSchema
      })
    );

    // when
    // input is not valid
    const event = {
      body: {
        name: 'Amelia'
      }
    }

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow('"age" is required');
  });

  it('should return an custom error message if input is invalid', async () => {
    // given
    const inputErrorMessage = 'Invalid input object';
    const inputSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required()
    });
    const handler = middy((event) => {
      return event.body // propagates the body as a response
    });
    handler.use(
      validatorMiddleware({
        inputSchema: inputSchema,
        inputErrorValidationMessage: inputErrorMessage
      })
    );

    // when
    // input is not valid
    const event = {
      body: {
        name: 'Amelia'
      }
    }

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow(inputErrorMessage);
  });
});

describe('Middy Joi Validator | outputSchema tests', () => {
  it('should validate the response object with output schema', async () => {
    // given
    const outputSchema = Joi.object({
      hello: Joi.string().required()
    });
    const responseObj = {
      hello: 'world'
    };
    const handler = middy(async _event => responseObj as any);
    handler.use(
      validatorMiddleware({
        outputSchema: outputSchema
      })
    );

    // when
    const event = {}
    const response = await handler(event, mockLambdaContext);

    // then
    expect(response).toEqual(responseObj);
  });

  it('should return an error if output has an unexpected value', async () => {
    // given
    const outputSchema = Joi.object({
      hello: Joi.string().required()
    });
    const responseObj = {
      hello: 'world',
      other: 'value'
    };
    const handler = middy(async _event => responseObj as any);
    handler.use(
      validatorMiddleware({
        outputSchema: outputSchema
      })
    );

    // when
    const event = {}

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow('"other" is not allowed');
  });

  it('should return an defined custom error message if output is invalid', async () => {
    // given
    const outputErrorMessage = 'Invalid response object';
    const outputSchema = Joi.object({
      hello: Joi.string().required()
    });
    const responseObj = {
      hello: 'world',
      other: 'value'
    };
    const handler = middy(async _event => responseObj as any);
    handler.use(
      validatorMiddleware({
        outputSchema: outputSchema,
        outputErrorValidationMessage: outputErrorMessage
      })
    );

    // when
    const event = {}

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow(outputErrorMessage);
  });
});