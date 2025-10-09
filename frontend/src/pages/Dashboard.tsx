import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Button,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  TrendingDown,
  TrendingUp,
  Timeline,
  Restaurant,
  FavoriteBorder,
  CalendarMonth,
  EmojiEvents,
  ArrowForward,
  LocalFireDepartment,
  Scale,
  Explore,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { API } from "../config/api";

interface WeightStats {
  currentWeight: number;
  startWeight: number;
  weightChange: number;
  goalWeight?: number;
  entriesCount: number;
}

interface ProgressInsights {
  currentWeight: number;
  startWeight: number;
  totalChange: number;
  avgWeeklyChange: number;
  last30DaysChange: number;
  entriesCount: number;
  trackingDays: number;
  progressToGoal?: {
    goalWeight: number;
    remaining: number;
    percentComplete: number;
  };
}

interface Recipe {
  _id: string;
  name: string;
  cuisineType?: string;
  calories?: number;
  prepTime?: number;
  image?: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [weightStats, setWeightStats] = useState<WeightStats | null>(null);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load weight stats
      const weightRes = await fetch(
        `${API.PROGRESS.WEIGHT_ENTRIES}?period=90days`,
        {
          credentials: "include",
        }
      );
      if (weightRes.ok) {
        const data = await weightRes.json();
        setWeightStats(data.data.stats);
      }

      // Load insights
      const insightsRes = await fetch(API.PROGRESS.INSIGHTS, {
        credentials: "include",
      });
      if (insightsRes.ok) {
        const data = await insightsRes.json();
        setInsights(data.data);
      }

      // Load suggested recipes (just fetch some recipes for now)
      const recipesRes = await fetch(`${API.RECIPES.BASE}?limit=6`, {
        credentials: "include",
      });
      if (recipesRes.ok) {
        const data = await recipesRes.json();
        setSuggestedRecipes(data.data?.slice(0, 3) || []);
      }

