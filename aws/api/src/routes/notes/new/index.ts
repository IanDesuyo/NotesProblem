import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { App } from "../../../types";
import response from "../../../utils/response";
import { Path } from "../../../types/route";
import dbManager from "../../../utils/dbManager";
import { objectIdParser } from "../../../utils/parser";

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);

  const userId = objectIdParser(event.requestContext.authorizer.userId);
  const fileId = uuidv4();

  const note = await dbManager.note.create(app, {
    title: data.title,
    hashtags: data.hashtags,
    content: data.content,
    authorId: userId,
    originalFile: `uploads/${fileId}`,
  });

  const s3SignedUrl = await app.s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${fileId}`,
    Expires: 600,
    Tagging: `noteId=${note.insertedId}&authorId=${userId}`,
  });

  return response(200, {
    message: "Successful",
    i18n: "notes.createSuccessful",
    data: {
      _id: note.insertedId,
      uploadUrl: s3SignedUrl,
    },
  });
};

export default {
  POST,
} as Path;
