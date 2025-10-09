import React from "react";
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  FitnessCenter,
  TrendingDown,
  TrendingUp,
  Favorite,
  Restaurant,
  Scale,
} from "@mui/icons-material";
import type { ProfileData } from "../ProfileQuiz";

interface GoalStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ data, onUpdate }) => {
  const goals = [
    {
      value: "lose_weight",
      label: "Lose Weight",
      description: "Create a calorie deficit with nutritious, satisfying meals",
      icon: <TrendingDown sx={{ fontSize: 32, color: "#ff7043" }} />,
      goalType: "lose" as const,
    },
    {
      value: "gain_weight",
      label: "Gain Weight",
      description: "Build muscle and increase calories with protein-rich meals",
      icon: <TrendingUp sx={{ fontSize: 32, color: "#ff7043" }} />,
      goalType: "gain" as const,
    },
    {
      value: "maintain_weight",
      label: "Maintain Weight",
      description: "Stay healthy with balanced, portion-controlled nutrition",
      icon: <FitnessCenter sx={{ fontSize: 32, color: "#ff7043" }} />,
      goalType: "maintain" as const,
    },
    {
      value: "improve_health",
      label: "Improve Health",
      description: "Focus on nutrient-dense foods for overall wellness",
      icon: <Favorite sx={{ fontSize: 32, color: "#ff7043" }} />,
      goalType: "maintain" as const,
    },
    {
      value: "save_money",
      label: "Save Money",
      description:
        "Affordable, budget-friendly meals without compromising nutrition",
      icon: <Restaurant sx={{ fontSize: 32, color: "#ff7043" }} />,
      goalType: "maintain" as const,
    },
  ];

  const timeframeOptions = [
    { value: 1, label: "1 Month" },
    { value: 2, label: "2 Months" },
    { value: 3, label: "3 Months" },
    { value: 6, label: "6 Months" },
    { value: 9, label: "9 Months" },
    { value: 12, label: "1 Year" },
    { value: 18, label: "1.5 Years" },
    { value: 24, label: "2 Years" },
  ];

  const handleGoalChange = (value: string) => {
    const selectedGoal = goals.find((goal) => goal.value === value);
    onUpdate({
      goal: [value], // Convert to array
      goalType: selectedGoal?.goalType || "maintain",
    });
  };

  const needsWeightGoal = data.goalType === "lose" || data.goalType === "gain";
  const selectedGoal = data.goal?.[0] || ""; // Get first goal from array

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="text.primary"
        sx={{ mb: 2, textAlign: "center" }}
      >
        What's your primary goal?
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Choose your main focus so we can personalize your meal plans
      </Typography>

      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup
          value={selectedGoal}
          onChange={(e) => handleGoalChange(e.target.value)}
          sx={{ gap: 2 }}
        >
          {goals.map((goal) => (
            <Paper
              key={goal.value}
              elevation={0}
              sx={{
                border: `2px solid ${
                  selectedGoal === goal.value ? "#ff7043" : alpha("#000", 0.1)
                }`,
                borderRadius: 3,
                transition: "all 0.3s ease",
                cursor: "pointer",
                bgcolor:
                  selectedGoal === goal.value
                    ? alpha("#ff7043", 0.05)
                    : "transparent",
                "&:hover": {
                  borderColor: alpha("#ff7043", 0.5),
                  bgcolor: alpha("#ff7043", 0.02),
                },
              }}
            >
              <FormControlLabel
                value={goal.value}
                control={
                  <Radio
                    sx={{
                      color: alpha("#ff7043", 0.6),
                      "&.Mui-checked": {
                        color: "#ff7043",
                      },
                      display: "none",
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 3,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>{goal.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                        sx={{ mb: 0.5 }}
                      >
                        {goal.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.description}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{
                  width: "100%",
                  margin: 0,
                  "& .MuiFormControlLabel-label": {
                    width: "100%",
                  },
                }}
              />
            </Paper>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Weight Goal Section */}
      {needsWeightGoal && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Scale sx={{ color: "#ff7043" }} />
            Weight Goal Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            }}
          >
            <TextField
              label="Goal Weight"
              type="number"
              value={data.goalWeight || ""}
              onChange={(e) =>
                onUpdate({ goalWeight: Number(e.target.value) || undefined })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              inputProps={{ min: 30, max: 300, step: 0.5 }}
              fullWidth
              helperText={`Current: ${data.weight} kg`}
            />

            <TextField
              select
              label="Timeframe"
              value={data.goalTimeframe || ""}
              onChange={(e) =>
                onUpdate({ goalTimeframe: Number(e.target.value) })
              }
              fullWidth
              helperText="Minimum 1 month for realistic goals"
            >
              {timeframeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {data.goalWeight && data.weight && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha("#ff7043", 0.05),
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Target:</strong>{" "}
                {data.goalType === "lose" ? "Lose" : "Gain"}{" "}
                {Math.abs(data.goalWeight - data.weight).toFixed(1)} kg{" "}
                {data.goalTimeframe &&
                  `in ${data.goalTimeframe} month${
                    data.goalTimeframe > 1 ? "s" : ""
                  }`}
                {data.goalTimeframe && (
                  <span>
                    {" "}
                    (~
                    {(
                      Math.abs(data.goalWeight - data.weight) /
                      data.goalTimeframe
                    ).toFixed(1)}{" "}
                    kg/month)
                  </span>
                )}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GoalStep;
