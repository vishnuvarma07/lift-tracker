import { navigate, setParams } from "react-router-dom"

function DayPage() {
    const {splitId, dayID} = setParams();
    const navigate = useNavigate()

    return <div>
        <button onClick={() => navigate(`splits/${splitID}`)}>
            Back
        </button>

        <h1> Split Day </h1>
        
    </div>


}

export default DayPage;