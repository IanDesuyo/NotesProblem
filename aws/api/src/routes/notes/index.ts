import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { App } from "../../types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;
  const page = parseInt(params?.page) || 0;
  const search = params?.search;

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: await dbManager.note.search(app, search, page),
  });
};

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);
  const file = Buffer.from(data.file, "base64");
  const fileType = data.fileType;

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

  const fileId = uuidv4();
  const s3Result = await app.s3
    .putObject({
      Body: file,
      Bucket: process.env.S3_BUCKET,
      Key: "uploads/" + fileId,
      ContentType: fileType,
    })
    .promise();

  if (!s3Result.ETag) {
    return response(500, {
      message: "Failed to upload file",
      i18n: "system.failedToUploadFile",
    });
  }

  // use textract to get text from image
  const textResult = await app.textract
    .detectDocumentText({
      Document: {
        S3Object: {
          Bucket: process.env.S3_BUCKET,
          Name: "uploads/" + fileId,
        },
      },
    })
    .promise();

  console.log(textResult);

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: {
      textResult,
    },
  });
};

export default {
  GET,
  POST,
} as Path;
