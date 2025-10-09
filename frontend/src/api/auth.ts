import { API, apiFetch } from "../config/api";

export const auth = {
  isUser: async () => {
    console.log("API_URL is set to:", API.BASE);
    try {
      const res = await apiFetch(API.AUTH.VERIFY, {
        method: "GET",
      });

      if (!res.ok) return { success: false, hasProfile: false };

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error verifying user:", error);
      return { success: false, hasProfile: false };
    }
  },
};

export const login = async (email: string, password: string) => {
  const res = await apiFetch(API.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const body = { firstName, lastName, email, password };
  console.log("signup payload:", body);

  const res = await apiFetch(API.AUTH.SIGNUP, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return await res.json();
};

export const logout = async () => {
  const res = await apiFetch(API.AUTH.LOGOUT, {
    method: "POST",
  });

  return await res.json();
};

export const createProfile = async (profileData: any) => {
  const res = await apiFetch(API.AUTH.CREATE_PROFILE, {
    method: "POST",
    body: JSON.stringify(profileData),
  });

  return await res.json();
};
