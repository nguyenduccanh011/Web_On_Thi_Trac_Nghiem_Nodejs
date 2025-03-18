# Web_On_Thi_Trac_Nghiem_Nodejs

# Dự án Web Ôn Thi Tiếng Anh Trắc Nghiệm

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ## Tổng quan

Dự án này là một ứng dụng web được xây dựng bằng Node.js, cung cấp nền tảng cho người dùng ôn luyện tiếng Anh thông qua các bài thi trắc nghiệm. Dự án bao gồm các chức năng cho cả người dùng thông thường và quản trị viên (Admin).

## Các chức năng chính

**Người dùng:**

* Đăng ký và đăng nhập tài khoản.
* Tham gia các bài thi trắc nghiệm tiếng Anh.
* Xem kết quả thi chi tiết sau mỗi lần thi.
* Theo dõi lịch sử các lần thi đã thực hiện.
* Xem bảng xếp hạng người dùng dựa trên điểm số.
* Tham gia trao đổi, thảo luận câu hỏi trên diễn đàn.

**Admin:**

* Quản lý phân quyền người dùng (gán vai trò admin).
* Thêm, chỉnh sửa và xóa câu hỏi trắc nghiệm.
* Xem báo cáo thống kê về hoạt động của người dùng và hệ thống.
* Thêm các danh mục đề thi (ví dụ: Ngữ pháp, Từ vựng, Đọc hiểu).
* Tạo và quản lý các đề thi, bao gồm việc chọn câu hỏi từ ngân hàng câu hỏi.
* Tự động hóa việc chọn ngẫu nhiên câu hỏi theo cấu trúc đề thi đã định.

## Cơ sở dữ liệu

* **Hệ quản trị cơ sở dữ liệu:** [Điền tên hệ quản trị CSDL bạn sử dụng, ví dụ: MySQL]

