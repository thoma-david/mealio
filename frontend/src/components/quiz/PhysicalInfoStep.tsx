import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Slider,
} from "@mui/material";
import type { ProfileData } from "../ProfileQuiz";

interface PhysicalInfoStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const PhysicalInfoStep: React.FC<PhysicalInfoStepProps> = ({
  data,
  onUpdate,
}) => {
  const isAdvanced = data.quizMode === "advanced";

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a" }}
      >
        Physical Info
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#666" }}>
        Help us understand your body metrics
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Height */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Height
          </Typography>
          <TextField
            type="number"
            value={data.height}
            onChange={(e) =>
              onUpdate({ height: parseInt(e.target.value) || 0 })
            }
            placeholder="180"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="#666">
                    cm
                  </Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ min: 100, max: 250 }}
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

        {/* Weight */}
        <Box>
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ mb: 1.5, color: "#1a1a1a" }}
          >
            Weight
          </Typography>
          <TextField
            type="number"
            value={data.weight}
            onChange={(e) =>
              onUpdate({ weight: parseInt(e.target.value) || 0 })
            }
            placeholder="70"
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
            inputProps={{ min: 30, max: 300 }}
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

        {/* Advanced Fields */}
        {isAdvanced && (
          <>
            {/* Body Fat Percentage */}
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
                  Body Fat Percentage
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "#1a1a1a" }}
                >
                  {data.bodyFatPercentage || 20}%
                </Typography>
              </Box>
              <Slider
                value={data.bodyFatPercentage || 20}
                onChange={(_, value) =>
                  onUpdate({ bodyFatPercentage: value as number })
                }
                min={5}
                max={50}
                step={0.5}
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
                }}
              />
              <Typography
                variant="caption"
                color="#999"
                sx={{ mt: 0.5, display: "block" }}
              >
                Optional - Leave at default if unknown
              </Typography>
            </Box>

            {/* Waist Circumference */}
            <Box>
              <Typography
                variant="body2"
                fontWeight="500"
                sx={{ mb: 1.5, color: "#1a1a1a" }}
              >
                Waist Circumference
              </Typography>
              <TextField
                type="number"
                value={data.waistCircumference || ""}
                onChange={(e) =>
                  onUpdate({
                    waistCircumference: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Optional"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="#666">
                        cm
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 50, max: 200 }}
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
                Helps assess visceral fat and health risks
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PhysicalInfoStep;
