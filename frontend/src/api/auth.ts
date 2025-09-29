
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



 export const auth = {
  isUser: async () => {
    console.log("API_URL is set to:", API_URL);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return false;

      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error("Error verifying user:", error);
      return false;
    }
  },
};


export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
};


export const logout = async () => {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return await res.json();
};
