import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import {
  AccessTime,
  AttachMoney,
  FavoriteBorder,
  Star,
  FavoriteRounded
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { API_URL } from '../api/auth';

type CardProps = {
  title: string;
  price: number;
  time: number;
  image: string;
  description: string;
  recipeId: string;
  isLiked?: boolean;
  rating?: number;
};

export default function RecipeCard({ 
  title, 
  price, 
  time, 
  image, 
  description,
  recipeId,
  isLiked = false,
  rating = 4.5
}: CardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
        const response = await fetch(`${API_URL}/remove-recipe-preference`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipeId }),
        });

        if (response.ok) {
          setLiked(false);
          setSnackbarMessage('Removed from favorites');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          throw new Error('Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch("http://localhost:5000/api/auth/like-recipe", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ recipeId }),
        });

        if (response.ok) {
          setLiked(true);
          setSnackbarMessage('Added to favorites!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          throw new Error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarSeverity('error');
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
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${alpha('#000', 0.08)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha('#000', 0.12)}`,
          borderColor: alpha('#ff7043', 0.2),
        }
      }}
    >
      {/* Heart Button - Top Right of Card */}
      <IconButton
        onClick={handleLikeClick}
        disabled={loading}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: liked ? alpha('#ff7043', 0.1) : alpha('#fff', 0.9),
          backdropFilter: 'blur(10px)',
          border: liked ? `2px solid #ff7043` : `2px solid ${alpha('#000', 0.1)}`,
          '&:hover': {
            bgcolor: liked ? alpha('#ff7043', 0.2) : alpha('#fff', 0.95),
            transform: loading ? 'none' : 'scale(1.15)',
            borderColor: '#ff7043'
          },
          '&:disabled': {
            opacity: 0.7
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {liked ? (
          <FavoriteRounded sx={{ color: '#ff7043', fontSize: 20 }} />
        ) : (
          <FavoriteBorder sx={{ color: alpha('#000', 0.6), fontSize: 20 }} />
        )}
      </IconButton>

      <Box sx={{ display: 'flex', position: 'relative' }}>
        {/* Image Section */}
        <Box sx={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Rating Badge */}
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              px: 1,
              py: 0.5,
              bgcolor: alpha('#000', 0.8),
              borderRadius: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Star sx={{ color: '#ffc107', fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
              {rating}
            </Typography>
          </Paper>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flex: 1, p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Title */}
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                mb: 1,
                fontSize: '1.1rem',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>

            {/* Description */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {description}
            </Typography>

            {/* Price and Time Chips */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={<AttachMoney sx={{ fontSize: 16 }} />}
                label={`€${price}`}
                size="small"
                sx={{
                  bgcolor: alpha('#4caf50', 0.1),
                  color: '#4caf50',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#4caf50'
                  }
                }}
              />
              
              <Chip
                icon={<AccessTime sx={{ fontSize: 16 }} />}
                label={`${time}min`}
                size="small"
                sx={{
                  bgcolor: alpha('#2196f3', 0.1),
                  color: '#2196f3',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#2196f3'
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Box>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: 20
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
