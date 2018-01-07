const assert = require('assert');
const match = require('../dist/match');
let params;
let data;

it('the match input be a Array', function() {
    params = [
        {
            code: 200,
            msg: 'ok',
            data: [1, 2, 3],
        },
        {
            code: 500,
            msg: 'error',
            data: [4, 5, 6],
        },
    ];

    data = match.parse(params, {
        code: '${0.code}',
        msg: '${1.msg}',
        data: function(data) {
            return data[0].data.concat(data[1].data);
        },
    });
    assert.deepEqual(data, {
        code: 200,
        msg: 'error',
        data: [1, 2, 3, 4, 5, 6],
    });
});
