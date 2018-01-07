const assert = require('assert');
const match = require('../dist/match');
let params;
let data;

it('return value calculate the function', function() {
    params = {
        pid: 1,
        id: 2,
    };
    data = match.parse(params, {
        pid: 1,
        id: function(data) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid;
        },
    });
    assert.deepEqual(data, {
        pid: 1,
        id: 4,
    });
});
