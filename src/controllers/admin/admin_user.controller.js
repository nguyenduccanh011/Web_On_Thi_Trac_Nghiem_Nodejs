// src/controllers/admin/admin_user.controller.js
const adminUserService = require('../../services/admin/admin_user.service');

// Các hàm quản lý người dùng (phân quyền, ...)
exports.getAllUsers = async (req, res) => {
    try {
      const users = await adminUserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await adminUserService.updateUser(userId, userData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      await adminUserService.deleteUser(userId);
      res.status(204).json({message: "User deleted successfully"});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.changeUserRole = async (req, res) => {
    try {
      const { userId, newRole } = req.body;
      const updatedUser = await adminUserService.changeUserRole(userId, newRole);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getUsersByRole = async (req, res) => {
      try {
          const role = req.params.role;
          const users = await adminUserService.getUsersByRole(role);
          res.status(200).json(users);
      } catch (error) {
          res.status(500).json({message: error.message});
      }
  }