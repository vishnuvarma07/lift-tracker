import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function SplitDaysPage() {
    const { splitId } = useParams();
    const [days, setDays] = useState([]);
    const [newDayName, setNewDayName] = useState("");

    
}