import Vue from 'vue';
import VueRouter from 'vue-router';
import A from '../../src/pages/test/a.vue';
import B from '../../src/pages/test/b.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/a', component: A },
  { path: '/b', component: B }
];

const router = new VueRouter({
  routes,
  // mode: 'history',
})

export default router;