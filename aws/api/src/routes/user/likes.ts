import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const id = objectIdParser(event.requestContext.authorizer.userId);

  return response(200, {
    message: "Successful",
    i18n: "users.successful",
    data: await dbManager.like.getUserLikeNotes(app, id),
  });
};

export default {
  GET,
} as Path;
