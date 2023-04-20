import React from 'react'
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Layout({ userName, setUserName }) {
    const logout = () => {
        localStorage.removeItem("token")
        setUserName("")
        window.location = "/"
    }
    return (
        <div>
            {userName ? <p>User Name: {userName}</p> : <p>You have not login!</p>}
            {userName ? <input type="button" value="logout" onClick={logout} /> : <></>}
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/UserRegister">User Register</Link></li>
                <li><Link to="/UserLogin">User Login</Link></li>
                <li><Link to="/start">Start</Link></li>
            </ul>
            <Outlet />
        </div>
    )
}
