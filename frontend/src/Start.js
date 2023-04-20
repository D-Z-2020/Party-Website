import React from 'react'
import Login from './Login';
import Dashboard from "./Dashboard"
import NonHostDashboard from './NonHostDashboard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
export default function Start() {
    const navigate = useNavigate();
    const [roomIdToJoin, setRoomIdToJoin] = useState("")
    const [roomInfo, setRoomInfo] = useState()
    const [isNonHost, setIsNonHost] = useState(false)
    // test
    async function pop() {
        try {
            const req = await axios.get("http://localhost:3001/pop", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            console.log(req.data)
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/UserLogin")
            alert("invalid login status, please login again")
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token")
        //console.log(token)
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                alert("Invalid Token")
                navigate("/UserLogin")
            } else {
                // test
                pop();
            }
        }
        else {
            navigate("/UserLogin")
            alert("To start, you must login first")
        }
    }, [])

    const joinRoom = async (e, optionalRoomId = null) => {
        e.preventDefault();
        try {
            const req1 = await axios.get("http://localhost:3001/userRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            const prevRoomId = req1.data

            const req = await axios.post("http://localhost:3001/joinRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
                roomId: optionalRoomId ? optionalRoomId : roomIdToJoin
            })

            console.log(req.data)
            socket.emit("join_room", req.data["_id"]);
            if ((req.status) === 200) {
                // restore room
                document.getElementsByClassName("spotifyHref")[0].click();
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
            if ((err.response.status) === 403) {
                localStorage.removeItem("token")
                navigate("/UserLogin")
            }
        }
    }

    const restorePrevRoom = async () => {
        try {
            const req = await axios.get("http://localhost:3001/userRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
            })

            console.log(req.data)
            if (!req.data) {
                alert("no prev room")
                return
            }
            setRoomIdToJoin(req.data);
            joinRoom(new SubmitEvent("submit"), req.data);
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/UserLogin")
        }
    }

    const code = new URLSearchParams(window.location.search).get('code')
    //console.log(code)
    return (
        <div>
            {isNonHost ? <NonHostDashboard roomInfo={roomInfo} socket={socket} /> : (code ? <Dashboard code={code} socket={socket} /> : <div>
                <Login />
                <form onSubmit={(e) => joinRoom(e)}>
                    <input
                        className='roomIdField'
                        value={roomIdToJoin}
                        onChange={(e) => setRoomIdToJoin(e.target.value)}
                        type="text"
                        placeholder='room id to join'
                        required={true} />
                    <input className='roomIdButton' type="submit" value="JOIN" />
                </form>
                <input type="button" value="restore previous room" onClick={restorePrevRoom} />
            </div>)}
        </div>
    )
}
