const mongoose = require("mongoose")

function getCurrentDT() {
    const currentDT = new Date();
    const formattedD = currentDT.toISOString().slice(0, 10);
    const hours = String(currentDT.getHours()).padStart(2, '0');
    const minutes = String(currentDT.getMinutes()).padStart(2, '0');
    return `${formattedD} ${hours}:${minutes}`;
}

const roomSchema = new mongoose.Schema({
    hostUser: { type: String, required: true, unique: true },
    queue: { type: Array, default: [] },
    links: { type: Array, default: [] },
    partyName: { type: String, default: "Party Space" },
    location: { type: String, default: "not specified" },
    date: { type: String, default: getCurrentDT }
})

module.exports = mongoose.model('Room', roomSchema);