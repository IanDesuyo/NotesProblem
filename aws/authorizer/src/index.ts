import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export const handler = (
  event: APIGatewayTokenAuthorizerEvent,
  _context: any,
  callback: APIGatewayAuthorizerCallback
) => {
  const token = event.authorizationToken;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    }) as JwtPayload;
    return callback(null, generatePolicy(payload, true, event.methodArn));
  } catch (e) {
    console.log(e);
    return callback(null, generatePolicy({}, false, event.methodArn));
  }
};

const generatePolicy = (payload: JwtPayload, allow: boolean, resource: string) => {
  return {
    principalId: payload.displayName || "Anonymous",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: allow ? "Allow" : "Deny",
          Resource: resource,
        },
      ],
    },
    context: {
      displayName: payload.displayName || "Anonymous",
      userId: payload.userId || "0",
      success: allow,
    },
  } as APIGatewayAuthorizerResult;
};
