var isNaN = Number.isNaN;

var typeTrans = function typeTrans(data, type) {
    // 字符串对应的 false 转化为false true 转化为true
    var booleanFun = function booleanFun() {
        return data.toLowerCase() !== 'false';
    };
    var BooleanFun = function BooleanFun() {
        return !!data;
    };
    if (type === '!boolean') {
        return !booleanFun();
    }
    if (type === 'boolean') {
        return booleanFun();
    }

    if (type === '!Boolean') {
        return !BooleanFun();
    }

    if (type === 'Boolean') {
        return BooleanFun();
    }

    if (type === 'int') {
        return parseInt(data, 10);
    }

    if (type === 'Int') {
        return isNaN(parseInt(data, 10)) ? 0 : parseInt(data, 10);
    }

    if (type === 'float') {
        return parseFloat(data, 10);
    }

    if (type === 'string') {
        return data.toString();
    }

    return true;
};

/**
 * @description 类型转换
 * */
var typeCharge = function typeCharge(str) {
    try {
        str = str.trim();
        var stringReg = /^(['"])(.*)\1$/;
        var arrayReg = /^\[\]$/;
        var objectReg = /^\{\}$/;

        // 若果是以''包住 或者""包住
        if (stringReg.test(str)) {
            // 返回字符串
            str = str.match(stringReg).pop();
            return str;
        }

        if (str === 'null') {
            return null;
        }

        if (str === 'undefined') {
            return undefined;
        }

        if (str === 'NaN') {
            return NaN;
        }

        if (arrayReg.test(str)) {
            return [];
        }

        if (objectReg.test(str)) {
            return {};
        }

        // 说明不是字符串类型的值
        var num = parseFloat(str);
        /* eslint-disable no-nested-ternary */
        var boo = str === 'false' ? false : str === 'true' ? true : '';
        /* eslint-disable no-nested-ternary */
        str = num || boo !== '' ? num || boo : str;
        return str;
    } catch (e) {
        return str;
    }
};

var objToArray = function objToArray(data, // 转换的对象数组
key) // 转化你的值
{
    try {
        var arr = [];
        for (var i = 0; i < data.length; i++) {
            // for (let i of data) {
            arr = arr.concat(data[i][key]);
        }

        return arr;
    } catch (e) {
        return [];
    }
};

var addArr = function addArr(arr, i) {
    if (arr && arr.length) {
        arr.push(i);
        return arr;
    }
    return [i];
};

var isObj = function isObj(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

var isFun = function isFun(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

var isArray = function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

var isStr = function isStr(str) {
  return Object.prototype.toString.call(str) === '[object String]';
};

var isNum = function isNum(num) {
  return Object.prototype.toString.call(num) === '[object Number]';
};

var isEmptyObj = function isEmptyObj(obj) {
  return JSON.stringify(obj) === '{}';
};

var empty = function empty(obj) {
  return obj === undefined;
};

/**
 * 正则match可以匹配上第一个缓存
 */
var hasReg = function hasReg(token) {
  return token && token.length && token.length >= 1;
};

var has = function has(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
};

/**
 * @descrption 增加全局配置项
 */
// 全局配置项
var config = {
    filterUndefined: true, // 过滤undefined
    filterNull: true, // 过滤null
    filterEmptyObject: false, // 过滤空对象
    filterDefaultArray: false, // 过滤匹配数组产生的Array 不过滤自定义的返回值 []
    filterDefaultObject: false, // 过滤匹配对象产生的Object 不过滤自定的返回值 {}
    autoComplete: false, // 自动补全
    ignoreTokenKey: [], // 忽略解析的key
    debug: false // debug 模式
};

var tmpConfig = null;
var debugArray = [];

var filterDefaultObject = false;

var changeFilterDefaultObject = function changeFilterDefaultObject(boo) {
    filterDefaultObject = boo;
};

var extendConfig = function extendConfig(obj) {
    if (!isObj(obj)) {
        /* eslint-disable no-console */
        console.error('error config type');
        /* eslint-disable no-console */
        return;
    }

    Object.assign(config, obj);
};

var extendTmpConfig = function extendTmpConfig(obj) {
    tmpConfig = Object.assign({}, config);
    extendConfig(obj);
};

var restoreConfig = function restoreConfig() {
    if (!tmpConfig) return;

    extendConfig(tmpConfig);

    tmpConfig = null;
};

/**
 * @description 字符串解析内容
 */

var getData = function getData(data, exp, // 对应的对象字面量字符串 xx.xxx
type) // 对应的类型
{
    var par = data;
    var token = exp.split('.');
    // 递归获取
    for (var i = 0; i < token.length; i++) {
        par = par[token[i]];
    }

    return type && par !== undefined ? typeTrans(par, type) : par;
};

var getArrData = function getArrData(data, exp, // 对应的数组序号字符串字面量
type) // 对应的类型
{
    var token = exp.split('.');
    var index = parseInt(token.shift(), 10);
    if (!isNum(index) || data[index] === undefined) {
        /* eslint-disable no-console */
        console.error('error: the Array index is not exist!');
        /* eslint-disable no-console */
        return undefined;
    }

    return getData(data[index], token.join('.'), type);
};

var isIgnore = function isIgnore(key) {
    return config.ignoreTokenKey.indexOf(key) !== -1;
};

var parse = function parse(str, key) {
    var token = void 0;
    var parseResult = {};
    var objTokenReg = /\$\$\{\{(.*)\}\}/;
    var arrTokenReg = /\$\{(.*)\}/;
    var typeTokenReg = /(!?)\((boolean|Boolean|int|Int|string|float)\)\$/;
    // const strTokenReg = /(?:(.*?)(\|\|))|(.+)/ig;
    // 隐藏token
    var strTokenReg = /(?:(.*?)(\|\|(?:\||)|(?:&&)))|(.+)/gi;

    if (empty(key)) {
        parseResult.matchArrayKey = str;
        return parseResult;
    }

    if (isObj(str)) {
        // 递归映射
        parseResult.matchObject = str;
        return parseResult;
    }

    if (isArray(str)) {
        // 数组递归映射
        parseResult.matchArray = str;
        return parseResult;
    }

    if (isFun(str)) {
        // 执行函数
        parseResult.matchFun = str;
        return parseResult;
    }

    if (!isStr(str) || isIgnore(key) || !objTokenReg.test(str) && !arrTokenReg.test(str)) {
        // 不是字符串 直接返回
        parseResult.noMatch = str;
        return parseResult;
    }

    var re = strTokenReg.exec(str);
    var end = function end(result) {
        parseResult.matchStr = addArr(parseResult.matchStr, result);
        return strTokenReg.exec(str);
    };
    while (re) {
        var spr = re[2];
        var tok = re[1] === undefined ? re[0] : re[1];
        var result = {};

        if (spr) {
            result.spr = spr.trim();
        }

        token = tok.trim().match(typeTokenReg);

        if (hasReg(token)) {
            // 类型
            result.matchType = token[1] + token[2];
        }

        token = tok.trim().match(objTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射字段
            result.matchParam = token[1];
            re = end(result);
            continue;
        }

        token = tok.trim().match(arrTokenReg);

        if (token && token.length && token.length >= 1) {
            // 映射数组
            result.matchArrParam = token[1];
            re = end(result);
            continue;
        }

        if (!token) {
            // 如果上面三个都没有匹配上 自认为是默认值
            result.default = tok.trim();
            re = end(result);
            continue;
        }
    }

    return parseResult;
};

/**
 * @description 存储公共内容
 */
var stack = [];

var stack$1 = stack;

var pushStack = function pushStack(key) {
    var has = false;
    for (var i = 0; i < stack.length; i++) {
        if (stack[i].name === key.name) {
            stack[i] = key;
            has = true;
        }
    }

    if (!has) stack.push(key);
};

var updateStack = function updateStack(key, name) {
    try {
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].name === name) {
                stack[i].value = key;
            }
        }
    } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-disable no-console */
    }
};

