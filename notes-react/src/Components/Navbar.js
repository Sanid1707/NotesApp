import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = ({ username }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Notes Dashboard
        </Typography>
        <Typography variant="body1" sx={{ marginRight: "16px" }}>
          Welcome, {username}!
        </Typography>
        <IconButton edge="end" color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <IconButton edge="end" color="inherit">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;