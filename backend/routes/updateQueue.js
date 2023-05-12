const express = require('express');
const router = express.Router();
const updateQueueController = require('../controllers/updateQueueController');

router.post('/', updateQueueController);

module.exports = router