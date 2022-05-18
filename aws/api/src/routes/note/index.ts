import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../..//types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser, tokenParser } from "../../utils/parser";
import { UpdateNoteRequestBody } from "../../types/requestBody";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;
  const userId = objectIdParser(
    event.requestContext.authorizer?.userId || tokenParser(event.headers.Authorization)?.userId
  );

  // validate data
  const noteId = objectIdParser(params.id);

  if (!noteId) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  // get note from db
  const note = await dbManager.note.get(app, noteId, userId);

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

const PUT = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;

  // validate data
  const noteId = objectIdParser(params.id);

  if (!noteId) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  const userId = objectIdParser(event.requestContext.authorizer.userId);
  const data = JSON.parse(event.body) as UpdateNoteRequestBody;

  const note = await dbManager.note.get(app, noteId);

  if (!note || note.author._id.toHexString() !== userId.toHexString()) {
    return response(403, {
      message: "Forbidden",
      i18n: "notes.forbidden",
    });
  }

  const success = await dbManager.note.update(app, noteId, data);

  if (!success) {
    return response(500, {
      message: "Internal server error",
      i18n: "system.internalError",
    });
  }

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: await dbManager.note.get(app, noteId, userId),
  });
};

export default {
  GET,
  PUT,
} as Path;
