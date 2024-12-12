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
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";

// Enum to match backend byte representation of roles
const NoteRoles = {
  Owner: 0,
  Editor: 1,
  Viewer: 2
};

const roleEnum = Object.fromEntries(
  Object.entries(NoteRoles).map(([key, value]) => [value, key])
);
const EditNoteDialog = ({ open, onClose, note }) => {
  const [dialogTab, setDialogTab] = useState(0);
  const [selectedNote, setSelectedNote] = useState(note);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState(NoteRoles.Viewer);
  const [addedCollaborators, setAddedCollaborators] = useState([]);
  const [noteStatus, setNoteStatus] = useState(1);
  const [modifiedCollaborators, setModifiedCollaborators] = useState([]);

  // Role mapping for display
  const roleLabels = {
    [NoteRoles.Owner]: "Owner",
    [NoteRoles.Editor]: "Editor", 
    [NoteRoles.Viewer]: "Viewer"
  };

  useEffect(() => {
    if (note) {
      setSelectedNote(note);
      setNoteStatus(note.status || 1);
    }
  }, [note]);

  useEffect(() => {
    if (dialogTab === 1) {
      const fetchAllUsers = async () => {
        try {
          const response = await fetch("http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/user/get-all-users");
          if (!response.ok) throw new Error("Failed to fetch users");
          const data = await response.json();
          setAllUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchAllUsers();
    }
  }, [dialogTab]);

  const handleDialogTabChange = (event, newValue) => {
    setDialogTab(newValue);
  };

  const handleRoleChange = (userId, newRole) => {
    // Track modified collaborators
    const isModified = !modifiedCollaborators.some(m => m.userId === userId);
    
    setSelectedNote((prevNote) => {
      const updatedCollaborators = prevNote.collaborators.map((c) =>
        c.userId === userId ? { ...c, role: newRole } : c
      );
      
      return {
        ...prevNote,
        collaborators: updatedCollaborators
      };
    });

    // Add to modified collaborators if not already tracked
    if (isModified) {
      setModifiedCollaborators(prev => [
        ...prev, 
        { userId, role: newRole }
      ]);
    }
  };

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

    try {
      const response = await fetch(
        "http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/user/delete-collaborators",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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
      } else {
        console.error("Failed to delete collaborators:", data.message);
      }
    } catch (error) {
      console.error("Error deleting collaborators:", error);
    }
  };

  const handleSaveChanges = async () => {
    // Only send modified collaborators to reduce unnecessary API calls
    const payload = {
      noteId: selectedNote.noteId,
      collaborators: modifiedCollaborators.map((collab) => ({
        userId: collab.userId,
        role: collab.role,
        status: 1,
      })),
    };

    try {
      const response = await fetch(
        "http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/user/edit-collaborators",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Reset modified collaborators after successful update
        setModifiedCollaborators([]);
        // Optionally, you might want to refresh the note data here
      } else {
        console.error("Failed to update collaborators:", data.message);
      }
    } catch (error) {
      console.error("Error updating collaborators:", error);
    }
  };

  const handleAddCollaborators = async () => {
    const payload = {
      noteId: selectedNote.noteId,
      collaborators: addedCollaborators.map((collab) => ({
        userId: collab.userId,
        role: collab.role,
        status: 1,
      })),
    };

    try {
      const response = await fetch(
        "http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/user/add-multiple-collaborators",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data.success) {
        setAddedCollaborators([]);
        setSelectedNote((prevNote) => ({
          ...prevNote,
          collaborators: [
            ...prevNote.collaborators,
            ...addedCollaborators.map((c) => ({
              userId: c.userId,
              username: c.username,
              role: c.role,
            })),
          ],
        }));
      } else {
        console.error("Failed to add collaborators:", data.message);
      }
    } catch (error) {
      console.error("Error adding collaborators:", error);
    }
  };

  const handleSaveNoteChanges = async () => {
    const payload = {
      userId: localStorage.getItem("userId"), // Retrieve UserId from localStorage
      noteId: selectedNote.noteId,
      title: selectedNote.title,
      tag: selectedNote.tag,
      status: noteStatus,
    };

    try {
      const response = await fetch("http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/edit-note", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update note:", data.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    const payload = {
      userId: localStorage.getItem("userId"), // Retrieve UserId from localStorage
      noteId: selectedNote.noteId,
    };

    try {
      const response = await fetch("http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/delete-note", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Note deleted successfully.");
        onClose(); // Close the dialog after deletion
      } else {
        console.error("Failed to delete note:", data.message);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: { backgroundColor: "#424242", color: "#fff" },
      }}
    >
      <DialogTitle>Edit Note</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={dialogTab} onChange={handleDialogTabChange}>
          <Tab label="Edit Collaborators" sx={{ color: "#fff" }} />
          <Tab label="Add Collaborators" sx={{ color: "#fff" }} />
          <Tab label="Edit Note" sx={{ color: "#fff" }} />
        </Tabs>
      </Box>
      <DialogContent>
        {dialogTab === 0 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Collaborators for: <strong>{selectedNote?.title}</strong>
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
                      checked={collab.isSelected || false}
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
                    <Typography sx={{ color: "#fff", flex: 1 }}>
                      {collab.username}
                    </Typography>
                    <TextField
                      select
                      value={collab.role ?? NoteRoles.Viewer}
                      onChange={(e) =>
                        handleRoleChange(collab.userId, Number(e.target.value))
                      }
                      sx={{
                        width: "120px",
                        "& .MuiInputBase-root": { color: "#fff" },
                        "& .MuiSelect-icon": { color: "#fff" },
                      }}
                      SelectProps={{ native: true }}
                    >
                      {Object.entries(roleLabels).map(([roleValue, roleLabel]) => (
                        <option key={roleValue} value={roleValue}>
                          {roleLabel}
                        </option>
                      ))}
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
        {dialogTab === 1 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Add Collaborators
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                fullWidth
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "#fff" },
                }}
              >
                <option value="">Select a user</option>
                {allUsers.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </TextField>
              <TextField
                select
                SelectProps={{ native: true }}
                fullWidth
                value={selectedRole}
                onChange={(e) => setSelectedRole(Number(e.target.value))}
                sx={{
                  "& .MuiInputBase-root": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "#fff" },
                }}
              >
                <option value={0}>Owner</option>
                <option value={1}>Editor</option>
                <option value={2}>Viewer</option>
              </TextField>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedUser}
                onClick={() => {
                  const user = allUsers.find((u) => u.userId === selectedUser);
                  if (user) {
                    setAddedCollaborators((prev) => [
                      ...prev,
                      { userId: user.userId, username: user.username, role: selectedRole },
                    ]);
                    setSelectedUser("");
                  }
                }}
              >
                Add Collaborator
              </Button>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {addedCollaborators.map((collab) => (
                  <Chip
                    key={collab.userId}
                    label={`${collab.username} (${roleEnum[collab.role]})`}
                    onDelete={() =>
                      setAddedCollaborators((prev) =>
                        prev.filter((c) => c.userId !== collab.userId)
                      )
                    }
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      "& .MuiChip-deleteIcon": { color: "#fff" },
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCollaborators}
              disabled={addedCollaborators.length === 0}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        )}
        {dialogTab === 2 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Editing: <strong>{selectedNote?.title}</strong>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Note Title"
              value={selectedNote?.title || ""}
              onChange={(e) =>
                setSelectedNote((prevNote) => ({ ...prevNote, title: e.target.value }))
              }
              sx={{ mt: 2, "& .MuiInputBase-root": { color: "#fff" } }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Note Tag"
              value={selectedNote?.tag || ""}
              onChange={(e) =>
                setSelectedNote((prevNote) => ({ ...prevNote, tag: e.target.value }))
              }
              sx={{ mt: 2, "& .MuiInputBase-root": { color: "#fff" } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={noteStatus === 0}
                  onChange={() => setNoteStatus(noteStatus === 0 ? 1 : 0)}
                  color="primary"
                />
              }
              label="Archive Note"
              sx={{ mt: 2, color: "#fff" }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteNote}
              sx={{ mt: 4 }}
            >
              Delete Note
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
          onClick={
            dialogTab === 0
              ? handleSaveChanges
              : dialogTab === 1
              ? handleAddCollaborators
              : handleSaveNoteChanges
          }
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNoteDialog;
