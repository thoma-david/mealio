import mongoose from "mongoose";

const mealEntrySchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  servings: {
    type: Number,
    required: true,
    default: 1, // Wie viele Portionen an diesem Tag gegessen werden
  },
  cookedOn: {
    type: String, // z. B. 'monday' – für Nachverfolgbarkeit bei Leftovers
    required: true,
  },
  isPrepared: {
    type: Boolean, // true = aufgewärmt, false = frisch gekocht
    required: true,
  },
  reason: {
    type: String, // z. B. "proteinreich", "Budgetfreundlich", etc.
  },
});

const daySchema = new mongoose.Schema({
  breakfast: mealEntrySchema,
  lunch: mealEntrySchema,
  dinner: mealEntrySchema,
  snack: mealEntrySchema,
});

const weekPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Nur ein Plan pro User
    },
    weekPlan: {
      monday: daySchema,
      tuesday: daySchema,
      wednesday: daySchema,
      thursday: daySchema,
      friday: daySchema,
      saturday: daySchema,
      sunday: daySchema,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WeekPlan", weekPlanSchema);
