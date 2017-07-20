/**
 * @description 字符串解析内容
 */

export default function parse (
    str: string
) {
    let strArr = str.split('||');
    let i;
    let token;
    let parseResult = {
    };
    for (i of strArr) {
        token = i.trim().match(/\$\$\{\{(.*)\}\}/);
        if (token && token.length && token.length >= 1) {
            parseResult['matchParam'] = token[1];
            continue;
        }

        if (!token) {
            parseResult['default'] = i.trim();
        }
    }

    return parseResult;
};
