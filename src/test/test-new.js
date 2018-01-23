import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: '200',
    msg: 'ok',
    data: null,
    pid: 'false',
    pid2: 'true',
};

let data = match.parse(params, {
    p: '(boolean)$${{pid}}',
    pid: '!(boolean)$${{pid}}',
    pid2: '!(boolean)$${{pid2}}',
});
console.log(data);
