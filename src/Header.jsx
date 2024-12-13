import React, { useState, useEffect } from 'react';
import './style/Header.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await axios.get('/api/user/isLoggedIn', { withCredentials: true });
        setUsername(response.data); // Assume the API returns the username when logged in
      } catch (error) {
        console.error('Error fetching username:', error);
        setUsername(null); // No user logged in
      }
    }

    fetchUsername();

    // Add event listener for custom auth change events
    const handleAuthChange = () => fetchUsername();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange); // Clean up the listener
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logOutUser = async () => {
    try {
      await axios.post('/api/user/logout', {}, { withCredentials: true });
      setUsername(null); // Update state to reflect logged-out status
      window.dispatchEvent(new Event('authChange')); // Notify other components
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav>
      <ul>
        <li><Link className='nav-link' to="/">Home</Link></li>
        {username ? (
          <>
            <li className="dropdown">
              <button className="btn nav-link" onClick={toggleDropdown}>
                {username}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-content">
                  <li><Link className='option' to={`/user/${username}`} onClick={toggleDropdown}>My Profile</Link></li>
                  <li>
                    <Link
                      className='option'
                      to="/"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation if needed
                        logOutUser();
                        toggleDropdown();
                      }}
                    >
                      Log Out
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li><Link className='nav-link' to="/signup">Sign Up</Link></li>
            <li><Link className='nav-link' to="/login">Log In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}