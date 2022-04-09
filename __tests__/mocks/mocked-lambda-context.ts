import { Context } from 'aws-lambda';

export const mockLambdaContext: Context = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: 'test',
  functionVersion: '1.0',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test',
  memoryLimitInMB: '256',
  awsRequestId: 'test',
  logGroupName: 'test',
  logStreamName: 'test',

  getRemainingTimeInMillis() {
    return 1000
  },

  done(error: Error | undefined, result: any | undefined) {
    if (error) console.error(error);
    if (result) console.log(result);
    return;
  },
  fail(error: Error | string) {
    if (error) console.error(error);
    return;
  },
  succeed(messageOrObject: any) {
    if (messageOrObject) console.log(messageOrObject);
    return;
  }
}