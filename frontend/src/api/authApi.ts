import { httpClient } from "./httpClient";

export type LoginResponse = {
  token: string;
  email: string;
  role: "employee" | "manager" | "hr" | "super_admin";
};

export type MeResponse = {
  id: string;
  email: string;
  role: "employee" | "manager" | "hr" | "super_admin";
};

export const authApi = {
  requestRegisterCode: async (email: string): Promise<void> => {
    await httpClient.post("/auth/register/request-code", { email });
  },
  completeRegistration: async (email: string, code: string, password: string): Promise<void> => {
    await httpClient.post("/auth/register/complete", { email, code, password });
  },
  requestPasswordResetCode: async (email: string): Promise<void> => {
    await httpClient.post("/auth/password-reset/request-code", { email });
  },
  completePasswordReset: async (email: string, code: string, password: string): Promise<void> => {
    await httpClient.post("/auth/password-reset/complete", { email, code, password });
  },
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>("/auth/login", { email, password });
    return response.data;
  },
  me: async (token: string): Promise<MeResponse> => {
    const response = await httpClient.get<MeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
