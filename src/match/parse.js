/**
 * @description 字符串解析内容
 */
import {
    isFun,
    isObj,
    isStr,
    isArray,
    typeCharge
} from 'LIB/util';

import {
    matchObject,
    matchArray
} from 'MATCH/match';

import stack from 'MATCH/stack';

export const parse = function (
    str: any
) {
    let strArr;
    let i;
    let token;
    let parseResult = {
    };
    const tokenReg = /\$\$\{\{(.*)\}\}/;

    if (isObj(str)) {
        // 递归映射
        parseResult['matchObject'] = str;
        return parseResult;
    }

    if (isArray(str)) {
        // 数组递归映射
        parseResult['matchArray'] = str;
        return parseResult;
    }

    if (isFun(str)) {
        // 执行函数
        parseResult['matchFun'] = str;
        return parseResult;
    }

    if (!isStr(str) || !tokenReg.test(str)) {
        // 不是字符串 直接返回
        parseResult['noMatch'] = str;
        return parseResult;
    }

    strArr = str.split('||');
    for (i of strArr) {

        token = i.trim().match(tokenReg);

        if (token && token.length && token.length >= 1) {
            parseResult['matchParam'] = token[1];
            continue;
        }

        if (!token) {
            //if (i.indexOf('{{') !== -1) {
            //    parseResult['defaultParam'] = 'return b';
            //} else {
            parseResult['default'] = i.trim();
            //}
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


    if (exp['matchObject']) {
        result = matchObject(data, exp['matchObject']);
        return result;
    }
    
    if (exp['matchArray']) {
        result = matchArray(data, exp['matchArray']);
        return result;
    }

    if (exp['noMatch']) {
        result = exp['noMatch'];
        return result;
    }

    //if (exp['defaultParam']) {
    //    result = getData(data, exp['matchParam']) || getParams(exp['defaultParam'], obj);
    //    return result;
    //}

    if (exp['matchParam']) {
        result = getData(data, exp['matchParam']) || typeCharge(exp['default']);
        return result;
    }

    if (exp['matchFun']) {
        result = exp['matchFun'].apply(that, [data].concat(stack));
        return result;
    }
};

const getParams = function (str, obj) {
    let createFun = function () {
        return new Function (str);
    }
    obj.title = createFun();
};

const getData = function (
    data: object,
    exp: str // 对应的对象字面量字符串 xx.xxx
) {
    let par = data;
    let token = exp.split('.');
    // 递归获取
    for (let i of token) {
        par = par[i];
    }

    return par;
};
