import request from './config';

module.exports = {
    sign(params) {
        return request.post('api/user/sign', params);
    },
    checkAccountIsRepeat(params) {
        return request.get('api/user/checkAccountIsRepeat', params);
    },
    login(params) {
        return request.post('api/user/login', params);
    }
}