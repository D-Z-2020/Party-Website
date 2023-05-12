import React from 'react'

export default function Link({ link, deleteLink, isHost }) {
  return (
    <div className='row' style={{width:"100%", fontSize:'1.2rem', marginTop: '1rem'}}>
      <a className='col-7' style={{ display: 'inline' }} target='_blank' href={"https://" + link}>{link}</a>
      <div className='col-3'></div>
      {isHost && <button
        className='col-2'
        style={{ display: 'inline', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => {
          deleteLink(link);
        }}
      >
        ❌
      </button>}
    </div>
  )
}
