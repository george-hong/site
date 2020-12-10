export default {
    numberNotStartWithZero: /^[1-9]\d*$/,             // 非零开头的整数
    natureNumber: /^([1-9]\d*|0)$/,                   // 自然数
    startWidthLetterOrChinese: /^[\u4e00-\u9fa5a-zA-Z]/,  // 以中文或字母开头
    letterOrChinese: /^[\u4e00-\u9fa5a-zA-Z]*$/,      // 中文或字母
    letterOrChineseAndNotStartWithNumber: /^[\u4e00-\u9fa5a-zA-Z]+[\u4e00-\u9fa5a-zA-Z0-9]*$/,      // 中文或字母或数字，但不能以数字开头
    letterChineseNumber: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,// 中文或字母或数字
    LetterNumberUnderline: /^[a-zA-Z0-9\_]*$/,        // 数字字母下划线
};