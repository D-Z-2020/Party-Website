const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLoginController');

router.post('/', userLoginController);

module.exports = router