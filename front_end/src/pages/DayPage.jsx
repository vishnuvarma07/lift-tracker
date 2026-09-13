import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import "./DayPage.css"

const API_URL = import.meta.env.VITE_API_URL;

function DayPage() {
    const { splitId, dayId } = useParams();
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [day, setDay] = useState(null);

    const [newExerciseName, setNewExerciseName] = useState("");
    const [targetSets, setTargetSets] = useState("");

    const [setData, setSetData] = useState({});
    const [previousSets, setPreviousSets] = useState([]);

    const [setCounts, setSetCounts] = useState({});

    useEffect(() => {
        const getPageData = async () => {
            const token = localStorage.getItem("token");

            const exerciseResponse = await fetch(
                `${API_URL}/splits/${splitId}/days/${dayId}/exercises`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!exerciseResponse.ok) {
                console.error("Could not load exercises");
                return;
            }

            const exerciseData = await exerciseResponse.json();

            setExercises(exerciseData.exercises);
            setDay(exerciseData.day);

            const initialSetCounts = {};

            exerciseData.exercises.forEach((exercise) => {
                initialSetCounts[exercise.id] = exercise.target_sets;
            });

            setSetCounts(initialSetCounts);

            const previousResponse = await fetch(
                `${API_URL}/splits/${splitId}/days/${dayId}/previous-workout`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!previousResponse.ok) {
                console.error("Could not load previous workout");
                return;
            }

            const previousData = await previousResponse.json();

            setPreviousSets(previousData.sets);
        };

        getPageData();
    }, [splitId, dayId]);

    const handleAddExercise = async (e) => {
        e.preventDefault();

        if (!newExerciseName.trim()) {
            alert("Enter an exercise name");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/splits/${splitId}/days/${dayId}/exercises`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newExerciseName,
                    target_sets: Number(targetSets)
                })
            }
        );

        if (!response.ok) {
            alert("Could not add exercise");
            return;
        }

        const newExercise = await response.json();

        setExercises([...exercises, newExercise]);
        setNewExerciseName("");
        setTargetSets(2);
    };

    const handleSetChange = (
        exerciseId,
        setNumber,
        field,
        value
    ) => {
        setSetData((previous) => ({
            ...previous,

            [exerciseId]: {
                ...previous[exerciseId],

                [setNumber]: {
                    ...previous[exerciseId]?.[setNumber],

                    [field]: value
                }
            }
        }));
    };

    const handleDeleteExercise = async (exerciseId) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/splits/${splitId}/days/${dayId}/exercises/${exerciseId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail || "Could not delete exercise");
            return;
        }

        setExercises(
            exercises.filter((exercise) => exercise.id !== exerciseId)
        );
    };

    const handleFinishWorkout = async () => {
        const token = localStorage.getItem("token");

        const workoutResponse = await fetch(
            `${API_URL}/workouts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    split_day_id: Number(dayId)
                })
            }
        );

        if (!workoutResponse.ok) {
            alert("Could not create workout");
            return;
        }

        const workout = await workoutResponse.json();

        for (const exercise of exercises) {
            const exerciseSets = setData[exercise.id];

            if (!exerciseSets) {
                continue;
            }

            for (const [setNumber, values] of Object.entries(exerciseSets)) {

                if (
                    values.weight === "" ||
                    values.reps === "" ||
                    values.weight === undefined ||
                    values.reps === undefined
                ) {
                    continue;
                }

                const response = await fetch(
                    `${API_URL}/sets`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            exercise_id: exercise.id,
                            workout_id: workout.id,
                            set_number: Number(setNumber),
                            weight: Number(values.weight),
                            reps: Number(values.reps)
                        })
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();

                    console.log(errorData);

                    alert(errorData.detail);

                    return;
                }
            }
        }

        alert("Workout saved!");
        setSetData({});
    };

    return (
        <div>
            
            <Navbar />

            <h1>{day?.name}</h1>

            {exercises.map((exercise) => (
                <div key={exercise.id}>

                    <div>
                        <h3>
                            {exercise.exercise_order}. {exercise.name}
                        </h3>

                        
                    </div>

                    {Array.from({ length: setCounts[exercise.id] ?? exercise.target_sets }).map((_, index) => {
                        const setNumber = index + 1;

                        const previousSet = previousSets.find(
                            (set) =>
                                set.exercise_id === exercise.id &&
                                set.set_number === setNumber
                        );

                        return (
                            <div key={index}>
                                <span className = "set-txt">
                                    Set {setNumber}
                                </span>

                                

                                <input
                                    type="number"
                                    placeholder="Weight"
                                    value={
                                        setData[exercise.id]?.[setNumber]?.weight ?? ""
                                    }
                                    className="weight-input"
                                    onChange={(e) =>
                                        handleSetChange(
                                            exercise.id,
                                            setNumber,
                                            "weight",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={
                                        setData[exercise.id]?.[setNumber]?.reps ?? ""
                                    }
                                    className="reps-input"
                                    onChange={(e) =>
                                        handleSetChange(
                                            exercise.id,
                                            setNumber,
                                            "reps",
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="prev-set-txt">
                                    {previousSet
                                        ? `Previous: ${previousSet.weight} x ${previousSet.reps}`
                                        : "Previous: —"}
                                </span>

                            </div>
                        );
                    })}

                    <button
                        type="button"
                        className="add-set-btn"
                        onClick={() => {
                            setSetCounts((previous) => ({
                                ...previous,
                                [exercise.id]:
                                    (previous[exercise.id] ?? exercise.target_sets) + 1
                            }));
                        }}
                    >
                        Add Set
                    </button>

                    <button
                        type="button"
                        className="remove-set-btn"
                        onClick={() => {
                            setSetCounts((previous) => ({
                                ...previous,
                                [exercise.id]: Math.max(
                                    1,
                                    (previous[exercise.id] ?? exercise.target_sets) - 1
                                )
                            }));
                        }}
                    >
                        Remove Set
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDeleteExercise(exercise.id)}
                    >
                        Delete Exercise
                    </button>

                </div>
            ))}

            <button
                onClick={handleFinishWorkout}
                style={{
                    backgroundColor: "green",
                    color: "white"
                }}
                className="finish-workout-btn"
            >
                Finish Workout
            </button>

            <form onSubmit={handleAddExercise}>
                <input
                    type="text"
                    value={newExerciseName}
                    onChange={(e) =>
                        setNewExerciseName(e.target.value)
                    }
                    placeholder="Exercise Name"
                    className="add-exercise-name"
                />

                <input
                    type="number"
                    min="1"
                    value={targetSets}
                    onChange={(e) =>
                        setTargetSets(Number(e.target.value))
                    }
                    placeholder="Sets"
                    className="add-exercise-sets"
                />

                <button type="submit" className="add-exercise-btn">
                    Add Exercise
                </button>
            </form>

        </div>
    );
}

export default DayPage;