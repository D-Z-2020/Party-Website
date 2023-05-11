import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import ConfirmationPage from './ConfirmationPage'
export default function Setting({ roomId, partyName, setPartyName, location, setLocation, date, setDate, socket, setActiveComponent, dismissRoom }) {
    const [partyNameLocal, setPartyNameLocal] = useState(partyName)
    const [locationLocal, setLocationLocal] = useState(location)
    const [dateLocal, setDateLocal] = useState(date)
    const [showConfirmationPage, setShowConfirmationPage] = useState(false)
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
            setActiveComponent("Music")
        } catch (err) {
            console.log(err)
        }

    };

    const handleDismiss = () => {
        setShowConfirmationPage(true)
    }

    return (
        <div className="container">
            <div className="row justify-content-center p-2">
                <div class="card">
                    <div class="card-body">
                        {!showConfirmationPage &&
                            <form onSubmit={handleSubmit} className="mt-4 text-center">
                                <div className="form-group row justify-content-center  p-2">
                                    <label htmlFor="party-name" className="col-sm-2 col-form-label">Party Name:</label>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            id="party-name"
                                            className="form-control"
                                            value={partyNameLocal}
                                            onChange={(e) => setPartyNameLocal(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row justify-content-center p-2">
                                    <label htmlFor="location" className="col-sm-2 col-form-label">Location:</label>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            id="location"
                                            className="form-control"
                                            value={locationLocal}
                                            onChange={(e) => setLocationLocal(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row justify-content-center  p-2">
                                    <label htmlFor="date" className="col-sm-2 col-form-label">Date:</label>
                                    <div className="col-sm-6">
                                        <input
                                            type="datetime-local"
                                            id="date"
                                            className="form-control"
                                            value={dateLocal}
                                            onChange={(e) => setDateLocal(e.target.value.replace("T", " "))}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-3" style={{ width: "50%" }}>Submit</button>
                            </form>
                        }

                        {showConfirmationPage && <ConfirmationPage handleConfirm={dismissRoom} handleCancel={() => setShowConfirmationPage(false)} />}

                        {!showConfirmationPage &&
                            <div className='row justify-content-center mt-5'>
                                <div className='row justify-content-center mt-5'>
                                    <button type="button" onClick={() => { setActiveComponent("Music") }} className="btn btn-secondary btn-block col-6">Back To Party Space</button>
                                </div>
                                <div className='row justify-content-center'>
                                    <button type="button" onClick={handleDismiss} className="btn btn-danger btn-block mt-2 col-6">dismiss room</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    );
}
