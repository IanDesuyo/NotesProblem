import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

/**
 * The main function.
 * @param event - The event object
 * @param _context - The context object
 * @param callback - The callback function to return the response
 */
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
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return callback("Unauthorized", generateErrorPolicy(event.methodArn, "Token expired"));
    }

    return callback("Unauthorized", generateErrorPolicy(event.methodArn, "Invalid token"));
  }
};

/**
 * Generate a policy object.
 * @param payload - The payload object from the jwt
 * @param allow - Whether the user is allowed to access the resource
 * @param resource - The resource string
 * @returns The policy object
 */
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

const generateErrorPolicy = (resource: string, message: string) => {
  return {
    principalId: "Anonymous",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: resource,
        },
      ],
    },
    context: {
      errorMessage: message,
    },
  } as APIGatewayAuthorizerResult;
};
