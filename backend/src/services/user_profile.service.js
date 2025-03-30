const User = require('../models/user.model');

exports.getUserProfile = async (userId) => {
  try {
    console.log('Finding user with ID:', userId); // Log ID đang tìm kiếm
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Loại bỏ password khỏi kết quả trả về
    });
    
    console.log('Found user:', user); // Log kết quả tìm kiếm
    
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    return user;
  } catch (error) {
    console.error('Error in getUserProfile:', error); // Log lỗi chi tiết
    throw error;
  }
};

exports.updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Cập nhật thông tin người dùng
    await user.update(updateData);
    
    // Trả về thông tin đã cập nhật (không bao gồm password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
}; 