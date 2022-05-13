import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { App, Privacy } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";
import { DetectNoteRequestBody } from "../../types/requestBody";
import textractParser from "../../utils/textractParser";

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const userId = objectIdParser(event.requestContext.authorizer.userId);

  if (!userId) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  const data = JSON.parse(event.body) as DetectNoteRequestBody;
  const fileBody = Buffer.from(data.fileBody, "base64");
  const fileType = data.fileType;

  if (fileBody.byteLength > 8000000) {
    return response(400, {
      message: "File size is too large",
      i18n: "system.fileSizeTooLarge",
    });
  }

  // return 400 when file type is not supported
  if (!/image\/*/.test(fileType)) {
    return response(400, {
      message: "File type is not supported",
      i18n: "system.fileTypeNotSupported",
    });
  }

  const fileId = uuidv4();
  const fileKey = `uploads/${fileId}`;

  const s3Result = await app.s3
    .putObject({
      Body: fileBody,
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
    })
    .promise();

  if (!s3Result.ETag) {
    return response(500, {
      message: "Failed to upload file",
      i18n: "system.failedToUploadFile",
    });
  }

  const textResult = await app.textract
    .detectDocumentText({
      Document: {
        S3Object: {
          Bucket: process.env.S3_BUCKET,
          Name: fileKey,
        },
      },
    })
    .promise();

  const content = textractParser(textResult);

  const noteId = await dbManager.note.create(app, {
    title: "Hidden Note",
    hashtags: [],
    content,
    authorId: userId,
    originalFile: fileKey,
    privacy: Privacy.HIDE,
  });

  return response(200, {
    message: "Success",
    i18n: "notes.detectSuccess",
    data: {
      noteId,
      content,
    },
  });
};

export default {
  POST,
} as Path;
