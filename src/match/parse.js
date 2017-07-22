/**
 * @description 字符串解析内容
 */
import {
    isFun,
    isObj,
    isStr,
    isArray
} from 'LIB/util';

export const parse = function (
    str: any
) {
    let strArr;
    let i;
    let token;
    let parseResult = {
    };

    if (isFun(str)) {
        // 执行函数
        parseResult['matchFun'] = str;
        return parseResult;
    }

    if (!isStr(str)) {
        // 不是字符串 直接返回
        parseResult['noMatch'] = str;
        return parseResult;
    }

    strArr = str.split('||');
    for (i of strArr) {

        token = i.trim().match(/\$\$\{\{(.*)\}\}/);

        if (!token) {
            // 直接赋值
            parseResult['noMatch'] = i;
            continue;
        }

        if (token && token.length && token.length >= 1) {
            parseResult['matchParam'] = token[1];
            continue;
        }

        if (!token) {
            parseResult['default'] = i.trim();
        }
    }

    return parseResult;
};

/**
 * @description 把exp解析的内容反装回真是值
 */
export const parseToData = function (
    exp: object, // parse 返回值
    data: object, // 映射的params数组
    that: object // 返回对象指针
) {
    let result;

    if (exp['noMatch']) {
        result = exp['noMatch'];
        return result;
    }

    if (exp['matchParam']) {
        result = data[exp['matchParam']] || exp['default'];
        return result;
    }

    if (exp['matchFun']) {
        result = exp['matchFun'].call(that, data);
        return result;
    }
};
