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

data = match.parse([params], {
    pid: '(boolean)${0.pid}',
    Pid: '(Boolean)${0.pid}',
    name: '(Boolean)${0.name}',
    id: '(int)${0.id}',
    id2: '(Int)${0.pid}',
    id3: '(Int)${0.name}',
    id4: '(Int)${0.district}',
    city: '(string)${0.city}',
    dis: '(float)${0.district}'
});
expect(data).to.be.eql({
    pid: false,
    Pid: true,
    name: true,
    id: 2,
    id2: 0,
    id3: 1,
    id4: 1,
    city: '1',
    dis: 1.56
});

params = [
    {
        id: 1,
        type: 2
    },
    {
        id: 2
    }
];
data = match.parse(params, [{
    id: '(string)$${{id}}',
    title: 'string',
    type: "$${{type}} || 'abc'"
}]);
expect(data).to.be.eql([
    {
        id: '1',
        title: 'string',
        type: 2
    },
    {
        id: '2',
        title: 'string',
        type: 'abc'
    }
]);
