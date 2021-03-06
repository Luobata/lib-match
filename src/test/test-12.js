/*
 * @description 测试数组对象 获取一个字段拼凑数组
 */
import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: 200,
    msg: 'ok',
    data: [
        {
            id: 1,
            name: 2
        },
        {
            id: 2,
            name: 3
        }
    ]
};

let data = match
    .parse(params, [
        'data', 'id'
    ]);

expect(data).to.be.eql([1, 2]);

data = match
    .parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: ['data', 'id'],
    });
expect(data).to.be.eql({
    code: 200,
    msg: 'ok',
    data: [1, 2]
});
