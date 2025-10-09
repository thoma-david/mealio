import mongoose from "mongoose";

const contaminantDetailSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g. "µg/kg", "mg/kg"
  },
  { _id: false }
);

const bioactivePropertySchema = new mongoose.Schema(
  {
    property: { type: String, required: true },
    description: { type: String },
    evidenceLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { _id: false }
);

const nutrientDetailSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g. "g", "mg", "kcal", "µg"
  },
  { _id: false }
);

const nutrientSchema = new mongoose.Schema(
  {
    calories: { type: nutrientDetailSchema, required: true }, // kcal
    protein: { type: nutrientDetailSchema, required: true }, // g
    fat: { type: nutrientDetailSchema, required: true }, // g
    saturatedFat: nutrientDetailSchema, // g
    carbohydrates: { type: nutrientDetailSchema, required: true }, // g
    sugar: nutrientDetailSchema, // g
    fiber: nutrientDetailSchema, // g
    salt: nutrientDetailSchema, // g or mg
    cholesterol: nutrientDetailSchema, // mg

    vitamins: {
      vitaminA: nutrientDetailSchema, // µg
      vitaminB1: nutrientDetailSchema, // mg
      vitaminB6: nutrientDetailSchema, // mg
      vitaminB12: nutrientDetailSchema, // µg
      vitaminC: nutrientDetailSchema, // mg
      vitaminD: nutrientDetailSchema, // µg
      vitaminE: nutrientDetailSchema, // mg
      vitaminK: nutrientDetailSchema, // µg
    },
    minerals: {
      iron: nutrientDetailSchema, // mg
      magnesium: nutrientDetailSchema, // mg
      potassium: nutrientDetailSchema, // mg
      calcium: nutrientDetailSchema, // mg
      zinc: nutrientDetailSchema, // mg
      selenium: nutrientDetailSchema, // µg
    },
  },
  { _id: false }
);

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // nutrientsPer100g and defaultUnit are optional to allow importing
    // ingredient records that may not include full nutrition info yet.
    nutrientsPer100g: { type: nutrientSchema },
    defaultUnit: { type: String },

    contaminants: {
      arsenic: contaminantDetailSchema,
      pesticides: contaminantDetailSchema,
      heavyMetals: contaminantDetailSchema,
      mycotoxins: contaminantDetailSchema,
    },

    qualityRating: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    bioactiveProperties: [bioactivePropertySchema],
  },
  { timestamps: true }
);

const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);

// Schema for recipe ingredient entries (reference + amount + unit)
const recipeIngredientSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    isOptional: { type: Boolean, default: false },
    raw: { type: Boolean, default: false },
  },
  { _id: false }
);

export { Ingredient, recipeIngredientSchema, nutrientSchema };
