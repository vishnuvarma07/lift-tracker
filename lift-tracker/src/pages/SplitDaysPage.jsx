import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function SplitDaysPage() {
    const { splitId } = useParams();
    const navigate = useNavigate();

    const [days, setDays] = useState([]);
    const [newDayName, setNewDayName] = useState("");

    useEffect(() => {
        const getDays = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/splits/${splitId}/days`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                alert("Could not load split days.");
                return;
            }

            const data = await response.json();
            setDays(data);
        };

        getDays();
    }, [splitId]);

    const handleAddDay = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/splits/${splitId}/days`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newDayName
                })
            }
        );

        if (!response.ok) {
            alert("Could not add day.");
            return;
        }

        const newDay = await response.json();

        setDays([...days, newDay]);
        setNewDayName("");
    };

    return (
        <div>
            <h1>Split Days</h1>

            {days.map((day) => (
                <button
                    key={day.id}
                    onClick={() =>
                        navigate(`/splits/${splitId}/days/${day.id}`)
                    }
                >
                    {day.name}
                </button>
            ))}

            <form onSubmit={handleAddDay}>
                <input
                    type="text"
                    value={newDayName}
                    onChange={(e) => setNewDayName(e.target.value)}
                    placeholder="Day Name"
                />

                <button type="submit">
                    Add Day
                </button>
            </form>
        </div>
    );
}

export default SplitDaysPage;