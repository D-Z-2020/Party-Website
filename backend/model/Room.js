const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    hostUser: {type: String, required: true, unique: true},
    queue : { type: Array, default: []},
    links : { type: Array, default: []}
})

module.exports = mongoose.model('Room', roomSchema);