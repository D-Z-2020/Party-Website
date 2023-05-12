const express = require('express');
const router = express.Router();
const userRoomController = require('../controllers/userRoomController');

router.get('/', userRoomController);

module.exports = router