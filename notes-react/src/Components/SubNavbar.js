// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Tabs,
// //   Tab,
// //   Button,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   TextField,
// // } from "@mui/material";

// // const SubNavbar = ({ currentTab, setCurrentTab, onAddNote }) => {
// //   const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
// //   const [newNote, setNewNote] = useState({ title: "", tag: "" }); // New note fields

// //   // Open Add Note Dialog
// //   const handleOpenDialog = () => {
// //     setDialogOpen(true);
// //   };

// //   // Close Add Note Dialog
// //   const handleCloseDialog = () => {
// //     setDialogOpen(false);
// //     setNewNote({ title: "", tag: "" }); // Reset fields
// //   };

// //   // Save New Note
// //   const handleSaveNote = () => {
// //     if (newNote.title && newNote.tag) {
// //       onAddNote(newNote); // Pass the new note to the parent component
// //       handleCloseDialog();
// //     }
// //   };

// //   return (
// //     <>
// //       <Box
// //         sx={{
// //           backgroundColor: "#424242",
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           height: "45px", 
// //           px: 2,
// //           overflow: "hidden", 
// //         }}
// //       >
// //         {/* Tabs */}
// //         <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
// //           <Tabs
// //             value={currentTab}
// //             onChange={(event, newValue) => setCurrentTab(newValue)}
// //             textColor="inherit"
// //             indicatorColor="primary"
// //             TabIndicatorProps={{
// //               style: { height: "5px", backgroundColor: "#388e3c" }, // Custom underline for selected tab
// //             }}
// //           >
// //             <Tab
// //               label="Active"
// //               sx={{
// //                 color: "white",
// //                 textTransform: "capitalize",
// //                 fontSize: "14px", 
// //                 "&:hover": {
// //                   color: "#fffff0", // Hover effect
// //                   textDecoration: "underline", // Underline on hover
// //                 },
// //                 "&.Mui-selected": {
// //                   color: "#ffffff", // Color when selected
// //                 },
// //               }}
// //             />
// //             <Tab
// //               label="Archive"
// //               sx={{
// //                 color: "white",
// //                 textTransform: "capitalize",
// //                 fontSize: "14px", // Adjust font size for compact design
// //                 "&:hover": {
// //                   color: "#fffff0", // Hover effect
// //                   textDecoration: "underline", // Underline on hover
// //                 },
// //                 "&.Mui-selected": {
// //                   color: "#ffffff", // Color when selected
// //                 },
// //               }}
// //             />
// //           </Tabs>
// //         </Box>

// //         {/* Add Note Button */}
// //         <Button
// //           variant="contained"
// //           color="success"
// //           onClick={handleOpenDialog}
// //           sx={{
// //             backgroundColor: "#4caf50",
// //             fontSize: "12px", // Adjust font size for compact button
// //             height: "28px", // Reduce button height for compact design
// //             "&:hover": { backgroundColor: "#388e3c" },
// //           }}
// //         >
// //           Add Note
// //         </Button>
// //       </Box>

// //       {/* Add Note Dialog */}
// //       <Dialog
// //         open={dialogOpen}
// //         onClose={handleCloseDialog}
// //         fullWidth
// //         maxWidth="sm"
// //         PaperProps={{
// //           style: {
// //             backgroundColor: "#333",
// //             color: "#fff",
// //           },
// //         }}
// //       >
// //         <DialogTitle>Add Note</DialogTitle>
// //         <DialogContent>
// //           <TextField
// //             fullWidth
// //             label="Note Title"
// //             variant="outlined"
// //             value={newNote.title}
// //             onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
// //             sx={{ mt: 2 }}
// //             InputProps={{
// //               style: { color: "#fff" },
// //             }}
// //             InputLabelProps={{
// //               style: { color: "#fff" },
// //             }}
// //           />
// //           <TextField
// //             fullWidth
// //             label="Note Tag"
// //             variant="outlined"
// //             value={newNote.tag}
// //             onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
// //             sx={{ mt: 2 }}
// //             InputProps={{
// //               style: { color: "#fff" },
// //             }}
// //             InputLabelProps={{
// //               style: { color: "#fff" },
// //             }}
// //           />
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCloseDialog} color="secondary">
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSaveNote}
// //             color="primary"
// //             variant="contained"
// //             disabled={!newNote.title || !newNote.tag} // Disable Save if fields are empty
// //           >
// //             Save
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </>
// //   );
// // };

