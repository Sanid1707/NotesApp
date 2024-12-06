// import React, { useState } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Tooltip,
//   Avatar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Tabs,
//   Tab,
//   Box,
//   TextField,
//   Chip,
//   Checkbox,
// } from "@mui/material"; // Added Checkbox
// import StarIcon from "@mui/icons-material/Star";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DeleteIcon from "@mui/icons-material/Delete";
// import GroupIcon from "@mui/icons-material/Group";
// import Navbar from "../../Components/Navbar"; // Main Navbar
// import SubNavbar from "../../Components/SubNavbar"; // Sub Navbar

// const mockNotes = [
//   {
//     NoteId: "1",
//     Title: "SOA",
//     Tag: "Collab",
//     Favourite: 1,
//     Archived: 0,
//     Collaborators: [
//       { UserId: "2", Username: "Alice" },
//       { UserId: "3", Username: "Bob" },
//       { UserId: "4", Username: "Charlie" },
//     ],
//   },
//   {
//     NoteId: "2",
//     Title: "React Project",
//     Tag: "Frontend",
//     Favourite: 0,
//     Archived: 0,
//     Collaborators: [{ UserId: "5", Username: "David" }],
//   },
//   {
//     NoteId: "3",
//     Title: "Database Design",
//     Tag: "Backend",
//     Favourite: 1,
//     Archived: 0,
//     Collaborators: [{ UserId: "6", Username: "Eve" }],
//   },
// ];

// const sampleUsers = [
//   { UserId: "1", Username: "Alice", Email: "alice@example.com" },
//   { UserId: "2", Username: "Bob", Email: "bob@example.com" },
//   { UserId: "3", Username: "Charlie", Email: "charlie@example.com" },
//   { UserId: "4", Username: "David", Email: "david@example.com" },
// ]; // Defined sampleUsers

// const NotesDash = () => {
//   const [notes, setNotes] = useState(mockNotes);
//   const [currentTab, setCurrentTab] = useState(0); // 0 for Active, 1 for Archive
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogTab, setDialogTab] = useState(0); // 0 for Edit Collaborators, 1 for Add Collaborators, 2 for Edit Note
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [role, setRole] = useState("Viewer"); // Role for new collaborators
//   const [selectedUser, setSelectedUser] = useState(""); // Currently selected user
// const [selectedRole, setSelectedRole] = useState(""); // Currently selected role
// const [addedCollaborators, setAddedCollaborators] = useState([]); // List of added collaborators

//   const handleFavouriteToggle = (noteId) => {
//     setNotes((prevNotes) =>
//       prevNotes.map((note) =>
//         note.NoteId === noteId
//           ? { ...note, Favourite: note.Favourite === 1 ? 0 : 1 }
//           : note
//       )
//     );
//   };

//   const handleAddNote = (newNote) => {
//     setNotes((prevNotes) => [...prevNotes, newNote]);
//   };


//   const openDialog = (note) => {
//     setSelectedNote(note);
//     setDialogOpen(true);
//   };

//   const closeDialog = () => {
//     setDialogOpen(false);
//     setSelectedNote(null);
//   };

//   const handleDialogTabChange = (event, newValue) => {
//     setDialogTab(newValue);
//   };

//   const handleDeleteCollaborator = (collaboratorId) => {
//     setSelectedNote((prevNote) => ({
//       ...prevNote,
//       Collaborators: prevNote.Collaborators.filter(
//         (collab) => collab.UserId !== collaboratorId
//       ),
//     }));
//   };

//   const filteredNotes =
//     currentTab === 0
//       ? notes.filter((note) => note.Archived === 0)
//       : notes.filter((note) => note.Archived === 1); 

//   return (
//     <>

//       <Navbar username="John Doe" />
//       <SubNavbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

//       <Container maxWidth="lg" sx={{ mt: 2 }}>
//         <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
//           {currentTab === 0 ? "Active Notes" : "Archived Notes"}
//         </Typography>

//         <Grid container spacing={4}>
//           {filteredNotes.map((note) => (
//             <Grid item xs={12} sm={6} md={3} key={note.NoteId}>
//               <Card
//                 sx={{
//                   backgroundColor: currentTab === 0 ? "#424242" : "#616161",
//                   color: "#fff",
//                   borderRadius: "8px",
//                   boxShadow: 3,
//                   height: 170,
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   position: "relative",
//                   padding: 1,
//                 }}
//               >
//                 {currentTab === 0 && (
//                   <IconButton
//                     onClick={() => handleFavouriteToggle(note.NoteId)}
//                     sx={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       color: note.Favourite ? "#FFD700" : "#fff",
//                     }}
//                   >
//                     {note.Favourite ? <StarIcon fontSize="medium" /> : <StarBorderIcon fontSize="medium" />}
//                   </IconButton>
//                 )}

