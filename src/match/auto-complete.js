/**
 * @description match的自动补全
 */
import config from 'MATCH/config';
import { isObj, has } from 'LIB/util';

const autoComplete = (
    result: Object,
    data: Object,
) => {
    if (!config.autoComplete) return;

    for (const i in data) {
        // if (!result.hasOwnProperty(i)) {
        if (!has(result, i)) {
            result[i] = data[i];
        } else if (isObj(result[i]) && isObj(data[i])) {
            autoComplete(result[i], data[i]);
        }
    }
};

export default autoComplete;
