import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home.vue'),
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
});
export default router;
