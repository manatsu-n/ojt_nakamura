import { createRouter, createWebHistory } from 'vue-router';
import select from './components/SelectPage.vue';
import game from './components/NumPre.vue';

const routes = [
  { path: '/ojt_nakamura/', name: 'Select', component: select },
  { path: '/ojt_nakamuragame', name: 'Game', component: game }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;