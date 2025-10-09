import Profile from "../models/profile.model.js";

export const verifyAuth = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if user has a profile
  const profile = await Profile.findOne({ user: user._id });

  // Return user data and profile status
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    hasProfile: !!profile,
  });
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    const newProfile = new Profile({
      user: userId,

      // Required fields
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      budget: req.body.budget,
      goal: req.body.goal || [],
      goalStartDate: req.body.goalStartDate || new Date(),
      goalTargetDate: req.body.goalTargetDate,

      // Basic fields with defaults
      activityLevel: req.body.activityLevel || 3,
      stressLevel: req.body.stressLevel || 3,
      dietType: req.body.dietType || "omnivore",
      allergies: req.body.allergies || [],
      conditions: req.body.conditions || [],
      dislikes: req.body.dislikes || [],
      likes: req.body.likes || [],

      // Advanced Physical Info (optional)
      bodyFatPercentage: req.body.bodyFatPercentage,
      waistCircumference: req.body.waistCircumference,

      // Advanced Lifestyle (optional)
      sleepQuality: req.body.sleepQuality,
      cookingSkill: req.body.cookingSkill,
      maxCookingTimePerMeal: req.body.maxCookingTimePerMeal,
      mealPrepDays: req.body.mealPrepDays || [],

      // Advanced Dietary (optional)
      foodPreferences: req.body.foodPreferences || [],
      intolerances: req.body.intolerances || [],

      // Medical Info (optional)
      medications: req.body.medications || [],
      bloodValues: req.body.bloodValues || {},

      // Advanced Goal Info (optional)
      targetWeight: req.body.targetWeight,
      goalProgressHistory: req.body.goalProgressHistory || [],
    });

    await newProfile.save();
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if profile exists
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create a profile first.",
      });
    }

    // Update profile with new data
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like a recipe
export const likeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id; // User ID aus authMiddleware

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Remove from dislikes if it's there
    profile.dislikes = profile.dislikes.filter((id) => !id.equals(recipeId));

    // Add to likes if not already there
    if (!profile.likes.includes(recipeId)) {
      profile.likes.push(recipeId);
    }

    await profile.save();
    res.status(200).json({
      success: true,
      message: "Recipe liked successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dislike a recipe
export const dislikeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id; // User ID aus authMiddleware

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Remove from likes if it's there
    profile.likes = profile.likes.filter((id) => !id.equals(recipeId));

    // Add to dislikes if not already there
    if (!profile.dislikes.includes(recipeId)) {
      profile.dislikes.push(recipeId);
    }

    await profile.save();
    res.status(200).json({
      success: true,
      message: "Recipe disliked successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove like/dislike (neutral)
export const removeRecipePreference = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user._id; // User ID aus authMiddleware

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Remove from both arrays
    profile.likes = profile.likes.filter((id) => !id.equals(recipeId));
    profile.dislikes = profile.dislikes.filter((id) => !id.equals(recipeId));

    await profile.save();
    res.status(200).json({
      success: true,
      message: "Recipe preference removed",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
