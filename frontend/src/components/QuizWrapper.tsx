import React from "react";
import ProfileQuiz, { type ProfileData } from "./ProfileQuiz";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

interface QuizWrapperProps {
  onComplete?: () => void;
}

const QuizWrapper: React.FC<QuizWrapperProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleQuizComplete = async (profileData: ProfileData) => {
    try {
      // Auto-set goalStartDate to today if not set
      const dataToSubmit = {
        ...profileData,
        goalStartDate: profileData.goalStartDate || new Date(),
      };

      const response = await createProfile(dataToSubmit);

      if (response.success) {
        console.log("Profile created successfully");

        // Refresh auth state to reflect the new profile
        await checkAuth();

        if (onComplete) {
          onComplete();
        } else {
          // Redirect to dashboard
          navigate("/");
        }
      } else {
        console.error("Failed to create profile:", response.message);
        // Handle error - maybe show a toast notification
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      // Handle network error
    }
  };

  return <ProfileQuiz onComplete={handleQuizComplete} />;
};

export default QuizWrapper;
