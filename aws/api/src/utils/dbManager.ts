import { APIGatewayEvent } from "aws-lambda";
import { App } from "../types";

const loginUser = async (app: App, email: string, password: string) => {
  const collection = app.db.collection("Users");
  const user = await collection.findOne({ email, password });

  return user;
};

const createUser = async (app: App, email: string, password: string, displayName: string) => {
  const collection = app.db.collection("Users");

  // check if email is already in use
  const user = await collection.findOne({ email });

  if (user) {
    throw {
      message: "Email is already in use",
      i18n: "register.invlaidEmail",
    };
  }

  const res = await collection.insertOne({
    displayName,
    password,
    email,
    createdAt: Math.floor(new Date().getTime() / 1000),
    emailVerified: false,
  });

  return {
    _id: res.insertedId,
    displayName,
    email,
  };
};

const getCurrentUser = async (app: App, event: APIGatewayEvent) => {
  const collection = app.db.collection("Users");
  const userId = parseInt(event.requestContext.authorizer.numberKey);

  return await collection.findOne({ id: userId });
};

export default {
  loginUser,
  createUser,
  getCurrentUser,
};
