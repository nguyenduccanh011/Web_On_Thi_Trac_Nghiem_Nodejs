// src/services/auth.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/config'); // Import config
const { sendEmail } = require('../config/email.config'); // Import email config
const { Op } = require('sequelize');


exports.registerUser = async (username, email, password, fullname) => {
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
    full_name: fullname,
    role: 'user', // Mặc định là user
  });
  // Không trả về password đã hash
  return { id: newUser.id, username: newUser.username, email: newUser.email, full_name: newUser.full_name, role: newUser.role };

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

  // Tạo JWT token với user_id
  const token = jwt.sign({ userId: user.user_id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return { user, token };
};

// Xử lý quên mật khẩu
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  // Tạo reset token với user_id thay vì id
  const resetToken = jwt.sign({ id: user.user_id }, jwtSecret, { expiresIn: '1h' });
  
  // Lưu reset token và thời gian hết hạn vào database
  await user.update({ 
    resetToken,
    resetTokenExpires: new Date(Date.now() + 3600000) // 1 giờ
  });

  // Tạo link đặt lại mật khẩu
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  // Gửi email chứa reset link
  await sendEmail(user.email, 'Đặt lại mật khẩu', `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Đặt lại mật khẩu</h2>
      <p>Xin chào ${user.username},</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Đặt lại mật khẩu
        </a>
      </div>
      <p>Hoặc copy và paste link sau vào trình duyệt:</p>
      <p style="word-break: break-all; color: #3498db;">${resetLink}</p>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #7f8c8d; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
  `);

  return true;
};

// Xử lý đặt lại mật khẩu
exports.resetPassword = async (token, newPassword) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded token:', decoded); // Log để debug
    
    // Tìm user và kiểm tra token
    const user = await User.findOne({ 
      where: { 
        user_id: decoded.id,
        resetToken: token,
        resetTokenExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    console.log('Found user:', user ? 'Yes' : 'No'); // Log để debug

    if (!user) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật mật khẩu và xóa reset token
    await user.update({ 
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    });

    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token đã hết hạn');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token không hợp lệ');
    }
    if (error.name === 'SequelizeValidationError') {
      throw new Error('Dữ liệu không hợp lệ');
    }
    throw new Error('Có lỗi xảy ra khi đặt lại mật khẩu');

  }
};