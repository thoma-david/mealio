import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Save,
  Person,
  Restaurant,
  FitnessCenter,
  LocalHospital,
  ExpandMore,
  Logout,
  ArrowBack,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { API } from "../config/api";

interface Profile {
  _id: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  activityLevel: number;
  stressLevel: number;
  sleepQuality?: number;
  dietType: string;
  foodPreferences: string[];
  allergies: string[];
  intolerances: string[];
  conditions: string[];
  medications: string[];
  goal: string[];
  targetWeight?: number;
  budget: number;
  cookingSkill?: number;
  maxCookingTimePerMeal?: number;
  mealPrepDays: string[];
  goalStartDate: string;
  goalTargetDate: string;
}

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newAllergy, setNewAllergy] = useState("");
  const [newIntolerance, setNewIntolerance] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API.AUTH.GET_PROFILE, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setFormData(data.data);
      } else {
        setError("Failed to load profile");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(API.AUTH.UPDATE_PROFILE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setFormData(data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAddItem = (
    field: keyof Profile,
    value: string,
    setter: (val: string) => void
  ) => {
    if (!value.trim()) return;
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: [...currentArray, value.trim()],
    });
    setter("");
  };

  const handleRemoveItem = (field: keyof Profile, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  if (loading) {
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

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ pt: 8, pb: 12 }}>
        <Alert severity="error">
          Profile not found. Please complete the quiz first.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/quiz")}
          sx={{ mt: 2, bgcolor: "#ff7043", "&:hover": { bgcolor: "#ff5722" } }}
        >
          Complete Quiz
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", pb: 12 }}>
      <Container maxWidth="md" sx={{ pt: 8, pb: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{ color: "text.secondary" }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                Settings
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Manage your profile and preferences
              </Typography>
            </Box>
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

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully!
            </Alert>
          )}

          {/* Account Info */}
          <Card
            elevation={0}
            sx={{ mb: 3, border: `1px solid ${alpha("#000", 0.1)}` }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Person sx={{ color: "#ff7043" }} />
                <Typography variant="h6" fontWeight="bold">
                  Account Information
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Email: {user?.email}
              </Typography>
              {user?.name && (
                <Typography variant="body2" color="text.secondary">
                  Name: {user.name}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Basic Physical Info */}
          <Accordion
            defaultExpanded
            elevation={0}
            sx={{
              mb: 2,
              border: `1px solid ${alpha("#000", 0.1)}`,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FitnessCenter sx={{ color: "#ff7043" }} />
                <Typography variant="h6" fontWeight="bold">
                  Physical Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, age: Number(e.target.value) })
                    }
                    fullWidth
                    InputProps={{ inputProps: { min: 1, max: 120 } }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="diverse">Diverse</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Height (cm)"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        height: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{ inputProps: { min: 100, max: 250 } }}
                  />
                  <TextField
                    label="Current Weight (kg)"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{
                      inputProps: { min: 30, max: 300, step: 0.1 },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Body Fat % (Optional)"
                    type="number"
                    value={formData.bodyFatPercentage || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bodyFatPercentage: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{ inputProps: { min: 3, max: 60, step: 0.1 } }}
                  />
                  <TextField
                    label="Waist (cm) (Optional)"
                    type="number"
                    value={formData.waistCircumference || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        waistCircumference: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{ inputProps: { min: 40, max: 200 } }}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Lifestyle */}
          <Accordion
            elevation={0}
            sx={{
              mb: 2,
              border: `1px solid ${alpha("#000", 0.1)}`,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">
                Lifestyle & Activity
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Activity Level: {formData.activityLevel || 3}/5
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Chip
                        key={level}
                        label={level}
                        onClick={() =>
                          setFormData({ ...formData, activityLevel: level })
                        }
                        sx={{
                          bgcolor:
                            formData.activityLevel === level
                              ? "#ff7043"
                              : alpha("#ff7043", 0.1),
                          color:
                            formData.activityLevel === level
                              ? "white"
                              : "#ff7043",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Stress Level: {formData.stressLevel || 3}/5
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Chip
                        key={level}
                        label={level}
                        onClick={() =>
                          setFormData({ ...formData, stressLevel: level })
                        }
                        sx={{
                          bgcolor:
                            formData.stressLevel === level
                              ? "#ff7043"
                              : alpha("#ff7043", 0.1),
                          color:
                            formData.stressLevel === level
                              ? "white"
                              : "#ff7043",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {formData.sleepQuality !== undefined && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Sleep Quality: {formData.sleepQuality || 3}/5
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Chip
                          key={level}
                          label={level}
                          onClick={() =>
                            setFormData({ ...formData, sleepQuality: level })
                          }
                          sx={{
                            bgcolor:
                              formData.sleepQuality === level
                                ? "#ff7043"
                                : alpha("#ff7043", 0.1),
                            color:
                              formData.sleepQuality === level
                                ? "white"
                                : "#ff7043",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Diet & Nutrition */}
          <Accordion
            elevation={0}
            sx={{
              mb: 2,
              border: `1px solid ${alpha("#000", 0.1)}`,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Restaurant sx={{ color: "#ff7043" }} />
                <Typography variant="h6" fontWeight="bold">
                  Diet & Nutrition
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Diet Type</InputLabel>
                  <Select
                    value={formData.dietType || "omnivore"}
                    onChange={(e) =>
                      setFormData({ ...formData, dietType: e.target.value })
                    }
                    label="Diet Type"
                  >
                    <MenuItem value="omnivore">Omnivore</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="pescatarian">Pescatarian</MenuItem>
                    <MenuItem value="keto">Keto</MenuItem>
                    <MenuItem value="paleo">Paleo</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Weekly Budget (€)"
                    type="number"
                    value={formData.budget || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budget: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{ inputProps: { min: 10, max: 1000 } }}
                  />
                  <TextField
                    label="Target Weight (kg)"
                    type="number"
                    value={formData.targetWeight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetWeight: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{
                      inputProps: { min: 30, max: 300, step: 0.1 },
                    }}
                  />
                </Box>

                <Divider />

                {/* Allergies */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Allergies
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}
                  >
                    {(formData.allergies || []).map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy}
                        onDelete={() => handleRemoveItem("allergies", index)}
                        sx={{
                          bgcolor: alpha("#f44336", 0.1),
                          color: "#f44336",
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add allergy"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem("allergies", newAllergy, setNewAllergy);
                        }
                      }}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleAddItem("allergies", newAllergy, setNewAllergy)
                      }
                      sx={{ borderColor: "#ff7043", color: "#ff7043" }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                {/* Intolerances */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Intolerances
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}
                  >
                    {(formData.intolerances || []).map((intolerance, index) => (
                      <Chip
                        key={index}
                        label={intolerance}
                        onDelete={() => handleRemoveItem("intolerances", index)}
                        sx={{
                          bgcolor: alpha("#ff9800", 0.1),
                          color: "#ff9800",
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add intolerance"
                      value={newIntolerance}
                      onChange={(e) => setNewIntolerance(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem(
                            "intolerances",
                            newIntolerance,
                            setNewIntolerance
                          );
                        }
                      }}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleAddItem(
                          "intolerances",
                          newIntolerance,
                          setNewIntolerance
                        )
                      }
                      sx={{ borderColor: "#ff7043", color: "#ff7043" }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Medical Info */}
          <Accordion
            elevation={0}
            sx={{
              mb: 2,
              border: `1px solid ${alpha("#000", 0.1)}`,
              borderRadius: 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalHospital sx={{ color: "#ff7043" }} />
                <Typography variant="h6" fontWeight="bold">
                  Medical Information
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Conditions */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Medical Conditions
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}
                  >
                    {(formData.conditions || []).map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        onDelete={() => handleRemoveItem("conditions", index)}
                        sx={{
                          bgcolor: alpha("#9c27b0", 0.1),
                          color: "#9c27b0",
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add condition"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem(
                            "conditions",
                            newCondition,
                            setNewCondition
                          );
                        }
                      }}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleAddItem(
                          "conditions",
                          newCondition,
                          setNewCondition
                        )
                      }
                      sx={{ borderColor: "#ff7043", color: "#ff7043" }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                {/* Medications */}
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Medications
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}
                  >
                    {(formData.medications || []).map((medication, index) => (
                      <Chip
                        key={index}
                        label={medication}
                        onDelete={() => handleRemoveItem("medications", index)}
                        sx={{
                          bgcolor: alpha("#2196f3", 0.1),
                          color: "#2196f3",
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add medication"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem(
                            "medications",
                            newMedication,
                            setNewMedication
                          );
                        }
                      }}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleAddItem(
                          "medications",
                          newMedication,
                          setNewMedication
                        )
                      }
                      sx={{ borderColor: "#ff7043", color: "#ff7043" }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                bgcolor: "#ff7043",
                "&:hover": { bgcolor: "#ff5722" },
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {saving ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderColor: "#f44336",
                color: "#f44336",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#d32f2f",
                  bgcolor: alpha("#f44336", 0.05),
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Settings;
