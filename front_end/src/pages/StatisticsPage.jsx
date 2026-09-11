import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL

function StatisticsPage(){
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if(!response.ok){
                alert("Could not load stats");
                return;
            }

            const data = await response.json();

            setStats(data);
        };
        getStats();
    },[]);

    return (
        <div>
            <Navbar />

            <h1> 
                Statistics
            </h1>

            {stats && (
                <div>
                    <h2>
                        Total Workouts: {stats.total_workouts}
                    </h2>

                    <h2>
                        Total Sets: {stats.total_sets}
                    </h2>

                    <h2>
                        Total Volume: {stats.total_volume} lb
                    </h2>
                </div>
            )}
        </div>
    );
}

export default StatisticsPage;