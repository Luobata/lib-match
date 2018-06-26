const assert = require('chai').assert;
let params;
let data;

it('multi token || and ||| usage', function() {
    params = {
        id: 0,
        c: 1,
        city: 2,
    };
    data = match.parseConfig(
        params,
        {
            id: '$${{ids}} || 123',
            id2: '$${{ids}} || null',
            id3: '$${{ids}} || NaN',
            id4: '$${{ids}} || undefined',
            id5: '$${{ids}} ||| null',
            id6: '$${{ids}} ||| NaN',
            id7: '$${{ids}} ||| undefined',
            city: '$${{c}} || $${{city}} || 1',
            city2: '$${{province}} || 4',
            city3: '$${{c2}} || $${{city}} || 1',
            city4: '$${{id}} ||| 1',
            city5: '$${{city}} ||| 1',
            city6: '$${{ids}} ||| 1',
            city7: '$${{ids}} || $${{id}} ||| 1',
            city8: '$${{id}} || $${{ids}} ||| 1',
        },
        {
            filterUndefined: false,
            filterNull: false,
        },
    );
    assert.deepEqual(data, {
        id: 123,
        id2: null,
        id3: NaN,
        id4: undefined,
        id5: null,
        id6: NaN,
        id7: undefined,
        city: 1,
        city2: 4,
        city3: 2,
        city4: 1,
        city5: 2,
        city6: 1,
        city7: 1,
        city8: 0,
    });
});
