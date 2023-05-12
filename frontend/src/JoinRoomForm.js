import React from 'react'

export default function JoinRoomForm({ joinRoom, roomIdToJoin, setRoomCodeToJoin, setShowJoinRoomForm }) {
    return (
        <div className="container p-2 d-flex align-items-center justify-content-center" style={{ height: "80vh"}}>
			{/* <div class="card">
			<div class="card-body"> */}
            <div className="row justify-content-center">
                <div className="col-md-10 text-center mt-5">
                    <h1>Join a party</h1>
                </div>
                <div className="col-md-6 text-center">
                    <form onSubmit={(e) => joinRoom(e)}>
                        <div className="form-group my-3">
                            <input
                                className="short-input"
                                value={roomIdToJoin}
                                onChange={(e) => setRoomCodeToJoin(e.target.value)}
                                type="text"
                                placeholder='4 Digits Party Code'
                                required={true} />
                        </div>
                        <div className="form-group">
                            <input className='button btn btn-primary my-3' type="submit" value="Join" />
                        </div>
                        <div className="form-group">
                            <input className="btn-border my-3" type="button" value="Back" onClick={() => setShowJoinRoomForm(false)} />
                        </div>
                    </form>
                    
                </div>
            </div>
			{/* </div>
            </div> */}
        </div>

    )
}