//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                     {note.Title}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       backgroundColor: "#757575",
//                       color: "#fff",
//                       borderRadius: "4px",
//                       padding: "2px 8px",
//                     }}
//                   >
//                     {note.Tag}
//                   </Typography>
//                 </CardContent>

//                 <CardContent
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-end",
//                   }}
//                 >

//                   {/* Collaborators */}
//                   <Box>
//                     {note.Collaborators.length > 1 ? (
//                       <Tooltip
//                         title={note.Collaborators.map((collab) => collab.Username).join(", ")}
//                       >
//                         <GroupIcon sx={{ fontSize: 30, color: "#1976d2" }} />
//                       </Tooltip>
//                     ) : (
//                       note.Collaborators.map((collab) => (
//                         <Tooltip title={collab.Username} key={collab.UserId}>
//                           <Avatar
//                             sx={{
//                               width: 36,
//                               height: 36,
//                               backgroundColor: "#1976d2",
//                               fontSize: "12px",
//                             }}
//                           >
//                             {collab.Username.charAt(0)}
//                           </Avatar>
//                         </Tooltip>
//                       ))
//                     )}
//                   </Box>

//                   <IconButton onClick={() => openDialog(note)} sx={{ color: "#fff" }}>
//                     <MoreVertIcon fontSize="small" />
//                   </IconButton>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Dialog Component */}
//         <Dialog
//           open={dialogOpen}
//           onClose={closeDialog}
//           fullWidth
//           maxWidth="md"
//           PaperProps={{
//             style: {
//               backgroundColor: "#424242",
//               color: "#fff",
//             },
//           }}
//         >

//   <Dialog
//   open={dialogOpen}
//   onClose={closeDialog}
//   fullWidth
//   maxWidth="md"
//   PaperProps={{
//     style: {
//       backgroundColor: "#424242",
//       color: "#fff",
//     },
//   }}
// >
//   <DialogTitle sx={{ color: "#fff" }}>Edit Note</DialogTitle>
//   <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//     <Tabs value={dialogTab} onChange={handleDialogTabChange}>
//       <Tab label="Edit Collaborators" sx={{ color: "#fff" }} />
//       <Tab label="Add Collaborators" sx={{ color: "#fff" }} />
//       <Tab label="Edit Notes" sx={{ color: "#fff" }} />
//     </Tabs>
//   </Box>
//   <DialogContent>
//     {dialogTab === 0 && (
//       <Box>
//         <Typography variant="body1" gutterBottom>
//           Collaborators for: <strong>{selectedNote?.Title}</strong>
//         </Typography>
//         {/* Collaborators with Checkboxes and Role Dropdown */}
//         <Box>
//           {selectedNote?.Collaborators.map((collab) => (
//             <Box
//               key={collab.UserId}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "8px",
//                 padding: "8px",
//                 border: "1px solid #757575",
//                 borderRadius: "8px",
//                 backgroundColor: "#333",
//               }}
//             >
//               {/* Checkbox */}
//               <Checkbox
//                 onChange={(e) => {
//                   setSelectedNote((prevNote) => ({
//                     ...prevNote,
//                     Collaborators: prevNote.Collaborators.map((c) =>
//                       c.UserId === collab.UserId
//                         ? { ...c, isSelected: e.target.checked }
//                         : c
//                     ),
//                   }));
//                 }}
//                 sx={{
//                   color: "#fff",
//                 }}
//               />

//               {/* Collaborator Name */}
//               <Typography sx={{ color: "#fff", fontWeight: "500", flex: 1 }}>
//                 {collab.Username}
//               </Typography>

//               {/* Role Dropdown */}
//               <TextField
//                 select
//                 value={collab.role || "Viewer"}
//                 onChange={(e) => {
//                   const newRole = e.target.value;
//                   setSelectedNote((prevNote) => ({
//                     ...prevNote,
//                     Collaborators: prevNote.Collaborators.map((c) =>
//                       c.UserId === collab.UserId ? { ...c, role: newRole } : c
//                     ),
//                   }));
//                 }}
//                 sx={{
//                   width: "120px",
//                   "& .MuiInputBase-root": { color: "#fff" },
//                   "& .MuiSelect-icon": { color: "#fff" },
//                 }}
//                 SelectProps={{
//                   native: true,
//                 }} // Ensure the dropdown is native
//               >
//                 <option value="Viewer">Viewer</option>
//                 <option value="Editor">Editor</option>
//                 <option value="Owner">Owner</option>
//               </TextField>
//             </Box>
//           ))}
//         </Box>
//         {/* Delete Button */}
//         <Button
//           variant="contained"
//           color="error"
//           onClick={() => {
//             setSelectedNote((prevNote) => ({
//               ...prevNote,
//               Collaborators: prevNote.Collaborators.filter(
//                 (collab) => !collab.isSelected
//               ),
//             }));
//           }}
//           disabled={
//             !selectedNote?.Collaborators.some((collab) => collab.isSelected)
//           }
//           sx={{ mt: 2 }}
//         >
//           Delete Selected
//         </Button>
//       </Box>
//     )}

