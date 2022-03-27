import Route from "../types/route";
import login from "./login";
import register from "./register";

export default {
  "/login": login,
  "/register": register,
} as Route;
