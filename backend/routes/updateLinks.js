const express = require('express');
const router = express.Router();
const updateLinksController = require('../controllers/updateLinksController');

router.post('/', updateLinksController);

module.exports = router