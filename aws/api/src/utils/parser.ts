// import * as bcrypt from "bcrypt"; // not support in my dev enviroment :(

import { ObjectId } from "mongodb";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Check if string is a valid email address.
 * @param email - Email address
 * @returns Account and domain of the email address if valid, otherwise null
 */
export const emailParser = (email: string) => {
  const res = emailRegex.exec(email);

  if (!res) {
    return null;
  }

  return { email, account: res[1], domain: res[5] };
};

/**
 * Check if string is a valid password and return the hash if valid.
 * @param password - Password hsah
 * @returns Hash of the password if valid, otherwise null
 */
export const passwordParser = async (password: string) => {
  if (!password || password.length < 8 || password.length > 32) {
    return null;
  }

  //return await bcrypt.hash(password, process.env.PASSWORD_SALT); // not support in my dev enviroment :(

  return Buffer.from(password).toString("base64");
};

/**
 * Check if string is a valid display name.
 * @param displayName - Display name
 * @returns Display name if valid, otherwise null
 */
export const displayNameParser = (displayName: string) => {
  if (!displayName || displayName.length < 2 || displayName.length > 32) {
    return null;
  }

  return displayName;
};

/**
 * Check if string is a valid object id.
 * @param id - A string of 24 hex characters
 * @returns ObjectId if valid, otherwise null
 */
export const objectIdParser = (id: string) => {
  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
};

/**
 * Check the jwt and return the payload if valid.
 * @param token jwt
 */
export const tokenParser = (token: string) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const data = JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as {
      displayName: string;
      userId: string;
      exp: number;
    };

    return data;
  } catch (e) {
    return null;
  }
};