// {dialogTab === 1 && (
//   <Box>
//     <Typography variant="body1" gutterBottom>
//       Add Collaborators
//     </Typography>
//     {/* Add Collaborators Section */}
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//       {/* Dropdown to Search and Select Users */}
//       <TextField
//         select
     
//         SelectProps={{
//           native: true,
//         }}
//         fullWidth
//         value={selectedUser || ""}
//         onChange={(e) => setSelectedUser(e.target.value)}
//         sx={{
//           "& .MuiInputBase-root": { color: "#fff" },
//           "& .MuiInputLabel-root": { color: "#fff" },
//         }}
//       >
//         <option value="">Select a user</option>
//         {sampleUsers.map((user) => (
//           <option key={user.UserId} value={user.UserId}>
//             {user.Username} ({user.Email})
//           </option>
//         ))}
//       </TextField>

//       {/* Dropdown to Select Role */}
//       <TextField
//         select
 
//         SelectProps={{
//           native: true,
//         }}
//         fullWidth
//         value={selectedRole || ""}
//         onChange={(e) => setSelectedRole(e.target.value)}
//         sx={{
//           "& .MuiInputBase-root": { color: "#fff" },
//           "& .MuiInputLabel-root": { color: "#fff" },
//         }}
//       >
//         <option value="Viewer">Viewer</option>
//         <option value="Editor">Editor</option>
//         <option value="Owner">Owner</option>
//       </TextField>

//       {/* Add Button */}
//       <Button
//         variant="contained"
//         color="primary"
//         disabled={!selectedUser || !selectedRole}
//         onClick={() => {
//           const user = sampleUsers.find((u) => u.UserId === selectedUser);
//           if (user) {
//             const newCollaborator = {
//               UserId: user.UserId,
//               Username: user.Username,
//               role: selectedRole,
//             };
//             setAddedCollaborators((prev) => [...prev, newCollaborator]);
//             setSelectedUser("");
//             setSelectedRole("");
//           }
//         }}
//       >
//         Add Collaborator
//       </Button>

