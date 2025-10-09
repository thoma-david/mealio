import fs from "fs";
import Profile from "../models/profile.model.js";
import { Recipe } from "../models/recipe.model.js";
import { chatWithOpenAI } from "../services/openaiService.js";
import WeekPlan from "../models/weekplan.model.js";

export const generateMealPlan = async (req, res) => {
  try {
    console.log("=== MEAL PLAN GENERATION STARTED ===");
    console.log("User ID:", req.user._id);
    console.log("Request Body:", req.body);

    const userId = req.user._id;

    // Fetch user profile
    console.log("\n📋 Fetching user profile...");
    const profile = await Profile.findOne({ user: userId }).lean();
    if (!profile) {
      console.error("❌ Profile not found for user:", userId);
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    console.log("✅ Profile found");
    console.log("Profile Summary:", {
      age: profile.age,
      gender: profile.gender,
      goals: profile.goal,
      diet: profile.diet,
      budget: profile.budget,
      likes: profile.likes?.length || 0,
      dislikes: profile.dislikes?.length || 0,
    });
    console.log("DEBUG - Full likes array:", JSON.stringify(profile.likes));
    console.log(
      "DEBUG - Full dislikes array:",
      JSON.stringify(profile.dislikes)
    );

    // Fetch liked recipes - only names and basic info
    console.log("\n🍽️  Fetching liked recipes...");
    console.log("Profile likes:", profile.likes);

    let likedRecipes = [];
    if (profile.likes && profile.likes.length > 0) {
      likedRecipes = await Recipe.find(
        { _id: { $in: profile.likes } },
        {
          name: 1,
          description: 1,
          cuisine: 1,
          time: 1,
          mealType: 1,
          calories: 1,
          protein: 1,
          carbohydrates: 1,
          fat: 1,
          tags: 1,
          "ingredients.ingredient": 1,
        }
      )
        .populate("ingredients.ingredient", "name category") // Only get ingredient name and category
        .lean();
    }
    console.log(`✅ Found ${likedRecipes.length} liked recipes`);

    // Only exclude disliked recipes, NOT liked ones
    const excludedRecipeIds = [...(profile.dislikes || [])];
    console.log("\n🚫 Excluding disliked recipes:");
    console.log(`  - Disliked: ${profile.dislikes?.length || 0}`);
    console.log(`  - Total excluded: ${excludedRecipeIds.length}`);
    console.log(`  - Liked recipes will be INCLUDED: ${likedRecipes.length}`);

    // Fetch additional recipes - only names and basic info
    console.log("\n🎲 Fetching additional random recipes...");
    const additionalRecipes = await Recipe.aggregate([
      { $match: { _id: { $nin: excludedRecipeIds } } },
      { $sample: { size: 30 } },
      {
        $lookup: {
          from: "ingredients",
          localField: "ingredients.ingredient",
          foreignField: "_id",
          as: "ingredientDocs",
        },
      },
      {
        $addFields: {
          ingredients: {
            $map: {
              input: "$ingredients",
              as: "ing",
              in: {
                ingredient: {
                  name: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$ingredientDocs",
                              cond: { $eq: ["$$this._id", "$$ing.ingredient"] },
                            },
                          },
                          as: "doc",
                          in: "$$doc.name",
                        },
                      },
                      0,
                    ],
                  },
                  category: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$ingredientDocs",
                              cond: { $eq: ["$$this._id", "$$ing.ingredient"] },
                            },
                          },
                          as: "doc",
                          in: "$$doc.category",
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          cuisine: 1,
          time: 1,
          mealType: 1,
          calories: 1,
          protein: 1,
          carbohydrates: 1,
          fat: 1,
          tags: 1,
          "ingredients.ingredient.name": 1,
          "ingredients.ingredient.category": 1,
        },
      },
      {
        $unset: "ingredientDocs", // Remove the temporary field
      },
    ]);
    console.log(`✅ Found ${additionalRecipes.length} additional recipes`);

    // Mark liked recipes explicitly for the AI
    const markedLikedRecipes = likedRecipes.map((recipe) => ({
      ...recipe,
      isLikedByUser: true,
    }));

    const allRecipes = [...markedLikedRecipes, ...additionalRecipes];
    console.log(`\n📚 Total recipes available for AI: ${allRecipes.length}`);
    console.log(`  - Liked: ${likedRecipes.length}`);
    console.log(`  - Random: ${additionalRecipes.length}`);

    // Read prompt template
    console.log("\n📝 Reading prompt template...");
    const template = fs.readFileSync(
      "backend/prompts/mealplanPromptTemplate.txt",
      "utf8"
    );
    console.log("✅ Template loaded");

    // Prepare a clean profile summary for the AI
    console.log("\n🧑 Preparing profile summary for AI...");
    const profileSummary = {
      // Basic info
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      activityLevel: profile.activityLevel,

      // Goals (now array)
      goals: Array.isArray(profile.goal) ? profile.goal : [profile.goal],
      targetWeight: profile.targetWeight,
      goalStartDate: profile.goalStartDate,
      goalTargetDate: profile.goalTargetDate,

      // Dietary preferences
      diet: profile.diet,
      foodPreferences: profile.foodPreferences || [],
      allergies: profile.allergies || [],
      intolerances: profile.intolerances || [],

      // Budget
      budget: profile.budget,

      // Advanced fields (if available)
      bodyFatPercentage: profile.bodyFatPercentage,
      waistCircumference: profile.waistCircumference,
      sleepQuality: profile.sleepQuality,
      cookingSkill: profile.cookingSkill,
      conditions: profile.conditions || [],
      medications: profile.medications || [],
    };
    console.log("✅ Profile summary prepared");

    // Build prompt
    console.log("\n🔧 Building AI prompt...");
    const prompt = template
      .replace("{{USER_PROFILE}}", JSON.stringify(profileSummary, null, 2))
      .replace("{{AVAILABLE_RECIPES}}", JSON.stringify(allRecipes, null, 2));
    console.log("✅ Prompt built");
    console.log(`Prompt length: ${prompt.length} characters`);

    // Call OpenAI
    console.log("\n🤖 Calling OpenAI API...");
    const startTime = Date.now();
    const gptResponse = await chatWithOpenAI(prompt);
    const elapsedTime = Date.now() - startTime;
    console.log(`✅ OpenAI response received in ${elapsedTime}ms`);
    console.log(`Response length: ${gptResponse.length} characters`);

    // Parse AI response
    console.log("\n📊 Parsing AI response...");
    const parsedResponse = JSON.parse(gptResponse);
    console.log("✅ Response parsed successfully");
    console.log("Response structure:", Object.keys(parsedResponse));

    // Extract the actual week plan (might be nested under "weekPlan" key)
    const weekPlan = parsedResponse.weekPlan || parsedResponse;
    console.log("Week plan keys:", Object.keys(weekPlan));

    // Delete old plan if exists
    console.log("\n🗑️  Deleting old meal plan...");
    const deleteResult = await WeekPlan.deleteOne({ user: userId });
    console.log(`✅ Deleted ${deleteResult.deletedCount} old plan(s)`);

    // Create new plan
    console.log("\n💾 Saving new meal plan to database...");
    const newWeekPlan = new WeekPlan({
      user: userId,
      weekPlan: parsedResponse.weekPlan || parsedResponse,
    });
    await newWeekPlan.save();
    console.log("✅ Meal plan saved to database");

    // Transform the weekPlan to match frontend format
    console.log("\n🔄 Transforming meal plan for frontend...");
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const transformedMealPlan = {
      week: [],
      groceryList: [],
      metadata: {
        weeklyBudget: req.body.weeklyBudget || profile.budget || 100,
        dailyBudget: (
          (req.body.weeklyBudget || profile.budget || 100) / 7
        ).toFixed(2),
        generatedAt: new Date().toISOString(),
      },
    };

    // Collect all ingredients for grocery list
    const allIngredients = new Map();
    let totalRecipesProcessed = 0;

    // Collect all recipe IDs from the AI response
    const allRecipeIds = new Set();
    Object.keys(weekPlan).forEach((dayKey) => {
      const dayMeals = weekPlan[dayKey];
      Object.keys(dayMeals).forEach((mealType) => {
        const meal = dayMeals[mealType];
        const recipeId = typeof meal === "object" ? meal.id || meal._id : meal;
        if (recipeId) {
          allRecipeIds.add(recipeId.toString());
        }
      });
    });

    console.log(`\n📋 Fetching ${allRecipeIds.size} recipes from database...`);

    // Fetch all needed recipes with full data and populated ingredients
    const fullRecipes = await Recipe.find({
      _id: { $in: Array.from(allRecipeIds) },
    })
      .populate("ingredients.ingredient", "name")
      .lean(); // Convert to plain objects

    console.log(`✅ Fetched ${fullRecipes.length} full recipes`);

    // Create a map for quick lookup
    const recipeMap = new Map();
    fullRecipes.forEach((recipe) => {
      recipeMap.set(recipe._id.toString(), recipe);
    });

    // Process each day
    Object.keys(weekPlan).forEach((dayKey, index) => {
      const dayName = weekdays[index] || dayKey;
      const dayMeals = weekPlan[dayKey];
      const dayRecipes = [];

      console.log(`\n  Processing ${dayName}...`);

      // Get recipes for each meal type
      Object.keys(dayMeals).forEach((mealType) => {
        const meal = dayMeals[mealType];
        console.log(`    🔍 ${mealType}:`, meal);

        // Extract recipe ID (handle both {id: "...", reason: "..."} and direct ID formats)
        const recipeId = typeof meal === "object" ? meal.id || meal._id : meal;
        console.log(`    🆔 Recipe ID:`, recipeId);

        // Get recipe from the fetched full recipes
        const recipe = recipeMap.get(recipeId.toString());

        if (recipe) {
          console.log(`    ✅ ${mealType}: ${recipe.name}`);
          totalRecipesProcessed++;

          // Transform recipe: extract nutrient values from nested structure
          const transformedRecipe = {
            ...recipe,
            // Extract flat nutritional values for frontend
            calories: recipe.nutrients?.calories?.value || 0,
            protein: recipe.nutrients?.protein?.value || 0,
            fat: recipe.nutrients?.fat?.value || 0,
            carbohydrates: recipe.nutrients?.carbohydrates?.value || 0,
            // Rename fields to match frontend expectations
            time: recipe.preparationTime || recipe.time || 0,
            estimated_price:
              recipe.estimatedPrice || recipe.estimated_price || 0,
            reason:
              typeof meal === "object"
                ? meal.reason || "AI-selected for optimal nutrition"
                : "AI-selected for optimal nutrition",
            mealType: mealType,
          };

          dayRecipes.push(transformedRecipe);

          // Collect ingredients - aggregate amounts for same ingredients
          if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
            recipe.ingredients.forEach((recipeIngredient) => {
              // Handle both populated and unpopulated ingredient references
              const ingredientName =
                recipeIngredient.ingredient?.name || recipeIngredient.name;

              if (ingredientName) {
                const key = ingredientName.toLowerCase();
                const amount = recipeIngredient.amount || 0;
                const unit = recipeIngredient.unit || "";

                if (allIngredients.has(key)) {
                  // Ingredient already exists - add to the amount
                  const existing = allIngredients.get(key);
                  // Only sum if units match (to avoid adding "2 cups" + "3 grams")
                  if (existing.unit === unit) {
                    existing.amount += amount;
                  } else {
                    // Different units - keep separate (could improve this later)
                    console.log(
                      `    ⚠️ Different units for ${ingredientName}: ${existing.unit} vs ${unit}`
                    );
                  }
                } else {
                  // First time seeing this ingredient
                  allIngredients.set(key, {
                    name: ingredientName,
                    amount: amount,
                    unit: unit,
                  });
                }
              } else {
                console.log(
                  `    ⚠️ Ingredient missing name:`,
                  recipeIngredient
                );
              }
            });
          }
        } else {
          console.log(
            `    ⚠️  ${mealType}: Recipe not found (ID: ${recipeId})`
          );
          console.log(
            `    📋 Available recipe IDs:`,
            allRecipes.slice(0, 3).map((r) => r._id.toString())
          );
        }
      });

      transformedMealPlan.week.push({
        day: dayName,
        recipes: dayRecipes,
        reason: `AI-curated meal plan for ${dayName} based on your goals and preferences`,
      });
    });

    // Convert ingredients map to array
    transformedMealPlan.groceryList = Array.from(allIngredients.values());

    console.log("\n📤 Final response summary:");
    console.log(`  Total days: ${transformedMealPlan.week.length}`);
    console.log(`  Total recipes: ${totalRecipesProcessed}`);
    console.log(
      `  Grocery list items: ${transformedMealPlan.groceryList.length}`
    );

    // Log a sample recipe to check structure
    if (transformedMealPlan.week[0]?.recipes[0]) {
      const sampleRecipe = transformedMealPlan.week[0].recipes[0];
      console.log(`\n🔍 Sample recipe structure:`);
      console.log(`  Name: ${sampleRecipe.name}`);
      console.log(`  Has ingredients: ${!!sampleRecipe.ingredients}`);
      console.log(
        `  Ingredients count: ${sampleRecipe.ingredients?.length || 0}`
      );
      console.log(`  Calories: ${sampleRecipe.calories}`);
      console.log(`  Protein: ${sampleRecipe.protein}g`);
      console.log(`  Fat: ${sampleRecipe.fat}g`);
      console.log(`  Carbohydrates: ${sampleRecipe.carbohydrates}g`);
      console.log(`  Time: ${sampleRecipe.time} minutes`);
      console.log(`  Price: $${sampleRecipe.estimated_price}`);
      if (sampleRecipe.ingredients?.[0]) {
        console.log(
          `  First ingredient structure:`,
          JSON.stringify(sampleRecipe.ingredients[0], null, 2)
        );
      }
    }

    res.status(200).json({ success: true, data: transformedMealPlan });
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
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const weekPlanDoc = await WeekPlan.findOne({ user: userId });
    if (!weekPlanDoc) {
      return res
        .status(404)
        .json({ success: false, message: "No meal plan found" });
    }

    // Check if day and mealType exist in weekPlan
    if (!weekPlanDoc.weekPlan[day]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid day provided" });
    }

    // Update the specific meal with new recipe id and optional reason
    weekPlanDoc.weekPlan[day][mealType] = {
      id: newRecipeId,
      reason: reason || "Recipe changed by user",
    };

    await weekPlanDoc.save();

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: weekPlanDoc.weekPlan,
    });
  } catch (error) {
    console.error("Change meal error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeekPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const weekPlanDoc = await WeekPlan.findOne({ user: userId });
    if (!weekPlanDoc) {
      return res
        .status(404)
        .json({ success: false, message: "No meal plan found" });
    }

    res.status(200).json({
      success: true,
      data: weekPlanDoc.weekPlan,
    });
  } catch (error) {
    console.error("Get week plan error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
