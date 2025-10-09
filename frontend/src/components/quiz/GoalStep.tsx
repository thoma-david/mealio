import React from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  TrendingDown,
  TrendingUp,
  FitnessCenter,
  Favorite,
  SelfImprovement,
  LocalFireDepartment,
  BoltOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import type { ProfileData } from "../ProfileQuiz";

interface GoalStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ data, onUpdate }) => {
  const goals = [
    {
      value: "weight_loss",
      label: "Weight Loss",
      description: "Lose weight healthily",
      icon: TrendingDown,
    },
    {
      value: "muscle_gain",
      label: "Muscle Gain",
      description: "Build muscle mass",
      icon: TrendingUp,
    },
    {
      value: "maintenance",
      label: "Maintenance",
      description: "Maintain current weight",
      icon: FitnessCenter,
    },
    {
      value: "gut_health",
      label: "Gut Health",
      description: "Improve digestion",
      icon: Favorite,
    },
    {
      value: "hormone_balance",
      label: "Hormone Balance",
      description: "Balance hormones",
      icon: SelfImprovement,
    },
    {
      value: "inflammation_reduction",
      label: "Reduce Inflammation",
      description: "Anti-inflammatory diet",
      icon: LocalFireDepartment,
    },
    {
      value: "energy_boost",
      label: "Energy Boost",
      description: "Increase energy levels",
      icon: BoltOutlined,
    },
    {
      value: "other",
      label: "Other",
      description: "Custom goal",
      icon: MoreHoriz,
    },
  ];

  const handleGoalToggle = (goalValue: string) => {
    const currentGoals = data.goal || [];
    const newGoals = currentGoals.includes(goalValue)
      ? currentGoals.filter((g) => g !== goalValue)
      : [...currentGoals, goalValue];
    onUpdate({ goal: newGoals });
  };

  const hasWeightGoal = (data.goal || []).some(
    (g) => g === "weight_loss" || g === "muscle_gain"
  );

  const durations = [
    { days: 30, label: "30 Days", description: "1 month" },
    { days: 90, label: "90 Days", description: "3 months" },
    { days: 180, label: "180 Days", description: "6 months" },
  ];

  const handleDurationSelect = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    onUpdate({ goalTargetDate: targetDate });
  };

  const getSelectedDuration = () => {
    if (!data.goalTargetDate) return null;
    const target = new Date(data.goalTargetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Find closest match
    if (Math.abs(diffDays - 30) < 5) return 30;
    if (Math.abs(diffDays - 90) < 5) return 90;
    if (Math.abs(diffDays - 180) < 5) return 180;
    return null;
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a" }}
      >
        Your Goals
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
        Select one or more goals you want to achieve
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Goals Grid */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {goals.map((goal) => {
              const IconComponent = goal.icon;
              const isSelected = (data.goal || []).includes(goal.value);

              return (
                <Box key={goal.value}>
                  <Card
                    onClick={() => handleGoalToggle(goal.value)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      minHeight: 140,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      p: 2,
                      border: "2px solid",
                      borderColor: isSelected ? "#1a1a1a" : "#e0e0e0",
                      bgcolor: isSelected ? alpha("#1a1a1a", 0.05) : "#f9f9f9",
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: isSelected ? "#333" : "#ccc",
                        bgcolor: isSelected
                          ? alpha("#1a1a1a", 0.08)
                          : "#f5f5f5",
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isSelected ? "#1a1a1a" : alpha("#1a1a1a", 0.1),
                        mb: 1.5,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 24,
                          color: isSelected ? "white" : "#666",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        mb: 0.5,
                        color: isSelected ? "#1a1a1a" : "#666",
                      }}
                    >
                      {goal.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#999", fontSize: "0.7rem" }}
                    >
                      {goal.description}
                    </Typography>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Target Date - Always Required */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Goal Timeline *
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {durations.map((duration) => {
              const isSelected = getSelectedDuration() === duration.days;
              return (
                <Box
                  key={duration.days}
                  onClick={() => handleDurationSelect(duration.days)}
                  sx={{
                    flex: 1,
                    minWidth: 120,
                    cursor: "pointer",
                    p: 2.5,
                    border: "2px solid",
                    borderColor: isSelected ? "#1a1a1a" : "#e0e0e0",
                    borderRadius: 2,
                    bgcolor: isSelected ? alpha("#1a1a1a", 0.05) : "#f9f9f9",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: isSelected ? "#333" : "#ccc",
                      bgcolor: isSelected ? alpha("#1a1a1a", 0.08) : "#f5f5f5",
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ mb: 0.5, color: isSelected ? "#1a1a1a" : "#666" }}
                  >
                    {duration.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {duration.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Typography
            variant="caption"
            color="#999"
            sx={{ mt: 1.5, display: "block" }}
          >
            Choose how long you want to work toward your goals
          </Typography>
        </Box>

        {/* Target Weight - Conditional */}
        {hasWeightGoal && (
          <Box>
            <Typography
              variant="body2"
              fontWeight="500"
              sx={{ mb: 1.5, color: "#1a1a1a" }}
            >
              Target Weight
            </Typography>
            <TextField
              type="number"
              value={data.targetWeight || ""}
              onChange={(e) =>
                onUpdate({
                  targetWeight: parseInt(e.target.value) || undefined,
                })
              }
              placeholder="Your goal weight"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="#666">
                      kg
                    </Typography>
                  </InputAdornment>
                ),
              }}
              inputProps={{ min: 40, max: 200 }}
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
            <Typography
              variant="caption"
              color="#999"
              sx={{ mt: 0.5, display: "block" }}
            >
              Current weight: {data.weight} kg
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GoalStep;
