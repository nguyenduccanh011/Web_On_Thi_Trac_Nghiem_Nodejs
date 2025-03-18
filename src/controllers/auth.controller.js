// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email, full_name } = req.body;
    const newUser = await authService.registerUser(username, password, email, full_name);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(401).json({ message: error.message }); // 401 Unauthorized
  }
};