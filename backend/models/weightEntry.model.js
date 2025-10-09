import mongoose from "mongoose";

const weightEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 30, // Minimum weight in kg
      max: 300, // Maximum weight in kg
    },
    bodyFatPercentage: {
      type: Number,
      min: 3,
      max: 60,
    },
    muscleMass: {
      type: Number,
      min: 0,
      max: 200,
    },
    bodyMeasurements: {
      waist: { type: Number, min: 0, max: 300 }, // cm
      hips: { type: Number, min: 0, max: 300 }, // cm
      chest: { type: Number, min: 0, max: 300 }, // cm
      arms: { type: Number, min: 0, max: 100 }, // cm
      thighs: { type: Number, min: 0, max: 150 }, // cm
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
weightEntrySchema.index({ userId: 1, date: -1 });

const WeightEntry = mongoose.model("WeightEntry", weightEntrySchema);

export default WeightEntry;
