import { useNavigate } from "react-router-dom";

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
                className="navbar-logo"
                onClick={() => navigate("/splits")}
            >
                ENDURANCE
            </button>

        </nav>
    );
}

export default Navbar;