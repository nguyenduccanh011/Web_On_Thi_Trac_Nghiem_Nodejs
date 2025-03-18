// src/controllers/admin/admin_auth.controller.js
// (Có thể không cần thiết nếu admin cũng dùng chung chức năng login/register)
// Nếu có hệ thống admin riêng, bạn có thể tạo controller này
const adminAuthService = require('../../services/admin/admin_auth.service'); // Nếu có service riêng

exports.adminLogin = async (req, res) => {
    // Tương tự như login của user, nhưng có thể kiểm tra thêm role
      try {
        const { username, password } = req.body;
        const token = await adminAuthService.adminLogin(username, password);  //Giả sử có hàm này

        if (token) {
          res.json({ message: "Admin login successful", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};