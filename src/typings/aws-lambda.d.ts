declare namespace AWSLambda {
  export interface APIGatewayProxyEvent {
    body: string | object | null;
    headers: APIGatewayProxyEventHeaders;
    multiValueHeaders: APIGatewayProxyEventMultiValueHeaders;
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    pathParameters: APIGatewayProxyEventPathParameters | null;
    queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
    multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters | null;
    stageVariables: APIGatewayProxyEventStageVariables | null;
    requestContext: APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext>;
    resource: string;
    rawBody: string | object | null;
    rawHeaders: APIGatewayProxyEventHeaders | null;
  }
}