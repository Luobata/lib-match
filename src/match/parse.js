/**
 * @description 字符串解析内容
 */
import {
    isFun,
    isNum,
    isObj,
    isStr,
    isArray,
    isEmptyObj,
    typeCharge,
    objToArray,
    hasReg,
    addArr,
    typeTrans
} from 'LIB/util';

import {
    matchObject,
    matchArray
} from 'MATCH/match';

import config, { changeFilterDefaultObject } from 'MATCH/config';

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
    const typeTokenReg = /\((boolean|Boolean|int|Int|string|float)\)\$/;
    const strTokenReg = /(?:(.*?)(\|\|))|(.+)/ig;
    // 隐藏token
    //const strTokenReg = /(?:(.*?)(\|\|(?:\||)|(?:&&)))|(.+)/ig


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

    let re = strTokenReg.exec(str);
    while (re) {
        let spr = re[2];
        let tok = re[1] === undefined ? re[0] : re[1];
        let result = {};
        const end = () => {
            parseResult['matchStr'] = addArr(parseResult['matchStr'], result);
            re = strTokenReg.exec(str);
        };

        if (spr) {
            result['spr'] = spr.trim();
        }

        token = tok.trim().match(typeTokenReg);

        if (hasReg(token)) {
            // 类型
            result['matchType'] = token[1];
        }

        token = tok.trim().match(objTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射字段
            result['matchParam'] = token[1];
            end();
            continue;
        }

        token = tok.trim().match(arrTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射数组
            result['matchArrParam'] = token[1];
            end();
            continue;
        }

        if (!token) {
            // 如果上面三个都没有匹配上 自认为是默认值
            result['default'] = tok.trim();
            end();
            continue;
        }
    }

    return parseResult;

    // 这里处理的一定是字符串
    strArr = str.split('||');
    // 方式错误 正则分隔
    // re = /(?:(.*?)(\|\|))|(.*)/ig
    //for (i of strArr) {
    for (let j = 0; j < strArr.length; j++) {
        let i = strArr[j];
        token = i.trim().match(typeTokenReg);
        if (hasReg(token)) {
            // 类型
            parseResult['matchType'] = token[1];
        }

        token = i.trim().match(objTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射字段
            parseResult['matchParam'] = token[1];
            continue;
        }

        token = i.trim().match(arrTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射数组
            parseResult['matchArrParam'] = token[1];
            continue;
        }

        if (!token) {
            // 如果上面三个都没有匹配上 自认为是默认值
            parseResult['default'] = i.trim();
            continue;
        }
    }

    return parseResult;
};


const getParams = (str, obj) => {
    let createFun = function () {
        return new Function (str);
    }
    obj.title = createFun();
};

export const getData = (
    data: object,
    exp: string, // 对应的对象字面量字符串 xx.xxx
    type: string // 对应的类型
) => {
    let par = data;
    let token = exp.split('.');
    // 递归获取
    for (let i = 0; i < token.length; i++) {
    //for (let i of token) {
        par = par[token[i]];
    }

    return type ? typeTrans(par, type) : par;
};

export const getArrData = (
    data: object,
    exp: string, // 对应的数组序号字符串字面量
    type: string // 对应的类型
) => {
    let token = exp.split('.');
    let index = parseInt(token.shift(), 10);
    if (!isNum(index) || data[index] === undefined) {
        console.log('error: the Array index is not exist!');
        return undefined;
    }

    return getData(data[index], token.join('.'), type);
};

const isIgnore = (
    key: string
) => {
    return config.ignoreTokenKey.indexOf(key) !== -1;
};
