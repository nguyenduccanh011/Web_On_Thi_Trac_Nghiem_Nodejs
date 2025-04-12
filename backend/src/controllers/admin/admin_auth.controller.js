const adminAuthService = require('../../services/admin/admin_auth.service'); 

exports.adminLogin = async (req, res) => {
      try {
        const { username, password } = req.body;
        const token = await adminAuthService.adminLogin(username, password); 

        if (token) {
          res.json({ message: "Admin login successful", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};