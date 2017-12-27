import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: '200',
    msg: 'ok',
    data: null
};

let data = 
    match.parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: {
            a: '$${{data.a}} || 123',
            b: {
                c: '$${{data.b.c}} || []',
                f: '$${{data.f}} || 2',
            },
            d: '$${{data.d}}'
        }
    });
expect(data).to.be.eql({
    code: '200',
    msg: 'ok',
    data: {
        a: 123,
        b: {
            c: [],
            f: 2
        }
    }
});
