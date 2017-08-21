export const isObj = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

export const isFun = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Function]';
};

export const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export const isStr = (str) => {
    return Object.prototype.toString.call(str) === '[object String]';
};

export const isNum = (num) => {
    return Object.prototype.toString.call(num) === '[object Number]';
};
