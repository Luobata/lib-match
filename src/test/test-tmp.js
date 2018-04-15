import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: '200',
    msg: 'ok',
    data: null,
    data: [
        {
            a: 1,
            b: 'c',
        },
        2,
    ],
    data2: null,
};

let data = match.parse(params, {
    code: '$${{code}}',
    msg: '$${{msg}}',
    data: '$${{data.0.a}}',
    data2: '$${{data.1}}',
});
console.log(data);
expect(data).to.be.eql({
    code: '200',
    msg: 'ok',
    data: 1,
    data2: 2,
});
