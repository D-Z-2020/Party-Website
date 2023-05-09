import React from 'react'

export default function Link({ link, deleteLink, isHost }) {
  return (
    <div>
      <a style={{ display: 'inline' }} href={"https://"+link}>{link}</a>
      {isHost && <button
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
