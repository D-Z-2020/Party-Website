const User = require("../model/User")
const Room = require("../model/Room")
userRoomController = async (req, res) => {
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
}

module.exports = userRoomController