import storageNameSpace from '@nameSpace/storageNameSpace';
import { commitNameSpace } from '@nameSpace/storeNameSpace';
import store from '../config/store/store';

// 更新本地存储的token信息
export const updateLocalToken = token => {
    const { tokenValue } = token;
    localStorage.setItem(storageNameSpace.token, tokenValue);
};

export const clearLocalToken = () => {
    localStorage.removeItem(storageNameSpace.token);
    localStorage.removeItem(storageNameSpace.userInfo);
    store.commit(commitNameSpace.saveUserInfo, null);
}

const tokenUtil = {
    updateLocalToken,
    clearLocalToken
};

export default tokenUtil;