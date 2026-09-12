import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function RegistrationPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            alert("Registration successful! Please log in.");
            setUsername("");
            setPassword("");
            navigate("/")
        } else {
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <br />
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <br />
            <button onClick={() => navigate("/")}>
                Back to login
            </button>
        </div>
    )
}

export default RegistrationPage;