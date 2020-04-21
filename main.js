import Vue from 'vue';
import App from './src/pages/app/app.vue';
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

// 自动注册组件
const autoRegisterBaseFilters = () => {
  const requireComponent = require.context('./src/filters', true, /\.js$/);
  requireComponent.keys().forEach(componentPath => {
    const componentConfig = requireComponent(componentPath);
    const controller = componentConfig.default || componentConfig;
    Vue.filter(controller.name, controller.filter);
  });
};

Vue.use(ElementUI);
// 注册全局提示信息
Vue.prototype.message = message;

autoRegisterBaseComponents();
autoRegisterBaseFilters();

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});