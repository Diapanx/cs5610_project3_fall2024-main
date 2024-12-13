import axios from "axios";
import { useEffect, useState } from "react";
import './style/Homepage.css';
import { Link } from "react-router-dom";

export default function Signup() {
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const navigate = useNavigate();

    function onInputUsername(event) {
        const username = event.target.value;
        setUsernameState(username);        
    }

    function onInputPassword(event) {
        const password = event.target.value;
        setPasswordState(password);        
    }

    async function onSubmit() {
        const response = await axios.post('/api/user/signup', {
            username: usernameState, 
            password: passwordState
        })
        navigate('/');

    }

    return (<div>
        <h1>Signup Page</h1>
        <div>
            <h3>Username:</h3>
            <input value={usernameState} onChange={(event) => onInputUsername(event)}></input>
        </div>
        <div>
            <h3>Password:</h3>
            <input type='password' value={passwordState} onChange={(event) => onInputPassword(event)}></input>
        </div>
        <button onClick={() => onSubmit()}>Click here to login</button>
    </div>)


}