* **Các bảng:**

    * **`users`:** Lưu thông tin người dùng
        * `user_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `username` (`VARCHAR(50)`, UNIQUE, NOT NULL)
        * `password` (`VARCHAR(255)`, NOT NULL)
        * `email` (`VARCHAR(100)`, UNIQUE, NOT NULL)
        * `full_name` (`VARCHAR(100)`)
        * `registration_date` (`TIMESTAMP`)
        * `last_login` (`TIMESTAMP`)
        * `role` (`ENUM('user', 'admin')`)
        * `profile_picture` (`VARCHAR(255)`)

    * **`questions`:** Lưu trữ các câu hỏi trắc nghiệm
        * `question_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `question_text` (`TEXT`, NOT NULL)
        * `correct_answer` (`VARCHAR(255)`, NOT NULL)
        * `option_a` (`VARCHAR(255)`, NOT NULL)
        * `option_b` (`VARCHAR(255)`, NOT NULL)
        * `option_c` (`VARCHAR(255)`)
        * `option_d` (`VARCHAR(255)`)
        * `category_id` (`INT`, FOREIGN KEY `exam_categories`)
        * `difficulty` (`ENUM('easy', 'medium', 'hard')`)
        * `explanation` (`TEXT`)
        * `created_at` (`TIMESTAMP`)
        * `updated_at` (`TIMESTAMP`)

    * **`exam_categories`:** Lưu trữ thông tin về các danh mục đề thi
        * `category_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `category_name` (`VARCHAR(100)`, UNIQUE, NOT NULL)
        * `description` (`TEXT`)
        * `created_at` (`TIMESTAMP`)
        * `updated_at` (`TIMESTAMP`)

    * **`exams`:** Lưu trữ thông tin về các đề thi
        * `exam_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `exam_name` (`VARCHAR(100)`, NOT NULL)
        * `description` (`TEXT`)
        * `category_id` (`INT`, FOREIGN KEY `exam_categories`)
        * `created_at` (`TIMESTAMP`)
        * `updated_at` (`TIMESTAMP`)

    * **`exam_questions`:** Quan hệ nhiều-nhiều giữa `exams` và `questions`
        * `exam_question_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `exam_id` (`INT`, FOREIGN KEY `exams`)
        * `question_id` (`INT`, FOREIGN KEY `questions`)
        * `question_order` (`INT`)

    * **`exam_attempts`:** Lưu trữ thông tin về các lần thi của người dùng
        * `attempt_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `user_id` (`INT`, FOREIGN KEY `users`)
        * `exam_id` (`INT`, FOREIGN KEY `exams`)
        * `start_time` (`TIMESTAMP`)
        * `end_time` (`TIMESTAMP`)
        * `score` (`DECIMAL(5, 2)`)
        * `total_questions` (`INT`)
        * `correct_answers` (`INT`)
        * `incorrect_answers` (`INT`)

    * **`user_answers`:** Lưu trữ chi tiết câu trả lời của người dùng trong mỗi lần thi
        * `user_answer_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `attempt_id` (`INT`, FOREIGN KEY `exam_attempts`)
        * `question_id` (`INT`, FOREIGN KEY `questions`)
        * `selected_answer` (`VARCHAR(255)`)
        * `is_correct` (`BOOLEAN`)

    * **`leaderboard`:** Lưu trữ thông tin bảng xếp hạng người dùng
        * `leaderboard_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `user_id` (`INT`, FOREIGN KEY `users`)
        * `score` (`DECIMAL(10, 2)`)
        * `rank` (`INT`)
        * `last_attempt_date` (`TIMESTAMP`)

    * **`forum_topics`:** Lưu trữ các chủ đề thảo luận trên diễn đàn
        * `topic_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `user_id` (`INT`, FOREIGN KEY `users`)
        * `title` (`VARCHAR(255)`, NOT NULL)
        * `created_at` (`TIMESTAMP`)
        * `updated_at` (`TIMESTAMP`)

    * **`forum_posts`:** Lưu trữ các bài viết trong từng chủ đề thảo luận
        * `post_id` (`INT`, PRIMARY KEY, AUTO_INCREMENT)
        * `topic_id` (`INT`, FOREIGN KEY `forum_topics`)
        * `user_id` (`INT`, FOREIGN KEY `users`)
        * `content` (`TEXT`, NOT NULL)
        * `created_at` (`TIMESTAMP`)
        * `updated_at` (`TIMESTAMP`)
        

## Giao diện người dùng (dự kiến)

* **Công nghệ Frontend (dự kiến):** [Điền công nghệ bạn dự định sử dụng, ví dụ: HTML, CSS, JavaScript thuần, hoặc các framework/thư viện như React, Angular, Vue.js]

* **Các trang giao diện chính:**
    * **Trang chủ:** Giới thiệu về website, có thể hiển thị các đề thi nổi bật.
    * **Trang đăng ký/đăng nhập:** Cho phép người dùng tạo tài khoản hoặc đăng nhập.
    * **Trang danh sách đề thi:** Hiển thị danh sách các đề thi có sẵn, có thể có bộ lọc theo danh mục.
    * **Trang làm bài thi:** Giao diện để người dùng thực hiện bài thi trắc nghiệm.
    * **Trang kết quả thi:** Hiển thị kết quả chi tiết sau khi hoàn thành bài thi.
    * **Trang lịch sử thi:** Cho phép người dùng xem lại các lần thi trước đó.
    * **Trang bảng xếp hạng:** Hiển thị danh sách người dùng có điểm số cao nhất.
    * **Trang diễn đàn:** Nơi người dùng có thể đặt câu hỏi và thảo luận.
    * **Trang quản trị (Admin Dashboard):** Giao diện quản lý dành cho admin, bao gồm các chức năng thêm/sửa/xóa câu hỏi, quản lý đề thi, xem báo cáo, v.v.

## Hướng dẫn cài đặt và chạy dự án

1.  **Cài đặt Node.js và npm trên máy tính của bạn.**
2.  **Clone repository này (nếu có).**
3.  **Di chuyển vào thư mục dự án:** `cd your-project-directory`
4.  **Cài đặt các dependencies:** `npm install` hoặc `yarn install`
5.  **Tạo file `.env` ở thư mục gốc và cấu hình các biến môi trường cần thiết (ví dụ: thông tin kết nối cơ sở dữ liệu).** 
6.  **Khởi chạy server:** `npm start` hoặc `node server.js` (tùy thuộc vào cấu hình trong `package.json`).
7.  **Truy cập ứng dụng trên trình duyệt tại địa chỉ:** `http://localhost:3000` (hoặc cổng bạn đã cấu hình).

## Công nghệ sử dụng

* Node.js
* Express.js
* MySQL
* Sequelize
* bcrypt
* jsonwebtoken
* cors
* helmet
* express-validator

## Đóng góp 