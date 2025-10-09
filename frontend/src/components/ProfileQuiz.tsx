import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Import individual question components
import ModeSelectionStep from "./quiz/ModeSelectionStep";
import BasicInfoStep from "./quiz/BasicInfoStep";
import PhysicalInfoStep from "./quiz/PhysicalInfoStep";
import LifestyleStep from "./quiz/LifestyleStep";
import DietaryStep from "./quiz/DietaryStep";
import GoalStep from "./quiz/GoalStep";

export interface ProfileData {
  // Quiz mode
  quizMode?: "simple" | "advanced";

  // Basic Info (required)
  age: number;
  gender: string;
  height: number;
  weight: number;
  budget: number;

  // Physical Info (advanced)
  bodyFatPercentage?: number;
  waistCircumference?: number;

  // Lifestyle
  activityLevel: number;
  stressLevel: number;
  sleepQuality?: number; // advanced
  cookingSkill?: number; // advanced
  maxCookingTimePerMeal?: number; // advanced
  mealPrepDays?: string[]; // advanced

  // Dietary
  dietType: string;
  allergies: string[];
  foodPreferences?: string[]; // advanced
  intolerances?: string[]; // advanced

  // Medical (advanced)
  conditions: string[];
  medications?: string[];
  bloodValues?: {
    cholesterol?: number;
    bloodSugar?: number;
    triglycerides?: number;
    vitaminD?: number;
    iron?: number;
    b12?: number;
  };

  // Goals
  goal: string[];
  goalStartDate?: Date; // advanced
  goalTargetDate?: Date; // advanced
  targetWeight?: number; // advanced

  // Legacy fields (keeping for compatibility)
  goalWeight?: number;
  goalTimeframe?: number; // in months
  goalType?: "lose" | "gain" | "maintain";
}

interface ProfileQuizProps {
  onComplete: (data: ProfileData) => void;
}

const ProfileQuiz: React.FC<ProfileQuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    quizMode: undefined,
    age: 25,
    gender: "",
    height: 190,
    weight: 70,
    budget: 100,
    allergies: [],
    conditions: [],
    activityLevel: 3,
    stressLevel: 3,
    dietType: "",
    goal: [],
    goalWeight: undefined,
    goalTimeframe: undefined,
    goalType: "maintain",
  });

  const getSteps = () => {
    // First step is always mode selection (handled separately)
    // Remaining steps use the standard data/onUpdate pattern
    return [
      { label: "Mode", component: ModeSelectionStep }, // handled specially in render
      { label: "Basic Info", component: BasicInfoStep },
      { label: "Physical", component: PhysicalInfoStep },
      { label: "Lifestyle", component: LifestyleStep },
      { label: "Dietary", component: DietaryStep },
      { label: "Goals", component: GoalStep },
    ];
  };

  const steps = getSteps();

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step - complete the quiz
      onComplete(profileData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Mode Selection
        return profileData.quizMode !== undefined;
      case 1: // Basic Info
        return profileData.age > 0 && profileData.gender !== "";
      case 2: // Physical
        return profileData.height > 0 && profileData.weight > 0;
      case 3: // Lifestyle
        return profileData.budget > 0;
      case 4: // Dietary
        return true; // Optional fields
      case 5: // Goals
        return (
          profileData.goal.length > 0 &&
          profileData.goalTargetDate !== undefined
        );
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f2 0%, #ffffff 50%, #fef2f2 100%)",
        display: "flex",
        alignItems: "center",
        py: 3,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#ff7043",
              mb: 3,
              boxShadow: `0 8px 32px ${alpha("#ff7043", 0.3)}`,
            }}
          >
            <RestaurantIcon sx={{ fontSize: 40, color: "white" }} />
          </Paper>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#ff7043",
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Let's personalize your experience
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              mb: 2,
            }}
          >
            Help us create the perfect meal plan for you
          </Typography>

          {/* Progress */}
          <Box sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Step {currentStep + 1} of {steps.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha("#ff7043", 0.1),
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#ff7043",
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Step Labels */}
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            sx={{
              maxWidth: 600,
              mx: "auto",
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
              "& .MuiStepIcon-root": {
                color: alpha("#ff7043", 0.3),
                "&.Mui-active": {
                  color: "#ff7043",
                },
                "&.Mui-completed": {
                  color: "#ff7043",
                },
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Question Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha("#000", 0.08)}`,
            overflow: "hidden",
            maxWidth: 800,
            mx: "auto",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 ? (
                  <ModeSelectionStep
                    value={profileData.quizMode || ""}
                    onChange={(mode) => updateProfileData({ quizMode: mode })}
                  />
                ) : currentStep === 1 ? (
                  <BasicInfoStep
                    data={profileData}
                    onUpdate={updateProfileData}
                  />
                ) : currentStep === 2 ? (
                  <PhysicalInfoStep
                    data={profileData}
                    onUpdate={updateProfileData}
                  />
                ) : currentStep === 3 ? (
                  <LifestyleStep
                    data={profileData}
                    onUpdate={updateProfileData}
                  />
                ) : currentStep === 4 ? (
                  <DietaryStep
                    data={profileData}
                    onUpdate={updateProfileData}
                  />
                ) : (
                  <GoalStep data={profileData} onUpdate={updateProfileData} />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Navigation */}
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              pt: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{
                borderColor: alpha("#000", 0.12),
                color: "text.secondary",
                "&:hover": {
                  borderColor: "#ff7043",
                  color: "#ff7043",
                  bgcolor: alpha("#ff7043", 0.04),
                },
                "&:disabled": {
                  borderColor: alpha("#000", 0.06),
                  color: alpha("#000", 0.26),
                },
              }}
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              endIcon={
                currentStep === steps.length - 1 ? undefined : <ArrowForward />
              }
              variant="contained"
              sx={{
                bgcolor: "#ff7043",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                boxShadow: `0 4px 16px ${alpha("#ff7043", 0.3)}`,
                "&:hover": {
                  bgcolor: "#ff5722",
                  boxShadow: `0 6px 20px ${alpha("#ff7043", 0.4)}`,
                },
                "&:disabled": {
                  bgcolor: alpha("#000", 0.12),
                  color: alpha("#000", 0.26),
                  boxShadow: "none",
                },
              }}
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileQuiz;
