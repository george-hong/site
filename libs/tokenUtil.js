import storageNameSpace from '../config/nameSpace/storageNameSpace';

// 更新本地存储的token信息
export const updateLocalToken = token => {
    const { tokenValue, expiresTime } = token;
    localStorage.setItem(storageNameSpace.token, tokenValue);
    localStorage.setItem(storageNameSpace.tokenExpiresTime, expiresTime);
};

const tokenUtil = {
    updateLocalToken
};

export default tokenUtil;