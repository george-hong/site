import Vue from 'vue';
import App from './src/pages/App/App.vue';
import router from './config/router';
import store from './config/store/store';
import message from './config/message/message';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './src/common/style/reset.scss';
import './src/common/style/common.scss';

// 自动注册组件
const autoRegisterBaseComponents = () => {
  const requireComponent = require.context('./src/components', true, /\.vue$/);
  requireComponent.keys().forEach(componentPath => {
    const componentConfig = requireComponent(componentPath);
    const controller = componentConfig.default || componentConfig;
    Vue.component(controller.name, controller);
  });
};

Vue.use(ElementUI);
// 注册全局提示信息
Vue.prototype.message = message;

autoRegisterBaseComponents();

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});