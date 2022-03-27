import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { App } from "../types";
import * as jwt from "jsonwebtoken";
import dbManager from "../utils/dbManager";
import response from "../utils/response";
import { Path } from "../types/route";
import { displayNameParser, emailParser, passwordParser } from "../utils/parser";

const POST = async (app: App, event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const data = JSON.parse(event.body);

  const { email } = emailParser(data.email);
  const password = await passwordParser(data.password);
  const displayName = displayNameParser(data.displayName);

  if ([email, password, displayName].some(v => !v)) {
    return response(400, {
      message: "Invalid email or password",
      i18n: "login.invalidInfo",
    });
  }

  try {
    const user = await dbManager.createUser(app, email, password, displayName);

    const payload = {
      displayName: user.displayName,
      userId: user._id.toHexString(),
      exp: Math.floor(Date.now() / 1000) + 604800, // 1 week
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return response(200, {
      message: "Registration successful",
      i18n: "login.successful",
      data: { token, payload },
    });
  } catch (err) {
    return response(400, {
      message: err.message,
      i18n: err.i18n,
    });
  }
};

export default {
  POST,
} as Path;
