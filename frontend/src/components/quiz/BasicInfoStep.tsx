import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import type { ProfileData } from "../ProfileQuiz";

interface BasicInfoStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate }) => {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a" }}
      >
        Basic Info
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
        Let's start with the basics
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Age */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Age
          </Typography>
          <TextField
            type="number"
            value={data.age}
            onChange={(e) => onUpdate({ age: parseInt(e.target.value) || 0 })}
            placeholder="25"
            fullWidth
            inputProps={{ min: 13, max: 120 }}
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

        {/* Gender */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Gender
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {genderOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onUpdate({ gender: option.value })}
                variant={
                  data.gender === option.value ? "contained" : "outlined"
                }
                sx={{
                  flex: "1 1 auto",
                  minWidth: "100px",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "500",
                  borderRadius: 2,
                  ...(data.gender === option.value
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
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfoStep;
