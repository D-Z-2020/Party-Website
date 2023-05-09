import React from 'react'

export default function JoinRoomForm({joinRoom, roomIdToJoin, setRoomIdToJoin, setShowJoinRoomForm}) {
    return (
        <div>
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
            <input type="button" value="back" onClick={()=> setShowJoinRoomForm(false)}/>
        </div>
    )
}