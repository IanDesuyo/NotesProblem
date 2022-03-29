import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../types";
import * as jwt from "jsonwebtoken";
import dbManager from "../utils/dbManager";
import response from "../utils/response";
import { Path } from "../types/route";
import { emailParser, passwordParser } from "../utils/parser";

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);

  const { email } = emailParser(data.email);
  const password = await passwordParser(data.password);

  if ([email, password].some(v => !v)) {
    return response(400, {
      message: "Invalid email or password",
      i18n: "login.invalidInfo",
    });
  }

  const user = await dbManager.account.login(app, email, password);

  if (!user) {
    return response(401, {
      message: "Wrong email or password",
      i18n: "login.wrongInfo",
    });
  }

  const payload = {
    displayName: user.displayName,
    userId: user._id.toHexString(),
    exp: Math.floor(Date.now() / 1000) + 604800, // 1 week
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return response(200, {
    message: "Login successful",
    i18n: "login.successful",
    data: { token, payload },
  });
};

export default {
  POST,
} as Path;
