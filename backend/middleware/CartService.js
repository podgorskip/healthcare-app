const Cart = require('../models/Cart');
const Item = require('../models/Item');
const mongoose = require('mongoose');

exports.addItemToCart = async (cartId, itemId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemExists = await Item.exists({ _id: itemId });
    if (!itemExists) {
      throw new Error('Item not found');
    }

    cart.items.push(itemId);
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error('Error adding item to cart: ' + error.message);
  }
};

exports.removeItemFromCart = async (cartId, itemId) => {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter((id) => id.toString() !== itemId);
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error('Error removing item from cart: ' + error.message);
  }
};

exports.getCartItems = async (id) => {
  try {
    const cart = await Cart.findById(id).populate('items');
    if (!cart) {
      throw new Error('Cart not found');
    }

    return cart.items;
  } catch (error) {
    throw new Error('Error retrieving items from cart: ' + error.message);
  }
};
