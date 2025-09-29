import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  IconButton,
  LinearProgress,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Rating,
  Container
} from '@mui/material';
import {
  Remove,
  Add,
  NavigateBefore,
  NavigateNext,
  AccessTime,
  AttachMoney,
  FiberManualRecord
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
type Ingredient = {
  name: string;
  amount: string;
};
type CardProps = {
  title: string;
  price: number;
  time: number;
  image: string;
  description: string;
  steps: string[];
  protein: number;
  calories: number;
  fat: number;
  carbohydrates: number;
  tags: string[];
  allergens: string[];
  ingredients: Ingredient[];
};

export default function SingleRecipe({
  title,
  price,
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
  const [person, setPerson] = useState(2);

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
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            bgcolor: 'white',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Box sx={{ p: 3, pb: 10 }}>
            {/* Hero Image */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={title}
                sx={{ objectFit: 'cover' }}
              />
            </Card>

            {/* Header with Title and Person Counter */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ flex: 1, mr: 2 }}>
                {title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => person > 1 && setPerson(person - 1)}
                  disabled={person <= 1}
                  sx={{
                    border: `1px solid ${alpha('#000', 0.2)}`,
                    '&:hover': { bgcolor: alpha('#ff7043', 0.1) }
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                
                <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                  {person}
                </Typography>
                
                <IconButton 
                  size="small"
                  onClick={() => setPerson(person + 1)}
                  sx={{
                    bgcolor: '#ff7043',
                    color: 'white',
                    '&:hover': { bgcolor: '#ff5722' }
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha('#ff7043', 0.1), borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Rating value={4.5} readOnly size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">Rating</Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha('#4caf50', 0.1), borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <AccessTime sx={{ color: '#4caf50', mr: 0.5 }} fontSize="small" />
                  <Typography variant="h6" fontWeight="bold" color="#4caf50">
                    {time}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">Minutes</Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha('#2196f3', 0.1), borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <AttachMoney sx={{ color: '#2196f3', mr: 0.5 }} fontSize="small" />
                  <Typography variant="h6" fontWeight="bold" color="#2196f3">
                    {(price * person).toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">Price</Typography>
              </Paper>
            </Box>

            {/* Description */}
            <Card elevation={0} sx={{ p: 2, mb: 3, bgcolor: alpha('#000', 0.02), borderRadius: 2 }}>
              <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                {description}
              </Typography>
            </Card>

            {/* Nutrition Info */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: `1px solid ${alpha('#000', 0.1)}` }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Nutrition Facts
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">Calories:</Typography>
                    <Typography variant="body2">{calories} kcal</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium">Protein:</Typography>
                    <Typography variant="body2">{protein}g</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">Fat:</Typography>
                    <Typography variant="body2">{fat}g</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium">Carbs:</Typography>
                    <Typography variant="body2">{carbohydrates}g</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Tags and Allergens */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Tags & Allergens
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.isArray(tags) && tags.length > 0 ? (
                    tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ bgcolor: alpha('#2196f3', 0.1), color: '#2196f3' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Allergens:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.isArray(allergens) && allergens.length > 0 ? (
                    allergens.map((allergen) => (
                      <Chip
                        key={allergen}
                        label={allergen}
                        size="small"
                        sx={{ bgcolor: alpha('#f44336', 0.1), color: '#f44336' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Cooking Steps */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Cooking Steps
              </Typography>
              
              {Array.isArray(steps) && steps.length > 0 ? (
                <Box>
                  {/* Main Step Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                      border: `1px solid ${alpha('#2196f3', 0.2)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#2196f3',
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {currentStep + 1}
                      </Avatar>
                      
                      <Typography variant="caption" color="text.secondary">
                        Step {currentStep + 1} of {steps.length}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" lineHeight={1.6}>
                      {steps[currentStep]}
                    </Typography>
                  </Paper>

                  {/* Navigation */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button
                      startIcon={<NavigateBefore />}
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                    >
                      Previous
                    </Button>

                    {/* Step Indicators */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {steps.map((_, index) => (
                        <IconButton
                          key={index}
                          onClick={() => goToStep(index)}
                          size="small"
                          sx={{ p: 0.25 }}
                        >
                          <FiberManualRecord
                            sx={{
                              fontSize: 12,
                              color: index === currentStep ? '#2196f3' : 
                                     index < currentStep ? '#4caf50' : alpha('#000', 0.3),
                              transform: index === currentStep ? 'scale(1.2)' : 'scale(1)',
                              transition: 'all 0.3s'
                            }}
                          />
                        </IconButton>
                      ))}
                    </Box>

                    <Button
                      endIcon={<NavigateNext />}
                      onClick={nextStep}
                      disabled={currentStep === steps.length - 1}
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
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
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha('#2196f3', 0.1),
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #2196f3 0%, #3f51b5 100%)',
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                      Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: alpha('#2196f3', 0.1), borderRadius: 2 }}>
                  <Typography color="text.secondary">No cooking steps available</Typography>
                </Paper>
              )}
            </Box>

            {/* Ingredients */}
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Ingredients
              </Typography>
              
              {Array.isArray(ingredients) && ingredients.length > 0 ? (
                <List disablePadding>
                  {ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        mb: 1,
                        bgcolor: alpha('#4caf50', 0.08),
                        borderRadius: 2,
                        border: `1px solid ${alpha('#4caf50', 0.2)}`
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {ingredient.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {parseFloat(ingredient.amount) * person} 
                            {ingredient.amount.replace(/[\d.]/g, '').trim()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: alpha('#4caf50', 0.1), borderRadius: 2 }}>
                  <Typography color="text.secondary">No ingredients available</Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
