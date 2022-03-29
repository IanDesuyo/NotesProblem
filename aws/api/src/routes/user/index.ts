import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  let id;
  if (event.resource === "/user/me") {
    id = objectIdParser(event.requestContext.authorizer.userId);
  } else {
    const params = event.pathParameters;
    id = objectIdParser(params.id);
  }

  if (!id) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  const user = await dbManager.account.get(app, id);

  if (!user) {
    return response(404, {
      message: "Not found",
      i18n: "users.notFound",
    });
  }

  return response(200, {
    message: "Successful",
    i18n: "users.successful",
    data: user,
  });
};

export default {
  GET,
} as Path;
