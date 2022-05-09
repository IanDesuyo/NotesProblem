import { ApiResponse, fetchApi } from ".";

interface LoginResponse {
  token: string;
  payload: {
    displayName: string;
    userId: string;
    exp: number;
  };
}

const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  const { res, body } = await fetchApi("/login", "POST", { email, password });

  return { success: res.status === 200, ...body };
};

const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<ApiResponse<LoginResponse>> => {
  const { res, body } = await fetchApi("/register", "POST", { email, password, displayName });

  return { success: res.status === 200, ...body };
};

const modules = {
  login,
  register,
};

export default modules;
