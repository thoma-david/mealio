import fs from "fs";
import Profile from "../models/profile.model.js";
import Recipe from "../models/recipe.model.js";
import { chatWithOpenAI } from "../services/openaiService.js";
import WeekPlan from "../models/weekplan.model.js";

export const generateMealPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Exclude 'steps' using projection
    const likedRecipes = await Recipe.find(
      { _id: { $in: profile.likes } },
      { steps: 0 } // exclude steps
    ).lean();

    // Also exclude 'steps' in aggregation
    const additionalRecipes = await Recipe.aggregate([
      { $match: { _id: { $nin: profile.likes } } },
      { $sample: { size: 30 } },
      { $project: { steps: 0 } } // exclude steps
    ]);

    const allRecipes = [...likedRecipes, ...additionalRecipes];

    const template = fs.readFileSync("backend/prompts/mealplanPromptTemplate.txt", "utf8");

    const prompt = template
      .replace("{{USER_PROFILE}}", JSON.stringify(profile, null, 2))
      .replace("{{AVAILABLE_RECIPES}}", JSON.stringify(allRecipes, null, 2));

    const gptResponse = await chatWithOpenAI(prompt);

    const weekPlan = JSON.parse(gptResponse);

    // Lösche den alten Plan, falls vorhanden
    await WeekPlan.deleteOne({ user: userId });

    // Erstelle neuen Plan
    const newWeekPlan = new WeekPlan({
      user: userId,
      weekPlan,
    });

    await newWeekPlan.save();

    res.status(200).json({ success: true, data: weekPlan });
  } catch (error) {
    console.error("Meal plan generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeMealInPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { day, mealType, newRecipeId, reason } = req.body;

    if (!day || !mealType || !newRecipeId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const weekPlanDoc = await WeekPlan.findOne({ user: userId });
    if (!weekPlanDoc) {
      return res.status(404).json({ success: false, message: "No meal plan found" });
    }

    // Check if day and mealType exist in weekPlan
    if (!weekPlanDoc.weekPlan[day]) {
      return res.status(400).json({ success: false, message: "Invalid day provided" });
    }

    // Update the specific meal with new recipe id and optional reason
    weekPlanDoc.weekPlan[day][mealType] = {
      id: newRecipeId,
      reason: reason || "Recipe changed by user"
    };

    await weekPlanDoc.save();

    res.status(200).json({ success: true, message: "Meal updated successfully", data: weekPlanDoc.weekPlan });
  } catch (error) {
    console.error("Change meal error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
