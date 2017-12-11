/*
 * @description 测试
 */
import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: '200',
    msg: 'ok',
};

let data = match
    .parse(params, {
        code: '(int)$${{code2}} || 2',
        code2: '(int)$${{code}} || 2',
        msg: '$${{msg}}',
    });
expect(data).to.be.eql({
    code: 2,
    code2: 200,
    msg: 'ok',
});
