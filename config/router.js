import Vue from 'vue';
import VueRouter from 'vue-router';
import ArticleList from '../src/pages/article/list/list.vue';
import ArticleDetail from '../src/pages/article/detail/detail.vue';
import ArticleEdit from '../src/pages/article/edit/edit.vue';
import Login from '../src/pages/mine/login/login.vue';
import Sign from '../src/pages/sign/sign.vue';
import DictionaryManage from '../src/pages/system/dictionaryManage.vue';
import Search from '../src/pages/search/search.vue';
// const Search = () => import('../src/pages/search/search.vue');

Vue.use(VueRouter);

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'sign',
    path: '/sign',
    component: Sign,
  },
  {
    name: 'search',
    path: '/search',
    component: Search,
  },
  {
    name: 'articleList',
    path: '/article/list/:page?',
    component: ArticleList,
  },
  {
    name: 'articleDetail',
    path: '/article/detail/:id',
    component: ArticleDetail,
  },
  {
    name: 'articleEdit',
    path: '/article/edit',
    component: ArticleEdit,
  },
  {
    name: 'systemDictionaryManage',
    path: '/system/dictionaryManage',
    component: DictionaryManage,
  },
];

const router = new VueRouter({
  routes,
  mode: process.env.NODE_ENV === 'production' ? 'history' : 'hash', // 开发环境使用hash模式,生产环境使用history模式
});

export default router;