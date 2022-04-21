# Middy joi validator middleware

<div align="center">
  <p><strong>middy middleware validator using <a href="https://joi.dev/">joi.dev</a></strong></p>
</div>

<div align="center">
  <p>
    <a href="https://github.com/bits-cr/middy-joi-validator/actions/workflows/tests.yml">
      <img src="https://github.com/bits-cr/middy-joi-validator/actions/workflows/tests.yml/badge.svg" alt="tests" style="max-width:100%;">
    </a>
  </p>
</div>

## Install

To install middy-joi-validator:

Using NPM:
```bash
npm install --save joi @bits-cr/middy-joi-validator
```

Using yarn:
```bash
yarn add joi @bits-cr/middy-joi-validator
```

## Options
- inputSchema (Joi.AnySchema object) (optional): The Joi schema object that will be used to validate the input body (request.event.body) of the Lambda handler.
- inputValidationOptions (ValidationOptions 'joi') (optional): This can be used to override the options for the joi any.validate method for the input schema. More info: [joi.dev - any.validate(value, [options]) ](https://joi.dev/api/?v=latest#anyvalidatevalue-options). `Defaults: Joi defaults options`
- preserveRawBody (boolean) (optional): This can be used to preserve the original input body at `event.rawBody`. `Defaults: false`
- inputErrorValidationMessage (string) (optional): This can be used to replace the error message in case of an input schema validation error.
- headersSchema (Joi.AnySchema object) (optional): The Joi schema object that will be used to validate the input headers (request.event.headers) of the Lambda handler.
- headersValidationOptions (ValidationOptions 'joi') (optional): This can be used to override the options for the joi any.validate method for the headers schema. More info: [joi.dev - any.validate(value, [options]) ](https://joi.dev/api/?v=latest#anyvalidatevalue-options). `Defaults: { allowUnknown: true }`
- preserveRawHeaders (boolean) (optional): This can be used to preserve the original input headers at `event.rawHeaders`. `Defaults: false`
- headersErrorValidationMessage (string) (optional): This can be used to replace the error message in case of an headers schema validation error.
- outputSchema (Joi.AnySchema object) (optional): The Joi schema object that will be used to validate the output (request.response) of the Lambda handler
- outputValidationOptions (ValidationOptions 'joi') (optional): This can be used to override the options for the joi any.validate method for the input schema. More info: [joi.dev - any.validate(value, [options]) ](https://joi.dev/api/?v=latest#anyvalidatevalue-options). `Defaults: Joi defaults options`
- outputErrorValidationMessage (string) (optional): This can be used to replace the error message in case of an output schema validation error.

## Documentation and examples
```javascript
//# handler.js #

// import core
import middy from '@middy/core' // esm Node v14+
//const middy = require('@middy/core') // commonjs Node v12+

// import some middlewares
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from 'middy-joi-validator'

// import joi
import Joi from 'joi';

// This is your common handler, in no way different than what you are used to doing every day in AWS Lambda
const baseHandler = async (event, context) => {
 // we don't need to deserialize the body ourself as a middleware will be used to do that
 const { creditCardNumber, expiryMonth, expiryYear, cvc, nameOnCard, amount } = event.body

 // do stuff with this data
 // ...

 const response = { result: 'success', message: 'payment processed correctly'}
 return {statusCode: 200, body: JSON.stringify(response)}
}

// Notice that in the handler you only added base business logic (no deserialization,
// validation or error handler), we will add the rest with middlewares

const inputSchema = Joi.object({
  creditCardNumber: Joi.string().min(12).max(19).pattern(/4242424242424242/).required(),
  expiryMonth: Joi.number().integer().min(1).max(12),
  expiryYear: Joi.number().integer().min(2017).max(2027),
  cvc: Joi.string().min(3).max(4),
  nameOnCard: Joi.string(),
  amount: Joi.number()
})

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const handler = middy(baseHandler)
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({inputSchema})) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses

module.exports = { handler }
```


## Contributing

Everyone is very welcome to contribute to this repository. Feel free to [raise issues](https://github.com/bits-cr/middy-joi-validator/issues) or to [submit Pull Requests](https://github.com/bits-cr/middy-joi-validator/pulls).


## License

Licensed under [MIT License](LICENSE). Copyright (c) 2022 Diego Arce and the [Contributors](https://github.com/bits-cr/middy-joi-validator/graphs/contributors).
