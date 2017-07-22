export const isObj = function (obj) {
    return typeof obj === 'object' && !(obj instanceof Array);
};

export const isFun = function (obj) {
    return typeof obj === 'function';
};

export const isArray = function (obj) {
    return !isObj(obj) && (obj instanceof Array);
};

export const isStr = function (str) {
    return typeof str === 'string';
};
