/**
 * @description 字符串解析内容
 */
import {
    isFun,
    isNum,
    isObj,
    isStr,
    isArray,
    empty,
    hasReg,
    addArr,
    typeTrans,
} from 'LIB/util';

import config from 'MATCH/config';

export const getData = (
    data: Object,
    exp: string, // 对应的对象字面量字符串 xx.xxx
    type: string, // 对应的类型
) => {
    let par = data;
    const token = exp.split('.');
    // 递归获取
    for (let i = 0; i < token.length; i++) {
    // for (let i of token) {
        par = par[token[i]];
    }

    return type ? typeTrans(par, type) : par;
};

export const getArrData = (
    data: Object,
    exp: string, // 对应的数组序号字符串字面量
    type: string, // 对应的类型
) => {
    const token = exp.split('.');
    const index = parseInt(token.shift(), 10);
    if (!isNum(index) || data[index] === undefined) {
        /* eslint-disable no-console */
        console.error('error: the Array index is not exist!');
        /* eslint-disable no-console */
        return undefined;
    }

    return getData(data[index], token.join('.'), type);
};

const isIgnore = (key: string) => config.ignoreTokenKey.indexOf(key) !== -1;

export const parse = function parse(
    str: any,
    key: any,
) {
    let token;
    const parseResult = {
    };
    const objTokenReg = /\$\$\{\{(.*)\}\}/;
    const arrTokenReg = /\$\{(.*)\}/;
    const typeTokenReg = /\((boolean|Boolean|int|Int|string|float)\)\$/;
    // const strTokenReg = /(?:(.*?)(\|\|))|(.+)/ig;
    // 隐藏token
    const strTokenReg = /(?:(.*?)(\|\|(?:\||)|(?:&&)))|(.+)/ig;

    if (empty(key)) {
        parseResult.matchArrayKey = str;
        return parseResult;
    }

    if (isObj(str)) {
        // 递归映射
        parseResult.matchObject = str;
        return parseResult;
    }

    if (isArray(str)) {
        // 数组递归映射
        parseResult.matchArray = str;
        return parseResult;
    }

    if (isFun(str)) {
        // 执行函数
        parseResult.matchFun = str;
        return parseResult;
    }

    if (!isStr(str) ||
        isIgnore(key) ||
        (!objTokenReg.test(str) &&
            !arrTokenReg.test(str))
    ) {
        // 不是字符串 直接返回
        parseResult.noMatch = str;
        return parseResult;
    }

    let re = strTokenReg.exec(str);
    while (re) {
        const spr = re[2];
        const tok = re[1] === undefined ? re[0] : re[1];
        const result = {};
        const end = () => {
            parseResult.matchStr = addArr(parseResult.matchStr, result);
            re = strTokenReg.exec(str);
        };

        if (spr) {
            result.spr = spr.trim();
        }

        token = tok.trim().match(typeTokenReg);

        if (hasReg(token)) {
            // 类型
            result.matchType = token[1];
        }

        token = tok.trim().match(objTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射字段
            result.matchParam = token[1];
            end();
            continue;
        }

        token = tok.trim().match(arrTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射数组
            result.matchArrParam = token[1];
            end();
            continue;
        }

        if (!token) {
            // 如果上面三个都没有匹配上 自认为是默认值
            result.default = tok.trim();
            end();
            continue;
        }
    }

    return parseResult;
};
