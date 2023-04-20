const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    hostUser: {type: String, required: true, unique: true},
    queue : { type: Array, default: []},
})

module.exports = mongoose.model('Room', roomSchema);