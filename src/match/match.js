import { parse , parseToData } from 'MATCH/parse';
import {
    isFun,
    isObj,
    isArray
} from 'LIB/util';


/**
 * 对象映射
 */
let matchObject = function (
    data: any,
    obj: object
) {
    let exp;
    let result = {};
    for (let i in obj) {
        exp = parse(obj[i]);
        result[i] = parseToData(exp, data, result);
    }

    return result;
};

/**
 * 数组映射
 */
let matchArray = function (
    data: any,
    arr: Array
) {
    let exp;
    let result = {};

    if (arr.length === 1) {
        // 直接映射 data
        for (let i = 0; i < data.length; i++) {
            result[i] = matchObject(data[i], arr[0]);
        }
    }

    return result;
};

export default function init (combineData, keyData) {
    let matchData = {};
    let result;

    if (isObj(keyData)) {
        result = matchObject(combineData, keyData);
    }

    if (isArray(keyData)) {
        result = matchArray(combineData, keyData);
    }

    return result;
};
