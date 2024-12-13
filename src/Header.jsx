import React, { useState } from 'react';
import './style/Header.css';
import { Link } from 'react-router-dom';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav>
      <ul>
        <li><Link className='nav-link' to="/">Home</Link></li>
        <li className="dropdown">
          <button className="btn nav-link" onClick={toggleDropdown}>
            User
          </button>
          {dropdownOpen && (
            <ul className="dropdown-content">
              <li><Link className='option' to="/login" onClick={toggleDropdown}>Log In</Link></li>
              <li><Link className='option' to="/signup" onClick={toggleDropdown}>Sign Up</Link></li>
              <li><Link className='option' to="/logout" onClick={toggleDropdown}>Log Out</Link></li>
            </ul>
          )}
        </li>
        <li><Link className='nav-link' to="/isLoggedIn">Current User</Link></li>
      </ul>
    </nav>
  );
}