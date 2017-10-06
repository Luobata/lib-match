/**
 * @description 把exp解析的内容反装回真是值
 */
import { 
    getData,
    getArrData
} from 'MATCH/parse';
import {
    isFun,
    isNum,
    isObj,
    isStr,
    isArray,
    isEmptyObj,
    typeCharge,
    objToArray,
    hasReg,
    addArr,
    typeTrans
} from 'LIB/util';
import {
    matchObject,
    matchArray
} from 'MATCH/match';
import stack from 'MATCH/stack';

export const parseToData = function (
    exp: object, // parse 返回值
    data: object, // 映射的params数组
    that: object // 返回对象指针
) {
    let result;

    try {
        if (exp['matchObject']) {
            result = matchObject(data, exp['matchObject']);
            return result;
        }

        if (exp['matchArray']) {
            result = matchArray(data, exp['matchArray']);
            return result;
        }

        if (exp['noMatch'] !== undefined) {
            result = exp['noMatch'];
            return result;
        }

        if (exp['matchFun']) {
            result = exp['matchFun'].apply(that, [data].concat(objToArray(stack, 'value')));
            return result;
        }

        if (exp['matchStr']) {
            result = splStr(exp['matchStr'], data);
            return result;
        }

        if (exp['matchParam']) {
            result = getData(data, exp['matchParam'], exp['matchType']);
            result =
                (result === undefined) ? typeCharge(exp['default']) : result;

            // 记录此时的空对象是默认产生的 防止被filter过滤
            if (isEmptyObj(result)) changeFilterDefaultObject(true);
            return result;
        }

        if(exp['matchArrParam']) {
            result = getArrData(data, exp['matchArrParam'], exp['matchType']);
            result =
                (result === undefined) ? typeCharge(exp['default']) : result;
            return result;
        }

    } catch (e) {
        if (exp['default']) {
            result = typeCharge(exp['default']);
            return (config.filterDefaultObject && isEmptyObj(result)) ? undefined : result;
        }
        // console.log(e);
    }
};

const splStr = (
    str: Array,
    data: object, // 映射的params数组
) => {
    let result;
    let i = 0;
    let item = str[i];
    const splData = (item) => {
        let result;

        if (item['matchParam']) {
            result = getData(data, item['matchParam'], item['matchType']);
            return result;
        }

        if (item['matchArrParam']) {
            result = getArrData(data, item['matchArrParam'], item['matchType']);
            return result;
        }

        if (item['default']) {
            result = typeCharge(item['default']);
            return result;
        }
    };
    const datas = (i) => {
        const item = str[i];
        let result = splData(item);

        if (item.spr) {
            i++;
            switch (item.spr) {
                case '||':
                    result = 
                        (result === undefined) ? datas(i) : result;
                break;
                case '|||':
                    result = result || datas(i);
                break;
            }
        }

        return result;
    };

    result = datas(i);

    return result;
};
