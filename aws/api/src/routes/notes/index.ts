import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { App } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;

  // validate data
  const page = parseInt(params?.page) || 0;
  const search = params?.search;

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: await dbManager.note.search(app, search, page),
  });
};

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const userId = objectIdParser(event.requestContext.authorizer.userId);

  // validate data
  const data = JSON.parse(event.body);
  const title = data.title;
  const hashtags = data.hashtags;
  const file = Buffer.from(data.file?.body, "base64");
  const fileType = data.file?.type;
  let content = data?.content;
  let fileKey;

  if (!content && !file) {
    return response(400, {
      message: "Content or file is required",
      i18n: "notes.contentOrFileRequired",
    });
  }

  // if file is provided, upload it to S3 and use textract to detect text
  if (file) {
    // return 400 when file size is larger than 8MB
    if (file.byteLength > 8000000) {
      return response(400, {
        message: "File size is too large",
        i18n: "system.fileSizeTooLarge",
      });
    }

    // return 400 when file type is not supported
    if (!["image/jpeg", "image/png", "application/pdf"].includes(fileType)) {
      return response(400, {
        message: "File type is not supported",
        i18n: "system.fileTypeNotSupported",
      });
    }

    // create a unique file key
    const fileId = uuidv4();
    fileKey = `uploads/${fileId}`;

    // upload file to S3
    const s3Result = await app.s3
      .putObject({
        Body: file,
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

    // use textract to detect text
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

    content = textResult.Blocks.reduce((acc, block) => {
      if (block.BlockType === "LINE") {
        return acc + block.Text + "\n";
      }
      return acc;
    }, "");
  }

  // create a new note
  const note = await dbManager.note.create(app, {
    title,
    hashtags,
    content,
    authorId: userId,
    originalFile: fileKey,
  });

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: note,
  });
};

export default {
  GET,
  POST,
} as Path;
