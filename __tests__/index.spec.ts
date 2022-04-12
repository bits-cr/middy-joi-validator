import middy from '@middy/core';
import Joi from 'joi';

import { mockLambdaContext } from './mocks/mocked-lambda-context';

import validatorMiddleware from '../src/index';

describe('Middy Joi Validator | inputSchema tests', () => {
  it('should validate the input object with input schema', async () => {
    let rawBody = {} as any;
    // given
    const inputSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required()
    });
    const handler = middy(async event => {
      rawBody = event.rawBody;
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
    expect(rawBody).toBeUndefined();
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

describe('Middy Joi Validator | headersSchema tests', () => {
  it('should validate the headers object and convert values according to joi headers schema', async () => {
    let rawHeaders = {} as any;
    // given
    const headersSchema = Joi.object({
      'Content-Type': Joi.string().lowercase().valid('application/json', 'application/xml').required()
    });
    const handler = middy(async event => {
      rawHeaders = event.rawHeaders;
      return event.headers; // propagates the headers as the response
    });
    handler.use(
      validatorMiddleware({
        headersSchema: headersSchema,
        preserveRawHeaders: true
      })
    );

    // when
    const event = {
      headers: {
        'User-Agent': 'Jest/Tests',
        'Content-Type': 'APPLICATION/JSON',
      }
    }
    const response = await handler(event, mockLambdaContext);

    // then
    expect(response['Content-Type']).toEqual('application/json');
    expect(response['User-Agent']).toEqual('Jest/Tests');
    expect(rawHeaders['Content-Type']).toEqual('APPLICATION/JSON'); // raw headers are not modified
  });

  it('should return an error message if joi allowUnknown option is false for headers', async () => {
    // given
    const headersSchema = Joi.object({
      'Content-Type': Joi.string().lowercase().valid('application/json', 'application/xml').required()
    });
    const handler = middy(async event => {
      return event.headers; // propagates the headers as the response
    });
    handler.use(
      validatorMiddleware({
        headersSchema: headersSchema,
        headersValidationOptions: {
          allowUnknown: false
        }
      })
    );

    // when
    const event = {
      headers: {
        'User-Agent': 'Jest/Tests',
        'Content-Type': 'APPLICATION/JSON',
      }
    }

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow('Header: "User-Agent" is not allowed');
  });

  it('should return an error message if joi schema validation fails', async () => {
    // given
    const headersSchema = Joi.object({
      'Content-Type': Joi.string().lowercase().valid('application/json', 'application/xml').required()
    });
    const handler = middy(async event => {
      return event.headers; // propagates the headers as the response
    });
    handler.use(
      validatorMiddleware({
        headersSchema: headersSchema,
      })
    );

    // when
    const event = {
      headers: {
        'User-Agent': 'Jest/Tests',
        'Content-Type': 'TEXT/PLAIN',
      }
    }

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow('Header: "Content-Type" must be one of [application/json, application/xml]');
  });

  it('should return an custom error message if joi schema validation fails', async () => {
    // given
    const headersErrorMessage = 'Invalid header value';
    const headersSchema = Joi.object({
      'Content-Type': Joi.string().lowercase().valid('application/json', 'application/xml').required()
    });
    const handler = middy(async event => {
      return event.headers; // propagates the headers as the response
    });
    handler.use(
      validatorMiddleware({
        headersSchema: headersSchema,
        headersErrorValidationMessage: headersErrorMessage
      })
    );

    // when
    const event = {
      headers: {
        'User-Agent': 'Jest/Tests',
        'Content-Type': 'TEXT/PLAIN',
      }
    }

    // then
    await expect(handler(event, mockLambdaContext)).rejects.toThrow(headersErrorMessage);
  });
});