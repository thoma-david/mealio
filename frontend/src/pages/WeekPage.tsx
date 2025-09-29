import React, { useState, useEffect } from 'react';
import { API_URL } from "../api/auth";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Refresh,
  ShoppingCart,
  CheckCircle,
  RadioButtonUnchecked,
  WbSunny,
  Restaurant,
  DinnerDining,
  LocalCafe,
  Settings,
  Add,
  Remove
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '../components/RecipeCard';
import SingleRecipe from '../components/SingleRecipe';

type Ingredient = {
  name: string;
  amount: string;
};

type Recipe = {
  _id: string;
  name: string;
  estimated_price: number;
  description: string;
  time: number;
  image: string;
  carbohydrates: number;
  calories: number;
  protein: number;
  fat: number;
  steps: string[];
  tags: string[];
  meal_type: string;
  allergens: string[];
  ingredients: Ingredient[];
  reason?: string;
  mealType?: string;
};

type MealPlanDay = {
  day: string;
  recipes: Recipe[];
  reason?: string;
};

type MealPlan = {
  week: MealPlanDay[];
  groceryList: Ingredient[];
  metadata?: {
    peopleCount: number;
    weeklyBudget: number;
    dailyBudget: string;
    generatedAt: string;
  };
};

// Helper function to get meal type icon and color
const getMealTypeInfo = (mealType?: string) => {
  switch (mealType?.toLowerCase()) {
    case 'breakfast':
      return { icon: <WbSunny />, color: '#ffa726', label: 'Breakfast' };
    case 'lunch':
      return { icon: <Restaurant />, color: '#4caf50', label: 'Lunch' };
    case 'dinner':
      return { icon: <DinnerDining />, color: '#f44336', label: 'Dinner' };
    case 'snack':
      return { icon: <LocalCafe />, color: '#9c27b0', label: 'Snack' };
    default:
      return { icon: <Restaurant />, color: '#ff7043', label: 'Meal' };
  }
};

