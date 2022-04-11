const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Login Route
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials...');
  }
});

// Register Route
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // Check user fills all the fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all the fields...');
  }
  // Check user already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Already registered with this email.Please login...');
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }
});

// Get profile
const profile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const userController = {
  login,
  register,
  profile,
};

module.exports = userController;
