import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import './style/style.css';

export default function UserDetail() {
    const [userDetailsState, setUserDetailState] = useState(null);
    const [statusUpdateState, setStatusUpdateState] = useState([]);
    const [statusUpdateName, setStatusUpdateNameState] = useState('');
    const [errorState, setErrorState] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [editBioState, setEditBioState] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingPostContent, setEditingPostContent] = useState('');
    const [isCreatingPost, setIsCreatingPost] = useState(false);

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
            const response = await axios.put('/api/user/' + params.username, { bio: editBioState });
            setUserDetailState({ ...userDetailsState, bio: editBioState });
            setIsEditingBio(false); // Exit edit mode
        } catch (error) {
            console.error('Error updating bio:', error);
            setErrorState('Error updating bio');
        }
    }

    async function updatePost(postId) {
        try {
            await axios.put(`/api/statusUpdate/${postId}`, { content: editingPostContent });
            setStatusUpdateState((prevState) =>
                prevState.map((post) =>
                    post._id === postId ? { ...post, content: editingPostContent } : post
                )
            );
            setEditingPostId(null); // Exit edit mode for the post
        } catch (error) {
            console.error('Error updating post:', error);
            setErrorState('Error updating post');
        }
    }

    async function deletePost(postId) {
        try {
            await axios.delete(`/api/statusUpdate/${postId}`, { withCredentials: true });
            setStatusUpdateState((prevState) => prevState.filter((post) => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            setErrorState('Error deleting post');
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
            setIsCreatingPost(false); // Hide the input box
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
            <h1 class="title">{userDetailsState.username}</h1>
            <div id="join">Joined in: {new Date(userDetailsState.created).toISOString().slice(0, 10)}</div>
            {/* Editable Bio Section */}
            <div class="about-containers">
            <div>
                
                {loggedInUsername === params.username && isEditingBio ? (
                    <div class='edit'>
                        <textarea className="custom-input-2"
                            value={editBioState}
                            onChange={(event) => setEditBioState(event.target.value)}
                        />
                        <div>
                            <button onClick={updateBio} class="btn btn-color-2 project-btn">Save</button>
                            <button onClick={() => setIsEditingBio(false)} class="btn btn-color-2 project-btn">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div id="bio">
                        <p class="section__text__p1">{userDetailsState.bio}</p>
                        {loggedInUsername === params.username && (
                            <button onClick={() => setIsEditingBio(true)} className="image-btn">
                            <img 
                              src="../public/edit.png" 
                              alt="Edit bio" 
                              style={{ width: '15px', height: '15px' }} 
                            />
                          </button>
                        )}
                    </div>
                )}
            </div>
            {/* Only show the input box for new posts if the logged-in user matches the user being viewed */}
            {loggedInUsername === params.username && (
                <div>
                {!isCreatingPost ? (
                    <button onClick={() => setIsCreatingPost(true)} className="add-post-btn">
                    <img 
                      src="../public/plus.png" 
                      alt="Add post" 
                      style={{ width: '27px', height: '27px' }} 
                    /></button>
                ) : (
                    <div class='edit'>
                        <h2>Add new post</h2>
                        <textarea className="custom-input-2"
                            value={statusUpdateName}
                            onChange={(event) => setStatusUpdateNameState(event.target.value)}
                        />
                        <div>
                            <button onClick={createNewStatusUpdate} class="btn btn-color-2 project-btn">Create</button>
                            <button onClick={() => setIsCreatingPost(false)} class="btn btn-color-2 project-btn">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            )}
            {statusUpdateState.length > 0 ? (
                statusUpdateState.map((statusUpdate) => (
                    <div key={statusUpdate._id} class="details-container color-container">
                        <div class='top-line'>
                        <div id="username">{statusUpdate.username}</div>
                        {loggedInUsername === params.username && editingPostId !== statusUpdate._id && (
                                    <div class="btn-container">
                                        <button class="btn btn-color-2 project-btn" onClick={() => deletePost(statusUpdate._id)}className="image-btn">
                            <img 
                              src="../public/garbage.png" 
                              alt="Delete post" 
                              style={{ width: '15px', height: '15px' }} 
                            /></button>
                                        <button class="btn btn-color-2 project-btn"
                                            onClick={() => {
                                                setEditingPostId(statusUpdate._id);
                                                setEditingPostContent(statusUpdate.content);
                                            }}
                                            className="image-btn">
                                            <img 
                                              src="../public/edit.png" 
                                              alt="Edit post" 
                                              style={{ width: '15px', height: '15px' }} 
                                            />
                                        </button>
                                    </div>
                                )}
                        </div>
                        {editingPostId === statusUpdate._id ? (
                            <div>
                                <textarea className="custom-input-2"
                                    value={editingPostContent}
                                    onChange={(event) => setEditingPostContent(event.target.value)}
                                />
                                <div>
                                    <button class="btn btn-color-2 project-btn" onClick={() => updatePost(statusUpdate._id)}>Save</button>
                                    <button class="btn btn-color-2 project-btn" onClick={() => setEditingPostId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div class="text-container">{statusUpdate.content}</div>
                                <div id='footer'>{new Date(statusUpdate.created).toISOString().slice(0, 10)}</div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div>No status updates found.</div>
            )}
            </div>
        </div>
    );
}