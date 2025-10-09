// Base API URL - should be just the domain, no path
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// API Endpoints organized by feature
export const API = {
  // Base URL
  BASE: BASE_URL,

  // Auth endpoints
  AUTH: {
    VERIFY: `${BASE_URL}/api/auth/verify`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    SIGNUP: `${BASE_URL}/api/auth/signup`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    CREATE_PROFILE: `${BASE_URL}/api/auth/create-profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/update-profile`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
    LIKE_RECIPE: `${BASE_URL}/api/auth/like-recipe`,
    DISLIKE_RECIPE: `${BASE_URL}/api/auth/dislike-recipe`,
    REMOVE_RECIPE_PREFERENCE: `${BASE_URL}/api/auth/remove-recipe-preference`,
  },

  // Recipe endpoints
  RECIPES: {
    BASE: `${BASE_URL}/api/auth/recipes`,
    FAVORITES: `${BASE_URL}/api/auth/favorites`,
    RANDOM: (limit: number = 20) =>
      `${BASE_URL}/api/auth/recipes/random?limit=${limit}`,
    BY_ID: (id: string) => `${BASE_URL}/api/auth/recipes/${id}`,
  },

  // Progress/Weight tracking endpoints
  PROGRESS: {
    WEIGHT_ENTRIES: `${BASE_URL}/api/auth/weight-entries`,
    WEIGHT_ENTRY_BY_ID: (id: string) =>
      `${BASE_URL}/api/auth/weight-entries/${id}`,
    INSIGHTS: `${BASE_URL}/api/auth/progress-insights`,
  },

  // Meal plan endpoints
  MEAL_PLAN: {
    GENERATE: `${BASE_URL}/api/auth/generate-mealplan`,
    GET: `${BASE_URL}/api/auth/weekplan`,
  },
};

// Helper function for fetch with credentials
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};
