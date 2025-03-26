import { createRouter, createWebHistory } from 'vue-router';
import QuestionDetailView from '../views/QuestionDetailView.vue';
import EditQuestionView from '../views/EditQuestionView.vue';
import CreateQuestionView from '../views/CreateQuestionView.vue';
import CreateCategoryView from '../views/CreateCategoryView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';


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
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard để kiểm tra xác thực
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;