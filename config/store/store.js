import Vue from 'vue';
import Vuex from 'vuex';
import {commitNameSpace, getterNameSpace, stateNameSpace} from '@nameSpace/storeNameSpace';
import {isObject} from '@utilMethods';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        [stateNameSpace.globalId]: 0,                    // 全局唯一id计数器
        [stateNameSpace.isShowLoginWindow]: false,       // 是否展示登录窗口
        [stateNameSpace.loginSuccessCallback]: null,     // 登录成功后执行的回调函数
        [stateNameSpace.loginFailCallback]: null,        // 登录失败后执行的回调函数
        [stateNameSpace.userInfo]: null,                 // 用户信息
        [stateNameSpace.searchKeyWord]: '',              // 导航栏搜索关键字
    },
    mutations: {
        // 切换登录窗口的展示状态 payload = { visible, callback } or Boolean
        [commitNameSpace.toggleShowLoginWindow](state, payload) {
            // 如果payload是对象，则取出其中的回调并设置展示状态，否则直接设置展示状态
            let isShowLoginWindow;
            if (isObject(payload)) {
                const {visible, onSuccess, onFail} = payload;
                isShowLoginWindow = visible;
                state.loginSuccessCallback = onSuccess;
                state.loginFailCallback = onFail;
            } else {
                isShowLoginWindow = payload;
            }
            state.isShowLoginWindow = !!isShowLoginWindow;
        },
        [commitNameSpace.saveUserInfo](state, payload) {
            // 仅null和对象允许保存
            console.log('payload');
            console.log(payload);

            if (isObject(payload) || payload === null)
                state.userInfo = payload;
        },
        // 更新全局唯一id
        [commitNameSpace.updateGlobalId](state) {
            state[stateNameSpace.globalId] += 1;
        },
        [commitNameSpace.updateSearchKeyWord](state, payload) {
            state[stateNameSpace.searchKeyWord] = payload;
        }
    }
});

export default store;