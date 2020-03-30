import Vue from 'vue';
import VueRouter from 'vue-router';
import ArticleList from '../src/pages/article/List/List.vue';
import ArticleDetail from '../src/pages/article/Detail/Detail.vue';
import Login from '../src/pages/mine/Login/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/article/list',
    component: ArticleList,
  },
  {
    path: '/article/detail',
    component: ArticleDetail,
  },
];

const router = new VueRouter({
  routes,
  // mode: 'history',
});

export default router;