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


/**
 * @description 类型转换
 **/
export const typeCharge = (
    str: string
) => {
    try {
        str = str.trim();
        const stringReg = /^(['"])(.*)\1$/;

        // 若果是以''包住 或者""包住
        if (stringReg.test(str)) {
            // 返回字符串
            str = str.match(stringReg).pop(); 
            return str;
        } else {
            // 说明不是字符串类型的值
            let num = parseFloat(str);
            let boo = str === 'false' ? false : (str === 'true' ? true: '');
            str = num || boo !== '' ? num || boo : str;
            return str;
        }
    } catch (e) {
        return str;
    }
};

export const objToArray = (
    data: Array, // 转换的对象数组
    key: string // 转化你的值
) => {
    try {
        let arr = [];
        for (let i of data) {
            arr = arr.concat(i[key]);
        }

        return arr;
    } catch (e) {
        return [];
    };
};
