import request from './config';

module.exports = {
    sign: params => {
        return request.post('api/user/sign', params)
    }
}