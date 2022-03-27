import { APIGatewayProxyResult } from "aws-lambda";
import { ResponseBody } from "../types/response";

export default (statusCode: number, body: ResponseBody, ...props: any[]) => {
  const bodyString = JSON.stringify(body);
  return {
    statusCode,
    body: bodyString,
    ...props,
  } as APIGatewayProxyResult;
};
