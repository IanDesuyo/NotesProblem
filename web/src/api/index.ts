import account from "./account";
import note from "./note";

export interface RawApiResponse<T> {
  message: string;
  i18n?: string;
  data?: T;
}

export interface ApiResponse<T> extends RawApiResponse<T> {
  success: boolean;
}

export const fetchApi = async (path: string, method: string, body?: any) => {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const resBody = (await res.json()) as RawApiResponse<any>;

  return { res, body: resBody };
};

const modules = {
  account,
  note,
};

export default modules;
