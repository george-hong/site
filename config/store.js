import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isShowLoginWindow: false,       // 是否展示登录窗口
    loginSuccessCallback: null,     // 登录成功后执行的回调函数
  },
  mutations: {
    // 切换登录窗口的展示状态 payload = { visible, callback } or Boolean
    toggleShowLoginWindow(state, payload) {
      // 如果payload是对象，则取出其中的回调并设置展示状态，否则直接设置展示状态
      let isShowLoginWindow;
      if (typeof payload === 'object') {
        const { visible, callback } = payload;
        isShowLoginWindow = visible;
        state.loginSuccessCallback = callback;
      } else {
        isShowLoginWindow = payload;
      }
      state.isShowLoginWindow = !!isShowLoginWindow;
    }
  }
});

export default store;