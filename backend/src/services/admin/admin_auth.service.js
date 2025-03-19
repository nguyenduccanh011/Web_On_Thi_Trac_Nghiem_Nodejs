const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.adminLogin = async (username, password) => {
    try {
        const user = await User.findOne({ where: { username, role: 'admin' } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.user_id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
        return token;
    } catch (error) {
        throw error;
    }
};
