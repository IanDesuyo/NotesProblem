import { ObjectId } from "mongodb";
import { Privacy } from ".";

export interface NewNote {
  title: string;
  hashtags: string[];
  content?: string;
  authorId: ObjectId;
  originalFile?: string;
  privacy: Privacy;
}

export interface UpdateNote {
  title?: string;
  hashtags?: string[];
  content?: string;
  privacy?: Privacy;
}
