import { parse, getData } from 'MATCH/parse';
import { parseToData } from 'MATCH/parse-data';
import {
    isFun,
    isObj,
    isStr,
    isArray
} from 'LIB/util';
import { pushStack, removeStack, cleanStack, updateStack } from 'MATCH/stack';
import { filter, filterEmpty } from 'MATCH/filter';
import autoComplete from 'MATCH/auto-complete';
import config , { extendConfig , extendTmpConfig , restoreConfig, changeFilterDefaultObject , filterDefaultObject } from 'MATCH/config';
import 'LIB/polyfill';


/**
 * 对象映射
 */
export const matchObject = function (
    data: any,
    obj: object | String
) {
    let exp;
    let result = {};

    if (isStr(obj)) {
        exp = parse(obj);
        result = parseToData(exp, data);
    } else {
        for (let i in obj) {
            exp = parse(obj[i], i);
            result[i] = parseToData(exp, data, result);
            filter(i, result);
            changeFilterDefaultObject(false);
        }
    }

    return filterEmpty(result);
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

    try {
        if (arr.length === 1) {
            // 直接映射 data
            for (let i = 0; i < data.length; i++) {
                result[i] = matchObject(data[i], arr[0]);
            }
        }

        if (arr.length === 2) {
            // 映射data的对象
            data = getData(data, arr[0]);
            // data = data[arr[0]];
            for (let i = 0; i < data.length; i++) {
                result[i] = matchObject(data[i], arr[1]);
            }
        }
    } catch (e) {
        if (config.filterDefaultArray) return;
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

        autoComplete(result, combineData);

        restoreConfig();

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
    tmpConfig (
        configTmp: object
    ) {
        extendTmpConfig(configTmp);

        return  this;
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
        return this;
    },
    // 移除register的内容
    remove: (
        name: string
    ) => {
        removeStack(name);
        return this;
    },
    removeAll: (
    ) => {
        cleanStack();

        return this;
    },
    config: (
        obj: object
    ) => {
        extendConfig(obj);

        return this;
    }
};

export default match;
