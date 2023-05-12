import React from 'react'
import Dashboard from "./Dashboard"
import NonHostDashboard from './NonHostDashboard';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import axios from 'axios';
import io from 'socket.io-client';
import RoleSelection from './RoleSelection';
import JoinRoomForm from './JoinRoomForm';
import background from './assets/image/pexels-photo-164853.webp'

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:${process.env.REACT_APP_FRONTEND_PORT}/start/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`
const AUTH_URL_SHOW_DIALOG = AUTH_URL + "&show_dialog=true"

const socket = io(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}`);
export default function Start({ setUserName }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomCodeToJoin, setRoomCodeToJoin] = useState("")
    const [roomInfo, setRoomInfo] = useState()
    const [isNonHost, setIsNonHost] = useState(false)
    const [globalIsPremium, setGlobalIsPremium] = useState(true)
    const [showJoinRoomForm, setShowJoinRoomForm] = useState(false)

    useEffect(() => {
        if (location.state?.isPremium !== false) {
            setGlobalIsPremium(true)
        } else {
            setGlobalIsPremium(false)
        }
    }, [location.state?.isPremium])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                alert("Invalid Token")
                navigate("/")
                setUserName("")
            }
        }
        else {
            navigate("/")
            setUserName("")
            alert("To start, you must login first")
        }
    }, [])

    const joinRoom = async (e, optionalRoomCode = null) => {
        e.preventDefault();
        try {
            const req1 = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userRoom`, {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            const prevRoomId = req1.data
            const req = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/joinRoom`, {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
                code: optionalRoomCode ? optionalRoomCode : roomCodeToJoin
            })

            socket.emit("join_room", req.data["_id"]);
            if ((req.status) === 200) {
                // restore room
                const anchor = document.createElement('a');
                anchor.href = globalIsPremium ? AUTH_URL : AUTH_URL_SHOW_DIALOG;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                return
            }
            if ((req.status) === 202) {
                socket.emit("host_room_dismissed", prevRoomId);
            }
            setIsNonHost(true)
            setRoomInfo(req.data)
        }
        catch (err) {
            alert(err.response.data)
            if ((err.response.status) === 401) {
                localStorage.removeItem("token")
                navigate("/")
                setUserName("")
            }
        }
    }

    const restorePrevRoom = async () => {
        try {
            const req = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/userRoom`, {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
            })
            if (!req.data) {
                return
            }
            setRoomCodeToJoin(req.data);
            joinRoom(new SubmitEvent("submit"), req.data);
        }
        catch (err) {
            alert("something wrong, please login again")
            setUserName("")
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token") && !isNonHost && !code) {
            restorePrevRoom();
        }
    }, [])

    const code = new URLSearchParams(window.location.search).get('code')
    return (
        <div className="container dashboard-container">
            <div className="row">
                {isNonHost ? <NonHostDashboard roomInfo={roomInfo} socket={socket} globalIsPremium={globalIsPremium} setIsNonHost={setIsNonHost} /> : (code ? <Dashboard code={code} socket={socket} /> : <div>
                    {showJoinRoomForm && <JoinRoomForm joinRoom={joinRoom} roomCodeToJoin={roomCodeToJoin} setRoomCodeToJoin={setRoomCodeToJoin} setShowJoinRoomForm={setShowJoinRoomForm} />}
                    {!showJoinRoomForm && <RoleSelection globalIsPremium={globalIsPremium} restorePrevRoom={restorePrevRoom} AUTH_URL={AUTH_URL} AUTH_URL_SHOW_DIALOG={AUTH_URL_SHOW_DIALOG} setShowJoinRoomForm={setShowJoinRoomForm} />}
                </div>)}
            </div>
        </div>
    )
}
