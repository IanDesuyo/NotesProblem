# API Gateway Authorizer

Set the environment variable `JWT_SECRET` first.
A vaild jwt token's payload must contain the following fields:

```json
{
  "displayName": "ian", // display name
  "userId": "***REMOVED***", // user id
  "exp": 1640966400 // expiration time
}
```

## for publish to aws lambda

```
aws lambda update-function-code --function-name NotesProblemBeta-Authorizer --zip-file fileb://authorizer.zip
```
