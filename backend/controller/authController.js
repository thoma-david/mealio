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
      try{
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
      }catch(error){
          res.status(500).json({ success: false, message: error.message });
      }

}

export const updateProfile = async (req, res) => {
    try{
        const userId = req.user._id;
        const updatedProfile = await Profile.findOneAndUpdate({ user: userId }, req.body, { new: true });
        res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedProfile });
    }catch (error){
          res.status(500).json({ success: false, message: error.message });
      }}



export const addRecipe = async (req, res) => {
    try {
        const { name, time, ingredients, description, steps, protein, calories, fat, carbohydrates, estimated_price, meal_type, allergens, tags, image } = req.body;

        const newRecipe = new Recipe({
            name,
            time,
            description,
            ingredients,
            image,
            steps,
            protein,
            calories,
            fat,
            carbohydrates,
            estimated_price,
            meal_type,
            allergens,
            tags
        });

        await newRecipe.save();
        res.status(201).json({ success: true, message: "Recipe added successfully", data: newRecipe });
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
        profile.dislikes = profile.dislikes.filter(id => !id.equals(recipeId));
        
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
        profile.likes = profile.likes.filter(id => !id.equals(recipeId));
        
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
        const { recipeId } = req.body;
        const userId = req.user._id; // User ID aus authMiddleware

        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // Remove from both arrays
        profile.likes = profile.likes.filter(id => !id.equals(recipeId));
        profile.dislikes = profile.dislikes.filter(id => !id.equals(recipeId));

        await profile.save();
        res.status(200).json({ success: true, message: "Recipe preference removed", data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate weekly meal plan
export const generateMealPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get user profile to understand preferences and default budget
        const profile = await Profile.findOne({ user: userId });
        
        if (!profile) {
            return res.status(404).json({ success: false, message: "User profile not found. Please create a profile first." });
        }

        // Extract parameters from request body (for this generation only)
        const { peopleCount, weeklyBudget } = req.body;
        
        // Use provided values or defaults (people count not saved to profile)
        const finalPeopleCount = peopleCount || 2; // Default 2 people (not saved)
        const finalWeeklyBudget = weeklyBudget || profile.budget || 100; // Use provided or profile budget
        
        // Calculate daily budget and adjust for people count
        const dailyBudget = finalWeeklyBudget / 7;
        const budgetPerMeal = dailyBudget / 4; // 4 meals per day (breakfast, lunch, dinner, snack)
        
        // Get all recipes
        const allRecipes = await Recipe.find({});
        
        if (allRecipes.length === 0) {
            return res.status(404).json({ success: false, message: "No recipes available" });
        }

        // Filter recipes by budget (considering people count)
        const filterRecipesByBudget = (recipes, maxPrice) => {
            return recipes.filter(recipe => {
                const adjustedPrice = (recipe.estimated_price || 0) * finalPeopleCount;
                return adjustedPrice <= maxPrice;
            });
        };

        // TODO: Here you would call your AI service with the prompt template
        // For now, we'll simulate the AI response structure
        
        // Simulate AI-generated meal plan structure
        const weekdays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        
        // Group recipes by meal type and filter by budget
        const recipesByMealType = {
            breakfast: filterRecipesByBudget(
                allRecipes.filter(recipe => recipe.meal_type?.toLowerCase() === 'breakfast'),
                budgetPerMeal
            ),
            lunch: filterRecipesByBudget(
                allRecipes.filter(recipe => recipe.meal_type?.toLowerCase() === 'lunch'),
                budgetPerMeal
            ),
            dinner: filterRecipesByBudget(
                allRecipes.filter(recipe => recipe.meal_type?.toLowerCase() === 'dinner'),
                budgetPerMeal * 1.5 // Allow slightly higher budget for dinner
            ),
            snack: filterRecipesByBudget(
                allRecipes.filter(recipe => recipe.meal_type?.toLowerCase() === 'snack'),
                budgetPerMeal * 0.5 // Lower budget for snacks
            )
        };

        // Fallback to all recipes if specific meal type has no budget-friendly recipes
        const getRecipesForMealType = (mealType) => {
            const specificRecipes = recipesByMealType[mealType];
            if (specificRecipes.length > 0) {
                return specificRecipes;
            }
            
            // Fallback: get all recipes of this meal type (ignore budget if no options)
            const allMealTypeRecipes = allRecipes.filter(recipe => 
                recipe.meal_type?.toLowerCase() === mealType
            );
            return allMealTypeRecipes.length > 0 ? allMealTypeRecipes : allRecipes;
        };

        const aiGeneratedPlan = {
            weekPlan: {}
        };

        // Simulate AI selection with proper meal type filtering
        weekdays.forEach(day => {
            aiGeneratedPlan.weekPlan[day] = {};
            
            mealTypes.forEach(mealType => {
                const availableRecipes = getRecipesForMealType(mealType);
                const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
                
                // Generate more realistic AI reasons based on meal type
                const reasons = {
                    breakfast: [
                        "High protein start to fuel your morning",
                        "Quick and nutritious breakfast option",
                        "Energy-boosting meal to kickstart your day",
                        "Balanced breakfast with good fiber content"
                    ],
                    lunch: [
                        "Balanced midday meal with lean protein",
                        "Perfect portion size for sustained energy",
                        "Nutrient-dense lunch to power through afternoon",
                        "Light yet satisfying meal option"
                    ],
                    dinner: [
                        "Comforting dinner with balanced macros",
                        "Perfect end-of-day meal for recovery",
                        "Satisfying dinner rich in nutrients",
                        "Hearty meal to conclude your day"
                    ],
                    snack: [
                        "Healthy snack to curb cravings",
                        "Energy-boosting snack between meals",
                        "Light and nutritious pick-me-up",
                        "Perfect portion for guilt-free snacking"
                    ]
                };

                const mealReasons = reasons[mealType] || ["Great meal choice for any time"];
                const randomReason = mealReasons[Math.floor(Math.random() * mealReasons.length)];

                aiGeneratedPlan.weekPlan[day][mealType] = {
                    id: randomRecipe._id,
                    reason: randomReason
                };
            });
        });

        // Transform AI response to our frontend format
        const transformedMealPlan = {
            week: [],
            groceryList: []
        };

        // Collect all ingredients for grocery list
        const allIngredients = new Map();

        weekdays.forEach((day, index) => {
            const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
            const dayMeals = aiGeneratedPlan.weekPlan[day];
            const dayRecipes = [];

            // Get recipes for each meal type
            Object.keys(dayMeals).forEach(mealType => {
                const meal = dayMeals[mealType];
                const recipe = allRecipes.find(r => r._id.toString() === meal.id.toString());
                
                if (recipe) {
                    dayRecipes.push({
                        ...recipe.toObject(),
                        reason: meal.reason,
                        mealType: mealType
                    });

                    // Collect ingredients
                    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                        recipe.ingredients.forEach(ingredient => {
                            const key = ingredient.name.toLowerCase();
                            if (allIngredients.has(key)) {
                                // For now, just take the first amount we see
                                // In a real app, you'd want to sum quantities properly
                            } else {
                                allIngredients.set(key, {
                                    name: ingredient.name,
                                    amount: ingredient.amount
                                });
                            }
                        });
                    }
                }
            });

            transformedMealPlan.week.push({
                day: dayName,
                recipes: dayRecipes,
                reason: `AI-curated meal plan for ${dayName} with balanced nutrition`
            });
        });

        // Convert ingredients map to array and adjust quantities for people count
        transformedMealPlan.groceryList = Array.from(allIngredients.values()).map(ingredient => ({
            ...ingredient,
            amount: `${ingredient.amount} (for ${finalPeopleCount} ${finalPeopleCount === 1 ? 'person' : 'people'})`
        }));

        // Add meal plan metadata
        transformedMealPlan.metadata = {
            peopleCount: finalPeopleCount,
            weeklyBudget: finalWeeklyBudget,
            dailyBudget: dailyBudget.toFixed(2),
            generatedAt: new Date().toISOString()
        };

        res.status(200).json({ 
            success: true, 
            message: "Meal plan generated successfully", 
            data: transformedMealPlan 
        });
    } catch (error) {
        console.error("Error generating meal plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFavoriteRecipes = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find the user's profile and populate the liked recipes
        const profile = await Profile.findOne({ user: userId }).populate('likes');
        
        if (!profile) {
            return res.status(404).json({ 
                success: false, 
                message: "Profile not found" 
            });
        }
        
        // Return the liked recipes
        res.status(200).json({ 
            success: true, 
            data: profile.likes || [] 
        });
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};