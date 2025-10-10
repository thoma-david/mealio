import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  console.log("Register function called");
  console.log("User model in register:", User);

  const user = req.body;

  if (!user.firstName || !user.lastName || !user.email || !user.password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    // Send welcome email asynchronously (don't block response)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to Mealio",
      text: `Hello ${user.firstName},\n\nThank you for registering! We're glad to have you on board.\n\nBest regards,\nThe Mealio Team`,
    };

    // Send email in background, log errors but don't fail the registration
    transporter.sendMail(mailOptions).catch((emailError) => {
      console.log("Warning: Failed to send welcome email:", emailError.message);
      // Email failure shouldn't fail the registration
    });

    // Always return success if user was created and token was set
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("Error in register function:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
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
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 9999);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email Verification",
      text: "Please verify your email by clicking on the following link: [verification link]",
    });
    res
      .status(200)
      .json({ success: true, message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
