const express = require('express');
const router = express.Router();
const clientCredentialsFlowController = require('../controllers/clientCredentialsFlowController');

router.get('/', clientCredentialsFlowController);

module.exports = router