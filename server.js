// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./src/config/database'); // Import sequelize

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

const authRoutes = require('./src/routes/auth.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Kiểm tra kết nối database
testConnection();

// Routes
app.use('/api/auth', authRoutes);

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