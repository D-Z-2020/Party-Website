const express = require('express');
const router = express.Router();
const joinRoomController = require('../controllers/joinRoomController');

router.post('/', joinRoomController);

module.exports = router