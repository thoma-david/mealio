import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import type { ProfileData } from "../ProfileQuiz";

interface DietaryStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const DietaryStep: React.FC<DietaryStepProps> = ({ data, onUpdate }) => {
  const isAdvanced = data.quizMode === "advanced";

  const dietTypes = [
    { value: "omnivore", label: "Standard" },
    { value: "no_pork", label: "No Pork" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "keto", label: "Keto" },
    { value: "paleo", label: "Paleo" },
    { value: "other", label: "Other" },
  ];

  const commonAllergies = [
    "Gluten",
    "Dairy",
    "Eggs",
    "Nuts",
    "Peanuts",
    "Soy",
    "Fish",
    "Shellfish",
    "Sesame",
  ];

  const commonIntolerances = ["Lactose", "Histamine", "Fructose", "FODMAP"];

  const foodPreferences = [
    "Low-carb",
    "Mediterranean",
    "High-protein",
    "Whole foods",
    "Organic",
  ];

  const commonConditions = [
    "Diabetes",
    "Hashimoto",
    "PCOS",
    "High blood pressure",
    "High cholesterol",
    "IBS",
  ];

  const handleArrayToggle = (
    array: string[],
    item: string,
    key: keyof ProfileData
  ) => {
    const newArray = array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
    onUpdate({ [key]: newArray } as Partial<ProfileData>);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a" }}
      >
        Dietary Info
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
        Tell us about your diet preferences
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Diet Type */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Diet Type
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {dietTypes.map((diet) => (
              <Button
                key={diet.value}
                onClick={() => onUpdate({ dietType: diet.value })}
                variant={
                  data.dietType === diet.value ? "contained" : "outlined"
                }
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  ...(data.dietType === diet.value
                    ? {
                        bgcolor: "#1a1a1a",
                        color: "white",
                        border: "1px solid #1a1a1a",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      }
                    : {
                        bgcolor: "#f9f9f9",
                        color: "#666",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                          borderColor: "#ccc",
                        },
                      }),
                }}
              >
                {diet.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Allergies */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Allergies
          </Typography>
          <Typography
            variant="caption"
            color="#999"
            sx={{ mb: 1.5, display: "block" }}
          >
            Select all that apply (optional)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {commonAllergies.map((allergy) => (
              <Chip
                key={allergy}
                label={allergy}
                onClick={() =>
                  handleArrayToggle(data.allergies || [], allergy, "allergies")
                }
                sx={{
                  borderRadius: 2,
                  bgcolor: (data.allergies || []).includes(allergy)
                    ? "#1a1a1a"
                    : "#f9f9f9",
                  color: (data.allergies || []).includes(allergy)
                    ? "white"
                    : "#666",
                  border: "1px solid",
                  borderColor: (data.allergies || []).includes(allergy)
                    ? "#1a1a1a"
                    : "#e0e0e0",
                  fontWeight: "500",
                  "&:hover": {
                    bgcolor: (data.allergies || []).includes(allergy)
                      ? "#333"
                      : "#f5f5f5",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Conditions */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Health Conditions
          </Typography>
          <Typography
            variant="caption"
            color="#999"
            sx={{ mb: 1.5, display: "block" }}
          >
            Helps us suggest appropriate recipes (optional)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {commonConditions.map((condition) => (
              <Chip
                key={condition}
                label={condition}
                onClick={() =>
                  handleArrayToggle(
                    data.conditions || [],
                    condition,
                    "conditions"
                  )
                }
                sx={{
                  borderRadius: 2,
                  bgcolor: (data.conditions || []).includes(condition)
                    ? "#1a1a1a"
                    : "#f9f9f9",
                  color: (data.conditions || []).includes(condition)
                    ? "white"
                    : "#666",
                  border: "1px solid",
                  borderColor: (data.conditions || []).includes(condition)
                    ? "#1a1a1a"
                    : "#e0e0e0",
                  fontWeight: "500",
                  "&:hover": {
                    bgcolor: (data.conditions || []).includes(condition)
                      ? "#333"
                      : "#f5f5f5",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Advanced Fields */}
        {isAdvanced && (
          <>
            {/* Intolerances */}
            <Box>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{ mb: 1.5, color: "#1a1a1a" }}
              >
                Intolerances
              </Typography>
              <Typography
                variant="caption"
                color="#999"
                sx={{ mb: 1.5, display: "block" }}
              >
                Different from allergies (optional)
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {commonIntolerances.map((intolerance) => (
                  <Chip
                    key={intolerance}
                    label={intolerance}
                    onClick={() =>
                      handleArrayToggle(
                        data.intolerances || [],
                        intolerance,
                        "intolerances"
                      )
                    }
                    sx={{
                      borderRadius: 2,
                      bgcolor: (data.intolerances || []).includes(intolerance)
                        ? "#1a1a1a"
                        : "#f9f9f9",
                      color: (data.intolerances || []).includes(intolerance)
                        ? "white"
                        : "#666",
                      border: "1px solid",
                      borderColor: (data.intolerances || []).includes(
                        intolerance
                      )
                        ? "#1a1a1a"
                        : "#e0e0e0",
                      fontWeight: "500",
                      "&:hover": {
                        bgcolor: (data.intolerances || []).includes(intolerance)
                          ? "#333"
                          : "#f5f5f5",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Food Preferences */}
            <Box>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{ mb: 1.5, color: "#1a1a1a" }}
              >
                Food Preferences
              </Typography>
              <Typography
                variant="caption"
                color="#999"
                sx={{ mb: 1.5, display: "block" }}
              >
                What kind of foods do you prefer?
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {foodPreferences.map((pref) => (
                  <Chip
                    key={pref}
                    label={pref}
                    onClick={() =>
                      handleArrayToggle(
                        data.foodPreferences || [],
                        pref,
                        "foodPreferences"
                      )
                    }
                    sx={{
                      borderRadius: 2,
                      bgcolor: (data.foodPreferences || []).includes(pref)
                        ? "#1a1a1a"
                        : "#f9f9f9",
                      color: (data.foodPreferences || []).includes(pref)
                        ? "white"
                        : "#666",
                      border: "1px solid",
                      borderColor: (data.foodPreferences || []).includes(pref)
                        ? "#1a1a1a"
                        : "#e0e0e0",
                      fontWeight: "500",
                      "&:hover": {
                        bgcolor: (data.foodPreferences || []).includes(pref)
                          ? "#333"
                          : "#f5f5f5",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DietaryStep;
