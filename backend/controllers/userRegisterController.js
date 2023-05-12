const bcryptjs = require("bcryptjs")
const User = require("../model/User")

const userRegisterController = async (req, res) => {
    try {
        const encryptedPassword = await bcryptjs.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            password: encryptedPassword
        })
        res.sendStatus(200)
    } catch (err) {
        res.status(422).send("duplicate name")
    }
}

module.exports = userRegisterController