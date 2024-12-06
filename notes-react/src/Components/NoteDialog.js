
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Box,
    Typography,
    Checkbox,
    TextField,
    Button,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  
  const EditNoteDialog = ({ open, onClose, note }) => {
    const [dialogTab, setDialogTab] = useState(0); // 0 for Edit Collaborators
    const [selectedNote, setSelectedNote] = useState(note);
  
    // Role mapping for enums
    const roleEnum = {
      0: "Owner",
      1: "Editor",
      2: "Viewer",
    };
  
    useEffect(() => {
      console.log("Incoming note data to dialog:", note);
  
      if (note) {
        setSelectedNote(note);
      }
    }, [note]);
  
    // Handle tab change
    const handleDialogTabChange = (event, newValue) => {
      setDialogTab(newValue);
    };
  
    // Handle role change for a collaborator
    const handleRoleChange = (userId, newRole) => {
      setSelectedNote((prevNote) => ({
        ...prevNote,
        collaborators: prevNote.collaborators.map((c) =>
          c.userId === userId ? { ...c, role: newRole } : c
        ),
      }));
    };
  
    // Handle delete selected collaborators
    const handleDeleteSelected = async () => {
      const collaboratorsToDelete = selectedNote.collaborators.filter(
        (collab) => collab.isSelected
      );
      const payload = {
        noteId: selectedNote.noteId,
        collaborators: collaboratorsToDelete.map((collab) => ({
          userId: collab.userId,
        })),
      };
  
      console.log("Delete payload:", payload);
  
      try {
        const response = await fetch(
          "http://localhost:5189/api/user/delete-collaborators",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (data.success) {
          setSelectedNote((prevNote) => ({
            ...prevNote,
            collaborators: prevNote.collaborators.filter(
              (collab) => !collab.isSelected
            ),
          }));
          console.log("Collaborators deleted successfully.");
        } else {
          console.error("Failed to delete collaborators:", data.message);
        }
      } catch (error) {
        console.error("Error deleting collaborators:", error);
      }
    };
  
    // Handle save changes for editing collaborators
    const handleSaveChanges = async () => {
      const payload = {
        noteId: selectedNote.noteId,
        collaborators: selectedNote.collaborators.map((collab) => ({
          userId: collab.userId,
          role: collab.role,
          status: 1, // Assuming "Active" is the default status
        })),
      };
  
      console.log("Edit payload:", payload);
  
      try {
        const response = await fetch(
          "http://localhost:5189/api/user/edit-collaborators",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (data.success) {
          console.log("Collaborators updated successfully.");
        } else {
          console.error("Failed to update collaborators:", data.message);
        }
      } catch (error) {
        console.error("Error updating collaborators:", error);
      }
    };
  
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "#424242",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Edit Note</DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={dialogTab} onChange={handleDialogTabChange}>
            <Tab label="Edit Collaborators" sx={{ color: "#fff" }} />
            <Tab label="Add Collaborators" sx={{ color: "#fff" }} />
            <Tab label="Edit Notes" sx={{ color: "#fff" }} />
          </Tabs>
        </Box>
        <DialogContent>
          {dialogTab === 0 && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Collaborators for: <strong>{selectedNote?.title || "N/A"}</strong>
              </Typography>
              <Box>
                {selectedNote?.collaborators?.length > 0 ? (
                  selectedNote.collaborators.map((collab) => (
                    <Box
                      key={collab.userId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        padding: "8px",
                        border: "1px solid #757575",
                        borderRadius: "8px",
                        backgroundColor: "#333",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => {
                          setSelectedNote((prevNote) => ({
                            ...prevNote,
                            collaborators: prevNote.collaborators.map((c) =>
                              c.userId === collab.userId
                                ? { ...c, isSelected: e.target.checked }
                                : c
                            ),
                          }));
                        }}
                        sx={{ color: "#fff" }}
                      />
                      <Typography sx={{ color: "#fff", fontWeight: "500", flex: 1 }}>
                        {collab.username}
                      </Typography>
                      <TextField
                        select
                        value={collab.role || 2} // Default to Viewer
                        onChange={(e) =>
                          handleRoleChange(collab.userId, Number(e.target.value))
                        }
                        sx={{
                          width: "120px",
                          "& .MuiInputBase-root": { color: "#fff" },
                          "& .MuiSelect-icon": { color: "#fff" },
                        }}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value={0}>Owner</option>
                        <option value={1}>Editor</option>
                        <option value={2}>Viewer</option>
                      </TextField>
                    </Box>
                  ))
                ) : (
                  <Typography>No collaborators available.</Typography>
                )}
              </Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteSelected}
                disabled={
                  !selectedNote?.collaborators.some((collab) => collab.isSelected)
                }
                sx={{ mt: 2 }}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditNoteDialog;