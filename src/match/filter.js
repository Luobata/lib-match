/**
 * @descprtion 过滤函数 过滤一些undefined等特殊情况
 */
import config from 'MATCH/config';

const filter = function (
    key: string,
    result: ojbect 
) {
    if (config.filterUndefined && result[key] === undefined) {
        delete result[key];
    }

    if (config.filterNull && result[key] === null) {
        delete result[key];
    }
};

export default filter;
