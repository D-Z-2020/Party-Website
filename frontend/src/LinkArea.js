import React from 'react'
import { useState } from 'react'
import Link from './Link'

export default function LinkArea({gameLink, setGameLink, gameLinks, setGameLinks, addLink, deleteLink, isHost}) {
    return (
        <div class="col p-2">
			<div class="card">
				<div class="card-body">    
					<form class="row g-2">		
						<div class="col-9">
							<input class="form-control" type="text" placeholder="Add a game link" value={gameLink} onChange={e => setGameLink(e.target.value)}></input>
						</div>
						<div class="col-3">
							<input class="btn btn-add mb-3" type="button" value="Add" onClick={() => {addLink(gameLink)}} />
						</div>
					</form>
				<div style={{ overflowY: "auto"}}>
                {gameLinks.map(link => (
                    <Link link={link} deleteLink={deleteLink} key={link} isHost={isHost}/>)
                )}
            </div>
        </div>
		</div>
		</div>
    )
}
