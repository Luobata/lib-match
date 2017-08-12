/**
 * 测试数组对象
 */
import match from 'MATCH/match';

let params = [
    {
        code: 200,
        msg: 'ok',
        data: [1, 2, 3]
    },
    {
        code: 500,
        msg: 'error',
        data: [4, 5, 6]
    }
];

let data = match.parse(params, {
    code: '${0.code}',
    msg: '${1.msg}',
    data: function (data) {
        return data[0].data.concat(data[1].data);
    }
});

console.log(data);
