import React from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Grid,
  Chip,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

interface ModeSelectionStepProps {
  value: "simple" | "advanced" | "";
  onChange: (mode: "simple" | "advanced") => void;
}

const ModeSelectionStep: React.FC<ModeSelectionStepProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{ mb: 1, color: "#1a1a1a", textAlign: "center" }}
      >
        Choose Your Setup Mode
      </Typography>
      <Typography
        variant="body1"
        color="#666"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Select how detailed you want your profile to be
      </Typography>

      <Grid container spacing={3}>
        {/* Simple Mode */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border:
                value === "simple" ? "2px solid #1a1a1a" : "1px solid #e0e0e0",
              bgcolor: value === "simple" ? alpha("#1a1a1a", 0.02) : "white",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#666",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardActionArea
              onClick={() => onChange("simple")}
              sx={{ height: "100%", p: 3 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: alpha("#4caf50", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 32, color: "#4caf50" }} />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ mb: 1, color: "#1a1a1a" }}
                >
                  Simple Mode
                </Typography>

                <Chip
                  label="Recommended"
                  size="small"
                  sx={{
                    bgcolor: "#4caf50",
                    color: "white",
                    fontWeight: "500",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="body2"
                  color="#666"
                  sx={{ mb: 2, lineHeight: 1.6 }}
                >
                  Quick setup with essential information. Perfect for getting
                  started fast.
                </Typography>

                <Box sx={{ textAlign: "left", mt: 3 }}>
                  <Typography
                    variant="caption"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Includes:
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Basic info (age, gender, height, weight)
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Activity & stress level
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Diet type & allergies
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Primary goal & budget
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                  <Typography variant="caption" color="#999">
                    Takes ~2 minutes
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Advanced Mode */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border:
                value === "advanced"
                  ? "2px solid #1a1a1a"
                  : "1px solid #e0e0e0",
              bgcolor: value === "advanced" ? alpha("#1a1a1a", 0.02) : "white",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#666",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardActionArea
              onClick={() => onChange("advanced")}
              sx={{ height: "100%", p: 3 }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: alpha("#2196f3", 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 32, color: "#2196f3" }} />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="600"
                  sx={{ mb: 1, color: "#1a1a1a" }}
                >
                  Advanced Mode
                </Typography>

                <Chip
                  label="For Best Results"
                  size="small"
                  sx={{
                    bgcolor: "#2196f3",
                    color: "white",
                    fontWeight: "500",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="body2"
                  color="#666"
                  sx={{ mb: 2, lineHeight: 1.6 }}
                >
                  Comprehensive setup for highly personalized meal plans and
                  tracking.
                </Typography>

                <Box sx={{ textAlign: "left", mt: 3 }}>
                  <Typography
                    variant="caption"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Everything in Simple, plus:
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Body measurements & composition
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Sleep quality & cooking skills
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Food preferences & intolerances
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Medical conditions & blood values
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#666"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    • Detailed goal tracking
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                  <Typography variant="caption" color="#999">
                    Takes ~5-7 minutes
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModeSelectionStep;
