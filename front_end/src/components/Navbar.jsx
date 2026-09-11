import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ showBack = true }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">

            {showBack && (
                <button
                    className="navbar-back"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            )}

            <button
                className="navbar-logo-button"
                onClick={() => navigate("/splits")}
                aria-label="Go to dashboard"
            >
                <img
                    src="/endurancelogo.png"
                    alt="Endurance"
                    className="navbar-logo-image"
                />
            </button>

        </nav>
    );
}

export default Navbar;