export const isObj = obj => Object.prototype.toString.call(obj) === '[object Object]';

export const isFun = obj => Object.prototype.toString.call(obj) === '[object Function]';

export const isArray = obj => Object.prototype.toString.call(obj) === '[object Array]';

export const isStr = str => Object.prototype.toString.call(str) === '[object String]';

export const isNum = num => Object.prototype.toString.call(num) === '[object Number]';

export const isEmptyObj = obj => JSON.stringify(obj) === '{}';

export const empty = obj => (obj === undefined);
