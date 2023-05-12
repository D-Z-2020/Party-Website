const User = require("../model/User")
const Room = require("../model/Room")
const fs = require('fs');
const dismissRoomController = async (req, res) => {
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
}

module.exports = dismissRoomController