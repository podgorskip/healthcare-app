const express = require('express');
const cartService = require('../middleware/CartService');

exports.addItemToCartEndpoint = async (req, res) => {
  const { id } = req.params;
  const item = req.body;

  try {
    const updatedCart = await cartService.addItemToCart(id, item);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.log('Error - failed to add item to cart, error: ', error);
    res.status(500).json({ message: error.message });
  }
}

exports.removeItemFromCartEndpoint = async (req, res) => {
  const { itemId } = req.params;

  try {
    const updatedCart = await cartService.removeItemFromCart(cartId, itemId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getCartItemsEndpoint = async (req, res) => {
  const { id } = req.params;

  try {
    const items = await cartService.getCartItems(id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