var removeStack = function removeStack(name) {
    for (var i = 0; i < stack.length;) {
        if (stack[i].name === name) {
            stack.splice(i, 1);
        } else {
            i++;
        }
    }
};

var cleanStack = function cleanStack() {
    stack = [];
};

/**
 * @description 把exp解析的内容反装回真是值
 */

var splStr = function splStr(str, data) // 映射的params数组
{
    var j = 0;
    // const item = str[i];
    var splData = function splData(item) {
        var result = void 0;

        if (item.matchParam) {
            result = getData(data, item.matchParam, item.matchType);
            return result;
        }

        if (item.matchArrParam) {
            result = getArrData(data, item.matchArrParam, item.matchType);
            return result;
        }

        if (item.default) {
            result = typeCharge(item.default);
            return result;
        }

        return result;
    };
    var datas = function datas(i) {
        var item = str[i];
        var result = splData(item);

        if (item.spr) {
            i++;
            switch (item.spr) {
                case '||':
                    result = result === undefined ? datas(i) : result;
                    break;
                case '|||':
                    result = result || datas(i);
                    break;
                default:
                    break;
            }
        }

        return result;
    };

    var results = datas(j);

    return results;
};

function parseToData (exp, // parse 返回值
data, // 映射的params数组
that) // 返回对象指针
{
    var result = void 0;

    try {
        if (exp.matchArrayKey) {
            result = data[exp.matchArrayKey];
            return result;
        }

        if (exp.matchObject) {
            result = matchObject(data, exp.matchObject);
            return result;
        }

        if (exp.matchArray) {
            result = matchArray(data, exp.matchArray);
            return result;
        }

        if (exp.noMatch !== undefined) {
            result = exp.noMatch;
            return result;
        }

        if (exp.matchFun) {
            result = exp.matchFun.apply(that, [data].concat(objToArray(stack$1, 'value')));
            return result;
        }

        if (exp.matchStr) {
            result = splStr(exp.matchStr, data);
            return result;
        }

        if (exp.matchParam) {
            result = getData(data, exp.matchParam, exp.matchType);
            result = result === undefined ? typeCharge(exp.default) : result;

            // 记录此时的空对象是默认产生的 防止被filter过滤
            if (isEmptyObj(result)) changeFilterDefaultObject(true);
            return result;
        }

        if (exp.matchArrParam) {
            result = getArrData(data, exp.matchArrParam, exp.matchType);
            result = result === undefined ? typeCharge(exp.default) : result;
            return result;
        }
    } catch (e) {
        if (exp.matchStr) {
            var def = exp.matchStr.pop();
            if (def.default) {
                result = typeCharge(def.default);
                return config.filterDefaultObject && isEmptyObj(result) ? undefined : result;
            }
        }
        // console.log(e);
    }

    return result;
}

