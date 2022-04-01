import { APIGatewayProxyResult } from "aws-lambda";
import { ResponseBody } from "../types/response";

/**
 * Create a response object.
 * @param statusCode - The response status code
 * @param body - The response body
 * @returns - The response object
 */
export default (statusCode: number, body: ResponseBody, ...props: any[]) => {
  const bodyString = JSON.stringify(body);
  return {
    statusCode,
    body: bodyString,
    ...props,
  } as APIGatewayProxyResult;
};