      // Load favorites
      const favoritesRes = await fetch(API.RECIPES.FAVORITES, {
        credentials: "include",
      });
      if (favoritesRes.ok) {
        const data = await favoritesRes.json();
        setFavoriteRecipes(data.data?.slice(0, 3) || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeightTrend = () => {
    if (!weightStats || weightStats.entriesCount < 2) return null;
    const change = weightStats.weightChange;
    if (Math.abs(change) < 0.1)
      return { icon: <Timeline />, text: "Stable", color: "#2196f3" };
    if (change > 0)
      return {
        icon: <TrendingUp />,
        text: `+${change.toFixed(1)} kg`,
        color: "#f44336",
      };
    return {
      icon: <TrendingDown />,
      text: `${change.toFixed(1)} kg`,
      color: "#4caf50",
    };
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#ff7043" }} />
      </Box>
    );
  }

  const trend = getWeightTrend();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", pb: 12 }}>
      <Container maxWidth="md" sx={{ pt: 8, pb: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Here's your meal planning overview
            </Typography>
          </Box>

          {/* Progress Overview */}
          {weightStats && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
                color="text.primary"
              >
                Your Progress
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    border: `2px solid ${alpha("#ff7043", 0.2)}`,
                    bgcolor: alpha("#ff7043", 0.05),
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                  }}
                  onClick={() => navigate("/progress")}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Scale sx={{ color: "#ff7043", fontSize: 20 }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        Current Weight
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="#ff7043" fontWeight="bold">
                      {weightStats.currentWeight.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      kg
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${alpha("#000", 0.1)}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                  }}
                  onClick={() => navigate("/progress")}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1, display: "block" }}
                    >
                      90-Day Change
                    </Typography>
                    {trend && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Box sx={{ color: trend.color, fontSize: 24 }}>
                          {trend.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ color: trend.color }}
                          fontWeight="bold"
                        >
                          {trend.text}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {insights?.progressToGoal && (
                  <Card
                    elevation={0}
                    sx={{
                      gridColumn: "1 / -1",
                      border: `1px solid ${alpha("#4caf50", 0.2)}`,
                      bgcolor: alpha("#4caf50", 0.05),
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <EmojiEvents sx={{ color: "#ffa726", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Goal Progress
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Target:{" "}
                          {insights.progressToGoal.goalWeight.toFixed(1)} kg
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="#4caf50"
                        >
                          {insights.progressToGoal.percentComplete}% complete
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: alpha("#4caf50", 0.2),
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${insights.progressToGoal.percentComplete}%`,
                            height: "100%",
                            bgcolor: "#4caf50",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {insights.progressToGoal.remaining.toFixed(1)} kg to go
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          )}

          {/* Quick Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2 }}
              color="text.primary"
            >
              Quick Actions
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<Explore />}
                onClick={() => navigate("/explore")}
                sx={{
                  bgcolor: "#ff7043",
                  "&:hover": { bgcolor: "#ff5722" },
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Explore Meals
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarMonth />}
                onClick={() => navigate("/week")}
                sx={{
                  borderColor: "#ff7043",
                  color: "#ff7043",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#ff5722",
                    bgcolor: alpha("#ff7043", 0.05),
                  },
                }}
              >
                Meal Plan
              </Button>
            </Box>
          </Box>

          {/* Suggested Recipes */}
          {suggestedRecipes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Suggested for You
                </Typography>
                <IconButton size="small" onClick={() => navigate("/explore")}>
                  <ArrowForward sx={{ color: "#ff7043" }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {suggestedRecipes.map((recipe) => (
                  <Card
                    key={recipe._id}
                    elevation={0}
                    sx={{
                      border: `1px solid ${alpha("#000", 0.1)}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`/explore?recipe=${recipe._id}`)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha("#ff7043", 0.1),
                          }}
                        >
                          <Restaurant sx={{ color: "#ff7043", fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {recipe.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {recipe.cuisineType && (
                              <Chip
                                label={recipe.cuisineType}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  height: 20,
                                  bgcolor: alpha("#ff7043", 0.1),
                                  color: "#ff7043",
                                }}
                              />
                            )}
                            {recipe.calories && (
                              <Chip
                                icon={
                                  <LocalFireDepartment
                                    sx={{ fontSize: 14, color: "#f44336" }}
                                  />
                                }
                                label={`${recipe.calories} cal`}
                                size="small"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            )}
                            {recipe.prepTime && (
                              <Chip
                                label={`${recipe.prepTime} min`}
                                size="small"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Favorites */}
          {favoriteRecipes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Your Favorites
                </Typography>
                <IconButton size="small" onClick={() => navigate("/favorites")}>
                  <ArrowForward sx={{ color: "#ff7043" }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {favoriteRecipes.map((recipe) => (
                  <Card
                    key={recipe._id}
                    elevation={0}
                    sx={{
                      border: `1px solid ${alpha("#e91e63", 0.2)}`,
                      bgcolor: alpha("#e91e63", 0.02),
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`/favorites?recipe=${recipe._id}`)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: alpha("#e91e63", 0.1),
                          }}
                        >
                          <FavoriteBorder
                            sx={{ color: "#e91e63", fontSize: 28 }}
                          />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {recipe.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {recipe.cuisineType && (
                              <Chip
                                label={recipe.cuisineType}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  height: 20,
                                  bgcolor: alpha("#e91e63", 0.1),
                                  color: "#e91e63",
                                }}
                              />
                            )}
                            {recipe.calories && (
                              <Chip
                                icon={
                                  <LocalFireDepartment
                                    sx={{ fontSize: 14, color: "#f44336" }}
                                  />
                                }
                                label={`${recipe.calories} cal`}
                                size="small"
                                sx={{ fontSize: "0.7rem", height: 20 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Stats Summary */}
          {insights && insights.entriesCount > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${alpha("#000", 0.1)}`,
                borderRadius: 3,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
                color="text.primary"
              >
                Recent Activity
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold" color="#ff7043">
                    {insights.trackingDays}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Days Tracking
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold" color="#4caf50">
                    {insights.avgWeeklyChange > 0 ? "+" : ""}
                    {insights.avgWeeklyChange.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg Weekly (kg)
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold" color="#2196f3">
                    {favoriteRecipes.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Favorites
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
