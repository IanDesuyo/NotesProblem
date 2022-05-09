import { ApiResponse, fetchApi } from ".";

export interface NoteResponse {
  _id: string;
  title: string;
  hashtags: string[];
  content: string;
  originalFile: string;
  createdAt: string;
  author: {
    _id: string;
    displayName: string;
  };
}

const search = async (search?: string, page?: number): Promise<ApiResponse<NoteResponse[]>> => {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.append("search", search);
  }
  if (page && page > 0) {
    searchParams.append("page", page.toString());
  }

  const { res, body } = await fetchApi(`/notes?${searchParams.toString()}`, "GET");

  return { success: res.status === 200, ...body };
};

const get = async (id: string): Promise<ApiResponse<NoteResponse>> => {
  const { res, body } = await fetchApi(`/note/${id}`, "GET");

  return { success: res.status === 200, ...body };
};

const modules = {
  search,
  get,
};

export default modules;
