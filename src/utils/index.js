import regExp from './regExp';

const getExistFieldFromParams = (params) => {
    if (typeof params !== 'object') return null;
    const result = {};
    Object.entries(params).forEach(item => {
        const [key, value] = item;
        if (value !== '' && value !== undefined) result[key] = value;
    });
    return result;
}

export default {
    regExp,
    getExistFieldFromParams
};