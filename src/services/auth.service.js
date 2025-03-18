const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.registerUser = async (username, password, email, full_name) => {
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, email, full_name });
    return { user_id: newUser.user_id, username: newUser.username, email: newUser.email, full_name: newUser.full_name };
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.user_id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw error;
  }
};