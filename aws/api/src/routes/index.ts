import Route, { Path } from "../types/route";
import login from "./login";
import register from "./register";
import user from "./user";
import notes from "./notes";
import note from "./note";
import noteLike from "./note/like";
import version from "./version";

// API Gateway resource paths
export default {
  "/": version,
  "/login": login,
  "/register": register,
  "/notes": notes,
  "/note/{id}": note,
  "/note/{id}/like": noteLike,
  "/user/me": user,
  "/user/{id}": user,
} as Route;
