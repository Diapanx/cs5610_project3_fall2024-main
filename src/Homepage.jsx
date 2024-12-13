import axios from "axios";
import { useEffect, useState } from "react";
import './style/Homepage.css';
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
        <div>
            {statusUpdateState.map((statusUpdate) => (
                <div key={statusUpdate._id}>
                    <Link to={`/user/${statusUpdate.username}`}>{statusUpdate.username}</Link>
                    <div>Content: {statusUpdate.content}</div>
                    <div>Posted: {new Date(statusUpdate.created).toISOString().slice(0, 10)}</div>
                </div>
            ))}
        </div>
    );
}