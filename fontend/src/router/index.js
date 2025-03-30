import { createRouter, createWebHistory } from "vue-router";
import QuestionDetailView from "../views/QuestionDetailView.vue";
import EditQuestionView from "../views/EditQuestionView.vue";
import CreateQuestionView from "../views/CreateQuestionView.vue";
import CreateCategoryView from "../views/CreateCategoryView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";
import HomeView from "../views/HomeView.vue"; // Import
import HistoryView from "../views/HistoryView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/questions/:id",
    name: "QuestionDetail",
    component: QuestionDetailView,
  },
  {
    path: "/questions/:id/edit",
    name: "EditQuestion",
    component: EditQuestionView,
  },
  {
    path: "/create-question",
    name: "CreateQuestion",
    component: CreateQuestionView,
  },
  {
    path: "/create-category",
    name: "CreateCategory",
    component: CreateCategoryView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordView,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
  {
    path: "/history",
    name: "History",
    component: HistoryView,
  },
  {
    path: "/history/detail/:attemptId",
    name: "AttemptDetail",
    component: DetailHistoryView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
