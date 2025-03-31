<template>
    <div class="container mt-5">
      <h2 class="mb-4">📜 Lịch sử thi</h2>
  
      <div v-if="history.length === 0" class="alert alert-warning">
        Không có lịch sử thi nào.
      </div>
  
      <div v-else class="table-responsive">
        <table class="table table-bordered table-hover text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Đề thi</th>
              <th>Ngày làm bài</th>
              <th>Thời gian làm bài</th>
              <th>Tổng số câu</th>
              <!-- ✅ Mới -->
              <th>Điểm</th>
              <th>Đúng</th>
              <th>Sai</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(attempt, index) in history"
              :key="attempt.attempt_id"
              @click="goToDetail(attempt.attempt_id)"
              style="cursor: pointer"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ attempt.exam.exam_name }}</td>
              <td>{{ formatDateOnly(attempt.start_time) }}</td>
              <td>{{ getDuration(attempt.start_time, attempt.end_time) }}</td>
              <td>{{ attempt.total_questions }}</td>
              <!-- ✅ Mới -->
              <td>
                <span class="badge bg-success">{{ attempt.score }}</span>
              </td>
              <td class="text-success fw-bold">{{ attempt.correct_answers }}</td>
              <td class="text-danger fw-bold">{{ attempt.incorrect_answers }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ExamAttemptView",
    data() {
      return {
        history: [],
      };
    },
    methods: {
      async fetchHistory() {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vui lòng đăng nhập để xem lịch sử");
          this.$router.push("/login");
          return;
        }
  
        try {
          const res = await fetch("http://localhost:3000/api/attempts/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          this.history = data;
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu lịch sử:", error);
        }
      },
  
      formatDateOnly(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
  
      getDuration(start, end) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffMs = endTime - startTime;
  
        const seconds = Math.floor((diffMs / 1000) % 60);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
  
        const parts = [];
        if (hours > 0) parts.push(`${hours} tiếng`);
        if (minutes > 0) parts.push(`${minutes} phút`);
        if (seconds > 0) parts.push(`${seconds} giây`);
        return parts.join(" ") || "0 giây";
      },
      goToDetail(attemptId) {
        this.$router.push(`/exam-attempt/detail/${attemptId}`);
      },
    },
    mounted() {
      this.fetchHistory();
    },
  };
  </script>
  