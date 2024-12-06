// // import React, { useState } from "react";
// // import ReactQuill from "react-quill"; // Rich-text editor
// // import "react-quill/dist/quill.snow.css";
// // import Navbar from "../Components/Navbar"; // Import Navbar from Components
// // import { Box, Typography, Tooltip } from "@mui/material";
// // import GroupIcon from "@mui/icons-material/Group"; // Icon for collaborators

// // const NotesCanvas = () => {
// //   const [content, setContent] = useState(""); // State for note content
// //   const [title, setTitle] = useState("Untitled Note");
// //   const [tag, setTag] = useState("General"); // Default tag
// //   const [lastEdited, setLastEdited] = useState(new Date().toLocaleString()); // Last edited time

// //   const handleSave = async () => {
// //     console.log("HTML Content:", content); // Print HTML content to console

// //     const noteData = {
// //       title: title,
// //       tag: tag,
// //       content: content, // Send HTML content to backend
// //     };

// //     try {
// //       const response = await fetch("https://localhost:5001/api/notes", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(noteData),
// //       });

// //       if (response.ok) {
// //         console.log("Note saved successfully!");
// //         setLastEdited(new Date().toLocaleString()); // Update last edited time
// //       } else {
// //         console.error("Error saving note");
// //       }
// //     } catch (error) {
// //       console.error("Error:", error);
// //     }
// //   };

// //   // Custom modules for ReactQuill toolbar
// //   const modules = {
// //     toolbar: [
// //       [{ header: [1, 2, 3, false] }], // Headers
// //       ["bold", "italic", "underline", "strike"], // Text styles
// //       [{ list: "ordered" }, { list: "bullet" }], // Lists
// //       [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
// //       [{ align: [] }], // Text alignment
// //       ["blockquote", "code-block"], // Blockquote and code
// //       ["link", "image", "video"], // Links, images, and videos
// //       [{ color: [] }, { background: [] }], // Text and background colors
// //       ["clean"], // Remove formatting
// //     ],
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         background: "#000",
// //         color: "#fff",
// //         minHeight: "100vh",
// //         display: "flex",
// //         flexDirection: "column",
// //       }}
// //     >
// //       {/* Navbar */}
// //       <Navbar username="John Doe" />

// //       {/* Title and Meta Information */}
// //       <Box
// //         sx={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           padding: "20px",
// //           borderBottom: "1px solid #555",
// //         }}
// //       >
// //         <Box sx={{ display: "flex", alignItems: "center" }}>
// //           {/* Note Title */}
// //           <input
// //             type="text"
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             placeholder="Enter Note Title"
// //             style={{
// //               fontSize: "24px",
// //               fontWeight: "bold",
// //               color: "#fff",
// //               background: "transparent",
// //               border: "none",
// //               borderBottom: "2px solid #555",
// //               outline: "none",
// //               marginRight: "20px",
// //               width: "300px",
// //             }}
// //           />
// //           {/* Tag */}
// //           <input
// //             type="text"
// //             value={tag}
// //             onChange={(e) => setTag(e.target.value)}
// //             placeholder="Tag (e.g., Work, Personal)"
// //             style={{
// //               fontSize: "16px",
// //               color: "#fff",
// //               background: "transparent",
// //               border: "none",
// //               borderBottom: "2px solid #555",
// //               outline: "none",
// //               width: "200px",
// //             }}
// //           />
// //         </Box>
// //         {/* Collaborators and Last Edited */}
// //         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //           <Tooltip title="Collaborators">
// //             <GroupIcon sx={{ fontSize: "24px", color: "#fff", cursor: "pointer" }} />
// //           </Tooltip>
// //           <Typography sx={{ fontSize: "16px", color: "#757575" }}>Last Edited: {lastEdited}</Typography>
// //         </Box>
// //       </Box>

// //       {/* Full-Screen Editor */}
// //       <Box sx={{ flex: 1, padding: "20px" }}>
// //         <ReactQuill
// //           theme="snow"
// //           value={content}
// //           onChange={setContent}
// //           modules={modules}
// //           style={{
// //             backgroundColor: "#000",
// //             color: "#fff",
// //             height: "100%",
// //             border: "none",
// //             borderRadius: "8px",
// //           }}
// //         />
// //       </Box>

// //       {/* Save Button */}
// //       <Box
// //         sx={{
// //           textAlign: "center",
// //           padding: "20px",
// //           borderTop: "1px solid #555",
// //         }}
// //       >
// //         <button
// //           onClick={handleSave}
// //           style={{
// //             backgroundColor: "#1976d2",
// //             color: "#fff",
// //             padding: "10px 20px",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: "pointer",
// //             fontSize: "16px",
// //             fontWeight: "bold",
// //             transition: "0.3s",
// //             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
// //           }}
// //           onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
// //           onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
// //         >
// //           Save Note
// //         </button>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default NotesCanvas;


// import React, { useState } from "react";
// import ReactQuill from "react-quill"; // Rich-text editor
// import "react-quill/dist/quill.snow.css";
// import Navbar from "../Components/Navbar"; // Import Navbar from Components
// import { Box, Typography, Tooltip } from "@mui/material";
// import GroupIcon from "@mui/icons-material/Group"; // Icon for collaborators

// const NotesCanvas = () => {
//   const [content, setContent] = useState(""); // State for note content
//   const title = "Untitled Note"; // Static title
//   const tag = "General"; // Static tag
//   const [lastEdited, setLastEdited] = useState(new Date().toLocaleString()); // Last edited time

