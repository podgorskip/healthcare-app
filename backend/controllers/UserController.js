const User = require('../models/User');
const Item = require('../models/Item');  
const mongoose = require('mongoose');
const userService = require('../middleware/UserService');

exports.getAllUsersEndpoint = async (req, res) => {
  console.log('.getAllUsers - invoked');

  try {
    const users = await userService.getUsers();
    const mapped = users.map(user => ({
      ...user.toObject(),
      id: user._id
    }));
    res.status(200).json(mapped);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleUserBanEndpoint = async (req, res) => {
  console.log('.toggleUserBanEndpoint - invoked');

  const { id } = req.params;

  try {
    await userService.toggleUserBan(id);
    res.status(204).json();
  } catch (err) {
    console.error('Error toggling user ban:', err);
    res.status(500).json({ message: 'Server error' });
  }
}