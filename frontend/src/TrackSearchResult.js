import React from 'react'

export default function TrackSearchResult({ track, chooseTrack, isQueue, isNonHost }) {
  function handleClick() {
    chooseTrack(track)
  }
  return (
    <div className={`track ${isQueue ? 'is-queue' : ''} row mt-1`} style={{ width: "100%", border: '1px solid #eee' }}>
      <div className='col-3'>
        <img src={track.albumUrl} style={{ height: '64px', width: '64px' }} />
      </div>
      <div className='col-1'>

      </div>
      <div className='col-5 text-left'>
        <div style={{ borderBottom: '1px solid #eee' }}>{track.title}</div>
        <div>{track.artist}</div>
      </div>
      
      <div className='col-2 d-flex align-items-center justify-content-center'>
        {isNonHost ?
          (isQueue ? <></> : <span style={{ color: 'green', fontSize: '50px' }} onClick={handleClick} className='plusSign'>&#43;</span>) :
          (isQueue ? <span style={{ color: 'green', fontSize: '25px' }} onClick={handleClick} className='plusSign'>▶</span> : <span style={{ color: 'green', fontSize: '50px' }} onClick={handleClick} className='plusSign'>&#43;</span>)}
      </div>
    </div >
  )
}
