import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = ({ username }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#212121", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Title Section */}
        <Typography 
          variant="h5" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: "bold", 
            color: "#ffffff", 
            textTransform: "uppercase", 
            letterSpacing: "1px" 
          }}
        >
          Notes Dashboard
        </Typography>
        
        {/* User Greeting */}
        <Typography 
          variant="body1" 
          sx={{ 
            marginRight: "16px", 
            color: "#f0f0f0", 
            fontSize: "16px", 
            fontStyle: "italic" 
          }}
        >
          Welcome, {username}!
        </Typography>

        {/* Settings Icon */}
        <IconButton 
          edge="end" 
          color="inherit" 
          sx={{ 
            fontSize: "32px", 
            marginRight: "8px", 
            transition: "transform 0.2s, color 0.3s", 
            "&:hover": { 
              color: "#ff9800", 
              transform: "scale(1.2)" 
            } 
          }}
        >
          <SettingsIcon fontSize="large" />
        </IconButton>

        {/* Profile Icon */}
        <IconButton 
          edge="end" 
          color="inherit" 
          sx={{ 
            fontSize: "32px", 
            transition: "transform 0.2s, color 0.3s", 
            "&:hover": { 
              color: "#4caf50", 
              transform: "scale(1.2)" 
            } 
          }}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;