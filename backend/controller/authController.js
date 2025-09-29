import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import transporter from "../config/nodemailer.js";
import Recipe from "../models/recipe.model.js";

export const verifyAuth = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // You can return selected fields if needed
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const register = async (req, res) => {
  console.log("Register function called");
  console.log("User model in register:", User);

  const user = req.body;
  if (!user.name || !user.email || !user.password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = new User({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "undefined");
    console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to Our Service",
      text: `Hello ${user.name},Thank you for registering! We're glad to have you on board.Best regards,The Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("Error in register function:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 9999);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email Verification",
      text: "Please verify your email by clicking on the following link: [verification link]",
    });
    res.status(200).json({ success: true, message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Profile already exists for this user" });
    }

    const newProfile = new Profile({
      user: userId,
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      budget: req.body.budget,
      allergies: req.body.allergies,
      conditions: req.body.conditions,
      activityLevel: req.body.activityLevel,
      stressLevel: req.body.stressLevel,
      dietType: req.body.dietType,
      dislikes: req.body.dislikes,
      likes: req.body.likes,
      goal: req.body.goal,
    });

    await newProfile.save();
    res.status(201).json({ success: true, message: "Profile created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, req.body, { new: true });
    res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find().skip(skip).limit(limit).sort({ createdAt: -1 }); // Sort by newest first

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

export const addRecipe = async (req, res) => {
  try {
    const {
      name,
      time,
      image,
      ingredients,
      steps,
      protein,
      calories,
      fat,
      description,
      carbohydrates,
      estimated_price,
      meal_type,
      allergens,
      tags,
    } = req.body;

    const newRecipe = new Recipe({
      name,
      time,
      ingredients,
      steps,
      image,
      protein,
      calories,
      fat,
      carbohydrates,
      description,
      estimated_price,
      meal_type,
      allergens,
      tags,
    });

    await newRecipe.save();
    res.status(201).json({ success: true, message: "Recipe added successfully", data: newRecipe });
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
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Remove from dislikes if it's there
    profile.dislikes = profile.dislikes.filter((id) => !id.equals(recipeId));

    // Add to likes if not already there
    if (!profile.likes.includes(recipeId)) {
      profile.likes.push(recipeId);
    }

    await profile.save();
    res.status(200).json({ success: true, message: "Recipe liked successfully", data: profile });
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
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Remove from likes if it's there
    profile.likes = profile.likes.filter((id) => !id.equals(recipeId));

    // Add to dislikes if not already there
    if (!profile.dislikes.includes(recipeId)) {
      profile.dislikes.push(recipeId);
    }

    await profile.save();
    res.status(200).json({ success: true, message: "Recipe disliked successfully", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove like/dislike (neutral)
export const removeRecipePreference = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Remove from both arrays
    profile.likes = profile.likes.filter((id) => !id.equals(recipeId));
    profile.dislikes = profile.dislikes.filter((id) => !id.equals(recipeId));

    await profile.save();
    res.status(200).json({ success: true, message: "Recipe preference removed", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
