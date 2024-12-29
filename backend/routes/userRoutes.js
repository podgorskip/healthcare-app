const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);

router.post('/:id/scheduled', userController.addScheduledVisitForUser);
router.get('/:id/scheduled', userController.getUserScheduledVisits);
router.delete('/:userId/schedule/:visitId', userController.deleteVisit);

router.get('/:id/cart', userController.getUserCart);
router.post('/:id/cart', userController.addToCart);
router.delete('/:userId/cart/:visitId', userController.removeFromCart);

exports.router = router;
