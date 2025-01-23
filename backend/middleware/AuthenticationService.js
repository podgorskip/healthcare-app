const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, { algorithms: ["HS256"] }, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user; 
    next(); 
  });
};

exports.generateToken = (user) => {
  return jwt.sign(
    { role: user.role },
    SECRET_KEY,         
    {
      algorithm: "HS256", 
      expiresIn: "1m",  
      subject: user._id.toString(), 
    }
  );
};

exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { role: user.role },
    SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "1m",
      subject: user._id.toString(),
    }
  );

  const refreshToken = jwt.sign(
    { role: user.role },
    REFRESH_SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "7d",
      subject: user._id.toString(),
    }
  );

  return { accessToken, refreshToken };
};