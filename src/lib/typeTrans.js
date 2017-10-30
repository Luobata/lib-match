export const typeTrans = (
    data: any,
    type: string
) => {
    // 字符串对应的 false 转化为false true 转化为true
    if (type === 'boolean') {
        return data.toLowerCase() === 'false' ? false : true;
    }

    if (type === 'Boolean') {
        return !!data;
    }

    if (type === 'int') {
        return parseInt(data, 10);
    }

    if (type === 'Int') {
        return (isNaN(parseInt(data, 10)) ? 0 : parseInt(data, 10));
    }

    if (type === 'float') {
        return parseFloat(data, 10);
    }

    if (type === 'string') {
        return data.toString();
    }
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
        const arrayReg = /^\[\]$/;
        const objectReg = /^\{\}$/;

        // 若果是以''包住 或者""包住
        if (stringReg.test(str)) {
            // 返回字符串
            str = str.match(stringReg).pop(); 
            return str;
        }

        if (arrayReg.test(str)) {
            return [];
        }

        if (objectReg.test(str)) {
            return {};
        }

        // 说明不是字符串类型的值
        let num = parseFloat(str);
        let boo = str === 'false' ? false : (str === 'true' ? true: '');
        str = num || boo !== '' ? num || boo : str;
        return str;
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
        for (let i = 0 ;i < data.length; i++) {
        //for (let i of data) {
            arr = arr.concat(data[i][key]);
        }

        return arr;
    } catch (e) {
        return [];
    };
};
