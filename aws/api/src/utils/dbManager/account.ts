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

/**
 * Get user by email and password.
 * @param app - App instance
 * @param email - Email address
 * @param password - Password
 * @returns User data if found, otherwise null
 */
const login = async (app: App, email: string, password: string) => {
  const collection = app.db.collection("Users");
  const user = await collection.findOne({ email, password });

  return user;
};

/**
 * Create a new user.
 * @param app - App instance
 * @param email -  Email address
 * @param password - Password
 * @param displayName - Display name
 * @returns Created user id, display name, and email
 * @throws Error if user already exists
 */
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

/**
 * Get user by id.
 * @param app - App instance
 * @param id - User id
 * @returns User data if found, otherwise null
 */
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

/**
 * Get user by id.
 * @param app - App instance
 * @param id - User id
 * @param data - User data to update
 * @returns MongoDB update result
 */
const update = async (app: App, id: ObjectId, data: any[]) => {
  const collection = app.db.collection("Users");

  const user = await collection.updateOne(
    {
      _id: id,
    },
    {
      $set: data,
    }
  );

  return user;
};

export default {
  login,
  create,
  get,
  update,
};
