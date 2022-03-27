// import * as bcrypt from "bcrypt"; // not support in my dev enviroment :(

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const emailParser = (email: string) => {
  const res = emailRegex.exec(email);

  if (!res) {
    return null;
  }

  return { email, account: res[1], domain: res[5] };
};

export const passwordParser = async (password: string) => {
  if (!password || password.length < 8 || password.length > 32) {
    return null;
  }

  //return await bcrypt.hash(password, process.env.PASSWORD_SALT); // not support in my dev enviroment :(

  return Buffer.from(password).toString("base64");
};

export const displayNameParser = (displayName: string) => {
  if (!displayName || displayName.length < 2 || displayName.length > 32) {
    return null;
  }

  return displayName;
};
