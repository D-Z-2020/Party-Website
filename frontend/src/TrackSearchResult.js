import React from 'react'

export default function TrackSearchResult({ track, chooseTrack, isQueue, isNonHost }) {
  function handleClick() {
    chooseTrack(track)
  }
  return (
    <div className={`track ${isQueue ? 'is-queue' : ''} row mt-1`} style={{ width: "100%"}}>
      <div className='col-3'>
        <img src={track.albumUrl} style={{ height: '64px', width: '64px', marginLeft: '10px', marginRight: '10px' }} />
      </div>

      <div className='col-5 text-left'>
        <div style={{ color: '#eee', fontWeight: '700'}}>{track.title}</div>
        <div style={{ color: '#ADD2D2' }}>{track.artist}</div>
      </div>
      <div className='col-2'>

</div>
      <div className='col-2 d-flex align-items-center justify-content-center'>
        {isNonHost ?
          (isQueue ? <></> : <span style={{ color: 'green', fontSize: '50px' }} onClick={handleClick} className='plusSign'>&#43;</span>) :
          (isQueue ? <span style={{ color: 'green', fontSize: '25px' }} onClick={handleClick} className='plusSign'>▶</span> : <span style={{ color: 'green', fontSize: '50px' }} onClick={handleClick} className='plusSign'>&#43;</span>)}
      </div>
    </div >
  )
}
