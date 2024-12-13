import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const navigate = useNavigate();

  async function onSubmit() {
    try {
      const response = await axios.post('/api/user/login', {
        username: usernameState,
        password: passwordState
      }, { withCredentials: true });
      console.log('Login successful:', response.data);
      // Trigger "authChange" event
      window.dispatchEvent(new Event('authChange'));
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <h3>Username:</h3>
        <input value={usernameState} onChange={(e) => setUsernameState(e.target.value)} />
      </div>
      <div>
        <h3>Password:</h3>
        <input type="password" value={passwordState} onChange={(e) => setPasswordState(e.target.value)} />
      </div>
      <button onClick={onSubmit}>Click here to login</button>
    </div>
  );
}