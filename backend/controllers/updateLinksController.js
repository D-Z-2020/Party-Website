const Room = require("../model/Room")

const updateLinksController = async (req, res) => {
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
}

module.exports = updateLinksController