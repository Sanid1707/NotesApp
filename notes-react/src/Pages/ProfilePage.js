import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  const token = localStorage.getItem("token"); // Retrieve token for authentication

  // States for user data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/user/get-user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { username, email, profilePicture } = response.data;

        setUsername(username);
        setEmail(email);

        // Prepend header if missing
        if (profilePicture && !profilePicture.startsWith("data:image")) {
          setProfilePicture(`data:image/png;base64,${profilePicture}`);
        } else {
          setProfilePicture(profilePicture || "https://via.placeholder.com/150");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePicture(base64String);
        console.log("Base64 String:", base64String); // Log the base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        userId,
        username,
        email,
        profilePicture: profilePicture.split(",")[1], // Send base64 without header
      };

      const response = await axios.put(
        "/api/user/update-user",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) throw new Error("Failed to update profile");

      console.log("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `/api/user/delete-user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.success) throw new Error("Failed to delete account");

      console.log("Account deleted successfully");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType("");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `url('../../../public/images/AuthBg1.jpg') no-repeat center center fixed`,
        backgroundSize: "cover",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ alignSelf: "flex-start", color: "#fff", marginBottom: "20px" }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <label htmlFor="profile-picture-upload">
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
        />
        <Avatar
          src={profilePicture}
          alt="Profile Picture"
          sx={{
            width: 150,
            height: 150,
            marginBottom: "20px",
            cursor: "pointer",
            border: "3px solid #4caf50",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
          }}
        />
      </label>

      <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
        {isEditing ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              fontSize: "20px",
              color: "#fff",
              background: "transparent",
              border: "none",
              borderBottom: "2px solid #4caf50",
              outline: "none",
              textAlign: "center",
              marginBottom: "10px",
            }}
          />
        ) : (
          <Typography variant="h5">{username}</Typography>
        )}
        <Typography variant="body1">{email}</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          sx={{ backgroundColor: isEditing ? "#1976d2" : "#4caf50", color: "#fff" }}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDialogOpen("delete")}
        >
          Delete Account
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleDialogOpen("logout")}
        >
          Logout
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === "delete" ? "Confirm Account Deletion" : "Confirm Logout"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={dialogType === "delete" ? handleDeleteAccount : handleLogout}
            color="error"
            autoFocus
          >
            {dialogType === "delete" ? "Delete" : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;