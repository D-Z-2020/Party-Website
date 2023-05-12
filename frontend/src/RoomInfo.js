import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
export default function RoomInfo({ roomCode, partyName, setPartyName, location, setLocation, date, setDate }) {
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (!roomCode) return
                const res = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/getRoomInfo`, {
                    headers: {
                        'x-access-token': localStorage.getItem("token")
                    }
                })

                setPartyName(res.data.partyName)
                setLocation(res.data.location)
                setDate(res.data.date)
            } catch (error) {
                console.error(error);
            }
        };
        fetchInfo();
    }, [roomCode]);

    return (
        <div class="m-3">
            <div class="room-info">
                <h2>Party Space</h2>
                <h1>{partyName}</h1>
                <p>Room Code: {roomCode}</p>
                <p>Location: {location}</p>
                <p>Time: {date}</p>
            </div>
        </div>
    )
}