/**
 * @descprtion 过滤函数 过滤一些undefined等特殊情况
 */

var filter = function filter(key, result) {
    if (config.filterUndefined && result[key] === undefined) {
        delete result[key];
    }

    if (config.filterNull && result[key] === null) {
        delete result[key];
    }

    if (config.filterEmptyObject && isEmptyObj(result[key])) {
        delete result[key];
    }
};

var filterEmpty = function filterEmpty(result) {
    if (config.filterDefaultObject && !filterDefaultObject && isEmptyObj(result)) return undefined;

    return config.filterEmptyObject && isEmptyObj(result) ? undefined : result;
};

/**
 * @description match的自动补全
 */

var autoComplete = function autoComplete(result, data) {
    if (!config.autoComplete) return;

    for (var i in data) {
        // if (!result.hasOwnProperty(i)) {
        if (!has(result, i)) {
            result[i] = data[i];
        } else if (isObj(result[i]) && isObj(data[i])) {
            autoComplete(result[i], data[i]);
        }
    }
};

/* eslint-disable */
(function () {
    if (typeof Object.assign !== 'function') {
        Object.assign = function (target, varArgs) {

            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
})();
/* eslint-disable */

var debug = (function (result, combineData, keyData) {
    if (!config.debug) return;
    if (!window.Match_Debug) {
        window.Match_Debug = debugArray;
    }
    debugArray.push({
        result: result,
        data: combineData,
        matchObj: keyData,
        config: Object.assign({}, config)
    });
});

var _this = undefined;

/**
 * 对象映射
 */
var matchObject = function matchObject(data, obj) {
    var exp = void 0;
    var result = {};

    if (isStr(obj)) {
        exp = parse(obj);
        result = parseToData(exp, data);
    } else {
        for (var i in obj) {
            if (!has(obj, i)) continue;
            exp = parse(obj[i], i);
            result[i] = parseToData(exp, data, result);
            filter(i, result);
            changeFilterDefaultObject(false);
        }
    }

    return filterEmpty(result);
};

/**
 * 数组映射
 */
var matchArray = function matchArray(data, arr) {
    var result = [];

    try {
        if (arr.length === 1) {
            // 直接映射 data
            for (var i = 0; i < data.length; i++) {
                result[i] = matchObject(data[i], arr[0]);
            }
        }

        if (arr.length === 2) {
            // 映射data的对象
            data = getData(data, arr[0]);
            // data = data[arr[0]];
            for (var _i = 0; _i < data.length; _i++) {
                result[_i] = matchObject(data[_i], arr[1]);
            }
        }
    } catch (e) {
        if (config.filterDefaultArray) return undefined;
    }

    return result;
};

var match = {
    parse: function parse$$1(combineData, keyData) {
        var result = void 0;

        if (isObj(keyData)) {
            result = matchObject(combineData, keyData);
        }

        if (isArray(keyData)) {
            result = matchArray(combineData, keyData);
        }

        autoComplete(result, combineData);
        debug(result, combineData, keyData);

        restoreConfig();

        return result;
    },
    parseConfig: function parseConfig(combineData, keyData, configTmp) {
        // 代表此次match使用传入的config
        var configCache = Object.assign({}, config);

        extendConfig(configTmp);
        var data = this.parse(combineData, keyData);
        extendConfig(configCache);

        return data;
    },
    tmpConfig: function tmpConfig(configTmp) {
        extendTmpConfig(configTmp);

        return this;
    },

    register: function register(obj, name) {
        pushStack({
            value: obj,
            name: name
        });
    },
    update: function update(obj, name) {
        updateStack(obj, name);
        return _this;
    },
    // 移除register的内容
    remove: function remove(name) {
        removeStack(name);
        return _this;
    },
    removeAll: function removeAll() {
        cleanStack();

        return _this;
    },
    config: function config$$1(obj) {
        extendConfig(obj);

        return _this;
    }
};

export default match;
//# sourceMappingURL=match.esm.js.map
