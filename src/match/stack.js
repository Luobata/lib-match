/**
 * @description 存储公共内容
 */
import {
    isFun,
    isObj,
    isStr,
    isArray
} from 'LIB/util';

let stack = [];

export default stack;

export const pushStack = function (
    obj: object | Array
) {
    if (isObj(obj)) {
        stack.push(obj);
    }

    if (isArray(obj)) {
        stack = stack.concat(obj);
    }
};
