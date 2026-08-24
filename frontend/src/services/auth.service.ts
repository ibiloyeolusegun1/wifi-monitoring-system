import api from "@/src/lib/api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: LoginUser;
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
}
