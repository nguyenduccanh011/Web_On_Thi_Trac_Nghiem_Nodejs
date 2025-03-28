import { createRouter, createWebHistory } from 'vue-router';
import QuestionDetailView from '../views/QuestionDetailView.vue';
import EditQuestionView from '../views/EditQuestionView.vue';
import CreateQuestionView from '../views/CreateQuestionView.vue';
import CreateCategoryView from '../views/CreateCategoryView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import HomeView from '../views/HomeView.vue'; // Import
import ProfileView from '../views/ProfileView.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/questions/:id',
    name: 'QuestionDetail',
    component: QuestionDetailView,
  },
  {
    path: '/questions/:id/edit',
    name: 'EditQuestion',
    component: EditQuestionView,
  },
  {
    path: '/create-question',
    name: 'CreateQuestion',
    component: CreateQuestionView,
  },
  {
    path: '/create-category',
    name: 'CreateCategory',
    component: CreateCategoryView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Thêm navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn || !token || !user || !user.user_id) {
      // Lưu đường dẫn đích để chuyển hướng sau khi đăng nhập

      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.path === '/login' && isLoggedIn) {
    // Nếu đã đăng nhập và cố gắng truy cập trang login, chuyển hướng về trang chủ
    next('/');

  } else {
    next();
  }
});

export default router;