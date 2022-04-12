const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const short = require('short-uuid');
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

  // Create user for chat engine
  const [first_name, last_name] = name.split(' ');
  const data = {
    username: `${first_name}${last_name}`,
    email: email,
    secret: hashedPassword,
    first_name: first_name,
    last_name: last_name,
  };
  const config = {
    method: 'POST',
    url: 'https://api.chatengine.io/users/',
    headers: {
      'PRIVATE-KEY': process.env.CHAT_ENGINE_PRIVATE_KEY,
    },
    data: data,
  };
  const response = await axios(config);
  const chatUser = response.data;
  console.log(chatUser);
  // Create user for backend
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    console.log(
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        chatUser: chatUser,
        token: generateToken(user._id),
      })
    );
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
