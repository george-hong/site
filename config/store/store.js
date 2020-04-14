import Vue from 'vue';
import Vuex from 'vuex';
import { commitNames, stateNames } from './storeFields';
import { isObject } from '@utilMethods';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    [stateNames.isShowLoginWindow]: false,       // 是否展示登录窗口
    [stateNames.loginSuccessCallback]: null,     // 登录成功后执行的回调函数
    [stateNames.loginFailCallback]: null,        // 登录失败后执行的回调函数
    [stateNames.userInfo]: null,                 // 用户信息
  },
  mutations: {
    // 切换登录窗口的展示状态 payload = { visible, callback } or Boolean
    [commitNames.toggleShowLoginWindow](state, payload) {
      // 如果payload是对象，则取出其中的回调并设置展示状态，否则直接设置展示状态
      let isShowLoginWindow;
      if (isObject(payload)) {
        const { visible, onSuccess, onFail } = payload;
        isShowLoginWindow = visible;
        state.loginSuccessCallback = onSuccess;
        state.loginFailCallback = onFail;
      } else {
        isShowLoginWindow = payload;
      }
      state.isShowLoginWindow = !!isShowLoginWindow;
    },
    [commitNames.saveUserInfo](state, payload) {
      // 仅null和对象允许保存
      console.log('payload');
      console.log(payload);
      
      if (isObject(payload) || payload === null)
      state.userInfo = payload;
    }
  }
});

export default store;