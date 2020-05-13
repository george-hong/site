const stateNameSpace = {
  isShowLoginWindow: 'isShowLoginWindow',
  userInfo: 'userInfo',
  loginSuccessCallback: 'loginSuccessCallback',
  loginFailCallback: 'loginFailCallback',
  globalId: 'globalId',                           // 全局唯一id计数器
};

const commitNameSpace = {
  toggleShowLoginWindow: 'toggleShowLoginWindow',
  saveUserInfo: 'saveUserInfo',
  updateGlobalId: 'updateGlobalId',
};

const getterNameSpace = {

};

export {
  stateNameSpace,
  getterNameSpace,
  commitNameSpace,
};