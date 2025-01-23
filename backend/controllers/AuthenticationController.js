const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authService = require("../middleware/AuthenticationService.js")
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

exports.authenticate = async (req, res) => {
  const { username, password } = req.body;

  try {
    const isValid = await validateCredentials(username, password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tokens = authService.generateTokens(user);

    console.log(tokens)

    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const validateCredentials = async (username, password) => {
  const user = await User.findByUsername(username);
  if (!user) {
    console.log("User not found");
    return false;
  }
  return await user.validatePassword(password);
};

exports.accountDetails = async (req, res) => {
    try {
      const userId = req.user.sub; 
  
      console.log(userId)
  
      const user = await User.findById(userId).select('-password'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        id: user._id,
        role: user.role,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        sex: user.sex,
        age: user.age,
        banned: user.banned
      });
  
    } catch (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  console.log('Refreshing token: ', refreshToken);

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided." });
  }

  try {
    // Verify the refresh token
    const user = jwt.verify(refreshToken, REFRESH_SECRET_KEY, { algorithms: ["HS256"] });

    console.log(user)

    const { sub, role } = user;

    if (!sub) {
      return res.status(403).json({ message: "Invalid token payload." });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { role },
      SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "2h",
        subject: sub
      }
    );

    console.log('New access token generated: ', newAccessToken);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};
