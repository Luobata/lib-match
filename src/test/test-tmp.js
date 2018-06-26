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

let data = match.parseConfig(
    params,
    {
        b: '(int)$${{msg}} ||| null',
        c: '(int)$${{msg}} ||| 1',
        d: '$${{msg2}} || null',
        // code: '$${{code}}',
        // msg: '$${{msg}}',
        // data: '$${{data.0.a}}',
        // data2: '$${{data.1}}',
    },
    {
        filterUndefined: false,
        filterNull: false,
    },
);
console.log(data);
// expect(data).to.be.eql({
//     code: '200',
//     msg: 'ok',
//     data: 1,
//     data2: 2,
// });
