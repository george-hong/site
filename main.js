import Vue from 'vue';
import App from './src/pages/App/App.vue';
import router from './config/router';
import store from './config/store';

const vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});