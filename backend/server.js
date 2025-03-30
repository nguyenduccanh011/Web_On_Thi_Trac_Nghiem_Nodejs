// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize, testConnection } = require("./src/config/database"); // Import sequelize

// Import tất cả các models
require("./src/models/user.model");
require("./src/models/exam.model");
require("./src/models/exam_category.model");
require("./src/models/exam_attempt.model.js");
require("./src/models/exam_question.model.js");
require("./src/models/forum_post.model.js");
require("./src/models/forum_topic.model.js");
require("./src/models/leaderboard.model.js");
require("./src/models/user_answer.model.js");
require("./src/models/question.model");

// Import các routes
const authRoutes = require("./src/routes/auth.routes");
const examRoutes = require("./src/routes/exam.routes");
const leaderboardRoutes = require("./src/routes/leaderboard.routes");
const questionRoutes = require("./src/routes/question.routes");
const userRoutes = require("./src/routes/user.routes");
const examAttemptRoutes = require("./src/routes/exam_attempt.routes");
const examCategoryRoutes = require("./src/routes/exam_category.routes");
const forumRoutes = require("./src/routes/forum.routes.js");

// Import admin routes
const adminAuthRoutes = require("./src/routes/admin/admin_auth.routes.js");
const adminExamRoutes = require("./src/routes/admin/admin_exam.routes.js");
const adminQuestionRoutes = require("./src/routes/admin/admin_question.routes.js");
const adminUserRoutes = require("./src/routes/admin/admin_user.routes.js");
const adminExamCategoryRoutes = require("./src/routes/admin/admin_exam_category.routes.js");

const app = express(); // KHAI BÁO APP Ở ĐÂY
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Kiểm tra kết nối database
testConnection();

// Sử dụng các routes với prefix (SAU KHI khai báo app)
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/attempts", examAttemptRoutes);
app.use("/api/categories", examCategoryRoutes);
app.use("/api/forum", forumRoutes);

// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/exams", adminExamRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/categories", adminExamCategoryRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the English Exam API!");
});

// Đồng bộ hóa models với database
sequelize
  .sync({ force: false }) // Đặt force: false để không xóa dữ liệu trong database
  // .sync({ alter: true}) // Thêm đoạn này để tự động cập nhật cấu trúc bảng mà không làm mất dữ liệu
  .then(() => {
    console.log("Database synced");

    // Khởi chạy server sau khi đồng bộ hóa thành công
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
