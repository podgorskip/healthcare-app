const Cart = require('../models/Cart');
const Item = require('../models/Item');
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { notifyCartUpdate } = require('./NotificationService');

exports.addItemToCart = async (id, itemData) => {
  try {
    const cart = await Cart.findById(id);

    if (!cart) {
      throw new Error('Cart not found for the user');
    }

    const { date, type, firstName, lastName, username, sex, age, details, price, doctor } = itemData;

    if (!date || !Array.isArray(date)) {
      throw new Error('Invalid date format');
    }

    const item = new Item({
      date,
      type,
      firstName,
      lastName,
      username,
      sex,
      age,
      details,
      price,
      doctor
    })

    const savedItem = item.save().then((savedItem) => {
      cart.items.push(savedItem._id);
      return cart.save();
    })

    const patient = await Patient.findOne({ cart: id }).populate('user');
    const items = await this.getCartItems(patient.user._id);

    notifyCartUpdate(id, items);
    return savedItem;

  } catch (error) {
    console.error('Error adding item:', error);
    throw new Error('Error adding item to cart: ' + error.message);
  }
};

exports.removeItemFromCart = async (id) => {

  try {
    const cart = await Cart.findOne({ items: id });
    if (!cart) {
      throw new Error('Item not found in any cart');
    }

    const deletedItem = await Item.findOneAndDelete({ _id: id });
    if (!deletedItem) {
      throw new Error('Item not found');
    }

    cart.items.pull(id);
    await cart.save();

    const patient = await Patient.findOne({ cart: cart._id }).populate('user');
    const items = await this.getCartItems(patient.user._id);

    notifyCartUpdate(cart._id, items.filter(i => i._id !== id));

  } catch (error) {
    console.error('Error removing item:', error);
    throw new Error('Error removing item from cart: ' + error.message);
  }
};

exports.getCartItems = async (userId) => {
  try {

    const patient = await Patient.findOne({ user: userId}).populate({
      path: 'cart',
      populate: {
        path: 'items',
        model: 'Item',
      },
    })

    if (!patient || !patient.cart) {
      throw new Error('Cart not found for the user');
    }

    return patient.cart.items; 
  } catch (error) {
    console.error('Error retrieving items:', error);
    throw new Error('Error retrieving items from cart: ' + error.message);
  }
};