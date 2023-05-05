import React from 'react'

export default function Link({ link, deleteLink }) {
  return (
    <div>
      <a style={{ display: 'inline' }} href={"https://"+link}>{link}</a>
      <button
        style={{ display: 'inline', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => {
          deleteLink(link);
        }}
      >
        ❌
      </button>
    </div>
  )
}
