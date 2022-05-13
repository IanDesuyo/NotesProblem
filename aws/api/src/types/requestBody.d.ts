import { Privacy } from ".";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody extends LoginRequestBody {
  displayName: string;
}

export interface LikeRequestBody {
  like: boolean;
}

export interface DetectNoteRequestBody {
  fileBody: string;
  fileType: string;
}

export interface CreateNoteRequestBody {
  title: string;
  hashtags: string[];
  content: string;
  privacy: Privacy;
}

export interface UpdateNoteRequestBody {
  title?: string;
  hashtags?: string[];
  content?: string;
  privacy?: Privacy;
}
