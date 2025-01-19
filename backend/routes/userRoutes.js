const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/', verifyToken, userController.getAllUsersEndpoint);
router.patch('/:id', verifyToken, userController.toggleUserBanEndpoint);

exports.router = router;
