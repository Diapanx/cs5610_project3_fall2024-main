import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const navigate = useNavigate();

    function onInputUsername(event) {
        setUsernameState(event.target.value);
    }

    function onInputPassword(event) {
        setPasswordState(event.target.value);
    }

    async function onSubmit() {
        try {
            const response = await axios.post('/api/user/signup', {
                username: usernameState, 
                password: passwordState
            }, { withCredentials: true });

            console.log('Signup successful:', response.data);

            // Dispatch the authChange event to update the header
            window.dispatchEvent(new Event('authChange'));

            // Redirect to the homepage
            navigate('/');
        } catch (error) {
            console.error('Error during signup:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <div>
            <h1>Signup Page</h1>
            <div>
                <h3>Username:</h3>
                <input value={usernameState} onChange={onInputUsername}></input>
            </div>
            <div>
                <h3>Password:</h3>
                <input type="password" value={passwordState} onChange={onInputPassword}></input>
            </div>
            <button onClick={onSubmit}>Click here to sign up</button>
        </div>
    );
}