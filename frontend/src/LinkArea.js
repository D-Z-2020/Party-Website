import React from 'react'
import { useState } from 'react'
import Link from './Link'

export default function LinkArea({gameLink, setGameLink, gameLinks, setGameLinks, addLink, deleteLink, isHost}) {
    return (
        <div class="col p-2">
			<div class="card">
				<div class="card-body">    
					<form class="row align-items-center">		
						<div class="col-8 m-2">
							<input class="form-control" type="text" placeholder="Add a game link" value={gameLink} onChange={e => setGameLink(e.target.value)}></input>
						</div>
						<div class="col-2 m-2">
							<input class="btn btn-add" type="button" value="Add" onClick={() => {if (gameLink) addLink(gameLink)}} />
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
