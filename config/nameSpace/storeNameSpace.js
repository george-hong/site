const stateNameSpace = {
    isShowLoginWindow: 'isShowLoginWindow',
    userInfo: 'userInfo',
    loginSuccessCallback: 'loginSuccessCallback',
    loginFailCallback: 'loginFailCallback',
    globalId: 'globalId',                           // 全局唯一id计数器
    searchKeyWord: 'keyWord',                       // 搜索key
};

const commitNameSpace = {
    toggleShowLoginWindow: 'toggleShowLoginWindow',
    saveUserInfo: 'saveUserInfo',
    updateGlobalId: 'updateGlobalId',
    updateSearchKeyWord: 'updateSearchKeyWord',
};

const getterNameSpace = {};

export {
    stateNameSpace,
    getterNameSpace,
    commitNameSpace,
};