const User = require("../model/User")
const Room = require("../model/Room")
const getRoomInfoController = async (req, res) => {
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
}

module.exports = getRoomInfoController