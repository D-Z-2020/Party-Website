import React from 'react'
import useAuth from './hooks/useAuth'
import { useState, useEffect } from "react"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import { useNavigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
    clientId: "5c9e849201d24dfb8f563a7a081e3be9",

})
export default function Dashboard({ code, socket}) {
    const navigate = useNavigate();
    const [isPremium, accessToken] = useAuth(code)
    // console.log(isPremium)
    // console.log(accessToken)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()

    const [customQueue, setCustomQueue] = useState([]);

    const [roomId, setRoomId] = useState()
    

    async function updateQueue(updatedQueue) {
        await axios.post("http://localhost:3001/updateQueue", {
            headers: {
                'x-access-token': localStorage.getItem("token")
            },
            updatedQueue: updatedQueue,
            roomId: roomId
        })
        setCustomQueue(updatedQueue);
        socket.emit("add_track", { updatedQueue: updatedQueue, room: roomId });
    }
    useEffect(() => {
        socket.on("receive_track", (data) => {
            setCustomQueue(data.updatedQueue);
        });

        socket.on("leave_host_room", () => {
            window.location = "/start"
            alert("host dismiss the room")
        });
    }, [])

    async function getRoomInfo() {
        try {
            const req = await axios.get("http://localhost:3001/room", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            setRoomId(req.data["_id"])
            setCustomQueue(req.data["queue"])
            socket.emit("join_room", req.data["_id"]);
            console.log("join room", req.data["_id"])
            if ((req.status) === 200) {
                alert("restore room as host")
            }
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/UserLogin")
            alert("invalid login status, please login again")
            return
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        //console.log(token)
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                alert("Invalid Token")
                navigate("/UserLogin")
            } else {
                // test
                getRoomInfo();
            }
        }
        else {
            navigate("/UserLogin")
            alert("To start, you must login first")
        }
    }, [])

    useEffect(()=>{
        console.log(isPremium)
        if (!isPremium) {
            dismissRoom(isPremium);
            alert("you need premium account to be a host!");
        }
    },[isPremium])



    function addTrack(track) {
        for (let i = 0; i < customQueue.length; i++) {
            if (track.uri === customQueue[i].uri) {
                alert("You have already added this track!")
                return;
            }
        }
        updateQueue([...customQueue, track])
    }

    function playTrack(track) {
        setPlayingTrack(track)
        let index = -1
        for (let i = 0; i < customQueue.length; i++) {
            if (track.uri === customQueue[i].uri) {
                index = i
            }
        }

        updateQueue(customQueue.slice(index))

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


    const dismissRoom = async (isPremium=true) => {
        try {
            const req = await axios.get("http://localhost:3001/dismissRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            socket.emit("host_room_dismissed", roomId);
            setRoomId(undefined)
            setCustomQueue([])
            // window.location = '/start'
            navigate('/start', {state:{isPremium}})
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/UserLogin")
            alert("invalid login status, please login again")
            return
        }
    }

    return (
        <div>
            <p>Room Id: {roomId}</p>
            <input type="button" value="dismiss room" onClick={dismissRoom} />
            <br />
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
                updateQueue={setCustomQueue} /></div>
        </div>
    )
}
