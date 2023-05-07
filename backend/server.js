const dotenv = require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose = require("mongoose")
const User = require("./model/User")
const Room = require("./model/Room")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const SpotifyWebApi = require('spotify-web-api-node');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

mongoose.connect(process.env.DATABASE_URI)

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/refresh', require('./routes/refresh'));
app.use('/login', require('./routes/login'));
app.get('/lyrics', require('./routes/lyrics'));

app.get('/ClientCredentialsFlow', async (req, res) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        res.status(200)
        res.json({
            accessToken: data.body['access_token'],
            expiresIn: data.body['expires_in']
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

app.post('/userRegister', async (req, res) => {
    try {
        const encryptedPassword = await bcryptjs.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            password: encryptedPassword
        })
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(422).send("duplicate name")
    }
})

app.post('/userLogin', async (req, res) => {
    const user = await User.findOne({
        name: req.body.name,
    })

    if (!user) {
        res.status(400).send("name does not exist")
        return;
    }

    const isValidPassword = await bcryptjs.compare(req.body.password, user.password)

    if (isValidPassword) {
        const token = jwt.sign({
            name: req.body.name
        }, process.env.TOKEN_SECRET)

        res.status(200)
        res.json({ token: token })
    } else {
        res.status(401).send("invalid password")
    }
})

// test
app.get('/pop', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name
        const user = await User.findOne({
            name: name,
        })
        res.status(200)
        res.json({ password: user.password })
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

// create or restore room for host
app.get('/room', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        try {
            const room = await Room.create({
                hostUser: name,
            })

            res.status(201)
            res.json(room)

            const user = await User.findOne({
                name: name,
            })
            user.roomId = room._id.toString()
            user.save()
        } catch (err) {
            const room = await Room.findOne({
                hostUser: name,
            })
            res.status(200)
            res.json(room)
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.post('/updateQueue', async (req, res) => {
    const token = req.body.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        try {
            // console.log(req.body.updatedQueue)
            // console.log(req.body.roomId)
            const room = await Room.findOne({
                _id: req.body.roomId,
            })
            room.queue = req.body.updatedQueue
            room.save()
            res.sendStatus(200)
        } catch (err) {
            res.sendStatus(400)
            console.log(err)
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.post('/updateLinks', async (req, res) => {
    const token = req.body.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        try {
            // console.log(req.body.updatedQueue)
            // console.log(req.body.roomId)
            const room = await Room.findOne({
                _id: req.body.roomId,
            })
            room.links = req.body.updatedLinks
            room.save()
            res.sendStatus(200)
        } catch (err) {
            res.sendStatus(400)
            console.log(err)
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.post('/joinRoom', async (req, res) => {
    const token = req.body.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        try {
            const user = await User.findOne({
                name: name,
            })

            const prevRoomId = user.roomId
            const newRoomId = req.body["roomId"]

            // console.log(prevRoomId)
            // console.log(newRoomId)


            let prevRoom = await Room.findOne({
                _id: prevRoomId,
            })

            let newRoom;
            try {
                newRoom = await Room.findOne({
                    _id: newRoomId,
                })
            }

            catch (err) {
                res.status(400)
                res.send("room id invalid format")
                return
            }

            if (!newRoom) {
                res.status(400)
                res.send("invalid room id")
                return
            } else {

                // the user has previousely join some room
                if (prevRoom) {
                    // the user is the host of prev room
                    if (prevRoom.hostUser === name) {
                        // host join its prev room by id
                        if (newRoom.hostUser === name) {
                            res.sendStatus(200)
                            return
                        } else {
                            // host join new room will dsimiss its original room, need to delet that room
                            // here also need to delete NonHost user from original room
                            Room.findOneAndRemove({
                                _id: prevRoomId,
                            }).exec();
                            user.roomId = newRoomId
                            user.save()

                            const users = await User.find({})
                            users.map(user => {
                                if (user.roomId === prevRoomId) {
                                    user.roomId = null;
                                    user.save();
                                }
                            })

                            res.status(202)
                            res.json(newRoom)
                            return
                        }
                    }
                    else {
                        user.roomId = newRoomId
                        user.save()
                        res.status(201)
                        res.json(newRoom)
                        return
                    }
                } else {
                    user.roomId = newRoomId
                    user.save()
                    res.status(201)
                    res.json(newRoom)
                    return
                }
            }
        } catch (err) {
            console.log(err)
            res.status(400).send("Invalid User")
        }

    } catch (err) {
        res.status(403).send("Please Login first")
    }
})

app.post("/changeSetting", async (req, res) => {
    const token = req.body.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        const roomId = req.body["roomId"]


        const room = await Room.findOne({
            _id: roomId,
        })
        
        room.partyName = req.body["partyName"]
        room.location = req.body["location"]
        room.date = req.body["date"]
        room.save()
        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.get("/getRoomInfo", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        const user = await User.findOne({
            name: name,
        })

        const roomId = user.roomId

        const room = await Room.findOne({
            _id: roomId,
        })
        
        res.status(200)
        res.json(room)

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.get("/userRoom", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        const user = await User.findOne({
            name: name,
        })
        res.status(200)
        res.json(user.roomId)

    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.get("/dismissRoom", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        const roomToDismiss = await Room.findOne({
            hostUser: name,
        })

        const roomId = roomToDismiss._id

        const user = await User.findOne({
            name: name,
        })

        if (!roomToDismiss) {
            res.status(400)
            res.send("you are not the host of any room")
        }
        else {
            Room.findOneAndRemove({
                hostUser: name,
            }).exec();
            user.roomId = null
            user.save()

            const users = await User.find({})
            users.map(user => {
                if (user.roomId === roomId.toString()) {
                    user.roomId = null;
                    user.save();
                }
            })

            const dir = `./uploads/${roomId}`;

            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true });
            }

            res.sendStatus(200)
            return
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.get("/leaveRoom", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const name = decoded.name

        const hostRoom = await Room.findOne({
            hostUser: name,
        })

        if (hostRoom) {
            res.status(400)
            res.send("You are the host of the room, you can only dismiss it, can't leave it")
            return
        }
        else {
            const user = await User.findOne({
                name: name,
            })
            user.roomId = null
            user.save()
            res.sendStatus(200)
            return
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})


const PORT = 3001;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
});

io.on("connection", (socket) => {
    //console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
    });

    socket.on("add_track", (data) => {
        socket.to(data.room).emit("receive_track", data);
    });

    socket.on("update_links", (data) => {
        socket.to(data.room).emit("receive_links", data);
    });

    socket.on("host_room_dismissed", (data) => {
        socket.to(data).emit("leave_host_room");
    });

    socket.on("settingChanges", (data) => {
        socket.to(data).emit("updateSetting");
    });

    socket.on("image_upload", (data) => {
        socket.to(data.room).emit("rerender_room_images");
    });
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const roomID = req.params.roomID.split("=")[1];
        const dir = `./uploads/${roomID}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.post('/upload/:roomID', upload.single('image'), (req, res) => {
    res.status(200).json({ message: 'uploaded successfully', file: req.file });
});

app.get('/images/:roomID', (req, res) => {
    const roomID = req.params.roomID.split("=")[1];
    const dir = `./uploads/${roomID}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory' });
        }
        res.status(200).json({ files: files.map(file => `/uploads/${roomID}/${file}`) });
    });
});

app.delete('/images/:roomId/:filename', async (req, res) => {
    const roomId = req.params.roomId.split("=")[1]
    const filename = req.params.filename.split("=")[1]
    const dir = `./uploads/${roomId}/${filename}`;
    try {
        if (fs.existsSync(dir)) {
            fs.unlinkSync(dir);
            res.status(200).send({ message: 'deleted successfully' });
        } else {
            res.status(404).send({ message: 'not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'server error' });
    }
});


