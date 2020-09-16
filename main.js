import Vue from 'vue';
import App from './src/views/app/app.vue';
import router, { routerConfig } from './config/router';
import store from './config/store/store';
import message from './config/message/message';
import ElementUI from 'element-ui';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css'
import { commitNameSpace, stateNameSpace } from '@nameSpace/storeNameSpace';
import 'element-ui/lib/theme-chalk/index.css';
import './src/common/style/reset.scss';
import './src/common/style/common.scss';

// 自动注册组件
const autoRegisterBaseComponents = () => {
  const requireComponent = require.context('./src/autoRegisterComponents', true, /\.vue$/);
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
Vue.use(Viewer);
// 注册全局提示信息
Vue.prototype.message = message;
// 生成全局唯一id
Vue.prototype.getGlobalId = () => {
  store.commit(commitNameSpace.updateGlobalId);
  return store.state[stateNameSpace.globalId];
};
router.beforeEach((to, from, next) => {
    const { name } = to;
    const matchedNextRoute = routerConfig.find(config => config.name === name);
    // 是否展示顶部备案信息
    let isShowFooter = false;
    if (matchedNextRoute) {
        const { showFooter } = matchedNextRoute;
        isShowFooter = !!showFooter;
    }
    store.commit(commitNameSpace.updateIsShowFooter, isShowFooter)
    next();
})

autoRegisterBaseComponents();
autoRegisterBaseFilters();

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});