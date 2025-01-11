const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.post('/', userController.createUser);

router.post('/:id/scheduled', verifyToken, userController.addScheduledVisitForUser);
router.get('/:id/scheduled', verifyToken, userController.getUserScheduledVisits);
router.delete('/:userId/schedule/:visitId', verifyToken, userController.deleteVisit);

router.get('/:id/cart', verifyToken, userController.getUserCart);
router.post('/:id/cart', verifyToken, userController.addToCart);
router.delete('/:userId/cart/:visitId', verifyToken, userController.removeFromCart);

exports.router = router;
