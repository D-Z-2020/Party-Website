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
    partyName: { type: String, default: "My Party" },
    location: { type: String, default: "Not specified" },
    date: { type: String, default: getCurrentDT },
    code: { type: String, unique: true, required: true }
})

roomSchema.statics.generateUniqueCode = async function () {
    let code = 1000;
    let existingRoom = null;

    do {
        existingRoom = await this.findOne({ code:String(code) });
        if (!existingRoom) {
            break;
        }
        code++;
    } while (code <= 9999);

    if (code > 9999) {
        throw new Error('No unique code avaliable!');
    }

    return String(code);
};

module.exports = mongoose.model('Room', roomSchema);