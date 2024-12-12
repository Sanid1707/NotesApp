

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
import EditNoteDialog from "../../Components/NoteDialog"


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
          ? `http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/get-all-notes/${userId}`
          : `http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/get-archived-notes/${userId}`;
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
        `http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/toggle-favourite/${noteId}`,
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
    console.log("Navigating to Note:", noteId); // Debugging log
    if (noteId) {
      navigate(`/notes/${noteId}`); // Navigate only if noteId is valid
    } else {
      console.error("Invalid Note ID");
    }
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
      <EditNoteDialog open={dialogOpen} onClose={closeDialog} note={selectedNote} />
    </>
  );
};

export default NotesDash;