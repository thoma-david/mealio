export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const auth = {
  isUser: async () => {
    console.log("API_URL is set to:", API_URL);
    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: "GET",
        credentials: "include",
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
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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

  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return await res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return await res.json();
};

export const createProfile = async (profileData: any) => {
  const res = await fetch(`${API_URL}/create-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileData),
  });

  return await res.json();
};
