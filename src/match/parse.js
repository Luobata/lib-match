/**
 * @description 字符串解析内容
 */
import {
    isFun,
    isNum,
    isObj,
    isStr,
    isArray,
    typeCharge,
    objToArray,
    hasReg,
    typeTrans
} from 'LIB/util';

import {
    matchObject,
    matchArray
} from 'MATCH/match';

import config from 'MATCH/config';

import stack from 'MATCH/stack';

export const parse = function (
    str: any,
    key: any
) {
    let strArr;
    let i;
    let token;
    let parseResult = {
    };
    const objTokenReg = /\$\$\{\{(.*)\}\}/;
    const arrTokenReg = /\$\{(.*)\}/;
    const typeTokenReg = /\((boolean|Boolean|int|string|float)\)\$/;

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

    if (!isStr(str) ||
        isIgnore(key) ||
        (!objTokenReg.test(str) && 
            !arrTokenReg.test(str))
    ) {
        // 不是字符串 直接返回
        parseResult['noMatch'] = str;
        return parseResult;
    }

    strArr = str.split('||');
    for (i of strArr) {
        token = i.trim().match(typeTokenReg);
        if (hasReg(token)) {
            parseResult['matchType'] = token[1];
        }

        token = i.trim().match(objTokenReg);

        if (token && token.length && token.length >= 1) {
            parseResult['matchParam'] = token[1];
            continue;
        }

        token = i.trim().match(arrTokenReg);

        if (token && token.length && token.length >= 1) {
            parseResult['matchArrParam'] = token[1];
            continue;
        }

        if (!token) {
            //if (i.indexOf('{{') !== -1) {
            //    parseResult['defaultParam'] = 'return b';
            //} else {
            parseResult['default'] = i.trim();
            continue;
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
    try {
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
            result = getData(data, exp['matchParam'], exp['matchType']);
            result = result === undefined ? typeCharge(exp['default']) : result;
            return result;
        }

        if(exp['matchArrParam']) {
            result = getArrData(data, exp['matchArrParam']);
            result = result === undefined ? typeCharge(exp['default']) : result;
            return result;
        }

        if (exp['matchFun']) {
            result = exp['matchFun'].apply(that, [data].concat(objToArray(stack, 'value')));
            return result;
        }
    } catch (e) {
        console.log(e);
    }
};

const getParams = (str, obj) => {
    let createFun = function () {
        return new Function (str);
    }
    obj.title = createFun();
};

const getData = (
    data: object,
    exp: string, // 对应的对象字面量字符串 xx.xxx
    type: string // 对应的类型
) => {
    let par = data;
    let token = exp.split('.');
    // 递归获取
    for (let i of token) {
        par = par[i];
    }

    return type ? typeTrans(par, type) : par;
};

const getArrData = (
    data: object,
    exp: string // 对应的数组序号字符串字面量
) => {
    let token = exp.split('.');
    let index = parseInt(token.shift(), 10);
    if (!isNum(index) || data[index] === undefined) {
        console.log('error: the Array index is not exist!');
        return undefined;
    }

    return getData(data[index], token.join('.'));
};

const isIgnore = (
    key: string
) => {
    return config.ignoreTokenKey.indexOf(key) !== -1;
};