//   const handleSave = async () => {
//     console.log("HTML Content:", content); // Print HTML content to console

//     const noteData = {
//       title: title,
//       tag: tag,
//       content: content, // Send HTML content to backend
//     };

//     try {
//       const response = await fetch("https://localhost:5001/api/notes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(noteData),
//       });

//       if (response.ok) {
//         console.log("Note saved successfully!");
//         setLastEdited(new Date().toLocaleString()); // Update last edited time
//       } else {
//         console.error("Error saving note");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // Custom modules for ReactQuill toolbar
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }], // Headers
//       ["bold", "italic", "underline", "strike"], // Text styles
//       [{ list: "ordered" }, { list: "bullet" }], // Lists
//       [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
//       [{ align: [] }], // Text alignment
//       ["blockquote", "code-block"], // Blockquote and code
//       ["link", "image", "video"], // Links, images, and videos
//       [{ color: [] }, { background: [] }], // Text and background colors
//       ["clean"], // Remove formatting
//     ],
//   };

//   return (
//     <Box
//       sx={{
//         background: "#000",
//         color: "#fff",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Navbar */}
//       <Navbar username="John Doe" />

//       {/* Title and Meta Information */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "20px",
//           borderBottom: "1px solid #555",
//         }}
//       >
//         <Box>
//           {/* Note Title */}
//           <Typography
//             variant="h4"
//             sx={{
//               fontSize: "24px",
//               fontWeight: "bold",
//               color: "#fff",
//               marginBottom: "5px",
//             }}
//           >
//             {title}
//           </Typography>
//           {/* Tag */}
//           <Typography
//             variant="subtitle1"
//             sx={{
//               fontSize: "16px",
//               color: "#757575",
//             }}
//           >
//             {tag}
//           </Typography>
//         </Box>
//         {/* Collaborators and Last Edited */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Tooltip title="Collaborators">
//             <GroupIcon
//               sx={{
//                 fontSize: "24px",
//                 color: "#fff",
//                 cursor: "pointer",
//                 transition: "0.3s",
//                 "&:hover": { color: "#1976d2" },
//               }}
//             />
//           </Tooltip>
//           <Typography sx={{ fontSize: "16px", color: "#757575" }}>Last Edited: {lastEdited}</Typography>
//         </Box>
//       </Box>

//       {/* Full-Screen Editor */}
//       <Box
//         sx={{
//           flex: 1,
//           padding: "20px",
//         }}
//       >
//         <ReactQuill
//           theme="snow"
//           value={content}
//           onChange={setContent}
//           modules={modules}
//           style={{
//             backgroundColor: "#000",
//             color: "#fff",
//             height: "100%",
//             border: "none",
//             borderRadius: "8px",
//           }}
//         />
//       </Box>

//       {/* Save Button */}
//       <Box
//         sx={{
//           textAlign: "center",
//           padding: "20px",
//           borderTop: "1px solid #555",
//         }}
//       >
//         <button
//           onClick={handleSave}
//           style={{
//             backgroundColor: "#1976d2",
//             color: "#fff",
//             padding: "10px 20px",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//             transition: "0.3s",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//           }}
//           onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
//           onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
//         >
//           Save Note
//         </button>
//       </Box>
//     </Box>
//   );
// };

// export default NotesCanvas;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get URL params
import ReactQuill from "react-quill"; // Rich-text editor
import "react-quill/dist/quill.snow.css";
import Navbar from "../Components/Navbar"; // Import Navbar from Components
import { Box, Typography, Tooltip } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group"; // Icon for collaborators

const NotesCanvas = () => {
  const [content, setContent] = useState(""); // State for note content
  const [title, setTitle] = useState("Loading..."); // Placeholder for title
  const [tag, setTag] = useState(""); // Tag for note
  const [lastEdited, setLastEdited] = useState(""); // Last edited time
  const { id: noteId } = useParams(); // Extract noteId from URL

  // Fetch note data when component mounts
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5189/api/content/${noteId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch note");
        }
        const note = await response.json();
        setTitle(note.title || "Untitled Note");
        setContent(note.content || "");
        setTag(note.tag || "General");
        setLastEdited(note.lastEdited || new Date().toLocaleString());
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [noteId]);

  // const handleSave = async () => {
  //   console.log("Saving Note ID:", noteId);
  //   console.log("HTML Content:", content);

  //   const noteData = {
  //     noteId,
  //     title,
  //     tag,
  //     content,
  //   };

  //   try {
  //     const response = await fetch(`http://localhost:5189/api/notes/${noteId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(noteData),
  //     });

  //     if (response.ok) {
  //       console.log("Note saved successfully!");
  //       setLastEdited(new Date().toLocaleString()); // Update last edited time
  //     } else {
  //       console.error("Error saving note");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
    <Box
      sx={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar username="John Doe" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #555",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "16px", color: "#757575" }}
          >
            {tag}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Collaborators">
            <GroupIcon
              sx={{
                fontSize: "24px",
                color: "#fff",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { color: "#1976d2" },
              }}
            />
          </Tooltip>
          <Typography sx={{ fontSize: "16px", color: "#757575" }}>
            Last Edited: {lastEdited}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, padding: "20px" }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            height: "100%",
            border: "none",
            borderRadius: "8px",
          }}
        />
      </Box>

      <Box sx={{ textAlign: "center", padding: "20px", borderTop: "1px solid #555" }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          Save Note
        </button>
      </Box>
    </Box>
  );
};

export default NotesCanvas;