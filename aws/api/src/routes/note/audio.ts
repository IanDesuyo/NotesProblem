import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../..//types";
import response from "../../utils/response";
import { Path } from "../../types/route";
import dbManager from "../../utils/dbManager";
import { objectIdParser } from "../../utils/parser";
import { v4 as uuidv4 } from "uuid";

const GET = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = event.pathParameters;

  // validate data
  const noteId = objectIdParser(params.id);

  if (!noteId) {
    return response(400, {
      message: "Invalid id",
      i18n: "notes.invalidId",
    });
  }

  // get note from db
  const note = await dbManager.note.get(app, noteId);

  if (!note) {
    return response(404, {
      message: "Not found",
      i18n: "notes.notFound",
    });
  }

  if (note.audio) {
    return response(200, {
      message: "Success",
      i18n: "notes.success",
      data: {
        audio: note.audio,
      },
    });
  }

  const pollyResult = await app.polly
    .synthesizeSpeech({
      OutputFormat: "mp3",
      Text: note.content,
      VoiceId: "Joanna",
    })
    .promise();

  const audioId = uuidv4();
  const audioKey = `audio/${audioId}.mp3`;

  const s3Result = await app.s3
    .putObject({
      Body: pollyResult.AudioStream,
      Bucket: process.env.S3_BUCKET,
      Key: audioKey,
      ContentType: "audio/mpeg",
    })
    .promise();

  if (!s3Result.ETag) {
    return response(500, {
      message: "Failed to upload audio",
      i18n: "system.failedToUploadAudio",
    });
  }

  await dbManager.note.update(app, noteId, {
    audio: audioKey,
    audioAt: new Date(),
  });

  return response(200, {
    message: "Successful",
    i18n: "notes.successful",
    data: {
      audio: audioKey,
    },
  });
};

export default {
  GET,
} as Path;
