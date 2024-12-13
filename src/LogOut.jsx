import axios from "axios";
import { useEffect, useState } from "react";
import './style/Homepage.css';
import { Link } from "react-router-dom";

export default function IsLoggedIn() {
    useEffect(() => {
        logOutUser()
    }, []);

    async function logOutUser() {
        const response = await axios.post('/api/user/logout')
    }

    return (<div>
        <h1>User is logged out.</h1>

    </div>)


}