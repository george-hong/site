import request from './config';

module.exports = {
    // 注册
    sign(params) {
        return request.post('api/user/sign', params);
    },
    // 校验账号是否重复
    checkAccountIsRepeat(params) {
        return request.get('api/user/checkAccountIsRepeat', params);
    },
    // 登录
    login(params) {
        return request.post('api/user/login', params);
    },
    testRequest(params) {
        return request.post('api/user/test', params);
    },
    // 新增文章
    editArticle(params) {
        return request.post('api/article/edit', params);
    },
    queryArticle(params) {
        return request.get('api/article/detail', params);
    },
}