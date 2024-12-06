
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Tabs,
//     Tab,
//     Box,
//     Typography,
//     Checkbox,
//     TextField,
//     Button,
//   } from "@mui/material";
//   import React, { useEffect, useState } from "react";
  
//   const EditNoteDialog = ({ open, onClose, note }) => {
//     const [dialogTab, setDialogTab] = useState(0); 
//     const [selectedNote, setSelectedNote] = useState(note);
  
//     // Role mapping for enums
//     const roleEnum = {
//       0: "Owner",
//       1: "Editor",
//       2: "Viewer",
//     };
  
//     useEffect(() => {
//       console.log("Incoming note data to dialog:", note);
  
//       if (note) {
//         setSelectedNote(note);
//       }
//     }, [note]);
  
//     // Handle tab change
//     const handleDialogTabChange = (event, newValue) => {
//       setDialogTab(newValue);
//     };
  
//     // Handle role change for a collaborator
//     const handleRoleChange = (userId, newRole) => {
//       setSelectedNote((prevNote) => ({
//         ...prevNote,
//         collaborators: prevNote.collaborators.map((c) =>
//           c.userId === userId ? { ...c, role: newRole } : c
//         ),
//       }));
//     };
  
//     // Handle delete selected collaborators
//     const handleDeleteSelected = async () => {
//       const collaboratorsToDelete = selectedNote.collaborators.filter(
//         (collab) => collab.isSelected
//       );
//       const payload = {
//         noteId: selectedNote.noteId,
//         collaborators: collaboratorsToDelete.map((collab) => ({
//           userId: collab.userId,
//         })),
//       };
  
//       console.log("Delete payload:", payload);
  
