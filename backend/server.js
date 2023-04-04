const dotenv = require('dotenv').config()
const express = require('express');
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/refresh', require('./routes/refresh'));

app.use('/login', require('./routes/login'))

app.get("/lyrics", require('./routes/lyrics'))

app.listen(3001)