import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const SubNavbar = ({ currentTab, setCurrentTab, onAddNote }) => {
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
  const [newNote, setNewNote] = useState({ title: "", tag: "" }); // New note fields

  // Open Add Note Dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Close Add Note Dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewNote({ title: "", tag: "" }); // Reset fields
  };

  // Save New Note
  const handleSaveNote = () => {
    if (newNote.title && newNote.tag) {
      onAddNote(newNote); // Pass the new note to the parent component
      handleCloseDialog();
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#424242",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "45px", 
          px: 2,
          overflow: "hidden", 
        }}
      >
        {/* Tabs */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            textColor="inherit"
            indicatorColor="primary"
            TabIndicatorProps={{
              style: { height: "5px", backgroundColor: "#388e3c" }, // Custom underline for selected tab
            }}
          >
            <Tab
              label="Active"
              sx={{
                color: "white",
                textTransform: "capitalize",
                fontSize: "14px", 
                "&:hover": {
                  color: "#fffff0", // Hover effect
                  textDecoration: "underline", // Underline on hover
                },
                "&.Mui-selected": {
                  color: "#ffffff", // Color when selected
                },
              }}
            />
            <Tab
              label="Archive"
              sx={{
                color: "white",
                textTransform: "capitalize",
                fontSize: "14px", // Adjust font size for compact design
                "&:hover": {
                  color: "#fffff0", // Hover effect
                  textDecoration: "underline", // Underline on hover
                },
                "&.Mui-selected": {
                  color: "#ffffff", // Color when selected
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Add Note Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#4caf50",
            fontSize: "12px", // Adjust font size for compact button
            height: "28px", // Reduce button height for compact design
            "&:hover": { backgroundColor: "#388e3c" },
          }}
        >
          Add Note
        </Button>
      </Box>

      {/* Add Note Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Note Title"
            variant="outlined"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{
              style: { color: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
          <TextField
            fullWidth
            label="Note Tag"
            variant="outlined"
            value={newNote.tag}
            onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{
              style: { color: "#fff" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveNote}
            color="primary"
            variant="contained"
            disabled={!newNote.title || !newNote.tag} // Disable Save if fields are empty
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubNavbar;