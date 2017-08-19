import match from 'MATCH/match';
const expect = require('chai').expect;


// 测试自动补全
let params = {
    pid: 1,
    id: 2
};
match.config({autoComplete: true});
let data = match.parse(params, {
    id: '$${{id}}'
});
expect(data).to.be.eql({
    id: 2,
    pid: 1
});
match.config({autoComplete: false});


// 测试parseConfig
params = {
    pid: 1,
    id: 2,
    cityId: 2
};
data = match.parseConfig(params, {
    id: '$${{ID}}',
    pid: '$${{pid}}'
}, {
    autoComplete: true,
    filterUndefined: false
});
expect(data).to.be.eql({
    id: undefined,
    pid: 1,
    cityId: 2
});

data = match.parse(params, {
    id: '$${{id}}'
});
expect(data).to.be.eql({
    id: 2
});

// 测试config ignoretokenkey
data = match.parseConfig(params, {
    id: '$${{id}}',
    pid: '$${{pid}}'
}, {
    ignoreTokenKey: ['id']
});

expect(data).to.be.eql({
    id: '$${{id}}',
    pid: 1
});

data = match.parse(params, {
    id: '$${{id}}'
});
expect(data).to.be.eql({
    id: 2
});
