const express = require('express');
const router = express.Router();
const userRegisterController = require('../controllers/userRegisterController');

router.post('/', userRegisterController);

module.exports = router