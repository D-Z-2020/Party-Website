const Room = require("../model/Room")
const updateQueueController = async (req, res) => {
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
}

module.exports = updateQueueController