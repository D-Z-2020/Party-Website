import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
export default function Player({ accessToken, trackUri, playingTrack, setPlayingTrack, customQueue, setCustomQueue }) {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])


    if (!accessToken) return null
    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false)
                // end at the last song in queue
                if (state.isPlaying === false && state.progressMs == 0 && state.status === "READY" && state.isActive === true && state.nextTracks.length === 0 && state.type === "player_update") {
                    console.log("end", state)

                    if (customQueue.length >= 2) {
                        setPlayingTrack(customQueue[1])
                        setCustomQueue(customQueue.slice(1))
                    }
                    else {
                        setPlay(false)
                    }
                }
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
        />
    )
}
