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
    key: object
) {
    let has = false;
    for (let i = 0; i < stack.length; i++) {
        if (stack[i].name === key.name) {
            stack[i] = key;
            has = true;
        }
    }

    if (!has) stack.push(key);
};

export const updateStack = function (
    key: object | Array,
    name: string
) {
    try {
        for (let i = 0; i < stack.length; i++) {
            if (stack[i].name === name) {
                stack[i].value = key;
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const removeStack = function (
    name: string
) {
    for (let i = 0; i < stack.length;) {
        if (stack[i].name === name) {
            stack.splice(i, 1);
        } else {
            i++;
        }
    }
};

export const cleanStack = function () {
    stack = [];
};
