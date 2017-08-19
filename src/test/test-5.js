import match from 'MATCH/match';
const expect = require('chai').expect;


// 测试 类型转换
let params = {
    pid: 'false',
    name: 1,
    id: '2',
    city: 1
};
let data = match.parse(params, {
    pid: '(boolean)$${{pid}}',
    Pid: '(Boolean)$${{pid}}',
    name: '(Boolean)$${{name}}',
    id: '(int)$${{id}}',
    city: '(string)$${{city}}'
});
expect(data).to.be.eql({
    pid: false,
    Pid: false,
    name: true,
    id: 2,
    city: '1'
});
