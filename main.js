import Vue from 'vue';
import App from './src/pages/App/App.vue';
import router from './config/router';
import store from './config/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

const vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});