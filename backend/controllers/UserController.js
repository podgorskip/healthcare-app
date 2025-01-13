const User = require('../models/User');
const Item = require('../models/Item');  
const mongoose = require('mongoose');
const ScheduledVisit = require('../models/ScheduledVisit');

exports.getAllUsers = async (req, res) => {
  console.log('.getAllUsers - invoked');

  try {
    const users = await User.find();  
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  console.log('.getUserById - invoked');

  const id = req.params.id;  
  
  try {
    const user = await User.findById(id).populate('scheduledVisits'); 
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.status(200).json(user);
  } catch (err) {
    console.error(err);  
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addScheduledVisitForUser = async (req, res) => {
  const { id } = req.params;
  const visitId = req.body.visitId; 

  console.log(`.addScheduledVisitForUser - invoked, user id=${id}, visit id=${visitId}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log('Error: user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const visit = await ScheduledVisit.findById(visitId);

    if (!visit) {
      console.log('Error: visit not found');
      return res.status(404).json({ message: 'Visit not found' });
    }

    if (!Array.isArray(user.scheduledVisits)) {
      user.scheduledVisits = [];
    }

    user.scheduledVisits.push(visitId);
    await user.save();
    res.status(201).json({ message: 'Scheduled visit added successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteVisit = async (req, res) => {
  const { userId, visitId } = req.params;

  console.log(`.deleteVisit - invoked, user id=${userId}, visit id=${visitId}`);

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log('Error: user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const visits = user.scheduledVisits;
    user.scheduledVisits = visits.filter(visit => visit !== visitId);
    await user.save(); 

    res.status(200);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

exports.createUser = async (req, res) => {
  console.log(`.createUser - invoked`);

  const { role, firstName, lastName, username, password, sex, age } = req.body;
  const formatSex = sex.toUpperCase();

  try {
    const newUser = new User({ role, firstName, lastName, username, password, sex: formatSex, age });
    await newUser.save(); 
    res.status(201).json(newUser._id);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.params; 
  const { date, type, details, price, firstName, lastName, username, sex, age, cancelled } = req.body;  

  console.log(`.addToCart - invoked, user id=${id}`);

  try {
    const user = await User.findById(id);

    if (!user) {
      console.log('Error: user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }

    const newItem = new Item({
      date: date,    
      type: type,
      details: details,
      price: price,
      firstName: firstName,
      lastName: lastName,
      username: username,
      sex: sex,
      age: age,
      cancelled: cancelled
    });

    console.log(newItem);

    const savedItem = await newItem.save(); 
    user.cart.push(savedItem._id);
    await user.save();

    res.status(201).json(savedItem._id);  
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, visitId } = req.params;

  console.log(`.removeFromCart - invoked, user id=${userId}, visit id=${visitId}`);

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log('Error: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.cart)) {
      console.log('Error: Cart not initialized for this user');
      return res.status(400).json({ message: 'Cart is not initialized for this user' });
    }

    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter((item) => !item.equals(visitId));  

    if (user.cart.length < initialCartLength) {
      await user.save();
      console.log(`Visit with id=${visitId} removed from cart`);

      await Item.findByIdAndDelete(visitId);

      console.log(`Item with id=${visitId} deleted from the Item collection`);

      return res.status(200).json({ message: 'Visit removed from cart and item deleted', cart: user.cart });
    } else {
      console.log(`Visit with id=${visitId} not found in cart`);
      return res.status(404).json({ message: 'Visit not found in cart' });
    }
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserCart = async (req, res) => {
  const { id } = req.params;

  console.log(`.getUserCart - invoked, user id=${id}`);

  try {
    const user = await User.findById(id).populate('cart');

    if (!user) {
      console.log('Error: user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = Array.isArray(user.cart) ? user.cart : [];

    const transformedCart = cart.map(item => {
      return {
        id: item._id,
        date: item.date,
        type: item.type,
        details: item.details,
        price: item.price,
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        age: item.age,
        sex: item.sex,
        cancelled: item.cancelled
      };
    });

    res.status(200).json(transformedCart);
  } catch (err) {
    console.error('Error fetching user cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

