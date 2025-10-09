import express from "express";
import { register, login, logout } from "../controller/authController.js";

import {
  verifyAuth,
  createProfile,
  updateProfile,
  getProfile,
  likeRecipe,
  dislikeRecipe,
  removeRecipePreference,
} from "../controller/profileController.js";
import {
  getRecipes,
  getFavoriteRecipes,
  addRecipes,
} from "../controller/recipesController.js";

import {
  generateMealPlan,
  getWeekPlan,
  changeMealInPlan,
} from "../controller/mealPlanController.js";
import {
  addIngredientsBatch,
  getIngredients,
} from "../controller/ingredientController.js";

import {
  getWeightEntries,
  addWeightEntry,
  deleteWeightEntry,
  getProgressInsights,
} from "../controller/progressController.js";

import authMiddleware from "../middleware/auth.js";
import { changeMealInPlan } from "../controller/mealPlanController.js";

const authRouter = express.Router();

//AUTH
authRouter.get("/verify", authMiddleware, verifyAuth);
authRouter.post("/signup", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

//PROFILE
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.post("/create-profile", authMiddleware, createProfile);
authRouter.put("/update-profile", authMiddleware, updateProfile);
authRouter.put("/like-recipe", authMiddleware, likeRecipe);
authRouter.put("/dislike-recipe", authMiddleware, dislikeRecipe);
authRouter.put(
  "/remove-recipe-preference",
  authMiddleware,
  removeRecipePreference
);
authRouter.get("/favorites", authMiddleware, getFavoriteRecipes);

//RECIPES
authRouter.get("/recipes", getRecipes);
authRouter.post("/add-recipes", addRecipes);

//AI MEAL PLAN
authRouter.post("/generate-mealplan", authMiddleware, generateMealPlan);
authRouter.get("/weekplan", authMiddleware, getWeekPlan);
authRouter.put("/change-meal", authMiddleware, changeMealInPlan);

//INGREDIENTS
authRouter.post("/add-ingredient", addIngredientsBatch);
authRouter.get("/get-ingredients", getIngredients);

//PROGRESS TRACKING
authRouter.get("/weight-entries", authMiddleware, getWeightEntries);
authRouter.post("/weight-entries", authMiddleware, addWeightEntry);
authRouter.delete("/weight-entries/:id", authMiddleware, deleteWeightEntry);
authRouter.get("/progress-insights", authMiddleware, getProgressInsights);

export default authRouter;
