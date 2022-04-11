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
