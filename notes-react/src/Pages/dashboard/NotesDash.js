import React, { useState, useEffect } from "react";

const NotesDash = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notes from the API
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:5189/api/notes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setNotes(result);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to fetch notes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>Loading notes...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
                <p>{error}</p>
            </div>
        );
    }

    // Empty notes state
    if (notes.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>No notes available. Click "Add Note" to create your first note!</p>
            </div>
        );
    }

    // Render notes
    return (
        <div style={{ padding: "20px" }}>
            <h1>Notes Dashboard</h1>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {notes.map((note, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: "10px",
                            padding: "15px",
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                        }}
                    >
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesDash;