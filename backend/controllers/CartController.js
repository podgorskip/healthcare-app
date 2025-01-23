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
  const { id } = req.params;

  try {
    const updatedCart = await cartService.removeItemFromCart(id);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.log('Error - failed to remove item from cart, error: ', error);
    res.status(500).json({ message: error.message });
  }
}

exports.getCartItemsEndpoint = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const items = await cartService.getCartItems(id);
    res.status(200).json(items);
  } catch (error) {
    console.log('Error - failed to fetch items from cart, error: ', error);
    res.status(500).json({ message: error.message });
  }
}
