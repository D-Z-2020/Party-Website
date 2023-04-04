import React from 'react'
import useAuth from './hooks/useAuth'
import { useState, useEffect } from "react"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'

const spotifyApi = new SpotifyWebApi({
    clientId: "5c9e849201d24dfb8f563a7a081e3be9",

})
export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()

    const [customQueue, setCustomQueue] = useState([]);

    function addTrack(track) {
        for (let i = 0; i < customQueue.length; i++) {
            if (track.uri === customQueue[i].uri) {
                alert("You have already added this track!")
                return;
            }
        }
        setCustomQueue([...customQueue, track])
    }

    function playTrack(track) {
        setPlayingTrack(track)
        let index = -1
        for (let i = 0; i < customQueue.length; i++) {
            if (track.uri === customQueue[i].uri) {
                index = i
            }
        }

        setCustomQueue(customQueue.slice(index))

    }

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlnumImage = track.album.images.reduce(
                    (smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlnumImage.url
                }
            }))
        })
        return () => (cancel = true)
    }, [search, accessToken])

    return (
        <div>
            <input type="text" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}>

            </input>
            <b style={{ display: 'block' }}>Search Result</b>
            <div style={{ overflowY: "auto", height: "30vh" }}>
                {searchResults.map(track =>
                    (<TrackSearchResult track={track} key={track.uri} chooseTrack={addTrack} />))}
            </div>
            <p>--------------------------</p>
            <b>Queue</b>
            <div style={{ overflowY: "auto", height: "40vh" }}>
                {customQueue.map(track =>
                    (<TrackSearchResult track={track} key={track.uri} chooseTrack={playTrack} />))}
            </div>

            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}
                playingTrack={playingTrack}
                setPlayingTrack={setPlayingTrack}
                customQueue={customQueue}
                setCustomQueue={setCustomQueue} /></div>
        </div>
    )
}
