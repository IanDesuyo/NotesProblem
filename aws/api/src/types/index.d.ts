import { Db } from "mongodb";
import { S3, Textract } from "aws-sdk";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface App {
  db: Db;
  s3: S3;
  textract: Textract;
}