//       try {
//         const response = await fetch(
//           "http://localhost:5189/api/user/delete-collaborators",
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           setSelectedNote((prevNote) => ({
//             ...prevNote,
//             collaborators: prevNote.collaborators.filter(
//               (collab) => !collab.isSelected
//             ),
//           }));
//           console.log("Collaborators deleted successfully.");
//         } else {
//           console.error("Failed to delete collaborators:", data.message);
//         }
//       } catch (error) {
//         console.error("Error deleting collaborators:", error);
//       }
//     };
  
//     // Handle save changes for editing collaborators
//     const handleSaveChanges = async () => {
//       const payload = {
//         noteId: selectedNote.noteId,
//         collaborators: selectedNote.collaborators.map((collab) => ({
//           userId: collab.userId,
//           role: collab.role,
//           status: 1, // Assuming "Active" is the default status
//         })),
//       };
  
//       console.log("Edit payload:", payload);
  
//       try {
//         const response = await fetch(
//           "http://localhost:5189/api/user/edit-collaborators",
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//           }
//         );
//         const data = await response.json();
//         if (data.success) {
//           console.log("Collaborators updated successfully.");
//         } else {
//           console.error("Failed to update collaborators:", data.message);
//         }
//       } catch (error) {
//         console.error("Error updating collaborators:", error);
//       }
//     };
  
//     return (
//       <Dialog
//         open={open}
//         onClose={onClose}
//         fullWidth
//         maxWidth="md"
//         PaperProps={{
//           style: {
//             backgroundColor: "#424242",
//             color: "#fff",
//           },
//         }}
//       >
//         <DialogTitle>Edit Note</DialogTitle>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <Tabs value={dialogTab} onChange={handleDialogTabChange}>
//             <Tab label="Edit Collaborators" sx={{ color: "#fff" }} />
//             <Tab label="Add Collaborators" sx={{ color: "#fff" }} />
//             <Tab label="Edit Notes" sx={{ color: "#fff" }} />
//           </Tabs>
//         </Box>
//         <DialogContent>
//           {dialogTab === 0 && (
//             <Box>
//               <Typography variant="body1" gutterBottom>
//                 Collaborators for: <strong>{selectedNote?.title || "N/A"}</strong>
//               </Typography>
//               <Box>
//                 {selectedNote?.collaborators?.length > 0 ? (
//                   selectedNote.collaborators.map((collab) => (
//                     <Box
//                       key={collab.userId}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         marginBottom: "8px",
//                         padding: "8px",
//                         border: "1px solid #757575",
//                         borderRadius: "8px",
//                         backgroundColor: "#333",
//                       }}
//                     >
//                       <Checkbox
//                         onChange={(e) => {
//                           setSelectedNote((prevNote) => ({
//                             ...prevNote,
//                             collaborators: prevNote.collaborators.map((c) =>
//                               c.userId === collab.userId
//                                 ? { ...c, isSelected: e.target.checked }
//                                 : c
//                             ),
//                           }));
//                         }}
//                         sx={{ color: "#fff" }}
//                       />
//                       <Typography sx={{ color: "#fff", fontWeight: "500", flex: 1 }}>
//                         {collab.username}
//                       </Typography>
//                       <TextField
//                         select
//                         value={collab.role || 2} // Default to Viewer
//                         onChange={(e) =>
//                           handleRoleChange(collab.userId, Number(e.target.value))
//                         }
//                         sx={{
//                           width: "120px",
//                           "& .MuiInputBase-root": { color: "#fff" },
//                           "& .MuiSelect-icon": { color: "#fff" },
//                         }}
//                         SelectProps={{
//                           native: true,
//                         }}
//                       >
//                         <option value={0}>Owner</option>
//                         <option value={1}>Editor</option>
//                         <option value={2}>Viewer</option>
//                       </TextField>
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography>No collaborators available.</Typography>
//                 )}
//               </Box>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={handleDeleteSelected}
//                 disabled={
//                   !selectedNote?.collaborators.some((collab) => collab.isSelected)
//                 }
//                 sx={{ mt: 2 }}
//               >
//                 Delete Selected
//               </Button>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             color="primary"
//             variant="contained"
//             onClick={handleSaveChanges}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };
  
//   export default EditNoteDialog;

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
} from "@mui/material";
import React, { useEffect, useState } from "react";

const EditNoteDialog = ({ open, onClose, note }) => {
  const [dialogTab, setDialogTab] = useState(0); // 0 for Edit Collaborators, 1 for Add Collaborators
  const [selectedNote, setSelectedNote] = useState(note);
  const [allUsers, setAllUsers] = useState([]); // To hold all users for Tab 1
  const [selectedUser, setSelectedUser] = useState(""); // Selected user for Tab 1
  const [selectedRole, setSelectedRole] = useState(2); // Default role: Viewer
  const [addedCollaborators, setAddedCollaborators] = useState([]);

  // Role mapping for enums
  const roleEnum = {
    0: "Owner",
    1: "Editor",
    2: "Viewer",
  };

  useEffect(() => {
    if (note) {
      console.log("Incoming note data to dialog:", note);
      setSelectedNote(note);
    }
  }, [note]);

  useEffect(() => {
    // Fetch all users for Tab 1
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:5189/api/user/get-all-users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setAllUsers(data);
        console.log("All users fetched for adding collaborators:", data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (dialogTab === 1) {
      fetchAllUsers();
    }
  }, [dialogTab]);

  const handleDialogTabChange = (event, newValue) => {
    setDialogTab(newValue);
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      collaborators: prevNote.collaborators.map((c) =>
        c.userId === userId ? { ...c, role: newRole } : c
      ),
    }));
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
        "http://localhost:5189/api/user/delete-collaborators",
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
        console.log("Collaborators deleted successfully.");
      } else {
        console.error("Failed to delete collaborators:", data.message);
      }
    } catch (error) {
      console.error("Error deleting collaborators:", error);
    }
  };

  const handleSaveChanges = async () => {
    const payload = {
      noteId: selectedNote.noteId,
      collaborators: selectedNote.collaborators.map((collab) => ({
        userId: collab.userId,
        role: collab.role,
        status: 1, // Active
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:5189/api/user/edit-collaborators",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  const handleAddCollaborators = async () => {
    const payload = {
      noteId: selectedNote.noteId,
      collaborators: addedCollaborators.map((collab) => ({
        userId: collab.userId,
        role: collab.role,
        status: 1, // Active
      })),
    };

    console.log("Add payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:5189/api/user/add-multiple-collaborators",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log("Collaborators added successfully.");
        setAddedCollaborators([]);
        // Refresh collaborators in the dialog
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
                    <Typography sx={{ color: "#fff", flex: 1 }}>
                      {collab.username}
                    </Typography>
                    <TextField
                      select
                      value={collab.role || 2}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNoteDialog;