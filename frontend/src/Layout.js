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
            {/* {userName ? <p>User Name: {userName}</p> : <p>You have not login!</p>}
            {userName ? <input type="button" value="logout" onClick={logout} /> : <></>} */}
            <Outlet />
        </div>
    )
}
