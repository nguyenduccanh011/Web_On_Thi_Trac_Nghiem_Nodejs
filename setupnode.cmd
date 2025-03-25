@echo off
echo - Đang cài đặt các thư viện Node.js...
cd /d %~dp0
powerShell "echo '+ Cài đặt backend................................................................................'; cd backend; npm install; cd ..; echo ''; echo ''; echo '+ Cài đặt fontend................................................................................'; cd fontend; npm install;"
echo - Cài đặt hoàn tất.