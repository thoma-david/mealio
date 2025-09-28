import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  steps: {
    type: Map,
    of: String,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  carbohydrates: {
    type: Number,
    required: true,
  },
  estimated_price: {
    type: Number,
    required: true,
  },
  meal_type: {
    type: String,
    required: true,
  },
  allergens: [{
    type: String,
    default: [],
  }],
  tags: [{
    type: String,
    default: [],
  }],
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
export default Recipe;