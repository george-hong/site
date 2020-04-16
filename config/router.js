import Vue from 'vue';
import VueRouter from 'vue-router';
import ArticleList from '../src/pages/article/List/List.vue';
import ArticleDetail from '../src/pages/article/Detail/Detail.vue';
import ArticleEdit from '../src/pages/article/Edit/Edit.vue';
import Login from '../src/pages/mine/Login/Login.vue';
import Sign from '../src/pages/Sign/Sign.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/sign',
    component: Sign,
  },
  {
    path: '/article/list',
    component: ArticleList,
  },
  {
    path: '/article/detail/:id',
    component: ArticleDetail,
  },
  {
    path: '/article/edit',
    component: ArticleEdit,
  },
];

const router = new VueRouter({
  routes,
  // mode: 'history',
});

export default router;