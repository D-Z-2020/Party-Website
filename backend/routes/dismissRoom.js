const express = require('express');
const router = express.Router();
const dismissRoomController = require('../controllers/dismissRoomController');

router.get('/', dismissRoomController);

module.exports = router