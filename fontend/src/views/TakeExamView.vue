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
      startTime: null,
      endTime: null,
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để làm bài thi");
      this.$router.push("/login");
      return;
    }

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
      this.startTime = new Date(); // Bắt đầu tính thời gian
      this.startTimer();
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
    async submitAnswers() {
      try {
        this.clearTimer();
        this.endTime = new Date();

        let correct = 0;
        const answerDetails = this.questions.map((q) => {
          const selectedId = this.userAnswers[q.question_id] || null;
          const correctAnswer = q.answers.find((a) => a.is_correct);
          const isCorrect = selectedId === correctAnswer?.answer_id;

          if (isCorrect) correct++;

          return {
            question_id: q.question_id,
            selected_answer: selectedId == null ? 0 : selectedId,
            is_correct: isCorrect,
          };
        });

        this.correctCount = correct;
        this.score = Math.round((correct / this.questions.length) * 10);

        const payload = {
          exam_id: this.$route.params.examId,
          start_time: formatDateTime(this.startTime),
          end_time: formatDateTime(this.endTime),
          score: this.score,
          total_questions: this.questions.length,
          correct_answers: this.correctCount,
          incorrect_answers: this.questions.length - this.correctCount,
          answers: answerDetails,
        };

        const saveStatus = await fetch(`/api/attempts/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!saveStatus.ok) {
          const err = await saveStatus.json();
          alert(err.message || "Không thể lưu bài thi");
          return;
        }
        this.submitted = true;
      } catch (error) {
        console.error("Lỗi trong submitAnswers:", error);
      }
    },
    goBack() {
      this.$router.push("/");
    },
  },
};
function formatDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
}
</script>
