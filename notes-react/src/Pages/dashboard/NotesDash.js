//make a template of a react page for me 


const NotesDash = () => {

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // make a an API call to get notes
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
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchNotes();
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    // if notes is empty
    if (notes.length === 0) {
        return( 
        <div>add note</div>);
    }

    


    return (
        <div>
            <h1>Notes Dashboard</h1>
        </div>

    );
}

export default NotesDash;