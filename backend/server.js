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
const fs = require('fs');
const userAuthenticate = require('./middleware/userAuthenticate')
const upload = require('./config/diskConnection');
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

// Get request. create or restore room for host
app.use('/room', userAuthenticate, require('./routes/room'))

// Post request. handle when user change the content of the queue
app.use('/updateQueue', userAuthenticate, require('./routes/updateQueue'))

// Post request. handle when user change the content of game links
app.use('/updateLinks', userAuthenticate, require("./routes/updateLinks"))

// Post request. Handle a guest join a room through 4 digit room code
app.use('/joinRoom', userAuthenticate, require('./routes/joinRoom'))

// Post request. handle when host change the room setting
app.use("/changeSetting", userAuthenticate, require('./routes/changeSetting'))

// Get request. get information for the room where the user is currently in
app.use("/getRoomInfo", userAuthenticate, require('./routes/getRoomInfo'))

// Get request. get the user's current room code
app.use("/userRoom", userAuthenticate, require('./routes/userRoom'))

// Get request. host permanently delete their room
app.use("/dismissRoom", userAuthenticate, require('./routes/dismissRoom'))

// Get request. Guest leave the room
app.use("/leaveRoom", userAuthenticate, require('./routes/leaveRoom'))

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
            return res.status(500).send('Error reading directory');
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
            res.status(200).send('deleted successfully');
        } else {
            res.status(404).send('not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
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

io.on("connection", (socket) => {
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