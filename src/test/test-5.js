import match from 'MATCH/match';
const expect = require('chai').expect;


// 测试 类型转换
let params = {
    pid: 'false',
    name: 1,
    id: '2',
    city: 1,
    district: '1.56'
};
let data = match.parse(params, {
    pid: '(boolean)$${{pid}}',
    Pid: '(Boolean)$${{pid}}',
    name: '(Boolean)$${{name}}',
    id: '(int)$${{id}}',
    city: '(string)$${{city}}',
    dis: '(float)$${{district}}'
});
expect(data).to.be.eql({
    pid: false,
    Pid: true,
    name: true,
    id: 2,
    city: '1',
    dis: 1.56
});
