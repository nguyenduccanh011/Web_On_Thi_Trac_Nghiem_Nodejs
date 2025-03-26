// src/services/auth.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/config'); // Import config
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

// Tìm user theo email
exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

// Lưu token đặt lại mật khẩu
exports.saveResetToken = async (userId, token) => {
  try {
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token hết hạn sau 1 giờ

    await User.update(
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      },
      {
        where: { user_id: userId }
      }
    );
  } catch (error) {
    console.error('Error saving reset token:', error);
    throw error;
  }
};

// Gửi email đặt lại mật khẩu
exports.sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Đặt lại mật khẩu',
    html: `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}">Đặt lại mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Tìm user theo reset token
exports.findUserByResetToken = async (userId, token) => {
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date() // Sử dụng thời gian hiện tại
        }
      }
    });
    return user;
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    return null;
  }
};

// Cập nhật mật khẩu mới
exports.updatePassword = async (userId, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { user_id: userId } }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Xóa token đặt lại mật khẩu
exports.clearResetToken = async (userId) => {
  try {
    await User.update(
      {
        resetPasswordToken: null,
        resetPasswordExpires: null
      },
      {
        where: { user_id: userId }
      }
    );
  } catch (error) {
    console.error('Error clearing reset token:', error);
    throw error;
  }
};