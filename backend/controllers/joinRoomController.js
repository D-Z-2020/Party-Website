const User = require("../model/User")
const Room = require("../model/Room")
const joinRoomController = async (req, res) => {
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
}

module.exports = joinRoomController