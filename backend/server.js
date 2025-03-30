// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./src/config/database'); // Import sequelize
const path = require('path');

// Import tất cả các models
require('./src/models/user.model');
require('./src/models/exam.model');
require('./src/models/exam_category.model');
require('./src/models/exam_attempt.model.js');
require('./src/models/exam_question.model.js');
require('./src/models/forum_post.model.js');
require('./src/models/forum_topic.model.js');
require('./src/models/leaderboard.model.js');
require('./src/models/user_answer.model.js');
require('./src/models/question.model');

// Import các routes
const authRoutes = require('./src/routes/auth.routes');
const examRoutes = require('./src/routes/exam.routes');
const leaderboardRoutes = require('./src/routes/leaderboard.routes');
const questionRoutes = require('./src/routes/question.routes');
const userRoutes = require('./src/routes/user.routes');
const examAttemptRoutes = require('./src/routes/exam_attempt.routes');
const examCategoryRoutes = require('./src/routes/exam_category.routes');
const forumRoutes = require('./src/routes/forum.routes.js');
const userProfileRoutes = require('./src/routes/user_profile.routes.js');

// Import admin routes
const adminAuthRoutes = require('./src/routes/admin/admin_auth.routes.js');
const adminExamRoutes = require('./src/routes/admin/admin_exam.routes.js');
const adminQuestionRoutes = require('./src/routes/admin/admin_question.routes.js');
const adminUserRoutes = require('./src/routes/admin/admin_user.routes.js');
const adminExamCategoryRoutes = require('./src/routes/admin/admin_exam_category.routes.js');


const app = express(); // KHAI BÁO APP Ở ĐÂY
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // URL của frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Cho phép truy cập file tĩnh từ các origin khác
}));
app.use(morgan('dev'));
app.use(express.json());

// Kiểm tra kết nối database
testConnection();

// Sử dụng các routes với prefix (SAU KHI khai báo app)
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/attempts', examAttemptRoutes);
app.use('/api/categories', examCategoryRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/profile', userProfileRoutes);

// Admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/exams', adminExamRoutes);
app.use('/api/admin/questions', adminQuestionRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/categories', adminExamCategoryRoutes);

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Welcome to the English Exam API!');
});

// Đồng bộ hóa models với database
sequelize.sync({ force: false }) // Thêm đoạn này
    .then(() => {
        console.log('Database synced');

        // Khởi chạy server sau khi đồng bộ hóa thành công
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });