const assert = require('assert');
const match = require('../dist/match');
let params;
let data;

it('multi token || and ||| usage', function() {
    params = {
        id: 0,
        c: 1,
        city: 2,
    };
    data = match.parse(params, {
        id: '$${{ids}} || 123',
        city: '$${{c}} || $${{city}} || 1',
        city2: '$${{province}} || 4',
        city3: '$${{c2}} || $${{city}} || 1',
        city4: '$${{id}} ||| 1',
    });
    assert.deepEqual(data, {
        id: 123,
        city: 1,
        city2: 4,
        city3: 2,
        city4: 1,
    });
});
