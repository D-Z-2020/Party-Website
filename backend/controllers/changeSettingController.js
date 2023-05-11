const Room = require("../model/Room")
const changeSettingController = async (req, res) => {
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
}

module.exports = changeSettingController