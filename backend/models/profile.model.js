import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  weight: Number,
  bodyMeasurements: {
    waist: Number,
    hips: Number,
    chest: Number,
    // ...weitere Maße
  },
  notes: String, // z. B. für Stimmung oder spezielle Beobachtungen
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Körperdaten
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "diverse"],
      required: true,
    },
    height: { type: Number, required: true }, // cm
    weight: { type: Number, required: true }, // kg
    bodyFatPercentage: { type: Number }, // optional, für genauere Analysen
    waistCircumference: { type: Number }, // optional, viszerales Fett

    // Lebensstil
    activityLevel: { type: Number, min: 1, max: 5, default: 3 }, // 1=sedentary, 5=athlete
    stressLevel: { type: Number, min: 1, max: 5, default: 3 },
    sleepQuality: { type: Number, min: 1, max: 5 }, // optional

    // Ernährung
    dietType: {
      type: String,
      enum: [
        "omnivore",
        "vegetarian",
        "vegan",
        "pescatarian",
        "keto",
        "paleo",
        "other",
      ],
      default: "omnivore",
    },
    foodPreferences: [{ type: String }], // z. B. "low-carb", "mediterranean"
    dislikes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", default: [] },
    ],
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", default: [] },
    ],
    allergies: [{ type: String, default: [] }], // z. B. "gluten", "soy"
    intolerances: [{ type: String, default: [] }], // z. B. "lactose", "histamine"

    // Medizinisch
    conditions: [{ type: String, default: [] }], // z. B. "diabetes", "hashimoto"
    medications: [{ type: String }], // optional
    bloodValues: {
      cholesterol: { type: Number }, // mg/dL
      bloodSugar: { type: Number }, // mg/dL
      triglycerides: { type: Number },
      vitaminD: { type: Number }, // ng/ml
      iron: { type: Number },
      b12: { type: Number },
    },

    // Ziele
    goal: [
      {
        type: String,
        enum: [
          "weight_loss",
          "muscle_gain",
          "maintenance",
          "gut_health",
          "hormone_balance",
          "inflammation_reduction",
          "energy_boost",
          "other",
        ],
      },
    ],
    goalStartDate: { type: Date, required: true },
    goalTargetDate: { type: Date, required: true },
    goalProgressHistory: [progressSchema], // oder Referenz zu Progress-Dokumenten
    targetWeight: { type: Number }, // optional
    budget: { type: Number, required: true }, // €/Woche

    // Zeit & Kochfaktor
    cookingSkill: { type: Number, min: 1, max: 5 }, // 1=Anfänger, 5=Profi
    maxCookingTimePerMeal: { type: Number }, // Minuten
    mealPrepDays: [{ type: String }], // z. B. ["sunday", "wednesday"]
    progress: [progressSchema], // Array mit Fortschritts-Einträgen

    // Technisch
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.profile || mongoose.model("Profile", profileSchema);
export default Profile;
