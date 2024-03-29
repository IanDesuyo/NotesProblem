import { MongoClient, Db } from "mongodb";
import { APIGatewayEvent } from "aws-lambda";
import routes from "./routes";
import { HttpMethod } from "./types";
import { Configuration, OpenAIApi } from "openai";
import S3 = require("aws-sdk/clients/s3");
import Textract = require("aws-sdk/clients/textract");
import Polly = require("aws-sdk/clients/polly");
import corsHandler from "./utils/corsHandler";

var dbCache: Db;
const textract = new Textract();
const s3 = new S3({
  signatureVersion: "v4",
});
const polly = new Polly({ apiVersion: "2016-06-10" });
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

/**
 * Get db instance from cache or create a new one.
 * @returns MongoDB instance
 */
const getDB = async () => {
  if (dbCache) {
    return dbCache;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  dbCache = db;

  return db;
};

/**
 * Get the handler function for the given event.
 * @param event - The event object
 * @returns A handler function for the event if found, otherwise null
 */
const getHandler = (event: APIGatewayEvent) => {
  const path = event.resource; // use resource to get the path without parameters like /note/{id}
  const method = event.httpMethod as HttpMethod;

  const routeHandler = routes[path]?.[method];

  if (!routeHandler) {
    console.warn(`${method} ${path}: not found, should be ${Object.keys(routes[path])}`);
  }
  return routeHandler;
};

/**
 * The main function.
 * @param event - The event object
 * @returns API Gateway response object
 */
export const handler = async (event: APIGatewayEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return corsHandler();
  }
  const db = await getDB();
  const routeHandler = getHandler(event);

  console.log(`${event.httpMethod} ${event.resource} ${event.requestContext.authorizer?.userId}`);

  if (!routeHandler) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "You should never see this",
        event: {
          method: event.httpMethod,
          path: event.resource,
          body: event.body,
          queryStringParameters: event.queryStringParameters,
          pathParameters: event.pathParameters,
        },
      }),
    };

    console.error(`${event.httpMethod} ${event.resource} not found`);
  }

  return await routeHandler({ db, s3, textract, polly, openai }, event);
};
