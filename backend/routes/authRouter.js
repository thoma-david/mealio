import express from "express";
import {
  register,
  login,
  logout,
  createProfile,
  updateProfile,
  addRecipe,
  likeRecipe,
  dislikeRecipe,
  verifyAuth,
  getRecipes,
} from "../controller/authController.js";
import authMiddleware from "../middleware/auth.js";
import { generateMealPlan, changeMealInPlan } from "../controller/mealPlanController.js";

const authRouter = express.Router();

authRouter.get("/verify", authMiddleware, verifyAuth);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/create-profile", authMiddleware, createProfile);
authRouter.put("/update-profile", authMiddleware, updateProfile);

authRouter.get("/recipes", getRecipes);
authRouter.post("/add-recipe", addRecipe);
authRouter.put("/like-recipe", authMiddleware, likeRecipe);
authRouter.put("/dislike-recipe", authMiddleware, dislikeRecipe);

authRouter.post("/generate-mealplan", authMiddleware, generateMealPlan);
authRouter.put("/change-meal", authMiddleware, changeMealInPlan);

export default authRouter;
