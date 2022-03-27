# API Gateway Lambda Proxy Integration

Set the environment variable `JWT_SECRET`, `PASSWORD_SALT`, `MONGODB_URI` and `MONGODB_DB` first.
Make sure every endpoint are using Lambda Proxy integration,
so the lambda function can receive the request event which contains the request body, path, method and headers.

## Event

```json
{
  "resource": "/note/{id}",
  "path": "/note/123",
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json"
    // ...
  },
  "queryStringParameters": {
    "a": "1",
    "b": "2"
  },
  "requestContext": {
    "authorizer": {
      // from api gateway authorizer
      "success": "true", // should always be true
      "principalId": "ian", // display name
      "userId": "***REMOVED***", // user id
      "displayName": "ian" // display name
    },
    "identity": {
      "sourceIp": "61.224.153.224", // client ip
      "userAgent": "PostmanRuntime/7.29.0" // client user agent
    }
  },
  "body": "{}" // request body
}
```

## for publish to aws lambda

```
aws lambda update-function-code --function-name NotesProblemBeta-API --zip-file fileb://api.zip
```
