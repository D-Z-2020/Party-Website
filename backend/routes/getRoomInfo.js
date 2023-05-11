const express = require('express');
const router = express.Router();
const getRoomInfoController = require('../controllers/getRoomInfoController');

router.get('/', getRoomInfoController);

module.exports = router