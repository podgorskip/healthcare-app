const User = require("../models/User");
const authService = require("../middleware/AuthenticationService.js")
const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY; 

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

    const token = authService.generateToken(user);

    console.log(token)

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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
        age: user.age
      });
  
    } catch (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided." });
  }

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, { algorithms: ["HS256"] }, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token." });
    }

    const newAccessToken = jwt.sign(
      { role: user.role },
      SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "2h",
        subject: user._id.toString(),
      }
    );

    res.json({ accessToken: newAccessToken });
  });
};