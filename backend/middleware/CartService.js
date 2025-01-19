const Cart = require('../models/Cart');
const Item = require('../models/Item');
const mongoose = require('mongoose');

exports.addItemToCart = async (id, itemData) => {
  try {
    const cart = await Cart.findById(id);

    console.log(itemData)

    new Error()

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

    return item.save().then((savedItem) => {
      cart.items.push(savedItem._id);
      return cart.save();
    })

  } catch (error) {
    console.error('Error adding item:', error);
    throw new Error('Error adding item to cart: ' + error.message);
  }
};

exports.removeItemFromCart = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedItem = await Item.findOneAndDelete({ _id: id }, { session });
    if (!deletedItem) {
      throw new Error('Item not found');
    }

    await Cart.updateMany(
      { items: id },
      { $pull: { items: id } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Error removing item:', error);
    throw new Error('Error removing item from cart: ' + error.message);
  } finally {
    session.endSession();
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
    console.error('Error retrieving items:', error);
    throw new Error('Error retrieving items from cart: ' + error.message);
  }
};

