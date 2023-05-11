import React from 'react'
import useAuth from './hooks/useAuth'
import { useState, useEffect } from "react"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'
import { useNavigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import axios from 'axios';
import LinkArea from './LinkArea'
import ImageUpload from './ImageUpload'
import RoomImages from './RoomImages'
import RoomInfo from './RoomInfo'
import Setting from './Setting'
import './styles/Dashboard.css'

const spotifyApi = new SpotifyWebApi({
    clientId: "5c9e849201d24dfb8f563a7a081e3be9",

})
export default function Dashboard({ code, socket }) {
    const navigate = useNavigate();
    const [isPremium, accessToken] = useAuth(code)
    // console.log(isPremium)
    // console.log(accessToken)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()

    const [customQueue, setCustomQueue] = useState([]);

    const [roomId, setRoomId] = useState()
    const [roomCode, setRoomCode] = useState()
    const [gameLink, setGameLink] = useState("")
    const [gameLinks, setGameLinks] = useState([])
    const [fetchImagesKey, setFetchImagesKey] = useState(0);
    const [fetchRoomInfoKey, setFetchRoomInfoKey] = useState(0);
    const [partyName, setPartyName] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState("")

    const [activeComponent, setActiveComponent] = useState('Music');


    const showComponent = (componentName) => {
        setActiveComponent(componentName);
    };

    function addLink(link) {
        for (let i = 0; i < gameLinks.length; i++) {
            if (link === gameLinks[i]) {
                alert("You have already added this link!")
                return;
            }
        }
        updateLink([...gameLinks, link])
    }

    function deleteLink(link) {
        let position = -1
        for (let i = 0; i < gameLinks.length; i++) {
            if (link === gameLinks[i]) {
                position = i
            }
        }
        if (position === -1) {
            alert("link does not exist")
        } else {
            let newGameLinks = [...gameLinks];
            newGameLinks.splice(position, 1);
            updateLink(newGameLinks)
        }
    }

    async function updateLink(updatedLinks) {
        await axios.post("http://localhost:3001/updateLinks", {
            headers: {
                'x-access-token': localStorage.getItem("token")
            },
            updatedLinks: updatedLinks,
            roomId: roomId
        })
        setGameLinks(updatedLinks);
        socket.emit("update_links", { updatedLinks: updatedLinks, room: roomId });
    }

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

        socket.on("receive_links", (data) => {
            setGameLinks(data.updatedLinks);
        });

        socket.on("leave_host_room", () => {
            window.location = "/start"
            alert("host dismiss the room")
        });

        socket.on("rerender_room_images", () => {
            setFetchImagesKey(prevFetchImagesKey => prevFetchImagesKey + 1);
            console.log("host rerender")
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
            setRoomCode(req.data["code"])
            setCustomQueue(req.data["queue"])
            setGameLinks(req.data["links"])
            socket.emit("join_room", req.data["_id"]);
            console.log("join room", req.data["_id"])
            // if ((req.status) === 200) {
            //     alert("restore room as host")
            // }
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/")
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
                navigate("/")
            } else {
                // test
                getRoomInfo();
            }
        }
        else {
            navigate("/")
            alert("To start, you must login first")
        }
    }, [])

    useEffect(() => {
        console.log(isPremium)
        if (!isPremium) {
            dismissRoom(isPremium);
            alert("you need premium account to be a host!");
        }
    }, [isPremium])



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
        // let newQueue = [...customQueue];
        // let element = newQueue.splice(index, 1)[0];
        // newQueue.unshift(element);
        // updateQueue(newQueue)

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


    const dismissRoom = async (isPremium = true) => {
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
            socket.emit("leave_room", roomId);
            navigate('/start', { state: { isPremium } })
        }
        catch (err) {
            localStorage.removeItem("token")
            navigate("/")
            alert("invalid login status, please login again")
            return
        }
    }

    const handleImageUploaded = () => {
        setFetchImagesKey(fetchImagesKey + 1);
        socket.emit("image_upload", { room: roomId });
    };

    const handleImageDeleted = () => {
        setFetchImagesKey(fetchImagesKey + 1);
        socket.emit("image_upload", { room: roomId });
    };

    const [playerKey, setPlayerKey] = useState(0)
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    {activeComponent !== 'Setting' &&
                        <>
                            <div className="row">
                                <div className="col-md-12">
                                    <RoomInfo roomCode={roomCode} partyName={partyName} setPartyName={setPartyName}
                                        location={location} setLocation={setLocation} date={date} setDate={setDate}
                                        key={fetchRoomInfoKey} />
                                </div>
                            </div>

                            <div className="row p-2">
                                <div className="col-md-12 d-flex flex-column mx-auto align-items-center">
                                    <input className="btn btn-menu mt-3" type="button" value="Music" onClick={() => showComponent('Music')} />
                                    <input className="btn btn-menu mt-3" type="button" value="Game" onClick={() => showComponent('Link')} />
                                    <input className="btn btn-menu mt-3" type="button" value="Album" onClick={() => showComponent('Album')} />
                                    <input className="btn-border mt-5" type="button" value="Party Settings" onClick={() => showComponent('Setting')} />
                                </div>
                            </div>
                        </>}
                </div>

                {activeComponent === 'Setting' && <Setting roomId={roomId} partyName={partyName} setPartyName={setPartyName}
                    location={location} setLocation={setLocation} date={date} setDate={setDate} socket={socket} setActiveComponent={setActiveComponent}
                    dismissRoom={dismissRoom}
                />}
                <br />

                {activeComponent === 'Album' && <div className="col-md-8" style={{ height: "80vh", overflowY: "auto" }}>
                    <ImageUpload roomId={roomId} onImageUploaded={handleImageUploaded} />
                    <RoomImages roomId={roomId} handleImageDeleted={handleImageDeleted} key={fetchImagesKey} isHost={true} /></div>}


                {activeComponent === 'Link' &&
                    <div className="col-md-8" style={{ height: "80vh", overflowY: "auto" }}>
                        <LinkArea gameLink={gameLink} setGameLink={setGameLink} gameLinks={gameLinks} setGameLinks={setGameLinks} addLink={addLink} deleteLink={deleteLink} isHost={true} />

                    </div>}

                {activeComponent === 'Music' &&
                    <div className="col-md-4 mb-2 song-list" style={{ height: "80vh", overflowY: "auto", border: '0.5px solid #eee' }}>
                        <input type="text" className="form-control my-2" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}>
                        </input>
                        <br />
                        <div style={{ overflowY: "auto" }} id="search">
                            {searchResults.map(track =>
                                (<TrackSearchResult track={track} key={track.uri} chooseTrack={addTrack} isQueue={false} isNonHost={false}/>))}
                        </div>
                    </div>
                }


                {activeComponent === 'Music' &&
                    <div className="col-md-4 song-list playback" style={{ height: "80vh", overflowY: "auto"}}>
                        <h3>Playback Queue</h3>
                        <div style={{ overflowY: "auto" }} id="queue">
                            {customQueue.map(track =>
                                (<TrackSearchResult track={track} key={track.uri} chooseTrack={playTrack} isQueue={true} isNonHost={false}/>))}
                        </div>
                    </div>
                }
            </div>

            {activeComponent !== 'Setting' && <div className='row d-flex align-items-end' style={{ height: "13vh" }}>
                <div className='col-md-12 player-style'>
                    <Player
                        key={playerKey}
                        accessToken={accessToken}
                        trackUri={playingTrack?.uri}
                        playingTrack={playingTrack}
                        setPlayingTrack={setPlayingTrack}
                        customQueue={customQueue}
                        updateQueue={updateQueue}
                        setPlayerKey={setPlayerKey}
                    />
                </div>
            </div>}
        </div>
    )
}
