import mongoose from "mongoose";
import {
  Ingredient,
  recipeIngredientSchema,
  nutrientSchema,
} from "./ingredient.model.js";

// Rezept Schema
const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },

    servings: { type: Number, required: true, default: 1 },
    preparationTime: { type: Number, required: true }, // in Minuten
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },

    ingredients: [recipeIngredientSchema],
    steps: [{ type: String, required: true }],

    // Optional: Cache der aggregierten Nährwerte für schnelle Abfrage (kann automatisiert aktualisiert werden)
    nutrients: nutrientSchema,

    estimatedPrice: { type: Number, required: true },

    allergens: [{ type: String, default: [] }],
    tags: [{ type: String, default: [] }], // z. B. vegan, gluten-free, high-protein

    // Gesundheitskategorien & Wirkung
    healthBenefits: [{ type: String }], // z. B. "supports liver", "lowers inflammation"
    contraindications: [{ type: String }], // z. B. "not suitable for kidney disease"
    therapeuticGoals: [{ type: String }], // z. B. "gut healing", "hormone balance"

    suitableFor: [{ type: String }], // z. B. "diabetes", "PCOS", "autoimmune", "weight loss"
    excludedFor: [{ type: String }], // z. B. "hypertension", "kidney issues"

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export { Ingredient, Recipe };
