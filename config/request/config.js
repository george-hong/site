import axios from 'axios';
import Qs from 'qs';
import message from '../message/message';
import router from '../router';
import { updateLocalToken } from '../../libs/tokenUtil';

export const serverBaseUrl = 'http://127.0.0.1:3000/'; // 接口请求地址
const timeout = 150000;                         // 接口超时时间

// 创建axios实例
function createAxiosInstance(callback) {
    let request = {};
    let instance = axios.create({
        baseURL: serverBaseUrl,
        timeout: 5000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: [function (data) {
            data = Qs.stringify(data);
            return data;
        }]
    });

    // 配置请求拦截器
    instance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.token = token;
        }
        return config;
    });

    // 配置响应拦截器
    instance.interceptors.response.use(response => {
        const { status, errDetail } = response.data;
        const { token, responseData } = response.data.data;
        // 如果服务端返回了token,则需要更新本地的token信息
        if (token) updateLocalToken(token);
        console.log('front', token, responseData)
        if (status !== 200) {
            message.error({
                title: '请求异常',
                message: errDetail,
            });
            if (status === 401) {
                router.push({ name: 'root' });
            }
        }
        return responseData;
    });

    callback && callback(instance);

    request.get = function (url, data, config) {
        return new Promise((resolve, reject) => {
            instance.get(url, { params: data}).then(response => {
                resolve(response);
            }).catch(function (msg) {
                reject(msg);
            });
        })
    };

    request.post = function (url, data, config) {
        return new Promise((resolve, reject) => {
            instance.post(url, data, config).then(response => {
                resolve(response);
            }).catch(function (msg) {
                reject(msg);
            });
        })
    };

    return request;
}

function configRequest(instance) {
    instance.interceptors.request.use(config => {
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        return Promise.reject(error);
    });
}

let axiosInstance = createAxiosInstance(configRequest);

export default axiosInstance;