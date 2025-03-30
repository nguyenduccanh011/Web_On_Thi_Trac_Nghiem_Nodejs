const { defineConfig } = require('@vue/cli-service')
//Cấu hình proxy để tráng lỗi CORS khi gọi API
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {  // Mọi request bắt đầu bằng /api sẽ được chuyển đến backend
        target: 'http://localhost:3000', // URL của backend
        changeOrigin: true, // Cần thiết cho virtual hosted sites
        // pathRewrite: { // (Tùy chọn) Nếu bạn muốn thay đổi đường dẫn
        //   '^/api': '' // Ví dụ: Xóa /api khỏi đường dẫn
        // }
      },
      '/uploads': {  // Thêm proxy cho thư mục uploads
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})

