import React from 'react'

export default function Link({ link, deleteLink, isHost }) {
  return (
    <div className='row' style={{width:"100%", border:'1px solid #eee'}}>
      <a className='col-2' style={{ display: 'inline' }} href={"https://" + link}>{link}</a>
      <div className='col-7'></div>
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
