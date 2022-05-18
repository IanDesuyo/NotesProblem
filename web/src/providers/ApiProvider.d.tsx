export interface ApiProviderProps {
  children: React.ReactNode;
}

export interface RawApiResponse<T> {
  message: string;
  i18n?: string;
  data?: T;
}

export interface FetchApiData {
  res: Response;
  body: RawApiResponse<any>;
}

export interface ApiProviderValue {
  fetch: (method: string, path: string, body?: any) => Promise<FetchApiData>;

  account: {
    login: (email: string, password: string) => Promise<ApiResponse<LoginResponse>>;
    register: (
      email: string,
      password: string,
      displayName: string
    ) => Promise<ApiResponse<LoginResponse>>;
    get: (id: string) => Promise<ApiResponse<UserResponse>>;
    likes: () => Promise<ApiResponse<NoteResponse[]>>;
  };

  note: {
    search: (search?: string, page?: number) => Promise<ApiResponse<NoteResponse[]>>;
    get: (id: string) => Promise<ApiResponse<NoteResponse>>;
    like: (id: string, like: boolean) => Promise<ApiResponse<NoteLikeResponse>>;
    detect: (file: File) => Promise<ApiResponse<NoteDetectResponse>>;
    create: (
      title: string,
      hashtags: string[],
      content: string
    ) => Promise<ApiResponse<NoteCreateResponse>>;
    update: (
      id: string,
      title?: string,
      hashtags?: string[],
      content?: string
    ) => Promise<ApiResponse<NoteResponse>>;
    audio: (id: string) => Promise<ApiResponse<NoteAudioResponse>>;
  };
}

export interface ApiResponse<T> extends RawApiResponse<T> {
  success: boolean;
}

export interface UserResponse {
  displayName: string;
  _id: string;
  createdAt: number;
}

export interface LoginResponse {
  token: string;
  payload: {
    displayName: string;
    userId: string;
    exp: number;
  };
}

export interface NoteResponse {
  _id: string;
  title: string;
  hashtags: string[];
  content: string;
  originalFile?: string;
  createdAt: string;
  author: {
    _id: string;
    displayName: string;
  };
  likes?: number;
  like?: boolean;
  likeAt?: string;
  aiComment?: string;
  aiCommentAt?: string;
  audio?: string;
  audioAt?: string;
}

export interface NoteLikeResponse {
  like: boolean;
}

export interface NoteCreateResponse {
  noteId: string;
}

export interface NoteDetectResponse extends NoteCreateResponse {
  content: string;
}

export interface NoteAudioResponse {
  audio: string;
}
