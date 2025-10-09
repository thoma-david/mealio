import RecipeCard from "../components/RecipeCard";
import { useState } from "react";
import React from "react";
import SingleRecipe from "../components/SingleRecipe";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart } from "lucide-react";
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { API } from "../config/api";
import type { Recipe } from "../types/recipe";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(API.RECIPES.FAVORITES, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecipes(data.data || data || []);

        // Update liked recipe IDs
        const likedIds = (data.data || data || []).map(
          (recipe: Recipe) => recipe._id
        );
        setLikedRecipeIds(likedIds);
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  const handleLikeChange = (recipeId: string, liked: boolean) => {
    if (liked) {
      // Add to liked IDs
      setLikedRecipeIds((prev) => [...prev, recipeId]);
    } else {
      // Remove from liked IDs and from recipes list (since this is favorites page)
      setLikedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
    }
  };

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

  const filteredRecipes = recipes.filter((recipe) => {
    // Text search only
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

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
      <Container maxWidth="sm" sx={{ pt: 8, pb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              Favorites
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Your saved recipes
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              bgcolor: alpha("#e91e63", 0.1),
              p: 1.5,
              borderRadius: 2,
            }}
          >
            <Heart size={24} style={{ color: "#e91e63" }} />
          </Paper>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search favorite recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "white",
              "& fieldset": {
                borderColor: alpha("#000", 0.1),
              },
              "&:hover fieldset": {
                borderColor: alpha("#e91e63", 0.3),
              },
              "&.Mui-focused fieldset": {
                borderColor: "#e91e63",
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
          }}
        />

        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filteredRecipes.length} favorite recipes
          </Typography>
          {recipes.length > 0 && (
            <Chip
              label="❤️ Loved"
              size="small"
              sx={{
                bgcolor: alpha("#e91e63", 0.1),
                color: "#e91e63",
                fontWeight: 500,
              }}
            />
          )}
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
                  color: "#e91e63",
                  mb: 3,
                }}
              />
              <Typography
                variant="h6"
                fontWeight="medium"
                color="text.primary"
                gutterBottom
              >
                Loading your favorites
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This won't take long...
              </Typography>
            </Box>
          ) : filteredRecipes.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                        borderColor: alpha("#e91e63", 0.2),
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
                  bgcolor: alpha("#e91e63", 0.1),
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Heart size={32} style={{ color: "#e91e63" }} />
              </Paper>
              <Typography
                variant="h6"
                fontWeight="medium"
                color="text.primary"
                gutterBottom
              >
                No favorite recipes yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start exploring recipes and add them to your favorites!
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

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

export default FavoritesPage;
