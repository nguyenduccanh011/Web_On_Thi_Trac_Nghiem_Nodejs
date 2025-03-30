const express = require('express');
const cors = require('cors');
const path = require('path');
const userProfileRoutes = require('./routes/user_profile.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/profile', userProfileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi, vui lòng thử lại sau'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
}); 