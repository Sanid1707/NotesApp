
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
      // Log the incoming data for debugging
      console.log("Incoming note data to dialog:");
      console.log(note);
  
      if (note) {
        console.log("Collaborators:");
        console.log(note.collaborators || "No collaborators found.");
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
    const handleDeleteSelected = () => {
      setSelectedNote((prevNote) => ({
        ...prevNote,
        collaborators: prevNote.collaborators.filter((collab) => !collab.isSelected),
      }));
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
                      {/* Checkbox */}
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
                      {/* Collaborator Name */}
                      <Typography sx={{ color: "#fff", fontWeight: "500", flex: 1 }}>
                        {collab.username}
                      </Typography>
                      {/* Status Display */}
                      <Typography
                        sx={{
                          color: "#ffb74d",
                          fontWeight: "bold",
                          marginRight: "16px",
                        }}
                      >
                        {roleEnum[collab.role] || "Unknown Role"}
                      </Typography>
                      {/* Role Dropdown */}
                      <TextField
                        select
                        value={collab.role || 2} // Default to Viewer
                        onChange={(e) => handleRoleChange(collab.userId, Number(e.target.value))}
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
              {/* Delete Button */}
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
            onClick={() => console.log("Updated Note Data:", selectedNote)}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EditNoteDialog;