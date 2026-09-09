import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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
        } else {
            alert("Registration failed. Please try again.");
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData,
        });

        if(!response.ok) {
            alert("Login failed. Please try again.");
            setUsername("");
            setPassword("");
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.access_token);

        navigate("/splits");
    }

    return (
        <div>
            <h1>Lift Tracker</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
                <button type="button" onClick={handleRegister}>Register</button>
            </form>
        </div>
    )
        
}

export default AuthPage;