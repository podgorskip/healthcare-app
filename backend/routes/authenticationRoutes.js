const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/AuthenticationController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.post('/authenticate', authenticationController.authenticate);
router.get('/account', verifyToken, authenticationController.accountDetails);
router.post('/refresh-token', authenticationController.refreshToken);

exports.router = router;
