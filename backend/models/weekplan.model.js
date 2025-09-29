import mongoose from "mongoose";

const weekPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },
  weekPlan: {
    type: Map, 
    of: {
      breakfast: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        reason: String,
      },
      lunch: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        reason: String,
      },
      dinner: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        reason: String,
      },
      snack: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
        reason: String,
      },
    },
  },
}, { timestamps: true });

export default mongoose.model("WeekPlan", weekPlanSchema);