// // export default SubNavbar;

// import React, { useState, useContext } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { Star, StarBorder } from "@mui/icons-material";
// import { UserContext } from "../Pages/auth/Context";

// const SubNavbar = ({ currentTab, setCurrentTab, onAddNote }) => {
//   const { userId } = useContext(UserContext); // Get userId from UserContext
//   const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
//   const [newNote, setNewNote] = useState({ title: "", tag: "", favourite: 0 }); // New note fields
//   const [errorMessage, setErrorMessage] = useState(""); // Error message state
//   const [successMessage, setSuccessMessage] = useState(""); // Success message state

//   // Open Add Note Dialog
//   const handleOpenDialog = () => {
//     setDialogOpen(true);
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   // Close Add Note Dialog
//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setNewNote({ title: "", tag: "", favourite: 0 }); // Reset fields
//   };

//   // Save New Note
//   const handleSaveNote = async () => {
//     if (!newNote.title || !newNote.tag) {
//       setErrorMessage("Title and Tag are required.");
//       return;
//     }

//     try {
//       const response = await fetch("http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/notesTitle/add-note", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: userId,
//           title: newNote.title,
//           tag: newNote.tag,
//           favourite: newNote.favourite,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add note. Please try again.");
//       }

//       const result = await response.json();
//       if (result.success) {
//         setSuccessMessage("Note added successfully!");
//         onAddNote({
//           noteId: result.noteId,
//           title: newNote.title,
//           tag: newNote.tag,
//           favourite: newNote.favourite,
//         });
//         handleCloseDialog(); // Close the dialog box on success
//       } else {
//         setErrorMessage(result.message || "Failed to add note.");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           backgroundColor: "#424242",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           height: "45px",
//           px: 2,
//           overflow: "hidden",
//         }}
//       >
//         {/* Tabs */}
//         <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
//           <Tabs
//             value={currentTab}
//             onChange={(event, newValue) => setCurrentTab(newValue)}
//             textColor="inherit"
//             indicatorColor="primary"
//             TabIndicatorProps={{
//               style: { height: "5px", backgroundColor: "#388e3c" },
//             }}
//           >
//             <Tab
//               label="Active"
//               sx={{
//                 color: "white",
//                 textTransform: "capitalize",
//                 fontSize: "14px",
//                 "&:hover": {
//                   color: "#fffff0",
//                   textDecoration: "underline",
//                 },
//                 "&.Mui-selected": {
//                   color: "#ffffff",
//                 },
//               }}
//             />
//             <Tab
//               label="Archive"
//               sx={{
//                 color: "white",
//                 textTransform: "capitalize",
//                 fontSize: "14px",
//                 "&:hover": {
//                   color: "#fffff0",
//                   textDecoration: "underline",
//                 },
//                 "&.Mui-selected": {
//                   color: "#ffffff",
//                 },
//               }}
//             />
//           </Tabs>
//         </Box>

//         {/* Add Note Button */}
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleOpenDialog}
//           sx={{
//             backgroundColor: "#4caf50",
//             fontSize: "12px",
//             height: "28px",
//             "&:hover": { backgroundColor: "#388e3c" },
//           }}
//         >
//           Add Note
//         </Button>
//       </Box>

