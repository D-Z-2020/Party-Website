import React from 'react'
import { useState } from 'react'
import Link from './Link'

export default function LinkArea({gameLink, setGameLink, gameLinks, setGameLinks, addLink, deleteLink}) {
    return (
        <div>            
            <input type="text" placeholder="add a game link" value={gameLink} onChange={e => setGameLink(e.target.value)}></input>
            <input type="button" value="add game link" onClick={() => {addLink(gameLink)}} />
            <div style={{ overflowY: "auto", height: "100px" }}>
                {gameLinks.map(link => (
                    <Link link={link} deleteLink={deleteLink} key={link}/>)
                )}
            </div>
        </div>
    )
}
