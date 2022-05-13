import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { App } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser, tokenParser } from "../../utils/parser";
import textractParser from "../../utils/textractParser";
import { CreateNoteRequestBody } from "../../types/requestBody";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;
  const userId = objectIdParser(event.requestContext.authorizer?.userId || tokenParser(event.headers.Authorization)?.userId);

  // validate data
  const page = parseInt(params?.page) || 0;
  const search = params?.search;

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: await dbManager.note.search(app, search, page, userId),
  });
};

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const userId = objectIdParser(event.requestContext.authorizer.userId);
  const data = JSON.parse(event.body) as CreateNoteRequestBody;

  const noteId = await dbManager.note.create(app, { ...data, authorId: userId });

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: {
      noteId,
    },
  });
};

export default {
  GET,
  POST,
} as Path;
