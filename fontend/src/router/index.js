import { createRouter, createWebHistory } from 'vue-router';
import QuestionDetailView from '../views/QuestionDetailView.vue';
import EditQuestionView from '../views/EditQuestionView.vue';
import CreateQuestionView from '../views/CreateQuestionView.vue';
import CreateCategoryView from '../views/CreateCategoryView.vue';
import HomeView from '../views/HomeView.vue'; // Import

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
  // ...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;