const WeekPage = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState(2);
  const [weeklyBudget, setWeeklyBudget] = useState(100);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/generate-mealplan`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          peopleCount: peopleCount, // Send people count for this generation only
          weeklyBudget: weeklyBudget // Send weekly budget for this generation
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the API response to our expected format
        setMealPlan(data.data);
        // Save to localStorage for persistence
        localStorage.setItem('mealPlan', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load meal plan from localStorage on component mount
  const loadSavedMealPlan = () => {
    try {
      const saved = localStorage.getItem('mealPlan');
      if (saved) {
        const parsedMealPlan = JSON.parse(saved);
        setMealPlan(parsedMealPlan);
        
        // Load settings from meal plan metadata if available
        if (parsedMealPlan.metadata) {
          setPeopleCount(parsedMealPlan.metadata.peopleCount || 2);
          setWeeklyBudget(parsedMealPlan.metadata.weeklyBudget || 100);
        }
      }
    } catch (error) {
      console.error("Error loading saved meal plan:", error);
      // If there's an error, clear the corrupted data
      localStorage.removeItem('mealPlan');
    }
  };

  // Update user profile with new settings (budget only, not people count)
  const updateProfileSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: weeklyBudget // Only save budget to profile
        }),
      });

      if (response.ok) {
        console.log("Profile budget updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile settings:", error);
    }
  };

  useEffect(() => {
    // Load saved meal plan on component mount
    loadSavedMealPlan();
  }, []);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  };

  const toggleGroceryItem = (item: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  const getCurrentDayRecipes = () => {
    if (!mealPlan) return [];
    const currentDay = mealPlan.week.find(day => day.day === selectedDay);
    return currentDay?.recipes || [];
  };

  // Helper function to calculate adjusted values based on people count
  const getAdjustedRecipeValues = (recipe: Recipe) => {
    const currentPeopleCount = peopleCount;
    return {
      adjustedPrice: Number((recipe.estimated_price * currentPeopleCount).toFixed(2)),
      adjustedIngredients: recipe.ingredients?.map(ingredient => ({
        ...ingredient,
        amount: `${ingredient.amount} (×${currentPeopleCount})`
      })) || []
    };
  };

  // Helper function to adjust grocery list amounts based on people count
  const getAdjustedGroceryList = () => {
    if (!mealPlan?.groceryList) return [];
    
    const currentPeopleCount = peopleCount;
    
    return mealPlan.groceryList.map(item => {
      // Parse the amount to extract numeric value and unit
      const amountMatch = item.amount.match(/^([\d.]+)\s*(.+)/);
      let adjustedAmount = item.amount;
      
      if (amountMatch) {
        const baseNumericValue = parseFloat(amountMatch[1]);
        const unit = amountMatch[2].replace(/\s*\(for.*\)/, ''); // Remove existing "for X people" part
        
        // Since recipes are for 1 person by default, multiply by current people count
        const adjustedValue = (baseNumericValue * currentPeopleCount).toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
        adjustedAmount = `${adjustedValue} ${unit} (for ${currentPeopleCount} ${currentPeopleCount === 1 ? 'person' : 'people'})`;
      } else {
        // If no numeric amount found, just update the people count notation
        adjustedAmount = item.amount.replace(/\(for \d+ (person|people)\)/, `(for ${currentPeopleCount} ${currentPeopleCount === 1 ? 'person' : 'people'})`);
      }
      
      return {
        ...item,
        amount: adjustedAmount
      };
    });
  };

  // Helper function to calculate total cost of all meals
  const getTotalMealCost = () => {
    if (!mealPlan?.week) return 0;
    
    const currentPeopleCount = peopleCount;
    const totalCost = mealPlan.week.reduce((weekTotal, day) => {
      const dayTotal = day.recipes.reduce((dayTotal, recipe) => {
        return dayTotal + (recipe.estimated_price * currentPeopleCount);
      }, 0);
      return weekTotal + dayTotal;
    }, 0);
    
    return Number(totalCost.toFixed(2));
  };

  const variants = {
    closed: {
      y: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
      }
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pb: 12 }}>
      {/* Header */}
      <Container maxWidth="sm" sx={{ pt: 8, pb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Your Week
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              onClick={() => setSettingsOpen(true)}
              sx={{
                bgcolor: alpha('#ff7043', 0.1),
                '&:hover': { bgcolor: alpha('#ff7043', 0.2) }
              }}
            >
              <Settings sx={{ color: '#ff7043' }} />
            </IconButton>
            
            <Button
              onClick={generateMealPlan}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
              variant="contained"
              sx={{
                bgcolor: '#ff7043',
                '&:hover': { bgcolor: '#ff5722' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {loading ? 'Generating...' : 'Generate New Week'}
            </Button>
          </Box>
        </Box>

        {/* Meal Plan Info */}
        {mealPlan && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: alpha('#ff7043', 0.05),
              border: `1px solid ${alpha('#ff7043', 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Planning for <strong>{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weekly Budget: <strong>${weeklyBudget.toFixed(2)}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                  Total Meal Cost: <strong>${getTotalMealCost()}</strong>
                </Typography>
                <Typography 
                  variant="body2" 
                  color={getTotalMealCost() <= weeklyBudget ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 500 }}
                >
                  {getTotalMealCost() <= weeklyBudget ? '✓ Within Budget' : '⚠ Over Budget'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Week Calendar Placeholder */}
        <Paper
          elevation={0}
          sx={{
            height: 120,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            border: `1px solid ${alpha('#2196f3', 0.2)}`,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Week Calendar View
          </Typography>
        </Paper>

        {/* Day Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 3 }}>
          {weekdays.map((day) => (
            <Chip
              key={day}
              label={day}
              onClick={() => setSelectedDay(day)}
              variant={selectedDay === day ? 'filled' : 'outlined'}
              sx={{
                minWidth: 60,
                bgcolor: selectedDay === day ? '#ff7043' : 'transparent',
                color: selectedDay === day ? 'white' : '#ff7043',
                borderColor: '#ff7043',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: selectedDay === day ? '#ff5722' : alpha('#ff7043', 0.1)
                }
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Recipes for Selected Day */}
      <Container maxWidth="sm">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ff7043' }} />
          </Box>
        ) : !mealPlan ? (
          /* No Meal Plan Generated Yet */
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 3,
              border: `2px dashed ${alpha('#ff7043', 0.3)}`,
              bgcolor: alpha('#ff7043', 0.02)
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                No Meal Plan Generated
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Click "Generate New Week" to create your personalized 7-day meal plan with AI-selected recipes.
              </Typography>
              
              <Button
                onClick={generateMealPlan}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#ff7043',
                  '&:hover': { bgcolor: '#ff5722' },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5
                }}
              >
                {loading ? 'Generating...' : 'Generate My Week'}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box sx={{ mb: 4 }}>
            {getCurrentDayRecipes().length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Organized by Meal Type */}
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, mealIndex) => {
                  const recipe = getCurrentDayRecipes().find(r => r.mealType === mealType);
                  if (!recipe) return null;
                  
                  const mealInfo = getMealTypeInfo(mealType);
                  
                  return (
                    <motion.div
                      key={mealType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mealIndex * 0.15 }}
                    >
                      {/* Meal Type Header */}
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: mealInfo.color,
                            fontWeight: 600,
                            fontSize: '1rem'
                          }}
                        >
                          {mealInfo.icon}
                          {mealInfo.label}
                        </Box>
                      </Box>
                      
                      <Paper
                        elevation={0}
                        onClick={() => handleRecipeClick(recipe)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 3,
                          overflow: 'hidden',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: `1px solid ${alpha(mealInfo.color, 0.2)}`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 24px ${alpha('#000', 0.15)}`,
                            borderColor: alpha(mealInfo.color, 0.4),
                          }
                        }}
                      >
                        <RecipeCard
                          title={recipe.name}
                          price={getAdjustedRecipeValues(recipe).adjustedPrice}
                          description={recipe.description}
                          time={recipe.time}
                          image={recipe.image}
                          recipeId={recipe._id}
                        />
                        
                        {/* AI-Generated Reason */}
                        {recipe.reason && (
                          <Box sx={{ px: 2, pb: 2 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: mealInfo.color,
                                fontStyle: 'italic',
                                fontSize: '0.75rem',
                                display: 'block',
                                mt: 1,
                                lineHeight: 1.4
                              }}
                            >
                              🤖 {recipe.reason}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </motion.div>
                  );
                })}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="text.secondary">
                  No recipes planned for {selectedDay}
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Grocery List - Only show when meal plan exists */}
        {mealPlan && (
          <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha('#000', 0.08)}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Your Grocery List
              </Typography>
            </Box>
            
            {mealPlan?.groceryList && mealPlan.groceryList.length > 0 ? (
              <List disablePadding>
                {getAdjustedGroceryList().map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      disablePadding
                      sx={{
                        py: 1,
                        textDecoration: checkedItems.has(`${item.name}-${item.amount}`) ? 'line-through' : 'none',
                        opacity: checkedItems.has(`${item.name}-${item.amount}`) ? 0.6 : 1
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleGroceryItem(`${item.name}-${item.amount}`)}
                        >
                          {checkedItems.has(`${item.name}-${item.amount}`) ? (
                            <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          ) : (
                            <RadioButtonUnchecked sx={{ color: alpha('#000', 0.4), fontSize: 20 }} />
                          )}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={item.amount}
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.875rem' }}
                      />
                    </ListItem>
                    {index < getAdjustedGroceryList().length - 1 && (
                      <Divider sx={{ ml: 5 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Generate a meal plan to see your grocery list
              </Typography>
            )}
          </CardContent>
        </Card>
        )}
      </Container>

      {/* Background Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleModalClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Recipe Modal */}
      <AnimatePresence>
        {modalOpen && selectedRecipe && (
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
                handleModalClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            style={{ 
              pointerEvents: "auto",
            }}
          >
            <Paper
              elevation={24}
              sx={{
                borderRadius: '24px 24px 0 0',
                pt: 1.5,
                pb: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 6,
                  bgcolor: alpha('#000', 0.2),
                  borderRadius: 3
                }}
              />
            </Paper>

            <Paper elevation={24} sx={{ bgcolor: 'white', overflow: 'hidden' }}>
              <SingleRecipe
                title={selectedRecipe.name}
                price={getAdjustedRecipeValues(selectedRecipe).adjustedPrice}
                description={selectedRecipe.description}
                time={selectedRecipe.time}
                image={selectedRecipe.image}
                carbohydrates={selectedRecipe.carbohydrates}
                protein={selectedRecipe.protein}
                fat={selectedRecipe.fat}
                steps={selectedRecipe.steps}
                tags={selectedRecipe.tags}
                allergens={selectedRecipe.allergens}
                ingredients={getAdjustedRecipeValues(selectedRecipe).adjustedIngredients}
                calories={selectedRecipe.calories}
              />
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Meal Plan Generation Settings
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* People Count */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Number of People
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                  disabled={peopleCount <= 1}
                  sx={{
                    bgcolor: alpha('#ff7043', 0.1),
                    '&:hover': { bgcolor: alpha('#ff7043', 0.2) },
                    '&:disabled': { bgcolor: alpha('#000', 0.05) }
                  }}
                >
                  <Remove sx={{ color: peopleCount <= 1 ? alpha('#000', 0.3) : '#ff7043' }} />
                </IconButton>
                
                <Box
                  sx={{
                    minWidth: 60,
                    textAlign: 'center',
                    py: 1,
                    px: 2,
                    border: `2px solid ${alpha('#ff7043', 0.2)}`,
                    borderRadius: 2,
                    bgcolor: alpha('#ff7043', 0.05)
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="#ff7043">
                    {peopleCount}
                  </Typography>
                </Box>
                
                <IconButton
                  onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
                  disabled={peopleCount >= 20}
                  sx={{
                    bgcolor: alpha('#ff7043', 0.1),
                    '&:hover': { bgcolor: alpha('#ff7043', 0.2) },
                    '&:disabled': { bgcolor: alpha('#000', 0.05) }
                  }}
                >
                  <Add sx={{ color: peopleCount >= 20 ? alpha('#000', 0.3) : '#ff7043' }} />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Ingredients and prices will be adjusted for {peopleCount} {peopleCount === 1 ? 'person' : 'people'} (for this meal plan only)
              </Typography>
            </Box>

            {/* Weekly Budget */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Weekly Budget ($)
              </Typography>
              <TextField
                type="number"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 20, max: 1000, step: 10 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff7043'
                    }
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Daily budget: ${(weeklyBudget / 7).toFixed(2)} • Per meal: ${(weeklyBudget / 28).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await updateProfileSettings(); // Only saves budget to profile
              setSettingsOpen(false);
              // People count is only used for meal plan generation, not saved to profile
            }}
            variant="contained"
            sx={{
              bgcolor: '#ff7043',
              '&:hover': { bgcolor: '#ff5722' }
            }}
          >
            Save Budget Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeekPage;