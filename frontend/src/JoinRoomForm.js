import React from 'react'

export default function JoinRoomForm({ joinRoom, roomIdToJoin, setRoomCodeToJoin, setShowJoinRoomForm }) {
    return (
        <div className="container p-2">
			<div class="card">
			<div class="card-body">
            <div className="row justify-content-center">
                <div className="col-md-10 text-center mt-5">
                    <h1>Enter 4 Digits Room Code</h1>
                </div>
                <div className="col-md-6">
                    <form onSubmit={(e) => joinRoom(e)}>
                        <div className="form-group my-3">
                            <input
                                className="form-control"
                                value={roomIdToJoin}
                                onChange={(e) => setRoomCodeToJoin(e.target.value)}
                                type="text"
                                placeholder='room id to join'
                                required={true} />
                        </div>
                        <div className="form-group">
                            <input className='btn btn-primary w-100 my-3' type="submit" value="JOIN" />
                        </div>
                    </form>
                    <div className="form-group">
                        <input className="btn btn-primary w-100 my-3" type="button" value="back" onClick={() => setShowJoinRoomForm(false)} />
                    </div>
                </div>
            </div>
			</div>
            </div>
        </div>

    )
}
