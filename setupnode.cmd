@echo off
echo - Đang cài đặt các thư viện Node.js...
cd /d %~dp0
powerShell "echo '+ Cài đặt backend................................................................................'; cd backend; npm install; cd ..; echo ''; echo ''; echo '+ Cài đặt fontend................................................................................'; cd fontend; npm install;"
echo - Cài đặt hoàn tất.
echo - Cài đặt environment...
cd /d %~dp0
cd backend
set fileName=.env

:: Kiểm tra file có tồn tại hay không
if exist %fileName% (
    echo File "%fileName%" đã tồn tại.
) else (
    echo File "%fileName%" không tồn tại.
    echo DB_HOST=localhost > .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD=your_password >> .env
    echo DB_NAME=exam_online >> .env
    echo DB_PORT=3306 >> .env
    echo JWT_SECRET=your-super-secret-jwt-key // Thay bằng khóa bí mật JWT của bạn >> .env
)
echo - Cài đặt environment hoàn tất.