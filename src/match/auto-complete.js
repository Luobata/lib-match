/**
 * @description match的自动补全
 */
import config from 'MATCH/config';
import { isObj } from 'LIB/util';

const autoComplete = (
    result: object,
    data: object
) => {

    if (!config.autoComplete) return;

    for (let i in data) {
        if (!result.hasOwnProperty(i)) {
            result[i] = data[i];
        } else if (isObj(result[i]) && isObj(data[i])) {
            autoComplete(result[i], data[i]);
        }
    }
};

export default autoComplete;
