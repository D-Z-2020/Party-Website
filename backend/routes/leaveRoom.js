const express = require('express');
const router = express.Router();
const leaveRoomController = require('../controllers/leaveRoomController');

router.get('/', leaveRoomController);

module.exports = router