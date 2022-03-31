import Route from "../types/route";
import login from "./login";
import register from "./register";
import user from "./user";
import notes, { newNote } from "./notes";
import note from "./note";

// API Gateway resource paths
export default {
  "/login": login,
  "/register": register,
  "/notes": notes,
  "/note/{id}": note,
  "/notes/new": newNote,
  "/user/me": user,
  "/user/{id}": user,
} as Route;
