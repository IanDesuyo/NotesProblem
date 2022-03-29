import { APIGatewayEvent } from "aws-lambda";
import { ObjectId } from "mongodb";
import { App } from "../../types";

const projection = {
  $project: {
    password: 0,
    email: 0,
    emailVerified: 0,
  },
};

const login = async (app: App, email: string, password: string) => {
  const collection = app.db.collection("Users");
  const user = await collection.findOne({ email, password });

  return user;
};

const create = async (app: App, email: string, password: string, displayName: string) => {
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
    createdAt: new Date(),
    emailVerified: false,
  });

  return {
    _id: res.insertedId,
    displayName,
    email,
  };
};

const get = async (app: App, id: ObjectId) => {
  const collection = app.db.collection("Users");

  const user = await collection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      projection,
    ])
    .limit(1)
    .toArray();

  return user[0];
};

export default {
  login,
  create,
  get,
};
