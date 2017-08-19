import { parse , parseToData } from 'MATCH/parse';
import {
    isFun,
    isObj,
    isArray
} from 'LIB/util';
import { pushStack, removeStack, cleanStack, updateStack } from 'MATCH/stack';
import filter from 'MATCH/filter';
import autoComplete from 'MATCH/auto-complete';
import config , { extendConfig } from 'MATCH/config';


/**
 * 对象映射
 */
export const matchObject = function (
    data: any,
    obj: object
) {
    let exp;
    let result = {};

    for (let i in obj) {
        exp = parse(obj[i]);
        result[i] = parseToData(exp, data, result);
        filter(i, result);
    }
    autoComplete(result, data);

    return result;
};

/**
 * 数组映射
 */
export const matchArray = function (
    data: any,
    arr: Array
) {
    let exp;
    let result = [];

    if (arr.length === 1) {
        // 直接映射 data
        for (let i = 0; i < data.length; i++) {
            result[i] = matchObject(data[i], arr[0]);
        }
    }

    if (arr.length === 2) {
        // 映射data的对象
        data= data[arr[0]];
        for (let i = 0; i < data.length; i++) {
            result[i] = matchObject(data[i], arr[1]);
        }
    }

    return result;
};

const match = {
    parse: (
        combineData: object | Array,
        keyData: object | Array
    ) => {
        let matchData = {};
        let result;

        if (isObj(keyData)) {
            result = matchObject(combineData, keyData);
        }

        if (isArray(keyData)) {
            result = matchArray(combineData, keyData);
        }

        return result;
    },
    parseConfig (
        combineData: object | Array,
        keyData: object | Array,
        configTmp: object
    ) {
        // 代表此次match使用传入的config
        const configCache = Object.assign({}, config);
        let data;

        extendConfig(configTmp);
        data = this.parse(combineData, keyData);
        extendConfig(configCache);

        return data;

    },
    register: (
        obj: object | Array,
        name: string
    ) => {
        pushStack({
            value: obj,
            name: name
        });
    },
    update: (
        obj: object | Array,
        name: string
    ) => {
        updateStack(obj, name);
    },
    // 移除register的内容
    remove: (
        name: string
    ) => {
        removeStack(name);
    },
    removeAll: (
    ) => {
        cleanStack();
    },
    config: (
        obj: object
    ) => {
        extendConfig(obj);
    }
};

export default match;
