/**
 * @description 存储公共内容
 */
let stack = [];

export default stack;

export const pushStack = (key: Object) => {
    let has = false;
    for (let i = 0; i < stack.length; i++) {
        if (stack[i].name === key.name) {
            stack[i] = key;
            has = true;
        }
    }

    if (!has) stack.push(key);
};

export const updateStack = (
    key: Object | Array,
    name: string,
) => {
    try {
        for (let i = 0; i < stack.length; i++) {
            if (stack[i].name === name) {
                stack[i].value = key;
            }
        }
    } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-disable no-console */
    }
};

export const removeStack = (name: string) => {
    for (let i = 0; i < stack.length;) {
        if (stack[i].name === name) {
            stack.splice(i, 1);
        } else {
            i++;
        }
    }
};

export const cleanStack = () => {
    stack = [];
};
