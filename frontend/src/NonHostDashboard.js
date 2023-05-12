import useClientCredential from './hooks/useClientCredential'
import { useState, useEffect } from "react"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import { useNavigate } from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import axios from 'axios';
import LinkArea from './LinkArea';
import ImageUpload from './ImageUpload'
import RoomImages from './RoomImages'
import RoomInfo from './RoomInfo';
import ConfirmationPage from './ConfirmationPage';
import './styles/Dashboard.css'

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,

})

export default function NonHostDashboard({ roomInfo, socket, globalIsPremium, setIsNonHost }) {
    const navigate = useNavigate();
    const accessToken = useClientCredential()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const [customQueue, setCustomQueue] = useState(roomInfo.queue);

    const [roomId, setRoomId] = useState(roomInfo._id)
    const [roomCode, setRoomCode] = useState(roomInfo.code)

    const [gameLink, setGameLink] = useState("")
    const [gameLinks, setGameLinks] = useState(roomInfo.links)
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
        await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/updateLinks`, {
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
        await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/updateQueue`, {
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
        const onReceiveTrack = (data) => {
            setCustomQueue(data.updatedQueue);
        };

        const onReceiveLinks = (data) => {
            setGameLinks(data.updatedLinks);
        };

        const onLeaveHostRoom = () => {
            window.location = "/start";
            alert("The host has deleted the party space");
        };

        const onRerenderRoomImages = () => {
            setFetchImagesKey((prevFetchImagesKey) => prevFetchImagesKey + 1);
        };

        const onUpdateSetting = () => {
            setFetchRoomInfoKey((prev) => prev + 1);
        };

        socket.on("receive_track", onReceiveTrack);
        socket.on("receive_links", onReceiveLinks);
        socket.on("leave_host_room", onLeaveHostRoom);
        socket.on("rerender_room_images", onRerenderRoomImages);
        socket.on("updateSetting", onUpdateSetting)

        return () => {
            socket.off("receive_track", onReceiveTrack);
            socket.off("receive_links", onReceiveLinks);
            socket.off("leave_host_room", onLeaveHostRoom);
            socket.off("rerender_room_images", onRerenderRoomImages);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                alert("Invalid Token")
                navigate("/")
            }
        }
        else {
            navigate("/")
            alert("To start, you must login first")
        }
    }, [])



    function addTrack(track) {
        for (let i = 0; i < customQueue.length; i++) {
            if (track.uri === customQueue[i].uri) {
                alert("You have already added this track!")
                return;
            }
        }
        updateQueue([...customQueue, track])
    }

    function showInfo(track) {
        console.log(track)
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


    const leaveRoom = async () => {
        try {
            const req = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/leaveRoom`, {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            socket.emit("leave_room", roomId);
            setRoomId(undefined)
            setRoomId(undefined)
            setCustomQueue([])
            setIsNonHost(false)
            navigate('/start', { state: { isPremium: globalIsPremium } })

        }
        catch (err) {
            console.log(err)
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

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    {activeComponent !== 'Confirmation' &&
                        <>
                            <div className="row">
                                <div className="col-md-12">
                                    <RoomInfo roomCode={roomCode} partyName={partyName} setPartyName={setPartyName}
                                        location={location} setLocation={setLocation} date={date} setDate={setDate}
                                        key={fetchRoomInfoKey} />
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className='flex-column mx-auto text-center'>
                                    <div className="col-md-12 d-flex mx-auto align-items-center whole-menu">
                                        <button className="btn btn-menu mt-3" onClick={() => showComponent('Music')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16">
                                                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                                                <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                                                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                                            </svg>
                                            &nbsp;Music
                                        </button>
                                        <button className="btn btn-menu mt-3" onClick={() => showComponent('Link')} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-controller" viewBox="0 0 16 16">
                                                <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z" />
                                                <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z" />
                                            </svg>
                                            &nbsp;Game
                                        </button>
                                        <button className="btn btn-menu mt-3" onClick={() => showComponent('Album')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                                                <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                                <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                            </svg>
                                            &nbsp;Album
                                        </button>
                                    </div>
                                    <input className="btn-border mt-5" type="button" value="Leave party" onClick={() => showComponent('Confirmation')} />
                                </div>
                            </div>

                        </>}
                </div>

                {activeComponent === 'Confirmation' &&
                    <ConfirmationPage handleConfirm={leaveRoom} handleCancel={() => showComponent('Music')} />}
                <br />

                {activeComponent === 'Album' && <div className="col-md-8 feature-height">
                    <ImageUpload roomId={roomId} onImageUploaded={handleImageUploaded} />
                    <RoomImages roomId={roomId} handleImageDeleted={handleImageDeleted} key={fetchImagesKey} isHost={false} /></div>}

                {activeComponent === 'Link' && <div className="col-md-8 feature-height">
                    <LinkArea gameLink={gameLink} setGameLink={setGameLink} gameLinks={gameLinks} setGameLinks={setGameLinks} addLink={addLink} deleteLink={deleteLink} isHost={false} />
                </div>
                }
                {activeComponent === 'Music' &&
                    <div className="col-md-4 my-2 song-list" style={{ overflowY: "auto" }}>
                        <input type="text" className="form-control my-2" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}>
                        </input>
                        <br />
                        <div style={{ overflowY: "auto" }} id="search">
                            {searchResults.map(track =>
                                (<TrackSearchResult track={track} key={track.uri} chooseTrack={addTrack} isQueue={false} isNonHost={true} />))}
                        </div>
                    </div>
                }

                {activeComponent === 'Music' &&
                    <div className="col-md-4 my-2 song-list playback" style={{ overflowY: "auto" }}>
                        <h3>Playback Queue</h3>
                        <div style={{ overflowY: "auto" }} id="queue">
                            {customQueue.map(track =>
                                (<TrackSearchResult track={track} key={track.uri} chooseTrack={showInfo} isQueue={true} isNonHost={true} />))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

