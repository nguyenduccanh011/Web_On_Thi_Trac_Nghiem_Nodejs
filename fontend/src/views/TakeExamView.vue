<template>
  <div class="container mt-5">
    <h2 class="mb-4">🧠 Bài thi</h2>

    <div v-if="loading" class="alert alert-info">Đang tải câu hỏi...</div>

    <!-- Giao diện sau khi nộp bài -->
    <div
      v-else-if="submitted"
      class="alert alert-success p-4 rounded shadow-sm"
    >
      <h4>🎉 Bạn đã hoàn thành bài thi!</h4>
      <p>✅ Số câu đúng: {{ correctCount }} / {{ questions.length }}</p>
      <p>🏆 Tổng điểm: {{ score }} điểm</p>
      <button class="btn btn-secondary mt-3" @click="goBack">
        Quay lại danh sách bài thi
      </button>
    </div>

    <div v-else>
      <div class="alert alert-warning fw-bold text-center">
        ⏰ Thời gian còn lại:
        {{ String(Math.floor(timeLeft / 60)).padStart(2, "0") }}:
        {{ String(timeLeft % 60).padStart(2, "0") }}
      </div>
      <div
        v-for="(q, index) in questions"
        :key="q.question_id"
        class="mb-5 p-4 border rounded shadow-sm bg-light"
      >
        <p>
          <strong>Câu {{ index + 1 }} ({{ q.difficulty }}):</strong>
          {{ q.question_text }}
        </p>

        <div class="row">
          <div
            v-for="answer in q.answers"
            :key="answer.answer_id"
            class="col-12 col-md-6 mb-3"
          >
            <div
              class="p-3 rounded text-center fw-semibold border d-flex justify-content-between align-items-center"
              :class="getAnswerClass(q.question_id, answer.answer_id)"
              @click="selectAnswer(q.question_id, answer.answer_id)"
              style="cursor: pointer"
            >
              <span>{{ answer.answer_text }}</span>
              <span v-if="userAnswers[q.question_id] === answer.answer_id"
                >✅</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="mb-5 p-4 rounded text-end"
        style="background-color: transparent; border: none; box-shadow: none"
      >
        <button class="btn btn-success btn-lg" @click="submitAnswers">
          🚀 Nộp bài
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExamTakingView",
  data() {
    return {
      questions: [],
      userAnswers: {},
      loading: true,
      submitted: false,
      score: null,
      correctCount: 0,
      timeLeft: 10,
      timer: null,
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    const examId = this.$route.params.examId || 1;

    try {
      const res = await fetch(
        `http://localhost:3000/api/exams/${examId}/take-exam`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Không thể tải bài thi");
        this.$router.push("/exams");
        return;
      }

      const data = await res.json();
      this.questions = data;
    } catch (err) {
      console.error("Lỗi khi tải bài thi:", err);
      alert("Lỗi kết nối máy chủ.");
    } finally {
      this.loading = false;
      this.startTimer();
      window.addEventListener("beforeunload", this.handleBeforeUnload);
    }
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.clearTimer();
          if (!this.submitted) {
            this.submitAnswers();
          }
        }
      }, 1000);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    selectAnswer(questionId, answerId) {
      this.userAnswers[questionId] = answerId;
    },
    getAnswerClass(questionId, answerId) {
      return this.userAnswers[questionId] === answerId
        ? "bg-primary text-white border-primary"
        : "bg-white";
    },
    submitAnswers() {
      this.clearTimer();
      window.removeEventListener("beforeunload", this.handleBeforeUnload);

      let correct = 0;
      this.questions.forEach((q) => {
        const selectedId = this.userAnswers[q.question_id];
        const correctAnswer = q.answers.find((a) => a.is_correct);
        if (selectedId && selectedId === correctAnswer?.answer_id) {
          correct++;
        }
      });

      this.correctCount = correct;
      this.score = Math.round((correct / this.questions.length) * 10);
      this.submitted = true;
    },
    goBack() {
      this.$router.push("/");
    },
    handleBeforeUnload(e) {
      if (!this.submitted) {
        e.preventDefault();
        e.returnValue = "";
        this.submitAnswers();
      }
    },
  },

  // ✅ Nếu bạn dùng Vue 3
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },

  // ✅ Ngăn rời route khi chưa nộp
  beforeRouteLeave(to, from, next) {
    if (!this.submitted) {
      if (confirm("Bạn có chắc muốn kết thúc bài thi? Bài sẽ được nộp ngay.")) {
        this.submitAnswers();
        next(); // cho phép đi tiếp
      } else {
        next(false); // chặn rời trang
      }
    } else {
      next(); // đã nộp rồi thì cho rời
    }
  },
};
</script>
