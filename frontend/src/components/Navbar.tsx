import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Paper,
  Container,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  AccountCircle,
  Home,
  Explore,
  FavoriteRounded,
  CalendarToday,
  Settings,
  Logout,
  TrendingUp,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    handleProfileMenuClose();
  };

  const handleLogoutClick = async () => {
    handleProfileMenuClose();
    try {
      await logout();
      // Navigate to login page after successful logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout fails
      navigate("/login", { replace: true });
    }
  };

  const navigationItems = [
    { icon: <Home />, label: "Home", path: "/" },
    { icon: <Explore />, label: "Explore", path: "/explore" },
    { icon: <CalendarToday />, label: "Week", path: "/week" },
    { icon: <TrendingUp />, label: "Progress", path: "/progress" },
    { icon: <FavoriteRounded />, label: "Favorites", path: "/favorites" },
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* Top App Bar */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${alpha("#000", 0.08)}`,
          }}
        >
          <Container maxWidth="sm">
            <Toolbar
              sx={{
                justifyContent: "space-between",
                minHeight: "64px !important",
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                sx={{
                  background:
                    "linear-gradient(135deg, #ff7043 0%, #ff5722 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                Meal.io
              </Typography>

              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                sx={{
                  bgcolor: alpha("#ff7043", 0.1),
                  "&:hover": { bgcolor: alpha("#ff7043", 0.2) },
                }}
              >
                <AccountCircle sx={{ color: "#ff7043" }} />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "#ff7043" }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#ff7043" }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bottom Navigation */}
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${alpha("#000", 0.08)}`,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              py: 2,
              px: 1,
            }}
          >
            {navigationItems.map((item, index) => {
              const isActive = currentPath === item.path;

              return (
                <Box
                  key={index}
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    "&:hover": {
                      bgcolor: alpha("#ff7043", 0.08),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      mb: 0.5,
                      color: isActive ? "#ff7043" : alpha("#000", 0.6),
                      bgcolor: isActive
                        ? alpha("#ff7043", 0.15)
                        : "transparent",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {item.icon}
                  </IconButton>

                  <Typography
                    variant="caption"
                    sx={{
                      color: isActive ? "#ff7043" : alpha("#000", 0.6),
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.75rem",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {item.label}
                  </Typography>

                  {/* Active indicator */}
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        bgcolor: "#ff7043",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Container>
      </Paper>
    </>
  );
};

export default Navbar;
