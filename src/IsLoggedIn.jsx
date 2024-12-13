import axios from "axios";
import { useEffect, useState } from "react";
import './style/Homepage.css';
import { Link } from "react-router-dom";

export default function IsLoggedIn() {
    const [usernameState, setUsernameState] = useState('');

    useEffect(() => {
        checkLoggedIn()
    }, []);

    async function checkLoggedIn() {
        try {
            const response = await axios.get('/api/user/isLoggedIn', { withCredentials: true });
            setUsernameState(response.data);
            console.log('Logged-in user:', response.data);
        } catch (error) {
            console.error('Error checking logged-in status:', error.response ? error.response.data : error.message);
            setUsernameState('');
        }
    }

    return (
        <div>
            {usernameState ? (
                <h1>{usernameState} is logged in.</h1>
            ) : (
                <h1>No user is logged in.</h1>
            )}
        </div>
    );


}