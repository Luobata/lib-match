import { parse , parseToData } from 'MATCH/parse';
import {
    isFun,
    isObj,
    isArray
} from 'LIB/util';


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

let matchArray = function (
    data: any,
    arr: Array
) {
};

export default function init (combineData, keyData) {
    let matchData = {};
    let result;

    if (isObj(keyData)) {
        result = matchObject(combineData, keyData);
    }

    return result;
};