//       {/* Add Note Dialog */}
//       <Dialog
//         open={dialogOpen}
//         onClose={handleCloseDialog}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           style: {
//             backgroundColor: "#333",
//             color: "#fff",
//           },
//         }}
//       >
//         <DialogTitle>Add Note</DialogTitle>
//         <DialogContent>
//           {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
//           {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
//           <TextField
//             fullWidth
//             label="Note Title"
//             variant="outlined"
//             value={newNote.title}
//             onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
//             sx={{ mt: 2 }}
//             InputProps={{
//               style: { color: "#fff" },
//             }}
//             InputLabelProps={{
//               style: { color: "#fff" },
//             }}
//           />
//           <TextField
//             fullWidth
//             label="Note Tag"
//             variant="outlined"
//             value={newNote.tag}
//             onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
//             sx={{ mt: 2 }}
//             InputProps={{
//               style: { color: "#fff" },
//             }}
//             InputLabelProps={{
//               style: { color: "#fff" },
//             }}
//           />
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginTop: "16px",
//               color: "#fff",
//             }}
//           >
//             <IconButton
//               onClick={() =>
//                 setNewNote({ ...newNote, favourite: newNote.favourite === 1 ? 0 : 1 })
//               }
//             >
//               {newNote.favourite === 1 ? <Star color="primary" /> : <StarBorder />}
//             </IconButton>
//             <span>{newNote.favourite === 1 ? "Favourite" : "Not Favourite"}</span>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveNote}
//             color="primary"
//             variant="contained"
//             disabled={!newNote.title || !newNote.tag}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default SubNavbar;





import React, { useState, useContext } from "react";
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
  Alert,
  IconButton,
  Typography, // <-- Add this import
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { UserContext } from "../Pages/auth/Context";

const SubNavbar = ({ currentTab, setCurrentTab, onAddNote }) => {
  const { userId } = useContext(UserContext); // Get userId from UserContext
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", tag: "", favourite: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Open Dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewNote({ title: "", tag: "", favourite: 0 }); // Reset form fields
  };

  // Save New Note
  const handleSaveNote = async () => {
    if (!newNote.title.trim() || !newNote.tag.trim()) {
      setErrorMessage("Title and Tag fields are required.");
      return;
    }

    try {
      const payload = {
        userId: userId,
        title: newNote.title,
        tag: newNote.tag,
        favourite: newNote.favourite,
      };

      const response = await fetch("/api/notesTitle/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add note. Please try again later.");
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Note added successfully!");
        onAddNote({
          noteId: result.data.noteId, // Assuming backend returns noteId
          title: newNote.title,
          tag: newNote.tag,
          favourite: newNote.favourite,
        });
        handleCloseDialog();
      } else {
        throw new Error(result.message || "Failed to add note.");
      }
    } catch (error) {
      setErrorMessage(error.message);
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
        }}
      >
        {/* Tabs */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            textColor="inherit"
            TabIndicatorProps={{ style: { height: "4px", backgroundColor: "#388e3c" } }}
          >
            <Tab
              label="Active"
              sx={{
                color: "#fff",
                textTransform: "capitalize",
                "&:hover": { color: "#ddd" },
                "&.Mui-selected": { color: "#ffffff" },
              }}
            />
            <Tab
              label="Archive"
              sx={{
                color: "#fff",
                textTransform: "capitalize",
                "&:hover": { color: "#ddd" },
                "&.Mui-selected": { color: "#ffffff" },
              }}
            />
          </Tabs>
        </Box>

        {/* Add Note Button */}
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            fontSize: "12px",
            height: "30px",
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
        PaperProps={{ style: { backgroundColor: "#333", color: "#fff" } }}
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          <TextField
            fullWidth
            label="Note Title"
            variant="outlined"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            fullWidth
            label="Note Tag"
            variant="outlined"
            value={newNote.tag}
            onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
            sx={{ mt: 2 }}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <IconButton
              onClick={() =>
                setNewNote({ ...newNote, favourite: newNote.favourite === 1 ? 0 : 1 })
              }
            >
              {newNote.favourite === 1 ? (
                <Star sx={{ color: "#fbc02d" }} />
              ) : (
                <StarBorder sx={{ color: "#bbb" }} />
              )}
            </IconButton>
            <Typography>{newNote.favourite === 1 ? "Favourite" : "Not Favourite"}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveNote}
            color="primary"
            variant="contained"
            disabled={!newNote.title.trim() || !newNote.tag.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubNavbar;