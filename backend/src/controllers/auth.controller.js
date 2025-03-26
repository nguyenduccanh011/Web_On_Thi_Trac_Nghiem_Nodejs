const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Log validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    console.log('Registering user:', { username, email }); // Log request data
    const newUser = await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      res.status(409).json({ message: error.message }); // 409 Conflict
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const { user, token } = await authService.loginUser(username, password);

    // Có thể trả về thêm thông tin user (tùy chọn)
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { 
        user_id: user.user_id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (error) {
    if (error.message === 'Invalid credentials') {
      res.status(401).json({ message: error.message }); // 401 Unauthorized
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    
    // Kiểm tra email có tồn tại trong hệ thống không
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Lưu token vào database
    await authService.saveResetToken(user.user_id, resetToken);

    // Gửi email đặt lại mật khẩu
    await authService.sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ 
      message: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi xử lý yêu cầu quên mật khẩu' 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Tìm user theo token
    const user = await authService.findUserByResetToken(null, token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật mật khẩu mới
    await authService.updatePassword(user.user_id, password);
    
    // Xóa token đã sử dụng
    await authService.clearResetToken(user.user_id);

    res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đặt lại mật khẩu'
    });
  }
};