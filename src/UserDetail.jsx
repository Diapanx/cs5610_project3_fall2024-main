import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function UserDetail() {
    const [userDetailsState, setUserDetailState] = useState(null);
    const [statusUpdateState, setStatusUpdateState] = useState([]);
    const [statusUpdateName, setStatusUpdateNameState] = useState('');
    const [errorState, setErrorState] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [editBioState, setEditBioState] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);

    const params = useParams();

    useEffect(() => {
        getUserDetails();
        getStatusUpdate();
        fetchLoggedInUsername();
    }, []);

    async function getUserDetails() {
        try {
            const response = await axios.get('/api/user/' + params.username);
            const user = response.data[0]; // Assume backend returns an array
            setUserDetailState(user);
            setEditBioState(user.bio); // Initialize bio edit field
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

    async function fetchLoggedInUsername() {
        try {
            const response = await axios.get('/api/user/isLoggedIn', { withCredentials: true });
            setLoggedInUsername(response.data); // Assume the API returns the logged-in username
        } catch (error) {
            console.error('Error fetching logged-in username:', error);
            setLoggedInUsername(null);
        }
    }

    async function updateBio() {
        try {
            // console.log('Updating bio for:', params.username);
            // console.log('New bio:', editBioState);
    
            const response = await axios.put('/api/user/' + params.username, { bio: editBioState });
            setUserDetailState({ ...userDetailsState, bio: editBioState });
            setIsEditingBio(false); // Exit edit mode
        } catch (error) {
            console.error('Error updating bio:', error);
            setErrorState('Error updating bio');
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

            {/* Editable Bio Section */}
            <div>
                <h3>Bio:</h3>
                {loggedInUsername === params.username && isEditingBio ? (
                    <div>
                        <textarea
                            value={editBioState}
                            onChange={(event) => setEditBioState(event.target.value)}
                        />
                        <button onClick={updateBio}>Save</button>
                        <button onClick={() => setIsEditingBio(false)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p>{userDetailsState.bio}</p>
                        {loggedInUsername === params.username && (
                            <button onClick={() => setIsEditingBio(true)}>Edit Bio</button>
                        )}
                    </div>
                )}
            </div>

            <div>Join in: {new Date(userDetailsState.created).toISOString().slice(0, 10)}</div>

            {/* Only show the input and button for creating a post if the logged-in user matches the user being viewed */}
            {loggedInUsername === params.username && (
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
            )}

            {statusUpdateState.length > 0 ? (
                statusUpdateState.map((statusUpdate) => (
                    <div key={statusUpdate._id}>
                        <div>{statusUpdate.username}</div>
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