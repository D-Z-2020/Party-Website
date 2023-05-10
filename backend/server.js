/**
 * This file is the server of our party app. It is responsible to handle user request such as
 * Spotify login, issue JWT, verify JWT, user authentication and authorization, and so on.
 * See below for details.
 */

// import required dependencies
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
const fs = require('fs');
const userAuthenticate = require('./middleware/userAuthenticate')
const upload = require('./config/diskConnection');
const socketConfig = require('./config/socketConfig')
const PORT = process.env.PORT || 3001;

// connect to database
mongoose.connect(process.env.DATABASE_URI)

const app = express();

// use middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// endpoints
app.use('/uploads', express.static('uploads'));
app.use('/refresh', require('./routes/refresh'));
app.use('/login', require('./routes/login'));

// Get request. Client Credentials Flow to access spotify API
// this endpoint is for guest which does not need to login with Spotify
// but still allow them to access Spotify API.
app.use('/clientCredentialsFlow', require('./routes/clientCredentialsFlow'))

// Post request. register user to our website
// if name duplicate, send status 422
app.use('/userRegister', require('./routes/userRegister'))

// Post request. user login endpoint
app.use('/userLogin', require('./routes/userLogin'))

// create or restore room for host
app.get('/room', userAuthenticate, async (req, res) => {
    const name = req.name
    try {
        // get a unique room code for other user to join the room
        const code = await Room.generateUniqueCode();

        // trying to create a new room for the host
        // duplicate hostUser will throw a MongoServerError, catched in the catch block
        const room = await Room.create({
            hostUser: name,
            code: code
        })

        const user = await User.findOne({
            name: name,
        })
        user.roomId = room._id.toString()
        user.save()

        res.status(201)
        res.json(room)
    } catch (err) {
        // there already exist room with the given name as host, find 
        // the room and let the host join to that room
        const room = await Room.findOne({
            hostUser: name,
        })
        res.status(200)
        res.json(room)
    }
})

// handle when user change the content of the queue
app.post('/updateQueue', userAuthenticate, async (req, res) => {
    try {
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
})

// handle when user change the content of game links
app.post('/updateLinks', userAuthenticate, async (req, res) => {
    try {
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
})

// handle a guest join a room through 4 digit room code
app.post('/joinRoom', userAuthenticate, async (req, res) => {
    const name = req.name
    try {
        const user = await User.findOne({
            name: name,
        })

        const prevRoomId = user.roomId
        const newRoomCode = req.body["code"]

        let prevRoom = await Room.findOne({
            _id: prevRoomId,
        })

        let newRoom;
        try {
            newRoom = await Room.findOne({
                code: newRoomCode,
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
            const newRoomId = newRoom._id
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
                        await Room.findOneAndRemove({
                            _id: prevRoomId,
                        }).exec();
                        user.roomId = newRoomId
                        await user.save()

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
})

// handle when host change the room setting
app.post("/changeSetting", userAuthenticate, async (req, res) => {
    try {
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
        res.sendStatus(401)
    }
})

// get information for the room where the user is currently in
app.get("/getRoomInfo", userAuthenticate, async (req, res) => {
    try {
        const name = req.name
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
        res.sendStatus(401)
    }
})

// get the host's room code for other user to join
app.get("/userRoom", userAuthenticate, async (req, res) => {
    try {
        const name = req.name

        const user = await User.findOne({
            name: name,
        })

        const room = await Room.findOne({
            _id: user.roomId,
        })


        res.status(200)
        if (room) {
            res.json(room.code)
        }
        else {
            res.json(null)
        }

    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
})

// host permanently delete their room
app.get("/dismissRoom", userAuthenticate, async (req, res) => {
    try {
        const name = req.name

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
        res.sendStatus(401)
    }
})

// guest leave the room
app.get("/leaveRoom", userAuthenticate, async (req, res) => {
    try {
        const name = req.name

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
        res.sendStatus(401)
    }
})

// user upload image to a room, saved in server side
app.post('/upload/:roomID', upload.single('image'), (req, res) => {
    res.status(200).json({ message: 'uploaded successfully', file: req.file });
});

// get all images for a room by roomID
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

// delete a file in a room
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

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
});

socketConfig(io)