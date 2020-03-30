import Vue from 'vue';
import App from './src/pages/App/App.vue';
import router from './config/router';
import store from './config/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './src/style/reset.scss';
import './src/style/common.scss';

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

autoRegisterBaseComponents();

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});