/**
 * @descrption 增加全局配置项
 */
import { isObj } from 'LIB/util';
// 全局配置项
let config = {
    filterUndefined: true, // 过滤undefined
    filterNull: true, // 过滤null
    filterEmptyObject: false, // 过滤空对象
    filterDefaultArray: false, // 过滤匹配数组产生的Array 不过滤自定义的返回值 []
    filterDefaultObject: false, // 过滤匹配对象产生的Object 不过滤自定的返回值 {}
    autoComplete: false, // 自动补全
    ignoreTokenKey: [] // 忽略解析的key
};

let tmpConfig = null;

export let filterDefaultObject = false;

export const changeFilterDefaultObject = (boo) => {
    filterDefaultObject = boo;
};

export const extendConfig = (
    obj: object
) => {
    if (!isObj(obj)) {
        console.log('error config type');
        return;
    }

    Object.assign(config, obj);
};

export const extendTmpConfig = (
    obj: object
) => {
    tmpConfig = Object.assign({}, config);
    extendConfig(obj);
};

export const restoreConfig = () => {
    if (!tmpConfig) return;

    extendConfig(tmpConfig);

    tmpConfig = null;
};

export default config;
