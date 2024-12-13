import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { redirect } from "react-router-dom";

export default function UserDetail() {
    const [userDetailsState, setUserDetailState] = useState(null);
    const [statusUpdateState, setStatusUpdateState] = useState([]);
    const [statusUpdateName, setStatusUpdateNameState] = useState('');

    const [errorState, setErrorState] = useState('');

    const params = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        getUserDetails()
        getStatusUpdate()
    }, []);

    // useEffect(() => {
    //     if (params.username) {
    //         getUserDetails();
    //     } else {
    //         setErrorState('Invalid user');
    //     }
    // }, [params.username]);

    async function getUserDetails() {
        try {
            const response = await axios.get('/api/user/' + params.username);
            setUserDetailState(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setErrorState('Unable to load user');
        }
    }

    if (errorState) {
        return <div>{errorState}</div>;
    }

    if (!userDetailsState) {
        return <div>Loading...</div>;
    }

    async function getStatusUpdate() {
        const response = await axios.get('/api/statusUpdate/' + params.username)

        setStatusUpdateState(
            response.data
        )
    }

    const statusUpdateComponents = [];
    for(let i = 0; i < statusUpdateState.length; i++) {
        const statusUpdate = statusUpdateState[i];
        const newStatusUpdateComponent = (<div>
            <Link to={'/statusUpdate/' + statusUpdate._id} >{statusUpdate.username}</Link>
            Content: {statusUpdate.content} 
            Posted: {statusUpdate.created}
         </div>)
        statusUpdateComponents.push(newStatusUpdateComponent)
    }


    function updateStatusUpdateName(event) {
        console.log(event.target.value);
        setStatusUpdateNameState(event.target.value);
    }

    async function createNewStatusUpdate() {

        const newStatusUpdate = {
            content: statusUpdateName,
        }

        if(!statusUpdateName) {
            setErrorMsgState('Please add valid StatusUpdate')
            return;
        }

        try {
            await axios.post('/api/statusUpdate', newStatusUpdate);
        } catch (error) {
            console.log(error)
            setErrorMsgState(error.response.data);
            return;
        }

        setStatusUpdateNameState('');
        
        await getStatusUpdate();
    }

    return (<div>
        <div>Name: {userDetailsState.username}</div>
        <div>Bio: {userDetailsState.bio}</div>
        <div>Join in: {userDetailsState.created}</div>
        <div>
            <h2>Add new StatusUpdate</h2>
            <input value={statusUpdateName} onChange={(event) => updateStatusUpdateName(event)}/>
            <div>
                <button onClick={() => createNewStatusUpdate()}>Create New StatusUpdate</button>
            </div>
        </div>
        {
            statusUpdateComponents
        }
    </div>)

    // return (<div>
    //     <h1>Show StatusUpdate Here</h1>
    //     <div>
    //         <h2>Add new StatusUpdate</h2>
    //         {errorMsgState && <div className="errorMessage">ERROR: {errorMsgState}</div>}
    //         <div>StatusUpdate Name:</div>
    //         <input value={statusUpdateName} onChange={(event) => updateStatusUpdateName(event)}/>
    //         <div>
    //             <button onClick={() => createNewStatusUpdate()}>Create New StatusUpdate</button>
    //         </div>
    //     </div>
    //     <h2>All StatusUpdate</h2>
    //     <button onClick={() => getStatusUpdate()}>Click here to get StatusUpdate</button>
    //     {
    //         statusUpdateComponents
    //     }
    // </div>);


}