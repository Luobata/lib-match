import match from 'MATCH/match';
const expect = require('chai').expect;


// 测试自动补全
var params = {
    pid: 1,
    id: 2
};
match.config({autoComplete: true});
var data = match.parse(params, {
    id: '$${{id}}'
});
expect(data).to.be.eql({
    id: 2,
    pid: 1
});
match.config({autoComplete: false});
