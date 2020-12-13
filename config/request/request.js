import request, { serverBaseUrl } from './config';

// 注册
export const sign = (params) => {
    return request.post('api/user/sign', params);
};
// 校验账号是否重复
export const checkAccountIsRepeat = params => {
    return request.get('api/user/checkAccountIsRepeat', params);
};
// 登录
export const login = params => {
    return request.post('api/user/login', params);
};
// 获取用户基本信息
export const getUserBaseInfo = params => {
    return request.get('api/user/getBaseInfo', params);
};
// 更新用户基本信息
export const updateUserBaseInfo = params => {
    return request.post('api/user/updateBaseInfo', params);
};
// 新增文章
export const editArticle = params => {
    return request.post('api/article/edit', params);
};
// 文章详情
export const queryArticle = params => {
    return request.get('api/article/detail', params);
};
// 变更文章状态
export const changeArticleStatus = params => {
    return request.post('api/article/changeStatus', params);
};
// 文章列表
export const getArticleList = params => {
    return request.get('api/article/list', params);
};
// 搜索信息
export const search = params => {
    return request.get('api/search', params);
};
// 上传文件
export const upload = params => {
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
// 更新用户图片
export const updateUserImage = params => {
    return request.post('api/upload/updateUserImage', params, {
        // 设置请求类型
        headers: {
            'Accept': '*/*',
            'Content-Type': 'multipart/form-data'
        },
        // 不处理请求数据
        transformRequest: []
    });
};

// 更新图片信息
export const updatePhoto = params => {
    return request.post('api/upload/update', params);
}

// 获取用户上传的文件信息
export const getUploadFilesInfo = params => {
    return request.get('api/upload/getUploadFilesByUser', params);
}

// 新增字典
export const createDictionary = params => {
    return request.post('api/dictionary/create', params);
}

// 更新字典
export const updateDictionary = params => {
    return request.post('api/dictionary/update', params);
}

// 删除字典
export const deleteDictionary = params => {
    return request.post('api/dictionary/delete', params);
}

// 查询字典列表
export const queryDictionaryList = params => {
    return request.get('api/dictionary/list', params);
}

// 查询字典字段列表
export const queryDictionaryFieldList = params => {
    return request.get('api/dictionaryField/list', params);
}

// 新增字典字段
export const createDictionaryField = params => {
    return request.post('api/dictionaryField/create', params);
}

// 更新字典字段
export const updateDictionaryField = params => {
    return request.post('api/dictionaryField/update', params);
}

// 删除字典字段
export const deleteDictionaryField = params => {
    return request.post('api/dictionaryField/delete', params);
}


export const uploadImageUrl = `${serverBaseUrl}api/upload`;

const api = {
    sign,
    checkAccountIsRepeat,
    login,
    getUserBaseInfo,
    updateUserBaseInfo,
    editArticle,
    queryArticle,
    getArticleList,
    search,
    upload,
    updateUserImage,
    getUploadFilesInfo,
    uploadImageUrl,
    changeArticleStatus,
    createDictionary
};

export default api;