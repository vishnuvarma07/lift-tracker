import { useNavigate, useParams } from "react-router-dom"
import {useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

function DayPage() {
    const {splitId, dayId} = useParams();
    const navigate = useNavigate()

    const [exercises, setExercises] = useState([])
    const [day, setDay] = useState(null)
    const [newExerciseName, setNewExerciseName] = useState("")

    useEffect(() => {
        const getExercises = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/splits/${splitId}/days/${dayId}/exercises`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("response status:", response.status);

            if (!response.ok) {
                console.error("Could not load exercises");
                return;
            }

            const data = await response.json();

            console.log("data:", data);

            setExercises(data.exercises);
            setDay(data.day);
        };

        getExercises();
    }, [splitId, dayId]);

    const handleAddExercise = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")

        const response = await fetch(
            `${API_URL}/splits/${splitId}/days/${dayId}/exercises`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    exercise: newExerciseName
                })
            }
        );

        if(!response.ok) {
            alert("Could not add exercise")
            return;
        }

        const newExercise = await response.json()
        setExercises([...exercises, newExercise]);
        setNewExerciseName("")

    }

    return <div>
        <button onClick={() => navigate(`/splits/${splitId}`)}>
            Back
        </button>

        <h1> {day?.name} </h1>

        {exercises.map((exercise) => (
            <div key={exercise.id}>

                <h3>
                    {exercise.exercise_order}. {exercise.name}
                </h3>

                {Array.from({ length: exercise.target_sets }).map((_, index) => (
                    <div key={index}>
                        <span>Set {index + 1}</span>

                        <input
                            type="number"
                            placeholder="Weight"
                        />

                        <input
                            type="number"
                            placeholder="Reps"
                        />
                    </div>
                ))}

            </div>
        ))}

        <form onSubmit={handleAddExercise}>
            <input
                type="text"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Exercise Name"
            />

            <button type="submit">
                Add Exercise
            </button>
        </form>

    </div>


}

export default DayPage;