import RecipeCard from "../components/RecipeCard";
import { useState } from "react";
import React from "react";
import SingleRecipe from "../components/SingleRecipe";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config/api";
import { Search, Filter, TrendingUp } from "lucide-react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { Recipe } from "../types/recipe";

const ExplorePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);

  // Filter States
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50] as number[],
    timeRange: [0, 120] as number[],
    selectedTags: [] as string[],
    selectedMealTypes: [] as string[],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableMealTypes, setAvailableMealTypes] = useState<string[]>([]);

  const sliderSx = (color: string) => ({
    color,
    "& .MuiSlider-thumb": { bgcolor: color },
    "& .MuiSlider-track": { bgcolor: color },
    "& .MuiSlider-rail": { bgcolor: alpha(color, 0.2) },
  });

  React.useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(API.RECIPES.BASE, {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRecipes(data.data || data || []);

        const allTags = (data.data || data || []).flatMap(
          (recipe: Recipe) => recipe.tags || []
        );
        setAvailableTags([...new Set(allTags)] as string[]);

        const allMealTypes = (data.data || data || [])
          .map((recipe: Recipe) => recipe.mealType)
          .filter(Boolean);
        setAvailableMealTypes([...new Set(allMealTypes)] as string[]);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedRecipes = async () => {
      try {
        const response = await fetch(API.RECIPES.FAVORITES, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Extract recipe IDs from liked recipes
          const likedIds = (data.data || []).map(
            (recipe: Recipe) => recipe._id
          );
          setLikedRecipeIds(likedIds);
        }
      } catch (error) {
        console.error("Error fetching liked recipes:", error);
      }
    };

    fetchRecipes();
    fetchLikedRecipes();
  }, []);

  const variants = {
    closed: {
      y: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      },
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  const handleLikeChange = (recipeId: string, liked: boolean) => {
    if (liked) {
      setLikedRecipeIds((prev) => [...prev, recipeId]);
    } else {
      setLikedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    // Text search
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Price filter
    const matchesPrice =
      recipe.estimatedPrice >= filters.priceRange[0] &&
      recipe.estimatedPrice <= filters.priceRange[1];

    // Time filter
    const matchesTime =
      recipe.preparationTime >= filters.timeRange[0] &&
      recipe.preparationTime <= filters.timeRange[1];

    // Tags filter
    const matchesTags =
      filters.selectedTags.length === 0 ||
      filters.selectedTags.some((tag) => recipe.tags?.includes(tag));

    // Meal type filter
    const matchesMealType =
      filters.selectedMealTypes.length === 0 ||
      filters.selectedMealTypes.includes(recipe.mealType);

    return (
      matchesSearch &&
      matchesPrice &&
      matchesTime &&
      matchesTags &&
      matchesMealType
    );
  });

  // Filter helper functions
  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleMealTypeToggle = (mealType: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedMealTypes: prev.selectedMealTypes.includes(mealType)
        ? prev.selectedMealTypes.filter((mt) => mt !== mealType)
        : [...prev.selectedMealTypes, mealType],
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50],
      timeRange: [0, 120],
      selectedTags: [],
      selectedMealTypes: [],
    });
  };

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 50 ||
    filters.timeRange[0] > 0 ||
    filters.timeRange[1] < 120 ||
    filters.selectedTags.length > 0 ||
    filters.selectedMealTypes.length > 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f2 0%, #ffffff 50%, #fef2f2 100%)",
        pb: 10,
      }}
    >
      {/* Header Section */}
      <Container maxWidth="sm" sx={{ pt: 6, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              Explore
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover amazing recipes
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha("#ff7043", 0.1),
              p: 1,
              borderRadius: 2,
            }}
          >
            <TrendingUp size={24} style={{ color: "#ff7043" }} />
          </Paper>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "white",
              "& fieldset": {
                borderColor: alpha("#000", 0.1),
              },
              "&:hover fieldset": {
                borderColor: alpha("#ff7043", 0.3),
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ff7043",
                borderWidth: 2,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} style={{ color: alpha("#000", 0.4) }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => setFilterOpen(true)}
                  sx={{
                    color: hasActiveFilters ? "#ff7043" : alpha("#000", 0.4),
                    bgcolor: hasActiveFilters
                      ? alpha("#ff7043", 0.1)
                      : "transparent",
                    "&:hover": {
                      bgcolor: alpha("#ff7043", 0.1),
                    },
                  }}
                >
                  <Filter size={20} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filteredRecipes.length} recipes found
          </Typography>
          <Chip
            label="Popular today"
            size="small"
            sx={{
              bgcolor: alpha("#ff7043", 0.1),
              color: "#ff7043",
              fontWeight: 500,
            }}
          />
        </Box>
      </Container>

      {/* Recipes List */}
      <Container maxWidth="sm">
        <Box sx={{ space: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 6,
              }}
            >
              <CircularProgress
                size={48}
                sx={{
                  color: "#ff7043",
                  mb: 3,
                }}
              />
              <Typography
                variant="h6"
                fontWeight="medium"
                color="text.primary"
                gutterBottom
              >
                Loading delicious recipes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This won't take long...
              </Typography>
            </Box>
          ) : filteredRecipes.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => handleRecipeClick(recipe)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: `1px solid ${alpha("#000", 0.06)}`,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 24px ${alpha("#000", 0.15)}`,
                        borderColor: alpha("#ff7043", 0.2),
                      },
                    }}
                  >
                    <RecipeCard
                      title={recipe.name}
                      description={recipe.description}
                      time={recipe.preparationTime}
                      image={recipe.image}
                      recipeId={recipe._id}
                      isLiked={likedRecipeIds.includes(recipe._id)}
                      onLikeChange={handleLikeChange}
                    />
                  </Paper>
                </motion.div>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha("#000", 0.04),
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Search size={32} style={{ color: alpha("#000", 0.4) }} />
              </Paper>
              <Typography
                variant="h6"
                fontWeight="medium"
                color="text.primary"
                gutterBottom
              >
                No recipes found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Filter Dialog */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Filter Recipes
            </Typography>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                size="small"
                sx={{ color: "#ff7043" }}
              >
                Clear All
              </Button>
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Price Range */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 2 }}>
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: newValue as number[],
                }))
              }
              valueLabelDisplay="auto"
              min={0}
              max={50}
              step={1}
              sx={sliderSx("#ff7043")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Time Range */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 2 }}>
              Cooking Time: {filters.timeRange[0]} - {filters.timeRange[1]}{" "}
              minutes
            </Typography>
            <Slider
              value={filters.timeRange}
              onChange={(_, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  timeRange: newValue as number[],
                }))
              }
              valueLabelDisplay="auto"
              min={0}
              max={120}
              step={5}
              sx={sliderSx("#4caf50")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Tags Filter */}
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 2 }}>
              Tags ({filters.selectedTags.length} selected)
            </Typography>
            <FormGroup>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableTags.map((tag) => (
                  <FormControlLabel
                    key={tag}
                    control={
                      <Checkbox
                        checked={filters.selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        size="small"
                        sx={{
                          color: alpha("#2196f3", 0.6),
                          "&.Mui-checked": {
                            color: "#2196f3",
                          },
                        }}
                      />
                    }
                    label={
                      <Chip
                        label={tag}
                        size="small"
                        variant={
                          filters.selectedTags.includes(tag)
                            ? "filled"
                            : "outlined"
                        }
                        sx={{
                          bgcolor: filters.selectedTags.includes(tag)
                            ? "#2196f3"
                            : "transparent",
                          color: filters.selectedTags.includes(tag)
                            ? "white"
                            : "#2196f3",
                          borderColor: "#2196f3",
                          ml: 0.5,
                        }}
                      />
                    }
                    sx={{ mr: 0, mb: 1 }}
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Meal Type Filter */}
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 2 }}>
              Meal Type ({filters.selectedMealTypes.length} selected)
            </Typography>
            <FormGroup>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableMealTypes.map((mealType) => (
                  <FormControlLabel
                    key={mealType}
                    control={
                      <Checkbox
                        checked={filters.selectedMealTypes.includes(mealType)}
                        onChange={() => handleMealTypeToggle(mealType)}
                        size="small"
                        sx={{
                          color: alpha("#ff7043", 0.6),
                          "&.Mui-checked": {
                            color: "#ff7043",
                          },
                        }}
                      />
                    }
                    label={
                      <Chip
                        label={
                          mealType.charAt(0).toUpperCase() + mealType.slice(1)
                        }
                        size="small"
                        variant={
                          filters.selectedMealTypes.includes(mealType)
                            ? "filled"
                            : "outlined"
                        }
                        sx={{
                          bgcolor: filters.selectedMealTypes.includes(mealType)
                            ? "#ff7043"
                            : "transparent",
                          color: filters.selectedMealTypes.includes(mealType)
                            ? "white"
                            : "#ff7043",
                          borderColor: "#ff7043",
                          ml: 0.5,
                        }}
                      />
                    }
                    sx={{ mr: 0, mb: 1 }}
                  />
                ))}
              </Box>
            </FormGroup>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setFilterOpen(false)}
            variant="outlined"
            sx={{
              borderColor: alpha("#000", 0.2),
              color: "text.secondary",
              "&:hover": {
                borderColor: alpha("#000", 0.3),
                bgcolor: alpha("#000", 0.04),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setFilterOpen(false)}
            variant="contained"
            sx={{
              bgcolor: "#ff7043",
              "&:hover": { bgcolor: "#ff5722" },
              ml: 2,
            }}
          >
            Apply Filters ({filteredRecipes.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Background Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Recipe Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                handleClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            style={{
              pointerEvents: "auto",
            }}
          >
            {/* Drag Handle */}
            <Paper
              elevation={24}
              sx={{
                borderRadius: "24px 24px 0 0",
                pt: 1.5,
                pb: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 6,
                  bgcolor: alpha("#000", 0.2),
                  borderRadius: 3,
                }}
              />
            </Paper>

            {selectedRecipe ? (
              <Paper
                elevation={24}
                sx={{ bgcolor: "white", overflow: "hidden" }}
              >
                <SingleRecipe
                  title={selectedRecipe.name || "Unknown Recipe"}
                  description={
                    selectedRecipe.description || "No description available"
                  }
                  time={selectedRecipe.preparationTime || 0}
                  image={selectedRecipe.image || ""}
                  carbohydrates={
                    selectedRecipe.nutrients?.carbohydrates?.value || 0
                  }
                  protein={selectedRecipe.nutrients?.protein?.value || 0}
                  fat={selectedRecipe.nutrients?.fat?.value || 0}
                  steps={selectedRecipe.steps || []}
                  tags={selectedRecipe.tags || []}
                  allergens={selectedRecipe.allergens || []}
                  ingredients={
                    selectedRecipe.ingredients?.map((ing) => ({
                      name: ing.ingredient.name,
                      amount: `${ing.amount} ${ing.unit}`,
                    })) || []
                  }
                  calories={selectedRecipe.nutrients?.calories?.value || 0}
                />
              </Paper>
            ) : (
              <Paper elevation={24} sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No recipe selected
                </Typography>
              </Paper>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ExplorePage;
