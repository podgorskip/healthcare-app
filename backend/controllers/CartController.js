const express = require('express');
const cartService = require('../middleware/CartService');

exports.addItemToCartEndpoint = async (req, res) => {
  const { cartId } = req.params;
  const { itemData } = req.body;

  try {
    const updatedCart = await cartService.addItemToCart(cartId, itemData);
    res.status(200).json(updatedCart);
  } catch (error) {
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
