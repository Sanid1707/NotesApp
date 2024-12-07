
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState(""); // State for username
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#212121",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        padding: "8px 0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Title Section */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Notes Dashboard
        </Typography>

        {/* User Greeting */}
        <Box
          sx={{
            marginRight: "16px",
            textAlign: "center",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #FF8C00, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
              letterSpacing: "0.5px",
              transition: "text-shadow 0.3s ease",
              "&:hover": {
                textShadow: "0 0 12px rgba(255, 215, 0, 0.8)",
              },
            }}
          >
            Welcome, {username}!
          </Typography>
        </Box>

        {/* Settings Icon */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => navigate("/settings")}
          sx={{
            fontSize: "32px",
            marginRight: "8px",
            transition: "transform 0.2s, color 0.3s",
            "&:hover": {
              color: "#ff9800",
              transform: "scale(1.2)",
            },
          }}
        >
          <SettingsIcon fontSize="large" />
        </IconButton>

        {/* Profile Icon */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => navigate("/profile")}
          sx={{
            fontSize: "32px",
            transition: "transform 0.2s, color 0.3s",
            "&:hover": {
              color: "#4caf50",
              transform: "scale(1.2)",
            },
          }}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;