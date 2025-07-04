import { createRouter, createWebHistory } from 'vue-router';
import select from './components/SelectPage.vue';
import game from './components/NumPre.vue';

const routes = [
  { path: '/', name: 'Select', component: select },
  { path: '/game', name: 'Game', component: game }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;