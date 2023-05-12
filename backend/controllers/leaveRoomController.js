const User = require("../model/User")
const Room = require("../model/Room")
const leaveRoomController = async (req, res) => {
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
}

module.exports = leaveRoomController