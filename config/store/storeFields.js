const stateNames = {
  isShowLoginWindow: 'isShowLoginWindow',
  userInfo: 'userInfo',
  loginSuccessCallback: 'loginSuccessCallback',
  loginFailCallback: 'loginFailCallback',
};

const commitNames = {
  toggleShowLoginWindow: 'toggleShowLoginWindow',
  saveUserInfo: 'saveUserInfo',
};

module.exports = {
  stateNames,
  commitNames,
}