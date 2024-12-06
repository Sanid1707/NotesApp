

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom"; // Import useParams to get URL params
// import ReactQuill from "react-quill"; // Rich-text editor
// import "react-quill/dist/quill.snow.css";
// import Navbar from "../Components/Navbar"; // Import Navbar from Components
// import { Box, Typography, Tooltip } from "@mui/material";
// import GroupIcon from "@mui/icons-material/Group"; // Icon for collaborators

// const NotesCanvas = () => {
//   const [content, setContent] = useState(""); // State for note content
//   const [title, setTitle] = useState("Loading..."); // Placeholder for title
//   const [tag, setTag] = useState(""); // Tag for note
//   const [lastEdited, setLastEdited] = useState(""); // Last edited time
//   const { id: noteId } = useParams(); // Extract noteId from URL

//   // Fetch note data when component mounts
//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const response = await fetch(`http://localhost:5189/api/notes/${noteId}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch note");
//         }
//         const note = await response.json();
//         setTitle(note.title || "Untitled Note");
//         setContent(note.content || "");
//         setTag(note.tag || "General");
//         setLastEdited(note.lastEdited || new Date().toLocaleString());
//       } catch (error) {
//         console.error("Error fetching note:", error);
//       }
//     };

//     fetchNote();
//   }, [noteId]);

//   const handleSave = async () => {
//     console.log("Saving Note ID:", noteId);
//     console.log("HTML Content:", content);

//     const noteData = {
//       noteId,
//       title,
//       tag,
//       content,
//     };

//     try {
//       const response = await fetch(`http://localhost:5189/api/notes/${noteId}`, {
//         method: "PUT",
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

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ script: "sub" }, { script: "super" }],
//       [{ align: [] }],
//       ["blockquote", "code-block"],
//       ["link", "image", "video"],
//       [{ color: [] }, { background: [] }],
//       ["clean"],
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
//       <Navbar username="John Doe" />

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
//           <Typography
//             variant="h4"
//             sx={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}
//           >
//             {title}
//           </Typography>
//           <Typography
//             variant="subtitle1"
//             sx={{ fontSize: "16px", color: "#757575" }}
//           >
//             {tag}
//           </Typography>
//         </Box>
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
//           <Typography sx={{ fontSize: "16px", color: "#757575" }}>
//             Last Edited: {lastEdited}
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ flex: 1, padding: "20px" }}>
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

//       <Box sx={{ textAlign: "center", padding: "20px", borderTop: "1px solid #555" }}>
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
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//           }}
//         >
//           Save Note
//         </button>
//       </Box>
//     </Box>
//   );
// };

// export default NotesCanvas;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For extracting noteId from URL
import ReactQuill from "react-quill"; // Rich-text editor
import "react-quill/dist/quill.snow.css";
import Navbar from "../Components/Navbar"; // Navbar Component
import { Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group"; // Icon for collaborators

const NotesCanvas = () => {
  const { noteId } = useParams(); // Extract noteId from the URL
  const [content, setContent] = useState(""); // State for note content
  const [title, setTitle] = useState(""); // State for note title
  const [tag, setTag] = useState(""); // State for note tag
  const [lastEdited, setLastEdited] = useState(""); // Last edited timestamp
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch content when the component mounts
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5189/api/content/${noteId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch content.");
        }
        const data = await response.json();
        setContent(data.formattedContent);
        setTitle(data.title || "Untitled Note");
        setTag(data.contentType || "General");
        setLastEdited(new Date(data.updatedAt).toLocaleString());
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [noteId]);

  // Handle saving the updated content
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5189/api/content/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formattedContent: content,
          contentType: tag || "General",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content.");
      }

      const updatedContent = await response.json();
      setLastEdited(new Date(updatedContent.updatedAt).toLocaleString());
      console.log("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  // ReactQuill toolbar configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ align: [] }],
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
      {/* Navbar */}
      <Navbar username="John Doe" />

      {/* Title and Metadata */}
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
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "5px",
            }}
          >
            {title || "Untitled Note"}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "16px",
              color: "#757575",
            }}
          >
            {tag || "General"}
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
            Last Edited: {lastEdited || "N/A"}
          </Typography>
        </Box>
      </Box>

      {/* Content Editor */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      ) : (
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
      )}

      {/* Save Button */}
      <Box
        sx={{
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid #555",
        }}
      >
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
            transition: "0.3s",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1565c0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          Save Note
        </button>
      </Box>
    </Box>
  );
};

export default NotesCanvas;