//       {/* Display Added Collaborators as Chips */}
//       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
//         {addedCollaborators.map((collab) => (
//           <Chip
//             key={collab.UserId}
//             label={`${collab.Username} (${collab.role})`}
//             onDelete={() =>
//               setAddedCollaborators((prev) =>
//                 prev.filter((c) => c.UserId !== collab.UserId)
//               )
//             }
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               "& .MuiChip-deleteIcon": {
//                 color: "#fff",
//               },
//             }}
//           />
//         ))}
//       </Box>
//     </Box>
//   </Box>
// )}


// {dialogTab === 2 && (
//   <Box>
//     <Typography variant="body1" gutterBottom>
//       Editing: <strong>{selectedNote?.Title}</strong>
//     </Typography>
//     <TextField
//       fullWidth
//       variant="outlined"
//       label="Note Title"
//       defaultValue={selectedNote?.Title}
//       sx={{ mt: 2 }}
//       InputProps={{
//         style: { color: "#fff" },
//       }}
//       InputLabelProps={{
//         style: { color: "#fff" },
//       }}
//     />
//     <TextField
//       fullWidth
//       variant="outlined"
//       label="Note Tag"
//       defaultValue={selectedNote?.Tag}
//       sx={{ mt: 2 }}
//       InputProps={{
//         style: { color: "#fff" },
//       }}
//       InputLabelProps={{
//         style: { color: "#fff" },
//       }}
//     />
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         mt: 4,
//       }}
//     >
//       {/* Delete Note Button */}
//       <Button
//         variant="contained"
//         color="error"
//         onClick={() => {
//           // Remove the selected note
//           setNotes((prevNotes) =>
//             prevNotes.filter((note) => note.NoteId !== selectedNote?.NoteId)
//           );
//           // Close the dialog after deletion
//           closeDialog();
//         }}
//         sx={{
//           position: "absolute",
//           bottom: 16,
//           left: 16,
//         }}
//       >
//         Delete Note
//       </Button>
//       {/* Save Button */}

//     </Box>
//   </Box>
// )}
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={closeDialog} color="secondary">
//       Cancel
//     </Button>
//     <Button color="primary" variant="contained">
//       Save
//     </Button>
//   </DialogActions>
// </Dialog>
//         </Dialog>
//       </Container>
//     </>
//   );
// };

// export default NotesDash;

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Chip,
  Checkbox,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupIcon from "@mui/icons-material/Group";
import Navbar from "../../Components/Navbar";
import SubNavbar from "../../Components/SubNavbar";
import { useNavigate } from "react-router-dom";

const NotesDash = () => {
  const [notes, setNotes] = useState([]);
  const [currentTab, setCurrentTab] = useState(0); // 0 for Active, 1 for Archive
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState(0); // 0 for Edit Collaborators, 1 for Add Collaborators, 2 for Edit Note
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [addedCollaborators, setAddedCollaborators] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const endpoint =
        currentTab === 0
          ? `http://localhost:5189/api/notesTitle/get-all-notes/${userId}`
          : `http://localhost:5189/api/notesTitle/get-archived-notes/${userId}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch notes.");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Handle favourite toggle
  const handleFavouriteToggle = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:5189/api/notesTitle/toggle-favourite/${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle favourite status.");
      }

      const data = await response.json();
      if (data.success) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.noteId === noteId
              ? { ...note, favourite: data.favourite }
              : note
          )
        );
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  // Open NotesCanvas
  const handleOpenNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  // Open dialog box for editing
  const openDialog = (note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  // Close dialog box
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedNote(null);
  };

  const handleDialogTabChange = (event, newValue) => {
    setDialogTab(newValue);
  };

  // Fetch notes on load and when the tab changes
  useEffect(() => {
    fetchNotes();
  }, [currentTab]);

  return (
    <>
      <Navbar username="John Doe" />
      <SubNavbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          {currentTab === 0 ? "Active Notes" : "Archived Notes"}
        </Typography>

        <Grid container spacing={4}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={3} key={note.noteId}>
              <Card
                sx={{
                  backgroundColor: currentTab === 0 ? "#424242" : "#616161",
                  color: "#fff",
                  borderRadius: "8px",
                  boxShadow: 3,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  padding: 1,
                }}
              >
                {currentTab === 0 && (
                  <IconButton
                    onClick={() => handleFavouriteToggle(note.noteId)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: note.favourite ? "#FFD700" : "#fff",
                    }}
                  >
                    {note.favourite ? (
                      <StarIcon fontSize="medium" />
                    ) : (
                      <StarBorderIcon fontSize="medium" />
                    )}
                  </IconButton>
                )}

                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#757575",
                      color: "#fff",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    {note.tag}
                  </Typography>
                </CardContent>

                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Collaborators */}
                  {note.collaborators && note.collaborators.length > 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {note.collaborators.length > 1 ? (
                        <Tooltip
                          title={note.collaborators
                            .map((collab) => collab.username)
                            .join(", ")}
                        >
                          <GroupIcon sx={{ fontSize: 30, color: "#1976d2" }} />
                        </Tooltip>
                      ) : (
                        note.collaborators.map((collab) => (
                          <Tooltip title={collab.username} key={collab.userId}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: "#1976d2",
                                fontSize: "12px",
                              }}
                            >
                              {collab.username.charAt(0)}
                            </Avatar>
                          </Tooltip>
                        ))
                      )}
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      flex: 1,
                    }}
                  >
                    <Button
                      variant="text"
                      onClick={() => handleOpenNote(note.noteId)}
                      sx={{
                        color: "#1976d2",
                        textTransform: "capitalize",
                        mr: 1,
                      }}
                    >
                      Open
                    </Button>
                    <IconButton
                      onClick={() => openDialog(note)}
                      sx={{ color: "#fff" }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Dialog Component */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "#424242",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Edit Note</DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={dialogTab} onChange={handleDialogTabChange}>
            <Tab label="Edit Collaborators" sx={{ color: "#fff" }} />
            <Tab label="Add Collaborators" sx={{ color: "#fff" }} />
            <Tab label="Edit Notes" sx={{ color: "#fff" }} />
          </Tabs>
        </Box>
        <DialogContent>
          {dialogTab === 0 && (
            <Typography>Collaborators Tab Content</Typography>
          )}
          {dialogTab === 1 && <Typography>Add Collaborators Tab Content</Typography>}
          {dialogTab === 2 && <Typography>Edit Notes Tab Content</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotesDash;