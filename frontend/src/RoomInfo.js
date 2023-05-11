import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
export default function RoomInfo({ roomCode,partyName,setPartyName,location,setLocation,date,setDate}) {
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                if (!roomCode) return
                const res = await axios.get("http://localhost:3001/getRoomInfo", {
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
        <div class="col p-2">
			<div class="card">
				<div class="card-body">
					<p>Room Code: {roomCode}</p>
					<p>party name: {partyName}</p>
					<p>location: {location}</p>
					<p>date: {date}</p>
				</div>
			</div>
        </div>
    )
}
