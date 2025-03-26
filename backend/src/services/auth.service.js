// src/services/auth.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/config'); // Import config

exports.registerUser = async (username, email, password) => {
  // Kiểm tra username và email đã tồn tại chưa
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new Error('Username already exists');
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash mật khẩu
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role: 'user', // Mặc định là user
  });
  // Không trả về password đã hash
  return { user_id: newUser.user_id, username: newUser.username, email: newUser.email, role: newUser.role };
};

exports.loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Tạo JWT token
  const token = jwt.sign({ user_id: user.user_id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiration,
  });

  return { user, token };
};