const Cart = require('../models/Cart');
const Item = require('../models/Item');
const mongoose = require('mongoose');

exports.addItemToCart = async (userId, itemData) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found for the user');
    }

    const { date, type, firstName, lastName, username, sex, age, details, price } = itemData;

    if (!date || !Array.isArray(date)) {
      throw new Error('Invalid date format');
    }

    if (!firstName || !lastName || !username || !sex || !age || !details || !price) {
      throw new Error('Incomplete item details');
    }

    const newItem = {
      date,
      type,
      firstName,
      lastName,
      username,
      sex,
      age,
      details,
      price,
    };

    cart.items.push(newItem);
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

exports.getCartItems = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate('items');
    if (!cart) {
      throw new Error('Cart not found for the user');
    }

    return cart.items;
  } catch (error) {
    throw new Error('Error retrieving items from cart: ' + error.message);
  }
};

