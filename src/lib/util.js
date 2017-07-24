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


/**
 * @description 类型转换
 **/
export const typeCharge = function (
    str: string
) {
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
