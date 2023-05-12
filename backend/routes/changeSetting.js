const express = require('express');
const router = express.Router();
const changeSettingController = require('../controllers/changeSettingController');

router.post('/', changeSettingController);

module.exports = router