import { ObjectId } from "mongodb";

export interface NewNote {
  title: string;
  hashtags: string[];
  content?: string;
  authorId: ObjectId;
  originalFile?: string;
}
