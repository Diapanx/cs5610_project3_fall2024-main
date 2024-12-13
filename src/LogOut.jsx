import axios from "axios";
import { useEffect } from "react";
import './style/Homepage.css';
import { useNavigate } from "react-router-dom";

export default function IsLoggedIn() {
    const navigate = useNavigate();

    useEffect(() => {
        logOutUser();
    }, []);

    async function logOutUser() {
        try {
            await axios.post('/api/user/logout', {}, { withCredentials: true });
            console.log('User logged out successfully');
            navigate('/'); // Redirect to the homepage after logout
        } catch (error) {
            console.error('Error logging out:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <h1>User is logged out.</h1>
        </div>
    );
}