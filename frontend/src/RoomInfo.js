import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
export default function RoomInfo({ roomId,partyName,setPartyName,location,setLocation,date,setDate}) {
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (!roomId) return
                const res = await axios.get("http://localhost:3001/getRoomInfo", {
                    headers: {
                        'x-access-token': localStorage.getItem("token")
                    }
                })
                console.log(res.data)
                setPartyName(res.data.partyName)
                setLocation(res.data.location)
                setDate(res.data.date)
            } catch (error) {
                console.error(error);
            }
        };
        fetchInfo();
    }, [roomId]);

    return (
        <div>
            <p>Room Id: {roomId}</p>
            <p>party name: {partyName}</p>
            <p>location: {location}</p>
            <p>date: {date}</p>
        </div>
    )
}
