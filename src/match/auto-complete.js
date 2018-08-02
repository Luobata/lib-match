/**
 * @description match的自动补全
 */
import config from 'MATCH/config';
import { isObj, isArray, has } from 'LIB/util';

const autoComplete = (result: Object, data: Object) => {
    if (!config.autoComplete) return;

    for (const i in data) {
        if (!has(result, i)) {
            result[i] = data[i];
        } else if (isObj(result[i]) && isObj(data[i])) {
            // object
            autoComplete(result[i], data[i]);
        } else if (isArray(result[i]) && isArray(data[i])) {
            // array
            for (let j = 0; j < result[i].length; j++) {
                autoComplete(result[i][j], data[i][j]);
            }
        }
    }
};

export default autoComplete;
