<template>
  <div class="home">
    <div class="banner">
      <h1>Chào mừng đến với trang web ôn thi trắc nghiệm tiếng Anh</h1>
      <p>Nâng cao kỹ năng tiếng Anh của bạn với các bài thi chất lượng cao.</p>
    </div>
    <div class="features">
      <div class="feature">
        <h2>Đa dạng bài thi</h2>
        <p>Truy cập hàng trăm bài thi trắc nghiệm theo cấp độ và chủ đề.</p>
      </div>
      <div class="feature">
        <h2>Theo dõi tiến độ</h2>
        <p>Xem lịch sử thi và theo dõi sự tiến bộ của bạn.</p>
      </div>
      <div class="feature">
        <h2>Cộng đồng học tập</h2>
        <p>Tham gia diễn đàn để chia sẻ kiến thức và kinh nghiệm.</p>
      </div>
    </div>
    <nav>
      <ul>
        <li>
          <router-link to="/create-question">Tạo câu hỏi mới</router-link>
        </li>
        <li><router-link to="/create-exam">Tạo đề thi mới</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.banner {
  background-color: #3498db;
  color: white;
  padding: 40px;
  margin-bottom: 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.feature {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 30%;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin: 0 10px;
}

nav ul li a {
  text-decoration: none;
  color: #3498db;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>
