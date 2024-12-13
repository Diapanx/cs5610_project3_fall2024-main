import axios from "axios";
import { useEffect, useState } from "react";
import './style/style.css';
import { Link } from "react-router-dom";


export default function Homepage() {
    const [statusUpdateState, setStatusUpdateState] = useState([]);

    useEffect(() => {
        getStatusUpdate();
    }, []);

    async function getStatusUpdate() {
        try {
            const response = await axios.get('/api/statusUpdate');
            const sortedStatusUpdates = response.data.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sort by newest
            setStatusUpdateState(sortedStatusUpdates);
        } catch (error) {
            console.error('Error fetching status updates:', error);
        }
    }

    return (
        <div class="about-containers">
            {statusUpdateState.map((statusUpdate) => (
                <div key={statusUpdate._id} class="details-container color-container">
                    <div id="username"><Link to={`/user/${statusUpdate.username}`}>{statusUpdate.username}</Link></div>
                    <div class="text-container">{statusUpdate.content}</div>
                    <div id="footer">{new Date(statusUpdate.created).toISOString().slice(0, 10)}</div>
                </div>
            ))}
        </div>
    );
}