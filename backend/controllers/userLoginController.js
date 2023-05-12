const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../model/User")

const userLoginController = async (req, res) => {
    const user = await User.findOne({
        name: req.body.name,
    })

    if (!user) {
        res.status(400).send("name does not exist")
        return;
    }

    const isValidPassword = await bcryptjs.compare(req.body.password, user.password)

    if (isValidPassword) {
        const token = jwt.sign({
            name: req.body.name
        }, process.env.TOKEN_SECRET)

        res.status(200)
        res.json({ token: token })
    } else {
        res.status(401).send("invalid password")
    }
}

module.exports = userLoginController