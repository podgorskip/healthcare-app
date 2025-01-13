const express = require('express');
const router = express.Router();

const cartController = require('../controllers/CartController');
const { verifyToken } = require('../middleware/AuthenticationService'); 

router.post('/:id', verifyToken, cartController.addItemToCartEndpoint);
router.get('/:id', verifyToken, cartController.getCartItemsEndpoint);
router.delete('/:id', verifyToken, cartController.removeItemFromCartEndpoint);

exports.router = router;
