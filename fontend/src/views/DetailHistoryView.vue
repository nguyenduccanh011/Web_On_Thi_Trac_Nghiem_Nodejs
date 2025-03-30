<template>
  <div class="container mt-5">
    <h2 class="mb-4">📝 Chi tiết bài làm: {{ attempt?.exam.exam_name }}</h2>

    <div v-if="!attempt" class="alert alert-info">Đang tải dữ liệu...</div>

    <div v-else>
      <div
        v-for="(ua, index) in attempt.user_answers"
        :key="ua.user_answer_id"
        class="mb-5 p-4 border rounded shadow-sm bg-light"
      >
        <p>
          <strong>Câu {{ index + 1 }} ({{ ua.question.difficulty }}):</strong>
          {{ ua.question.question_text }}
        </p>

        <div class="row">
          <div
            class="col-12 col-md-6 mb-3"
            v-for="answer in ua.question.answers"
            :key="answer.answer_id"
          >
            <div
              class="p-3 rounded text-center fw-semibold border d-flex justify-content-between align-items-center"
              :class="getAnswerClass(answer, ua)"
            >
              <span>{{ answer.answer_text }}</span>
              <span v-if="answer.answer_id == ua.selected_answer">
                <span v-if="ua.is_correct">✅</span>
                <span v-else>❌</span>
              </span>
            </div>
          </div>
        </div>

        <p class="mt-2">
          <strong>Giải thích:</strong> {{ ua.question.explanation }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryDetailView",
  data() {
    return {
      attempt: null,
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    const attemptId = this.$route.params.attemptId;

    try {
      const res = await fetch(
        `http://localhost:3000/api/attempts/${attemptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Lỗi khi tải chi tiết bài thi");
        this.$router.push("/history");
        return;
      }

      const data = await res.json();
      this.attempt = data;
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      alert("Lỗi không xác định.");
      this.$router.push("/history");
    }
  },
  methods: {
    getAnswerClass(answer, ua) {
      const isSelected = answer.answer_id == ua.selected_answer;

      // Nếu là đáp án không được chọn
      if (!isSelected) {
        return "bg-secondary text-white border-secondary";
      }

      if (ua.is_correct) {
        // Nếu là đáp án đúng
        return "bg-success text-white border-success";
      } else {
        // Nếu là đáp án đsai
        return "bg-danger text-white border-danger";
      }
    },
  },
};
</script>

<style scoped>
/* Không cần nhiều style vì đã dùng Bootstrap */
</style>
