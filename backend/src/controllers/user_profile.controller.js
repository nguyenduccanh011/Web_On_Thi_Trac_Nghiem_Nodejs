const userProfileService = require('../services/user_profile.service');

exports.getProfile = async (req, res) => {
  try {
    console.log('Request user:', req.user); // Log thông tin user từ token
    const userId = req.user.user_id;
    console.log('User ID:', userId); // Log user ID
    
    const userProfile = await userProfileService.getUserProfile(userId);
    console.log('User profile:', userProfile); // Log thông tin profile
    
    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Error in getProfile:', error); // Log lỗi chi tiết
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const updateData = req.body;
    
    // Loại bỏ các trường không được phép cập nhật
    delete updateData.password;
    delete updateData.role;
    
    const updatedProfile = await userProfileService.updateUserProfile(userId, updateData);
    res.json({
      success: true,
      data: updatedProfile,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 