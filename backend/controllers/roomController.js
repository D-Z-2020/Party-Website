const User = require("../model/User")
const Room = require("../model/Room")
const roomController = async (req, res) => {
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
}

module.exports = roomController