# Web On Thi Trac Nghiem Nodejs

## Models

### Question

The `Question` model represents a question in the system.

- `question_id`: Integer, primary key, auto-increment.
- `question_text`: Text, not null.
- `correct_answer`: String(255), not null.
- `category_id`: Integer, not null, foreign key referencing `ExamCategory`.
- `difficulty`: Enum('easy', 'medium', 'hard').
- `explanation`: Text.
- `created_at`: Date, default value is now.
- `updated_at`: Date.

### Answer

The `Answer` model represents an answer option for a question.

- `answer_id`: Integer, primary key, auto-increment.
- `answer_text`: String(255), not null.
- `question_id`: Integer, not null, foreign key referencing `Question`.
- `is_correct`: Boolean, not null, default value is false.
- `created_at`: Date, default value is now.
- `updated_at`: Date.

## API Endpoints

### Create a Question

To create a new question with answers, send a POST request to `/questions` with the following JSON body:

```json
{
  "question_text": "What is the capital of France?",
  "correct_answer": "Paris",
  "category_id": 1,
  "difficulty": "easy",
  "explanation": "Paris is the capital of France.",
  "answers": [
    { "answer_text": "Paris", "is_correct": true },
    { "answer_text": "London", "is_correct": false },
    { "answer_text": "Berlin", "is_correct": false },
    { "answer_text": "Madrid", "is_correct": false }
  ]
}
```

### Get a Question

To get a question with its answers, send a GET request to `/questions/:id`.

### Update a Question

To update a question, send a PUT request to `/questions/:id` with the updated data.

### Delete a Question

To delete a question, send a DELETE request to `/questions/:id`.

### Search Questions

To search for questions, send a GET request to `/questions/search?q=searchTerm`.


# 🚀 Ý nghĩa của `feat`, `fix`, `chore`, ... trong Git Commit  

## 📌 1. Các loại commit phổ biến  

| **Loại commit** | **Ý nghĩa** | **Ví dụ** |
|---------------|------------|----------------|
| `feat` | Thêm tính năng mới | `feat(auth): Thêm đăng nhập Google` |
| `fix` | Sửa lỗi | `fix(cart): Sửa lỗi không thể xóa sản phẩm` |
| `chore` | Cập nhật config, package, task phụ | `chore: Cập nhật axios lên bản mới` |
| `refactor` | Cải thiện code, không đổi chức năng | `refactor(api): Tối ưu truy vấn SQL` |
| `style` | Chỉnh sửa format, coding style | `style: Chuẩn hóa code theo ESLint` |
| `test` | Viết/sửa test case | `test: Thêm unit test cho đặt hàng` |
| `perf` | Tối ưu hiệu suất | `perf(api): Cải thiện caching sản phẩm` |
| `docs` | Cập nhật tài liệu | `docs: Thêm hướng dẫn cài đặt vào README.md` |
| `ci` | Thay đổi CI/CD pipeline | `ci: Cập nhật GitHub Actions` |
| `build` | Cấu hình build hệ thống | `build: Thêm webpack vào dự án` |
| `revert` | Hoàn tác commit trước đó | `revert: Hoàn tác commit "feat(cart): Thêm xóa sản phẩm"` |


Ví dụ
git commit -m "feat(controller): Thêm API lấy danh sách sản phẩm"
git commit -m "fix(repository): Sửa lỗi truy vấn dữ liệu sản phẩm"
git commit -m "chore(database): Tạo bảng mới lưu lịch sử thanh toán"

