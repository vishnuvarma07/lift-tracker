import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function SplitsPage() {
    const [splits, setSplits] = useState([]);
    const [newSplitName, setNewSplitName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getSplits = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/splits`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                alert("Could not load splits.");
                return;
            }

            const data = await response.json();
            setSplits(data);
        };

        getSplits();
    }, []);

    const handleAddSplit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/splits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({ name: newSplitName }),
        });

        if(!response.ok) {
            alert("Could not add split.");
            return;
        }

        const newSplit = await response.json();
        setSplits([...splits, newSplit]);
        setNewSplitName("");

    };

    return (
        <div>
            <h1>My Splits</h1>

            {splits.map((split) => (
                <button key={split.id} onClick={() => navigate(`/splits/${split.id}`)}>
                    {split.name}
                </button>
            ))}

            <form onSubmit={handleAddSplit}>
                <input
                    type="text"
                    value={newSplitName}
                    onChange={(e) => setNewSplitName(e.target.value)}
                    placeholder="Split Name"
                />
                <button type="submit">Add Split</button>
            </form>
        </div>
    );
}

export default SplitsPage;