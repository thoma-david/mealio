import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { ProfileData } from "../ProfileQuiz";

interface LifestyleStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ data, onUpdate }) => {
  const isAdvanced = data.quizMode === "advanced";

  const activityLabels = [
    "Sedentary",
    "Light",
    "Moderate",
    "Active",
    "Athlete",
  ];
  const stressLabels = ["Very Low", "Low", "Moderate", "High", "Very High"];
  const sleepLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  const skillLabels = [
    "Beginner",
    "Basic",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a" }}
      >
        Lifestyle
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
        Help us understand your daily routine
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Budget */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Weekly Food Budget
          </Typography>
          <TextField
            type="number"
            value={data.budget}
            onChange={(e) =>
              onUpdate({ budget: parseInt(e.target.value) || 0 })
            }
            placeholder="100"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2" color="#666">
                    €
                  </Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 20, max: 1000 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #e0e0e0",
                "& fieldset": { border: "none" },
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#ccc",
                },
                "&.Mui-focused": {
                  bgcolor: "white",
                  borderColor: "#1a1a1a",
                  boxShadow: "0 0 0 2px rgba(26, 26, 26, 0.1)",
                },
              },
              "& input": {
                fontSize: "1rem",
                fontWeight: "500",
                color: "#1a1a1a",
              },
            }}
          />
        </Box>

        {/* Activity Level */}
        <Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Typography
              variant="body2"
              fontWeight="500"
              sx={{ color: "#1a1a1a" }}
            >
              Activity Level
            </Typography>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: "#1a1a1a" }}
            >
              {activityLabels[(data.activityLevel || 3) - 1]}
            </Typography>
          </Box>
          <Slider
            value={data.activityLevel || 3}
            onChange={(_, value) =>
              onUpdate({ activityLevel: value as number })
            }
            min={1}
            max={5}
            step={1}
            marks
            sx={{
              color: "#1a1a1a",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                bgcolor: "#1a1a1a",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(26, 26, 26, 0.1)",
                },
              },
              "& .MuiSlider-track": {
                border: "none",
                bgcolor: "#1a1a1a",
              },
              "& .MuiSlider-rail": {
                bgcolor: "#e0e0e0",
                opacity: 1,
              },
              "& .MuiSlider-mark": {
                bgcolor: "#e0e0e0",
                width: 2,
                height: 2,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="#999">
              Less Active
            </Typography>
            <Typography variant="caption" color="#999">
              Very Active
            </Typography>
          </Box>
        </Box>

        {/* Stress Level */}
        <Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
          >
            <Typography
              variant="body2"
              fontWeight="500"
              sx={{ color: "#1a1a1a" }}
            >
              Stress Level
            </Typography>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: "#1a1a1a" }}
            >
              {stressLabels[(data.stressLevel || 3) - 1]}
            </Typography>
          </Box>
          <Slider
            value={data.stressLevel || 3}
            onChange={(_, value) => onUpdate({ stressLevel: value as number })}
            min={1}
            max={5}
            step={1}
            marks
            sx={{
              color: "#1a1a1a",
              height: 6,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                bgcolor: "#1a1a1a",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(26, 26, 26, 0.1)",
                },
              },
              "& .MuiSlider-track": {
                border: "none",
                bgcolor: "#1a1a1a",
              },
              "& .MuiSlider-rail": {
                bgcolor: "#e0e0e0",
                opacity: 1,
              },
              "& .MuiSlider-mark": {
                bgcolor: "#e0e0e0",
                width: 2,
                height: 2,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="#999">
              Low
            </Typography>
            <Typography variant="caption" color="#999">
              High
            </Typography>
          </Box>
        </Box>

        {/* Advanced Fields */}
        {isAdvanced && (
          <>
            {/* Sleep Quality */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ color: "#1a1a1a" }}
                >
                  Sleep Quality
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1a1a1a" }}
                >
                  {sleepLabels[(data.sleepQuality || 3) - 1]}
                </Typography>
              </Box>
              <Slider
                value={data.sleepQuality || 3}
                onChange={(_, value) =>
                  onUpdate({ sleepQuality: value as number })
                }
                min={1}
                max={5}
                step={1}
                marks
                sx={{
                  color: "#1a1a1a",
                  height: 6,
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    bgcolor: "#1a1a1a",
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(26, 26, 26, 0.1)",
                    },
                  },
                  "& .MuiSlider-track": {
                    border: "none",
                    bgcolor: "#1a1a1a",
                  },
                  "& .MuiSlider-rail": {
                    bgcolor: "#e0e0e0",
                    opacity: 1,
                  },
                  "& .MuiSlider-mark": {
                    bgcolor: "#e0e0e0",
                    width: 2,
                    height: 2,
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="caption" color="#999">
                  Poor
                </Typography>
                <Typography variant="caption" color="#999">
                  Excellent
                </Typography>
              </Box>
            </Box>

            {/* Cooking Skill */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ color: "#1a1a1a" }}
                >
                  Cooking Skill
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1a1a1a" }}
                >
                  {skillLabels[(data.cookingSkill || 3) - 1]}
                </Typography>
              </Box>
              <Slider
                value={data.cookingSkill || 3}
                onChange={(_, value) =>
                  onUpdate({ cookingSkill: value as number })
                }
                min={1}
                max={5}
                step={1}
                marks
                sx={{
                  color: "#1a1a1a",
                  height: 6,
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    bgcolor: "#1a1a1a",
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(26, 26, 26, 0.1)",
                    },
                  },
                  "& .MuiSlider-track": {
                    border: "none",
                    bgcolor: "#1a1a1a",
                  },
                  "& .MuiSlider-rail": {
                    bgcolor: "#e0e0e0",
                    opacity: 1,
                  },
                  "& .MuiSlider-mark": {
                    bgcolor: "#e0e0e0",
                    width: 2,
                    height: 2,
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="caption" color="#999">
                  Beginner
                </Typography>
                <Typography variant="caption" color="#999">
                  Expert
                </Typography>
              </Box>
            </Box>

            {/* Max Cooking Time */}
            <Box>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{ mb: 1.5, color: "#1a1a1a" }}
              >
                Max Cooking Time per Meal
              </Typography>
              <TextField
                type="number"
                value={data.maxCookingTimePerMeal || ""}
                onChange={(e) =>
                  onUpdate({
                    maxCookingTimePerMeal:
                      parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="60"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="#666">
                        min
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 10, max: 180 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#f9f9f9",
                    border: "1px solid #e0e0e0",
                    "& fieldset": { border: "none" },
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused": {
                      bgcolor: "white",
                      borderColor: "#1a1a1a",
                      boxShadow: "0 0 0 2px rgba(26, 26, 26, 0.1)",
                    },
                  },
                  "& input": {
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "#1a1a1a",
                  },
                }}
              />
            </Box>

            {/* Meal Prep Days */}
            <Box>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{ mb: 1.5, color: "#1a1a1a" }}
              >
                Preferred Meal Prep Days
              </Typography>
              <ToggleButtonGroup
                value={data.mealPrepDays || []}
                onChange={(_, newDays) => onUpdate({ mealPrepDays: newDays })}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    borderRadius: "8px !important",
                    margin: 0,
                  },
                }}
              >
                {weekDays.map((day) => (
                  <ToggleButton
                    key={day}
                    value={day.toLowerCase()}
                    sx={{
                      px: 2,
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#666",
                      bgcolor: "#f9f9f9",
                      border: "1px solid #e0e0e0 !important",
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                      "&.Mui-selected": {
                        bgcolor: "#1a1a1a",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#333",
                        },
                      },
                    }}
                  >
                    {day.slice(0, 3)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Typography
                variant="caption"
                color="#999"
                sx={{ mt: 1, display: "block" }}
              >
                Select days you typically cook or meal prep
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default LifestyleStep;
