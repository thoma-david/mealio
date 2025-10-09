import { useState } from "react";

import {
  Box,
  Typography,
  CardMedia,
  IconButton,
  LinearProgress,
  Button,
  Container,
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  AccessTime,
  FiberManualRecord,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

type Ingredient = {
  name: string;
  amount: string;
};

type CardProps = {
  title: string;
  time: number;
  image: string;
  description: string;
  steps: string[];
  protein?: number;
  calories?: number;
  fat?: number;
  carbohydrates?: number;
  tags: string[];
  allergens: string[];
  ingredients: Ingredient[];
};

export default function SingleRecipe({
  title,
  time,
  image,
  description,
  steps,
  protein,
  calories,
  fat,
  carbohydrates,
  tags,
  allergens,
  ingredients,
}: CardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Helper function to format numbers with European decimal style (comma separator)
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0,0";
    return num.toFixed(1).replace(".", ",");
  };

  const nextStep = () => {
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            bgcolor: "white",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ p: 3, pb: 15 }}>
            {/* Hero Image */}
            <Box
              sx={{
                position: "relative",
                height: 240,
                borderRadius: 4,
                overflow: "hidden",
                mb: 3,
                boxShadow: `0 8px 24px ${alpha("#000", 0.15)}`,
              }}
            >
              <CardMedia
                component="img"
                image={image}
                alt={title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg,
                    ${alpha("#000", 0.1)} 0%,
                    ${alpha("#ff7043", 0.15)} 50%,
                    ${alpha("#000", 0.3)} 100%)`,
                }}
              />

              {/* Title Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: `linear-gradient(transparent, ${alpha(
                    "#000",
                    0.9
                  )})`,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "white",
                    lineHeight: 1.2,
                    textShadow: `0 2px 8px ${alpha("#000", 0.8)}`,
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <AccessTime sx={{ color: "#666", mr: 1, fontSize: 20 }} />
                  <Typography variant="h5" fontWeight="600" color="#1a1a1a">
                    {time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="#666" fontWeight="500">
                  Minutes
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" color="#1a1a1a" lineHeight={1.6}>
                {description}
              </Typography>
            </Box>

            {/* Nutrition Info */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 3, color: "#1a1a1a" }}
              >
                Nutrition Facts
              </Typography>

              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 0.5 }}
                  >
                    {calories ?? 0}
                  </Typography>
                  <Typography variant="body2" color="#666" fontWeight="500">
                    Calories
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 0.5 }}
                  >
                    {formatNumber(protein)}g
                  </Typography>
                  <Typography variant="body2" color="#666" fontWeight="500">
                    Protein
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 0.5 }}
                  >
                    {formatNumber(fat)}g
                  </Typography>
                  <Typography variant="body2" color="#666" fontWeight="500">
                    Fat
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    color="#1a1a1a"
                    sx={{ mb: 0.5 }}
                  >
                    {formatNumber(carbohydrates)}g
                  </Typography>
                  <Typography variant="body2" color="#666" fontWeight="500">
                    Carbs
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tags and Allergens */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 3, color: "#1a1a1a" }}
              >
                Tags & Allergens
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  sx={{ mb: 2, color: "#1a1a1a" }}
                >
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {Array.isArray(tags) && tags.length > 0 ? (
                    tags.map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="#666"
                          fontWeight="500"
                        >
                          {tag}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="#999"
                      sx={{ fontStyle: "italic" }}
                    >
                      No tags available
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  sx={{ mb: 2, color: "#1a1a1a" }}
                >
                  Allergens
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {Array.isArray(allergens) && allergens.length > 0 ? (
                    allergens.map((allergen) => (
                      <Box
                        key={allergen}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="#666"
                          fontWeight="500"
                        >
                          {allergen}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="#999"
                      sx={{ fontStyle: "italic" }}
                    >
                      No allergens
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Cooking Steps */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 3, color: "#1a1a1a" }}
              >
                Cooking Steps
              </Typography>

              {Array.isArray(steps) && steps.length > 0 ? (
                <Box>
                  {/* Main Step Card */}
                  <Box
                    sx={{
                      p: 3,
                      mb: 3,
                      bgcolor: "white",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color="#1a1a1a"
                        >
                          {currentStep + 1}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="#666" fontWeight="500">
                        Step {currentStep + 1} of {steps.length}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      lineHeight={1.6}
                      color="#1a1a1a"
                    >
                      {steps[currentStep]}
                    </Typography>
                  </Box>

                  {/* Navigation */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Button
                      startIcon={<NavigateBefore />}
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#e0e0e0",
                        color: "#666",
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        fontWeight: "500",
                        "&:hover": {
                          borderColor: "#ccc",
                          bgcolor: "#f9f9f9",
                        },
                        "&:disabled": {
                          borderColor: "#e0e0e0",
                          color: "#ccc",
                        },
                      }}
                    >
                      Previous
                    </Button>

                    {/* Step Indicators */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {steps.map((_, index) => (
                        <IconButton
                          key={index}
                          onClick={() => goToStep(index)}
                          size="small"
                          sx={{ p: 0.5 }}
                        >
                          <FiberManualRecord
                            sx={{
                              fontSize: 12,
                              color:
                                index === currentStep
                                  ? "#666"
                                  : index < currentStep
                                  ? "#999"
                                  : "#e0e0e0",
                            }}
                          />
                        </IconButton>
                      ))}
                    </Box>

                    <Button
                      endIcon={<NavigateNext />}
                      onClick={nextStep}
                      disabled={currentStep === steps.length - 1}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#e0e0e0",
                        color: "#666",
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        fontWeight: "500",
                        "&:hover": {
                          borderColor: "#ccc",
                          bgcolor: "#f9f9f9",
                        },
                        "&:disabled": {
                          borderColor: "#e0e0e0",
                          color: "#ccc",
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Box>

                  {/* Progress Bar */}
                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={((currentStep + 1) / steps.length) * 100}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "#f0f0f0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#666",
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="#666"
                      sx={{ mt: 1, textAlign: "center", fontWeight: "500" }}
                    >
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                      complete
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography color="#999" sx={{ fontStyle: "italic" }}>
                    No cooking steps available
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Ingredients */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 3, color: "#1a1a1a" }}
              >
                Ingredients
              </Typography>

              {Array.isArray(ingredients) && ingredients.length > 0 ? (
                <Box>
                  {ingredients.map((ingredient, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: 3,
                        mb: 1,
                        bgcolor: "white",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        color="#1a1a1a"
                      >
                        {ingredient.name}
                      </Typography>
                      <Typography variant="body2" color="#666" fontWeight="500">
                        {ingredient.amount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography color="#999" sx={{ fontStyle: "italic" }}>
                    No ingredients available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
