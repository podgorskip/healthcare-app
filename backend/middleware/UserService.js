const { default: mongoose } = require('mongoose');
const User = require('../models/User'); 

exports.createUser = async (userData, role) => {
    try {
        const user = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: userData.password,
            role: role
        });

        return await user.save();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

exports.removeUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error removing user:', error);
        throw error;
    }
};

exports.getUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

exports.toggleUserBan = async (id) => {
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            throw new Error('User not found');
        }
        user.banned = user.banned ? false : true;
        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Error banning user: ${error.message}`);
    }
}
