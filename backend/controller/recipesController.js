import mongoose from "mongoose";
import { Ingredient, Recipe } from "../models/recipe.model.js";
import Profile from "../models/profile.model.js";

// Hilfsfunktion im Controller definieren
const aggregateNutrients = (ingredientsList, dbIngs) => {
  const totalNutrients = {
    calories: { value: 0, unit: "kcal" },
    protein: { value: 0, unit: "g" },
    fat: { value: 0, unit: "g" },
    saturatedFat: { value: 0, unit: "g" },
    carbohydrates: { value: 0, unit: "g" },
    sugar: { value: 0, unit: "g" },
    fiber: { value: 0, unit: "g" },
    salt: { value: 0, unit: "g" },
    cholesterol: { value: 0, unit: "mg" },
    vitamins: {
      vitaminA: { value: 0, unit: "µg" },
      vitaminB1: { value: 0, unit: "mg" },
      vitaminB6: { value: 0, unit: "mg" },
      vitaminB12: { value: 0, unit: "µg" },
      vitaminC: { value: 0, unit: "mg" },
      vitaminD: { value: 0, unit: "µg" },
      vitaminE: { value: 0, unit: "mg" },
      vitaminK: { value: 0, unit: "µg" },
    },
    minerals: {
      iron: { value: 0, unit: "mg" },
      magnesium: { value: 0, unit: "mg" },
      potassium: { value: 0, unit: "mg" },
      calcium: { value: 0, unit: "mg" },
      zinc: { value: 0, unit: "mg" },
      selenium: { value: 0, unit: "µg" },
    },
  };

  ingredientsList.forEach((ing) => {
    const dbIng = dbIngs.find(
      (d) => d._id.toString() === ing.ingredient.toString()
    );
    if (!dbIng) return;
    const factor = ing.amount / 100;

    // Summiere Makronährstoffe
    [
      "calories",
      "protein",
      "fat",
      "saturatedFat",
      "carbohydrates",
      "sugar",
      "fiber",
      "salt",
      "cholesterol",
    ].forEach((key) => {
      if (dbIng.nutrientsPer100g[key]) {
        totalNutrients[key].value += dbIng.nutrientsPer100g[key].value * factor;
      }
    });

    // Vitamine
    for (const vit in dbIng.nutrientsPer100g.vitamins || {}) {
      if (dbIng.nutrientsPer100g.vitamins[vit]) {
        totalNutrients.vitamins[vit].value +=
          dbIng.nutrientsPer100g.vitamins[vit].value * factor;
      }
    }
    // Mineralstoffe
    for (const min in dbIng.nutrientsPer100g.minerals || {}) {
      if (dbIng.nutrientsPer100g.minerals[min]) {
        totalNutrients.minerals[min].value +=
          dbIng.nutrientsPer100g.minerals[min].value * factor;
      }
    }
  });

  return totalNutrients;
};

// Bulk add recipes - created with ai because logic got to complex
export const addRecipes = async (req, res) => {
  try {
    const recipes = Array.isArray(req.body) ? req.body : req.body.recipes;

    if (!Array.isArray(recipes) || recipes.length === 0) {
      return res
        .status(400)
        .json({ message: "No recipes provided or wrong format." });
    }

    // Einmal alle ingredient IDs sammeln
    const allIngredientIds = new Set();
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        allIngredientIds.add(ing.ingredient);
      });
    });

    // Zutaten aus DB holen (hier casten zu ObjectId)
    const dbIngredients = await Ingredient.find({
      _id: {
        $in: Array.from(allIngredientIds).map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      },
    }).lean();

    const recipesToInsert = recipes.map((recipe) => {
      const ingredientsWithObjectIds = recipe.ingredients.map((ing) => ({
        ...ing,
        ingredient: new mongoose.Types.ObjectId(ing.ingredient),
      }));

      const nutrients = aggregateNutrients(
        ingredientsWithObjectIds,
        dbIngredients
      );

      let estimatedPrice = 0;
      for (const ing of ingredientsWithObjectIds) {
        const dbIng = dbIngredients.find(
          (d) => d._id.toString() === ing.ingredient.toString()
        );
        if (dbIng && dbIng.pricePer100g) {
          estimatedPrice += (dbIng.pricePer100g * ing.amount) / 100;
        }
      }

      return {
        ...recipe,
        ingredients: ingredientsWithObjectIds,
        nutrients,
        estimatedPrice,
      };
    });

    const insertedRecipes = await Recipe.insertMany(recipesToInsert);

    res.status(201).json({
      message: `${insertedRecipes.length} recipes added successfully`,
      data: insertedRecipes,
    });
  } catch (error) {
    console.error("Error adding recipes batch:", error);
    res
      .status(500)
      .json({ message: "Failed to add recipes batch", error: error.message });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    // Finde Rezepte und populieren Zutaten (wenn du Details der Zutaten brauchst)
    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("ingredients.ingredient"); // <- hier Zutaten referenziert laden

    const totalRecipes = await Recipe.countDocuments();
    const hasMore = page * limit < totalRecipes;

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        limit: limit,
        totalRecipes: totalRecipes,
        hasMore: hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavoriteRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's profile and populate the liked recipes
    const profile = await Profile.findOne({ user: userId }).populate("likes");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Return the liked recipes
    res.status(200).json({
      success: true,
      data: profile.likes || [],
    });
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
