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

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=5c9e849201d24dfb8f563a7a081e3be9&response_type=code&redirect_uri=http://localhost:3000/start/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"
const AUTH_URL_SHOW_DIALOG = AUTH_URL + "&show_dialog=true"

const socket = io('http://localhost:3001');
export default function Start() {
    const navigate = useNavigate();
    const location = useLocation();
    const [roomIdToJoin, setRoomIdToJoin] = useState("")
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


    // console.log(globalIsPremium)
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
            navigate("/")
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
                navigate("/")
            } else {
                // test
                pop();
            }
        }
        else {
            navigate("/")
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
            console.log("prevRoomId", prevRoomId)
            const req = await axios.post("http://localhost:3001/joinRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
                roomId: optionalRoomId ? optionalRoomId : roomIdToJoin
            })

            console.log("join_room", req.data["_id"])
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
                console.log("status 202")
                socket.emit("host_room_dismissed", prevRoomId);
            }
            setIsNonHost(true)
            setRoomInfo(req.data)
        }
        catch (err) {
            alert(err.response.data)
            if ((err.response.status) === 403) {
                localStorage.removeItem("token")
                navigate("/")
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


            if (!req.data) {
                // alert("no prev room")
                return
            }
            setRoomIdToJoin(req.data);
            joinRoom(new SubmitEvent("submit"), req.data);
        }
        catch (err) {
            alert("something wrong, please login again")
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    useEffect(()=>{
        console.log(!isNonHost)
        if (localStorage.getItem("token") && !isNonHost && !code) {
            restorePrevRoom();
        }
    },[])

    const code = new URLSearchParams(window.location.search).get('code')
    //console.log(code)
    return (
        <div>
            {isNonHost ? <NonHostDashboard roomInfo={roomInfo} socket={socket} globalIsPremium={globalIsPremium} setIsNonHost={setIsNonHost} /> : (code ? <Dashboard code={code} socket={socket} /> : <div>
                {/* <form onSubmit={(e) => joinRoom(e)}>
                    <input
                        className='roomIdField'
                        value={roomIdToJoin}
                        onChange={(e) => setRoomIdToJoin(e.target.value)}
                        type="text"
                        placeholder='room id to join'
                        required={true} />
                    <input className='roomIdButton' type="submit" value="JOIN" />
                </form> */}
                {showJoinRoomForm && <JoinRoomForm joinRoom={joinRoom} roomIdToJoin ={roomIdToJoin} setRoomIdToJoin={setRoomIdToJoin} setShowJoinRoomForm={setShowJoinRoomForm}/>}
                {/* <input type="button" value="restore previous room" onClick={restorePrevRoom} /> */}
                {!showJoinRoomForm && <RoleSelection globalIsPremium={globalIsPremium} restorePrevRoom={restorePrevRoom} AUTH_URL={AUTH_URL} AUTH_URL_SHOW_DIALOG={AUTH_URL_SHOW_DIALOG} setShowJoinRoomForm={setShowJoinRoomForm}/>}
            </div>)}
        </div>
    )
}
