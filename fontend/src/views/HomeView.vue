<template>
  <div>
    <h1>Chào mừng đến với trang chủ</h1>
    <p>Đây là trang chủ demo của ứng dụng.</p>
    <nav>
      <ul>
        <li><router-link to="/create-question">Tạo câu hỏi mới</router-link></li>
        <li><router-link to="/create-category">Tạo danh mục mới</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>