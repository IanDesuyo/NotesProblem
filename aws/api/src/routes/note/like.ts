import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../..//types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";
import { LikeRequestBody } from "../../types/requestBody";

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;

  // validate data
  const noteId = objectIdParser(params.id);
  const userId = objectIdParser(event.requestContext.authorizer.userId);

  if (!noteId || !userId) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  const data = JSON.parse(event.body) as LikeRequestBody;

  try {
    const { like } = await dbManager.like.setUserLike(app, userId, noteId, data.like);

    return response(200, {
      message: "Successful",
      i18n: "notes.successful",
      data: {
        like,
      },
    });
  } catch (err) {
    return response(err.status, {
      message: err.message,
      i18n: err.i18n,
    });
  }
};

export default {
  POST,
} as Path;
