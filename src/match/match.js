import { parse, getData } from 'MATCH/parse';
import parseToData from 'MATCH/parse-data';
import { isObj, isStr, isArray, has } from 'LIB/util';
import { pushStack, removeStack, cleanStack, updateStack } from 'MATCH/stack';
import { filter, filterEmpty } from 'MATCH/filter';
import autoComplete from 'MATCH/auto-complete';
import config, {
    extendConfig,
    extendTmpConfig,
    restoreConfig,
    changeFilterDefaultObject,
} from 'MATCH/config';
import 'LIB/polyfill';
import debug from 'MATCH/debug';

/**
 * 对象映射
 */
export const matchObject = function matchObject(
    data: any,
    obj: Object | String,
) {
    let exp;
    let result = {};

    if (isStr(obj)) {
        exp = parse(obj);
        result = parseToData(exp, data);
    } else {
        for (const i in obj) {
            if (!has(obj, i)) continue;
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
export const matchArray = function matchArray(data: any, keyData: Array) {
    const result = [];

    try {
        if (keyData.length === 1) {
            // 直接映射 data
            for (let i = 0; i < data.length; i++) {
                result[i] = matchObject(data[i], keyData[0]);
            }
        }

        if (keyData.length === 2) {
            // 映射data的对象
            data = getData(data, keyData[0]);
            // data = data[keyData[0]];
            for (let i = 0; i < data.length; i++) {
                result[i] = matchObject(data[i], keyData[1]);
            }
        }
    } catch (e) {
        if (config.filterDefaultArray) return undefined;
    }

    return result;
};

const match = {
    parse: (combineData: Object | Array, keyData: Object | Array) => {
        let result;

        if (isObj(keyData)) {
            result = matchObject(combineData, keyData);
            autoComplete(result, combineData);
        }

        if (isArray(keyData)) {
            result = matchArray(combineData, keyData);

            // length 2 的时候autoComplete的对象是选中的key对象
            if (keyData.length === 2) {
                autoComplete(result, combineData[keyData[0]]);
            } else {
                autoComplete(result, combineData);
            }
        }

        debug(result, combineData, keyData);

        restoreConfig();

        return result;
    },
    parseConfig(
        combineData: Object | Array,
        keyData: Object | Array,
        configTmp: Object,
    ) {
        // 代表此次match使用传入的config
        const configCache = Object.assign({}, config);

        extendConfig(configTmp);
        const data = this.parse(combineData, keyData);
        extendConfig(configCache);

        return data;
    },
    tmpConfig(configTmp: Object) {
        extendTmpConfig(configTmp);

        return this;
    },
    register: (obj: Object | Array, name: string) => {
        pushStack({
            value: obj,
            name,
        });
    },
    update: (obj: Object | Array, name: string) => {
        updateStack(obj, name);
        return this;
    },
    // 移除register的内容
    remove: (name: string) => {
        removeStack(name);
        return this;
    },
    removeAll: () => {
        cleanStack();

        return this;
    },
    config: (obj: Object) => {
        extendConfig(obj);

        return this;
    },
};

export default match;
