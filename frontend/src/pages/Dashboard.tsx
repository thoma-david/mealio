import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            🏠 Your Personal Dashboard
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </Typography>

          {user?.email && (
            <Typography variant="body1" gutterBottom>
              📧 {user.email}
            </Typography>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">This is your personal dashboard where you'll see:</Typography>
            <ul>
              <li>Your meal plans</li>
              <li>Your favorite recipes</li>
              <li>Your dietary preferences</li>
              <li>Your nutrition goals</li>
            </ul>
          </Box>

          <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 3 }}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
