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

const spotifyApi = new SpotifyWebApi({
    clientId: "5c9e849201d24dfb8f563a7a081e3be9",

})

export default function NonHostDashboard({ roomInfo, socket, globalIsPremium, setIsNonHost }) {
    const navigate = useNavigate();
    const accessToken = useClientCredential()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const [customQueue, setCustomQueue] = useState(roomInfo.queue);

    const [roomId, setRoomId] = useState(roomInfo._id)

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
        const onReceiveTrack = (data) => {
            setCustomQueue(data.updatedQueue);
        };

        const onReceiveLinks = (data) => {
            setGameLinks(data.updatedLinks);
        };

        const onLeaveHostRoom = () => {
            window.location = "/start";
            console.log("leave");
            alert("host dismiss the room");
        };

        const onRerenderRoomImages = () => {
            setFetchImagesKey((prevFetchImagesKey) => prevFetchImagesKey + 1);
            console.log("guest rerender");
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
        //console.log(token)
        if (token) {
            const user = decodeToken(token)
            if (!user) {
                localStorage.removeItem("token")
                alert("Invalid Token")
                navigate("/UserLogin")
            }
        }
        else {
            navigate("/UserLogin")
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
            const req = await axios.get("http://localhost:3001/leaveRoom", {
                headers: {
                    'x-access-token': localStorage.getItem("token")
                }
            })

            socket.emit("leave_room", roomId);
            setRoomId(undefined)
            setCustomQueue([])
            setIsNonHost(false)
            navigate('/start', { state: { isPremium: globalIsPremium } })

        }
        catch (err) {
            console.log(err)
            localStorage.removeItem("token")
            navigate("/UserLogin")
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
        <div>
            {activeComponent !== 'Confirmation' &&
                <div><RoomInfo roomId={roomId} partyName={partyName} setPartyName={setPartyName}
                    location={location} setLocation={setLocation} date={date} setDate={setDate}
                    key={fetchRoomInfoKey} />

                    <input type="button" value="leave room" onClick={() => showComponent('Confirmation')} />
                    <input type="button" value="view album" onClick={() => showComponent('Album')} />
                    <input type="button" value="show link" onClick={() => showComponent('Link')} />
                    <input type="button" value="show music" onClick={() => showComponent('Music')} />
                </div>}

            {activeComponent === 'Confirmation' &&
                <ConfirmationPage handleConfirm={leaveRoom} handleCancel={() => showComponent('Music')} />}
            <br />

            {activeComponent === 'Album' && <div>
                <ImageUpload roomId={roomId} onImageUploaded={handleImageUploaded} />
                <RoomImages roomId={roomId} handleImageDeleted={handleImageDeleted} key={fetchImagesKey} /></div>}
            <br />

            {activeComponent === 'Link' &&
                <LinkArea gameLink={gameLink} setGameLink={setGameLink} gameLinks={gameLinks} setGameLinks={setGameLinks} addLink={addLink} deleteLink={deleteLink} />
            }
            <br />

            {activeComponent === 'Music' &&
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
                            (<TrackSearchResult track={track} key={track.uri} chooseTrack={showInfo} />))}
                    </div>
                </div>
            }
        </div>
    )
}

