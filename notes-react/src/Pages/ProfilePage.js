import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate(); // Navigation hook
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [username, setUsername] = useState("John Doe");
  const [email] = useState("johndoe@example.com"); // Email is non-editable
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150" // Placeholder profile image
  );

  const [dialogType, setDialogType] = useState(""); // Type of dialog (delete or logout)
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state

  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType("");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(-1)} // Navigate back
        sx={{
          alignSelf: "flex-start",
          color: "#fff",
          marginBottom: "20px",
          "&:hover": {
            color: "#4caf50",
          },
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      {/* Profile Picture */}
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
            border: "3px solid #4caf50",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            cursor: "pointer",
          }}
        />
      </label>

      {/* Profile Details */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Username */}
        {isEditing ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#fff",
              background: "transparent",
              border: "none",
              borderBottom: "2px solid #4caf50",
              textAlign: "center",
              outline: "none",
              width: "100%",
              marginBottom: "10px",
            }}
          />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            {username}
          </Typography>
        )}

        {/* Email */}
        <Typography variant="body1" sx={{ color: "#ddd", marginBottom: "20px" }}>
          {email}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* Edit Profile Button */}
        <Button
          variant="contained"
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            width: "200px",
            backgroundColor: isEditing ? "#1976d2" : "#4caf50",
            color: "#fff",
            "&:hover": {
              backgroundColor: isEditing ? "#1565c0" : "#43a047",
            },
          }}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>

        {/* Delete Account Button */}
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDialogOpen("delete")}
          sx={{
            width: "200px",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          Delete Account
        </Button>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleDialogOpen("logout")}
          sx={{
            width: "200px",
            "&:hover": {
              backgroundColor: "#f57c00",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === "delete" ? "Confirm Account Deletion" : "Confirm Logout"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDialogClose();
              if (dialogType === "delete") {
                console.log("Account Deleted");
                // Add delete logic here
              } else if (dialogType === "logout") {
                console.log("Logged Out");
                // Add logout logic here
              }
            }}
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