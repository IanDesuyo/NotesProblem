import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../..//types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  const id = objectIdParser(params.id);

  if (!id) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  const note = await dbManager.note.get(app, id);

  if (!note) {
    return response(404, {
      message: "Not found",
      i18n: "notes.notFound",
    });
  }

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: note,
  });
};

export default {
  GET,
} as Path;
