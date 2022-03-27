import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../types";
import response from "../utils/response";
import { Path } from "../types/route";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;
  const query = {};

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
  });
};

export default {
  GET,
} as Path;
