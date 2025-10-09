import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp,
  TrendingDown,
  Timeline,
  Scale,
  Delete,
  EmojiEvents,
  CalendarToday,
  Insights,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API } from "../config/api";

interface WeightEntry {
  _id: string;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bodyMeasurements?: {
    waist?: number;
    hips?: number;
    chest?: number;
    arms?: number;
    thighs?: number;
  };
  date: string;
  notes?: string;
}

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

type TimePeriod = "90days" | "6months" | "1year" | "all";

const periodLabels: Record<TimePeriod, string> = {
  "90days": "3 Months",
  "6months": "6 Months",
  "1year": "1 Year",
  all: "All Time",
};

const ProgressPage: React.FC = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(70); // Default to 70kg
  const [bodyFat, setBodyFat] = useState<number | null>(null); // Body fat percentage
  const [submitting, setSubmitting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("90days");
  const [error, setError] = useState<string | null>(null);

  const loadWeightData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API.PROGRESS.WEIGHT_ENTRIES}?period=${selectedPeriod}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeightEntries(data.data.entries);
        setStats(data.data.stats);
      } else {
        setError("Failed to load weight data");
      }
    } catch (error) {
      console.error("Error loading weight data:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  const loadInsights = useCallback(async () => {
    try {
      const response = await fetch(API.PROGRESS.INSIGHTS, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      }
    } catch (error) {
      console.error("Error loading insights:", error);
    }
  }, []);

  useEffect(() => {
    loadWeightData();
    loadInsights();
  }, [loadWeightData, loadInsights]);

  useEffect(() => {
    // Initialize newWeight with current weight when dialog opens or stats change
    if (stats?.currentWeight && stats.currentWeight > 0) {
      setNewWeight(stats.currentWeight);
    }
  }, [stats]);

  const handleAddWeight = async () => {
    if (!newWeight || newWeight < 30 || newWeight > 300) {
      setError("Please enter a valid weight (30-300 kg)");
      return;
    }

    if (bodyFat !== null && (bodyFat < 3 || bodyFat > 60)) {
      setError("Body fat percentage must be between 3% and 60%");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const requestBody: any = {
        weight: Number(newWeight),
      };

      // Only include body fat if it's been set
      if (bodyFat !== null && bodyFat > 0) {
        requestBody.bodyFatPercentage = Number(bodyFat);
      }

      const response = await fetch(API.PROGRESS.WEIGHT_ENTRIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setAddDialogOpen(false);
        setNewWeight(0);
        setBodyFat(null);
        loadWeightData();
        loadInsights();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add weight entry");
      }
    } catch (error) {
      console.error("Error adding weight:", error);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const incrementWeight = (amount: number) => {
    setNewWeight((prev) => Math.min(300, Math.max(30, prev + amount)));
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await fetch(API.PROGRESS.WEIGHT_ENTRY_BY_ID(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        loadWeightData();
        loadInsights();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const formatChartData = () => {
    return weightEntries
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        weight: entry.weight,
        fullDate: entry.date,
      }))
      .reverse();
  };

  const getWeightTrend = () => {
    if (!stats || stats.entriesCount < 2) return null;

    const change = stats.weightChange;
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

  const trend = getWeightTrend();

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          pt: 8,
          pb: 12,
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#ff7043" }} />
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", pb: 12 }}>
      <Container maxWidth="sm" sx={{ pt: 8, pb: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Track your weight and celebrate your achievements
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {stats && stats.entriesCount > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    border: `2px solid ${alpha("#ff7043", 0.2)}`,
                    bgcolor: alpha("#ff7043", 0.05),
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
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
                        Current
                      </Typography>
                    </Box>
                    <Typography variant="h5" color="#ff7043" fontWeight="bold">
                      {stats.currentWeight.toFixed(1)} kg
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{ border: `1px solid ${alpha("#000", 0.1)}` }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mb: 1, display: "block" }}
                    >
                      Progress
                    </Typography>
                    {trend && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Box sx={{ color: trend.color, fontSize: 18 }}>
                          {trend.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ color: trend.color }}
                          fontWeight="bold"
                        >
                          {trend.text}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {insights && insights.entriesCount >= 2 && (
                <Card
                  elevation={0}
                  sx={{
                    mb: 2,
                    border: `1px solid ${alpha("#4caf50", 0.2)}`,
                    bgcolor: alpha("#4caf50", 0.05),
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Insights sx={{ color: "#4caf50" }} />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#4caf50"
                      >
                        Insights
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Avg. weekly change
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {insights.avgWeeklyChange > 0 ? "+" : ""}
                          {insights.avgWeeklyChange.toFixed(1)} kg
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Last 30 days
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {insights.last30DaysChange > 0 ? "+" : ""}
                          {insights.last30DaysChange.toFixed(1)} kg
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Tracking for
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {insights.trackingDays} days
                        </Typography>
                      </Box>
                      {insights.progressToGoal && (
                        <>
                          <Divider sx={{ my: 0.5 }} />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <EmojiEvents
                              sx={{ color: "#ffa726", fontSize: 18 }}
                            />
                            <Typography variant="caption" fontWeight={600}>
                              Goal Progress
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Remaining to goal
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {insights.progressToGoal.remaining.toFixed(1)} kg
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Progress
                            </Typography>
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="#4caf50"
                            >
                              {insights.progressToGoal.percentComplete}%
                              complete
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  bgcolor: "#ff7043",
                  "&:hover": { bgcolor: "#ff5722" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  width: "100%",
                  py: 1.5,
                }}
              >
                Log Weight
              </Button>
            </Box>
          )}

          {stats && stats.entriesCount === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                border: `2px dashed ${alpha("#ff7043", 0.3)}`,
                bgcolor: alpha("#ff7043", 0.02),
                mb: 3,
              }}
            >
              <Scale
                sx={{ fontSize: 60, color: alpha("#ff7043", 0.3), mb: 2 }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Start Tracking Your Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Log your first weight entry to begin tracking your journey
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{
                  bgcolor: "#ff7043",
                  "&:hover": { bgcolor: "#ff5722" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                Log Your First Weight
              </Button>
            </Paper>
          )}

          {weightEntries.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
                  <Chip
                    key={period}
                    label={periodLabels[period]}
                    onClick={() => setSelectedPeriod(period)}
                    variant={selectedPeriod === period ? "filled" : "outlined"}
                    sx={{
                      minWidth: 80,
                      bgcolor:
                        selectedPeriod === period ? "#ff7043" : "transparent",
                      color: selectedPeriod === period ? "white" : "#ff7043",
                      borderColor: "#ff7043",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor:
                          selectedPeriod === period
                            ? "#ff5722"
                            : alpha("#ff7043", 0.1),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {weightEntries.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Weight Progress
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha("#000", 0.1)}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      stroke={alpha("#000", 0.5)}
                    />
                    <YAxis
                      domain={["dataMin - 2", "dataMax + 2"]}
                      tick={{ fontSize: 11 }}
                      stroke={alpha("#000", 0.5)}
                      label={{
                        value: "kg",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 11 },
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} kg`, "Weight"]}
                      labelFormatter={(label: string) => `${label}`}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#ff7043"
                      strokeWidth={3}
                      dot={{ fill: "#ff7043", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#ff7043", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          )}

          {weightEntries.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Entries
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {weightEntries.slice(0, 10).map((entry, index) => (
                  <Box key={entry._id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            {entry.weight.toFixed(1)} kg
                          </Typography>
                          {entry.bodyFatPercentage && (
                            <Chip
                              label={`${entry.bodyFatPercentage.toFixed(
                                1
                              )}% BF`}
                              size="small"
                              sx={{
                                bgcolor: alpha("#4caf50", 0.1),
                                color: "#4caf50",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          )}
                          {index === 0 && (
                            <Chip
                              label="Latest"
                              size="small"
                              sx={{
                                bgcolor: alpha("#ff7043", 0.1),
                                color: "#ff7043",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarToday
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                        {entry.notes && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontSize: "0.85rem" }}
                          >
                            {entry.notes}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEntry(entry._id)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    {index < Math.min(weightEntries.length, 10) - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </motion.div>
      </Container>

      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Scale sx={{ fontSize: 48, color: "#ff7043", mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Log Weight
            </Typography>
            {stats?.currentWeight && (
              <Typography variant="caption" color="text.secondary">
                Current: {stats.currentWeight.toFixed(1)} kg
              </Typography>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 4,
            }}
          >
            <IconButton
              onClick={() => incrementWeight(-0.1)}
              sx={{
                bgcolor: alpha("#ff7043", 0.1),
                width: 56,
                height: 56,
                "&:hover": { bgcolor: alpha("#ff7043", 0.2) },
              }}
            >
              <RemoveIcon sx={{ color: "#ff7043", fontSize: 28 }} />
            </IconButton>

            <Box
              sx={{
                textAlign: "center",
                minWidth: 140,
                bgcolor: alpha("#ff7043", 0.05),
                borderRadius: 2,
                py: 2,
                px: 3,
                border: `2px solid ${alpha("#ff7043", 0.2)}`,
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: "#ff7043", fontFamily: "monospace" }}
              >
                {newWeight.toFixed(1)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                kg
              </Typography>
            </Box>

            <IconButton
              onClick={() => incrementWeight(0.1)}
              sx={{
                bgcolor: alpha("#ff7043", 0.1),
                width: 56,
                height: 56,
                "&:hover": { bgcolor: alpha("#ff7043", 0.2) },
              }}
            >
              <AddIcon sx={{ color: "#ff7043", fontSize: 28 }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Chip
              label="-1.0"
              size="small"
              onClick={() => incrementWeight(-1)}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${alpha("#ff7043", 0.3)}`,
                color: "text.secondary",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha("#ff7043", 0.1) },
              }}
            />
            <Chip
              label="-0.5"
              size="small"
              onClick={() => incrementWeight(-0.5)}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${alpha("#ff7043", 0.3)}`,
                color: "text.secondary",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha("#ff7043", 0.1) },
              }}
            />
            <Chip
              label="+0.5"
              size="small"
              onClick={() => incrementWeight(0.5)}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${alpha("#ff7043", 0.3)}`,
                color: "text.secondary",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha("#ff7043", 0.1) },
              }}
            />
            <Chip
              label="+1.0"
              size="small"
              onClick={() => incrementWeight(1)}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${alpha("#ff7043", 0.3)}`,
                color: "text.secondary",
                fontWeight: 600,
                "&:hover": { bgcolor: alpha("#ff7043", 0.1) },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Body Fat Percentage */}
          <Box sx={{ px: 2 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Body Fat % (Optional)
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <IconButton
                onClick={() =>
                  setBodyFat((prev) =>
                    prev === null ? 20 : Math.max(3, prev - 0.5)
                  )
                }
                sx={{
                  bgcolor: alpha("#4caf50", 0.1),
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: alpha("#4caf50", 0.2) },
                }}
              >
                <RemoveIcon sx={{ color: "#4caf50", fontSize: 24 }} />
              </IconButton>

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: 100,
                  bgcolor: alpha("#4caf50", 0.05),
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  border: `2px solid ${alpha("#4caf50", 0.2)}`,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: "#4caf50", fontFamily: "monospace" }}
                >
                  {bodyFat !== null ? bodyFat.toFixed(1) : "--"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  %
                </Typography>
              </Box>

              <IconButton
                onClick={() =>
                  setBodyFat((prev) =>
                    prev === null ? 20 : Math.min(60, prev + 0.5)
                  )
                }
                sx={{
                  bgcolor: alpha("#4caf50", 0.1),
                  width: 48,
                  height: 48,
                  "&:hover": { bgcolor: alpha("#4caf50", 0.2) },
                }}
              >
                <AddIcon sx={{ color: "#4caf50", fontSize: 24 }} />
              </IconButton>
            </Box>
            {bodyFat !== null && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Button
                  size="small"
                  onClick={() => setBodyFat(null)}
                  sx={{
                    textTransform: "none",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  Clear
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={submitting}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              borderRadius: 2,
              py: 1.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddWeight}
            variant="contained"
            disabled={submitting || !newWeight}
            fullWidth
            sx={{
              bgcolor: "#ff7043",
              "&:hover": { bgcolor: "#ff5722" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
            }}
          >
            {submitting ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Save Weight"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressPage;
