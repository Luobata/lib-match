/**
 * @descrption 增加全局配置项
 */
import { isObj } from 'LIB/util';
// 全局配置项
let config = {
    filterUndefined: true, // 过滤undefined
    filterNull: true, // 过滤null
    autoComplete: false // 自动补全
};

export default config;

export const extendConfig = (
    obj: object
) => {

    if (!isObj(obj)) {
        console.log('error config type');
        return;
    }

    Object.assign(config, obj);
};
