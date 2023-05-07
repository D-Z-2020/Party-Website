import React from 'react'
import { useState } from 'react'
import axios from 'axios'
export default function Setting({ roomId, partyName, setPartyName, location, setLocation, date, setDate, socket }) {
    const [partyNameLocal, setPartyNameLocal] = useState(partyName)
    const [locationLocal, setLocationLocal] = useState(location)
    const [dateLocal, setDateLocal] = useState(date)
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const req = await axios.post("http://localhost:3001/changeSetting", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                },
                roomId: roomId,
                partyName: partyNameLocal,
                location: locationLocal,
                date: dateLocal,
            });
            socket.emit("settingChanges", roomId)
            setPartyName(partyNameLocal)
            setLocation(locationLocal)
            setDate(dateLocal)
        } catch (err) {
            console.log(err)
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="party-name">Party Name:</label>
                <input
                    type="text"
                    id="party-name"
                    value={partyNameLocal}
                    onChange={(e) => setPartyNameLocal(e.target.value)}
                />

                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    value={locationLocal}
                    onChange={(e) => setLocationLocal(e.target.value)}
                />

                <label htmlFor="date">Date:</label>
                <input
                    type="datetime-local"
                    id="date"
                    value={dateLocal}
                    onChange={(e) => setDateLocal(e.target.value.replace("T", " "))}
                />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
