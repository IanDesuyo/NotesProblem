import { Db } from "mongodb";
import { S3, Textract, Polly } from "aws-sdk";
import { OpenAIApi } from "openai";

export const enum Privacy {
  HIDE = 0,
  PUBLIC = 1,
  PRIVATE = 2,
}

export const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface App {
  db: Db;
  s3: S3;
  textract: Textract;
  polly: Polly;
  openai: OpenAIApi;
}
