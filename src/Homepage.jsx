import axios from "axios";
import { useEffect, useState } from "react";
import './style/Homepage.css';
import { Link } from "react-router-dom";

export default function Homepage() {
    const [statusUpdateState, setStatusUpdateState] = useState([]);
    const [statusUpdateName, setStatusUpdateNameState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState(null);

    useEffect(() => {
        getStatusUpdate()
    }, []);

    async function getStatusUpdate() {
        const response = await axios.get('/api/statusUpdate')

        setStatusUpdateState(
            response.data
        )
    }

    const statusUpdateComponents = [];
    for(let i = 0; i < statusUpdateState.length; i++) {
        const statusUpdate = statusUpdateState[i];
        const newStatusUpdateComponent = (<div>
            <Link to={'/user/' + statusUpdate.username} >{statusUpdate.username}</Link>
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
        setErrorMsgState(null);

        const newStatusUpdate = {
            name: statusUpdateName,
        }

        if(!statusUpdateName) {
            setErrorMsgState('Please add valid StatusUpdate Name')
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
        {
            statusUpdateComponents
        }
    </div>);

}