// src/services/auth.service.js
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

        const existingEmail = await User.findOne({where: {email}});
        if(existingEmail) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash mật khẩu (saltRounds = 10)
        const newUser = await User.create({ username, password: hashedPassword, email, full_name });

        // Trả về thông tin user (không bao gồm mật khẩu)
        return { user_id: newUser.user_id, username: newUser.username, email: newUser.email, full_name: newUser.full_name };
    } catch (error) {
        throw error; // Ném lỗi để controller xử lý
    }
};

exports.loginUser = async (username, password) => {
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error('Invalid credentials'); // Tên người dùng không tồn tại
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials'); // Mật khẩu không đúng
        }

        // Tạo JWT token
        const token = jwt.sign({ userId: user.user_id, role: user.role }, config.jwtSecret, { expiresIn: '1h' }); // Thời hạn 1 giờ

        return token;
    } catch (error) {
        throw error;
    }
};