
import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../Components/Navbar";
import { Box, Typography, Tooltip, CircularProgress ,IconButton} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotesCanvas = () => {
  const [content, setContent] = useState(""); // HTML content
  const [title, setTitle] = useState("Loading..."); // Note title
  const [tag, setTag] = useState("General"); // Content type
  const [lastEdited, setLastEdited] = useState(""); // Last edited timestamp
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const { id: noteId } = useParams(); // Extract noteId from URL
  const navigate = useNavigate();
  

  // Fetch note content on component mount
  useEffect(() => {
    const fetchNoteContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/content/${noteId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch note content");
        }

        const result = await response.json();
        const data = result.data;

        // Set state with response data
        setTitle(data.noteTitle || "Untitled Note");
        setContent(data.formattedContent || "");
        setTag(data.tag || "General");
        setLastEdited(new Date(data.updatedAt).toLocaleString());
      } catch (error) {
        console.error("Error fetching note content:", error);
        setTitle("Error Loading Note");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteContent();
  }, [noteId]);

  // Save note content to backend
  const handleSave = async () => {
    try {
      const payload = {
        formattedContent: content,
        contentType: tag,
      };

      const response = await fetch(`http://ec2-51-20-142-84.eu-north-1.compute.amazonaws.com:80/api/content/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      const updatedData = await response.json();
      setLastEdited(new Date(updatedData.data.updatedAt).toLocaleString());
      console.log("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  // ReactQuill editor toolbar configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
    <Box
      sx={{
        background: `url('../../../public/images/AuthBg1.jpg') no-repeat center center fixed`,
        backgroundSize: "cover",
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "10px 20px",
        borderBottom: "1px solid #333",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        gap: "16px",
      }}
    >
      {/* Back Arrow Button */}
      <IconButton
        onClick={() => navigate(-1)} // Use navigate to go back
        sx={{
          color: "#fff",
          "&:hover": {
            color: "#1976d2",
          },
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      {/* Title and Tag */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#bdbdbd", fontSize: "14px" }}>
          {tag}
        </Typography>
      </Box>
    </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Collaborators">
            <GroupIcon
              sx={{
                fontSize: "24px",
                color: "#fff",
                cursor: "pointer",
                "&:hover": { color: "#1976d2" },
              }}
            />
          </Tooltip>
          <Typography sx={{ fontSize: "16px", color: "#bdbdbd" }}>
            Last Edited: {lastEdited || "N/A"}
          </Typography>
        </Box>
      </Box>

      {/* Content Editor */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
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
              backgroundColor: "#121212", // Dark theme background
              color: "#e0e0e0", // Light text color for contrast
              height: "70vh",
              border: "1px solid #333", // Border matching dark theme
              borderRadius: "8px",
              padding: "1px",
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
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

