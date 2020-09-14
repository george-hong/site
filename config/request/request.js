import request, { serverBaseUrl } from './config';

// 注册
const sign = (params) => {
    return request.post('api/user/sign', params);
};
// 校验账号是否重复
const checkAccountIsRepeat = params => {
    return request.get('api/user/checkAccountIsRepeat', params);
};
// 登录
const login = params => {
    return request.post('api/user/login', params);
};
// 新增文章
const editArticle = params => {
    return request.post('api/article/edit', params);
};
// 文章详情
const queryArticle = params => {
    return request.get('api/article/detail', params);
};
// 文章列表
const getArticleList = params => {
    return request.get('api/article/list', params);
};
// 搜索信息
const search = params => {
    return request.get('api/search', params);
};
// 上传文件
const upload = params => {
    return request.post('api/upload', params, {
        // 设置请求类型
        headers: {
            'Accept': '*/*',
            'Content-Type': 'multipart/form-data'
        },
        // 不处理请求数据
        transformRequest: []
    });
};

const uploadImageUrl = `${serverBaseUrl}api/upload`;

const api = {
    sign,
    checkAccountIsRepeat,
    login,
    editArticle,
    queryArticle,
    getArticleList,
    search,
    upload,
    uploadImageUrl
};

export {
    sign,
    checkAccountIsRepeat,
    login,
    editArticle,
    queryArticle,
    getArticleList,
    search,
    upload,
    uploadImageUrl
};

export default api;