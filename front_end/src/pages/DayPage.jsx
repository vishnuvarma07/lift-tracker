import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function DayPage() {
    const { splitId, dayId } = useParams();
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [day, setDay] = useState(null);

    const [newExerciseName, setNewExerciseName] = useState("");
    const [targetSets, setTargetSets] = useState(2);

    const [setData, setSetData] = useState({});
    const [previousSets, setPreviousSets] = useState([]);

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
                    target_sets: targetSets
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
            <button onClick={() => navigate(`/splits/${splitId}`)}>
                Back
            </button>

            <h1>{day?.name}</h1>

            {exercises.map((exercise) => (
                <div key={exercise.id}>

                    <h3>
                        {exercise.exercise_order}. {exercise.name}
                    </h3>

                    {Array.from({ length: exercise.target_sets }).map((_, index) => {
                        const setNumber = index + 1;

                        const previousSet = previousSets.find(
                            (set) =>
                                set.exercise_id === exercise.id &&
                                set.set_number === setNumber
                        );

                        return (
                            <div key={index}>
                                <span>
                                    Set {setNumber}
                                </span>

                                

                                <input
                                    type="number"
                                    placeholder="Weight"
                                    value={
                                        setData[exercise.id]?.[setNumber]?.weight ?? ""
                                    }
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
                                    onChange={(e) =>
                                        handleSetChange(
                                            exercise.id,
                                            setNumber,
                                            "reps",
                                            e.target.value
                                        )
                                    }
                                />

                                <span>
                                    {previousSet
                                        ? `Previous: ${previousSet.weight} x ${previousSet.reps}`
                                        : "Previous: —"}
                                </span>

                            </div>
                        );
                    })}

                </div>
            ))}

            <form onSubmit={handleAddExercise}>
                <input
                    type="text"
                    value={newExerciseName}
                    onChange={(e) =>
                        setNewExerciseName(e.target.value)
                    }
                    placeholder="Exercise Name"
                />

                <input
                    type="number"
                    min="1"
                    value={targetSets}
                    onChange={(e) =>
                        setTargetSets(Number(e.target.value))
                    }
                    placeholder="Sets"
                />

                <button type="submit">
                    Add Exercise
                </button>
            </form>

            <button
                onClick={handleFinishWorkout}
                style={{
                    backgroundColor: "green",
                    color: "white"
                }}
            >
                Finish Workout
            </button>
        </div>
    );
}

export default DayPage;