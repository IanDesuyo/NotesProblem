import { useToast } from "@chakra-ui/react";
import { createContext, FC, useContext, useState } from "react";
import fileConverter from "../utils/fileConverter";
import { AccountContext } from "./AccountProvider";
import {
  ApiProviderProps,
  ApiProviderValue,
  ApiResponse,
  FetchApiData,
  LoginResponse,
  NoteAudioResponse,
  NoteCreateResponse,
  NoteDetectResponse,
  NoteLikeResponse,
  NoteResponse,
  RawApiResponse,
  UserResponse,
} from "./ApiProvider.d";

export const ApiContext = createContext<ApiProviderValue>({} as any);

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const account = useContext(AccountContext);
  const toast = useToast();

  const fetchApi = async (method: string, path: string, body?: any) => {
    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: account.isLoggedIn ? account.token : "",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const jsonBody = (await res.json()) as RawApiResponse<any>;

    if (res.status === 401) {
      account.logout();

      toast({
        title: body.message,
        description: "請重新登入",
        status: "error",
        duration: 5000,
      });

      throw new Error(body.message);
    } else if (res.status >= 500 && res.status < 600) {
      toast({
        title: "發生錯誤",
        description: jsonBody.message,
        status: "error",
        duration: 5000,
      });
    } else if (true) {
      // debug
      toast({
        title: jsonBody.message,
        status: "info",
        duration: 3000,
      });
    }

    return { res, body: jsonBody } as FetchApiData;
  };

  const api = {
    account: {
      login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
        const { res, body } = await fetchApi("POST", "/login", { email, password });

        return { success: res.status === 200, ...body };
      },
      register: async (
        email: string,
        password: string,
        displayName: string
      ): Promise<ApiResponse<LoginResponse>> => {
        const { res, body } = await fetchApi("POST", "/register", { email, password, displayName });

        return { success: res.status === 200, ...body };
      },
      get: async (id: string): Promise<ApiResponse<UserResponse>> => {
        const { res, body } = await fetchApi("GET", `/user/${id}`);

        return { success: res.status === 200, ...body };
      },
      likes: async (): Promise<ApiResponse<NoteResponse[]>> => {
        const { res, body } = await fetchApi("GET", `/user/me/likes`);

        return { success: res.status === 200, ...body };
      },
    },
    note: {
      search: async (search?: string, page?: number): Promise<ApiResponse<NoteResponse[]>> => {
        const searchParams = new URLSearchParams();
        if (search) {
          searchParams.append("search", search);
        }
        if (page && page > 0) {
          searchParams.append("page", page.toString());
        }

        const { res, body } = await fetchApi("GET", `/notes?${searchParams.toString()}`);

        return { success: res.status === 200, ...body };
      },

      get: async (id: string): Promise<ApiResponse<NoteResponse>> => {
        const { res, body } = await fetchApi("GET", `/note/${id}`);

        return { success: res.status === 200, ...body };
      },

      like: async (id: string, like: boolean): Promise<ApiResponse<NoteLikeResponse>> => {
        const { res, body } = await fetchApi("POST", `/note/${id}/like`, { like });

        return { success: res.status === 200, ...body };
      },
      detect: async (file: File): Promise<ApiResponse<NoteDetectResponse>> => {
        const data = await fileConverter(file);

        const { res, body } = await fetchApi("POST", "/notes/detect", data);

        return { success: res.status === 200, ...body };
      },
      create: async (
        title: string,
        hashtags: string[],
        content: string
      ): Promise<ApiResponse<NoteCreateResponse>> => {
        const { res, body } = await fetchApi("POST", "/notes", {
          title,
          hashtags,
          content,
          privacy: 1,
        });

        return { success: res.status === 200, ...body };
      },
      update: async (
        id: string,
        title?: string,
        hashtags?: string[],
        content?: string
      ): Promise<ApiResponse<NoteResponse>> => {
        const { res, body } = await fetchApi("PUT", `/note/${id}`, {
          title,
          hashtags,
          content,
          privacy: 1,
        });

        return { success: res.status === 200, ...body };
      },
      audio: async (id: string): Promise<ApiResponse<NoteAudioResponse>> => {
        const { res, body } = await fetchApi("GET", `/note/${id}/audio`);

        return { success: res.status === 200, ...body };
      },
    },
  };

  return <ApiContext.Provider value={{ fetch: fetchApi, ...api }}>{children}</ApiContext.Provider>;
};

export default ApiProvider;
