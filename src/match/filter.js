/**
 * @descprtion 过滤函数 过滤一些undefined等特殊情况
 */
import config from 'MATCH/config';
import { isEmptyObj } from 'LIB/util';

export const filter = (
    key: string,
    result: object
) => {
    if (config.filterUndefined && result[key] === undefined) {
        delete result[key];
    }

    if (config.filterNull && result[key] === null) {
        delete result[key];
    }

    if (config.filterEmptyObject && isEmptyObj(result[key])) {
        delete result[key];
    }
};

export const filterEmpty = (
    result: object
) => {
    if (config.filterEmptyObject) {
        // debugger;
    }
    return (config.filterEmptyObject && isEmptyObj(result)) ? undefined : result;
};
