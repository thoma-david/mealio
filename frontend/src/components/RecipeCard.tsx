import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccessTime,
  FavoriteBorder,
  FavoriteRounded,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { API } from "../config/api";

type CardProps = {
  title: string;
  time: number;
  image: string;
  description: string;
  recipeId: string;
  isLiked?: boolean;
  onLikeChange?: (recipeId: string, liked: boolean) => void;
};

export default function RecipeCard({
  title,
  time,
  image,
  description,
  recipeId,
  isLiked = false,
  onLikeChange,
}: CardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Sync local state with prop changes
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleClick = () => {
    console.log("Card clicked:", title);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      if (liked) {
        // Remove from favorites
        const response = await fetch(API.AUTH.REMOVE_RECIPE_PREFERENCE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipeId }),
        });

        if (response.ok) {
          setLiked(false);
          if (onLikeChange) onLikeChange(recipeId, false);
          setSnackbarMessage("Removed from favorites");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          throw new Error("Failed to remove from favorites");
        }
      } else {
        // Add to favorites
        console.log("Adding to favorites:", recipeId);
        const response = await fetch(API.AUTH.LIKE_RECIPE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipeId }),
        });

        if (response.ok) {
          setLiked(true);
          if (onLikeChange) onLikeChange(recipeId, true);
          setSnackbarMessage("Added to favorites!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          throw new Error("Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setSnackbarMessage("Something went wrong. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={handleClick}
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${alpha("#000", 0.06)}`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        background: `linear-gradient(135deg, ${alpha("#fff", 0.9)} 0%, ${alpha(
          "#f8f9fa",
          0.9
        )} 100%)`,
        backdropFilter: "blur(10px)",
        "&:hover": {
          transform: "translateY(-6px) scale(1.02)",
          boxShadow: `0 20px 40px ${alpha("#000", 0.15)}, 0 0 0 1px ${alpha(
            "#ff7043",
            0.1
          )}`,
          borderColor: alpha("#ff7043", 0.3),
          "& .recipe-image": {
            transform: "scale(1.1)",
          },
          "& .recipe-overlay": {
            opacity: 0.3,
          },
        },
      }}
    >
      {/* Heart Button - Top Right of Card */}
      <IconButton
        onClick={handleLikeClick}
        disabled={loading}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 3,
          bgcolor: liked ? alpha("#ff7043", 0.15) : alpha("#fff", 0.95),
          backdropFilter: "blur(20px)",
          border: liked
            ? `2px solid #ff7043`
            : `2px solid ${alpha("#000", 0.08)}`,
          boxShadow: `0 4px 12px ${alpha("#000", 0.1)}`,
          "&:hover": {
            bgcolor: liked ? alpha("#ff7043", 0.25) : alpha("#fff", 1),
            transform: loading ? "none" : "scale(1.1)",
            borderColor: "#ff7043",
            boxShadow: `0 6px 20px ${alpha("#ff7043", 0.3)}`,
          },
          "&:disabled": {
            opacity: 0.6,
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {liked ? (
          <FavoriteRounded sx={{ color: "#ff7043", fontSize: 22 }} />
        ) : (
          <FavoriteBorder sx={{ color: alpha("#000", 0.7), fontSize: 22 }} />
        )}
      </IconButton>

      <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
        {/* Background Image */}
        <CardMedia
          component="img"
          image={image}
          alt={title}
          className="recipe-image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Gradient Overlay */}
        <Box
          className="recipe-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg,
              ${alpha("#000", 0.1)} 0%,
              ${alpha("#ff7043", 0.15)} 50%,
              ${alpha("#000", 0.2)} 100%)`,
            opacity: 0.2,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Content Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: `linear-gradient(transparent, ${alpha("#000", 0.8)})`,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "white",
              fontSize: "1.1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: `0 2px 4px ${alpha("#000", 0.5)}`,
              mb: 1,
            }}
          >
            {title}
          </Typography>

          {/* Time Chip */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              icon={<AccessTime sx={{ fontSize: 14 }} />}
              label={`${time}min`}
              size="small"
              sx={{
                bgcolor: alpha("#2196f3", 0.9),
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#fff", 0.2)}`,
                "& .MuiChip-icon": {
                  color: "white",
                },
                boxShadow: `0 2px 8px ${alpha("#000", 0.15)}`,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Description Section */}
      <CardContent sx={{ p: 2, pt: 1.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </CardContent>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: `0 8px 24px ${alpha("#000", 0.15)}`,
            "& .MuiAlert-icon": {
              fontSize: 20,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
