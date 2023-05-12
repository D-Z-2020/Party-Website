import React from 'react'
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import logo from "./assets/logo.png";

export default function Layout({ userName, setUserName }) {
    const logout = () => {
        localStorage.removeItem("token")
        setUserName("")
        window.location = "/"
    }
    return (
        <div>
            <nav className="navbar bg-light" id="header">
                <div className="container-fluid">
                    <div className="d-flex">
                        <img src={logo} alt="Logo" width="120" height="48" />
                    </div>
                    {/* <div className="d-flex">
                        {userName ? (
                            <p>Welcome, user {userName}</p>
                        ) : (
                            <p>You have not login!</p>
                        )}
                    </div> */}
                    <div className="d-flex" style={{minWidth:"100px"}}>
                        {userName ? (
                            <input
                                type="button"
                                className="btn btn-outline-secondary"
                                value="Logout"
                                onClick={logout}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}
