import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function UserDetail() {
    const [userDetailsState, setUserDetailState] = useState(null);
    const [statusUpdateState, setStatusUpdateState] = useState([]);
    const [statusUpdateName, setStatusUpdateNameState] = useState('');
    const [errorState, setErrorState] = useState('');

    const params = useParams();

    useEffect(() => {
        getUserDetails();
        getStatusUpdate();
    }, []);

    async function getUserDetails() {
        try {
            const response = await axios.get('/api/user/' + params.username);
            setUserDetailState(response.data[0]); // Assume backend returns an array
        } catch (error) {
            console.error('Error fetching user details:', error);
            setErrorState('Unable to load user');
        }
    }

    async function getStatusUpdate() {
        try {
            const response = await axios.get('/api/statusUpdate/user/' + params.username);
            const sortedStatusUpdates = response.data.sort((a, b) => new Date(b.created) - new Date(a.created)); // Sort by newest
            setStatusUpdateState(sortedStatusUpdates); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching status updates:', error);
            setStatusUpdateState([]); // Clear state if there's an error
        }
    }

    async function createNewStatusUpdate() {
        if (!statusUpdateName) {
            setErrorState('Please add valid StatusUpdate');
            return;
        }

        try {
            await axios.post('/api/statusUpdate', { content: statusUpdateName });
            setStatusUpdateNameState(''); // Clear input
            getStatusUpdate(); // Refresh status updates
        } catch (error) {
            console.error('Error creating new status update:', error);
            setErrorState('Error creating new status update');
        }
    }

    if (errorState) {
        return <div>{errorState}</div>;
    }

    if (!userDetailsState) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>Name: {userDetailsState.username}</div>
            <div>Bio: {userDetailsState.bio}</div>
            <div>Join in: {new Date(userDetailsState.created).toISOString().slice(0, 10)}</div>
            <div>
                <h2>Add new StatusUpdate</h2>
                <input
                    value={statusUpdateName}
                    onChange={(event) => setStatusUpdateNameState(event.target.value)}
                />
                <div>
                    <button onClick={createNewStatusUpdate}>Create New StatusUpdate</button>
                </div>
            </div>
            {statusUpdateState.length > 0 ? (
                statusUpdateState.map((statusUpdate) => (
                    <div key={statusUpdate._id}>
                        <Link to={`/statusUpdate/${statusUpdate._id}`}>{statusUpdate.username}</Link>
                        <div>Content: {statusUpdate.content}</div>
                        <div>Posted: {new Date(statusUpdate.created).toISOString().slice(0, 10)}</div>
                    </div>
                ))
            ) : (
                <div>No status updates found.</div>
            )}
        </div>
    );
}