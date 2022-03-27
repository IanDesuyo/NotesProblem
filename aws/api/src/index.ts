import { MongoClient, Db } from "mongodb";
import { APIGatewayEvent } from "aws-lambda";
import routes from "./routes";
import { HttpMethod } from "./types";

var dbCache: Db;

const getDB = async () => {
  if (dbCache) {
    return dbCache;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  dbCache = db;

  return db;
};

const getHandler = (event: APIGatewayEvent) => {
  const path = event.resource; // use resource to get the path without parameters like /note/{id}
  const method = event.httpMethod as HttpMethod;

  const routeHandler = routes[path][method];

  return routeHandler;
};

export const handler = async (event: APIGatewayEvent) => {
  const db = await getDB();
  const routeHandler = getHandler(event);

  if (!routeHandler) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "You should never see this",
      }),
    };
  }

  return await routeHandler({ db }, event);
};
