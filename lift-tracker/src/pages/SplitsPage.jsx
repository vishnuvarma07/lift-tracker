import { useEffect, useState } from "react";

function SplitsPage() {
    const [splits, setSplits] = useState([]);

    useEffect(() => {
        const getSplits = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8000/splits", {
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

    return (
        <div>
            <h1>My Splits</h1>

            {splits.map((split) => (
                <div key={split.id}>
                    <h2>{split.name}</h2>
                </div>
            ))}
        </div>
    );
}

export default SplitsPage;