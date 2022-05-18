import Route, { Path } from "../types/route";
import login from "./login";
import register from "./register";
import user from "./user";
import userLikes from "./user/likes";
import notes from "./notes";
import notesDetect from "./notes/detect";
import note from "./note";
import noteLike from "./note/like";
import noteAudio from "./note/audio";
import version from "./version";

// API Gateway resource paths
export default {
  "/": version,
  "/login": login,
  "/register": register,
  "/notes": notes,
  "/notes/detect": notesDetect,
  "/note/{id}": note,
  "/note/{id}/like": noteLike,
  "/note/{id}/audio": noteAudio,
  "/user/me": user,
  "/user/{id}": user,
  "/user/me/likes": userLikes,
} as Route;
