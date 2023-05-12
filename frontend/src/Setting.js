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
            const req = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/changeSetting`, {
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
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="row w-100 justify-content-center p-2">
                {!showConfirmationPage &&
                    <form onSubmit={handleSubmit} className="mt-4 text-center">
                        <div className="form-group row justify-content-center  p-2">
                            <h2>Party Space Settings</h2>
                            <label htmlFor="party-name" className="col-sm-2 col-form-label setting-label">Party Name</label>
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
                            <label htmlFor="location" className="col-sm-2 col-form-label setting-label">Location</label>
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
                            <label htmlFor="date" className="col-sm-2 col-form-label setting-label">Date</label>
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
                        <div className='row justify-content-center mt-3'>
                        <button type="button" onClick={() => { setActiveComponent("Music") }} className="btn-border my-2">Back</button>
                        <button type="submit" className="btn btn-primary my-2" style={{ width: "50%" }}>Save</button>
                        </div>
                    </form>
                }

                {showConfirmationPage && <ConfirmationPage handleConfirm={dismissRoom} handleCancel={() => setShowConfirmationPage(false)} />}

                {!showConfirmationPage &&
                        <div className='row justify-content-center mt-5'>
                            <button type="button" onClick={handleDismiss} className="btn btn-danger btn-danger-extend ml-5">Delete room</button>
                        </div>
                }
            </div>

        </div>

    );
}
