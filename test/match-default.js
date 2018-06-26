const assert = require('assert');
let params;
let data;

params = {
    abcd: 1,
};
it('number type', function() {
    data = match.parse(params, {
        title: '$${{abc}} || 123',
    });
    assert.deepEqual(data, {
        title: 123,
    });
});
it('boolean type', function() {
    data = match.parse(params, {
        title: '$${{abc}} || true',
    });
    assert.deepEqual(data, {
        title: true,
    });

    data = match.parse(params, {
        title: '$${{abc}} || false',
    });
    assert.deepEqual(data, {
        title: false,
    });
});
it('string type', function() {
    data = match.parse(params, {
        title: '$${{abc}} || "123"',
    });
    assert.deepEqual(data, {
        title: '123',
    });

    data = match.parse(params, {
        title: "$${{abc}} || '123'",
    });
    assert.deepEqual(data, {
        title: '123',
    });
});
it('array type', function() {
    data = match.parse(params, {
        title: '$${{abc}} || []',
    });
    assert.deepEqual(data, {
        title: [],
    });
});
it('object type', function() {
    data = match.parse(params, {
        title: '$${{abc}} || {}',
    });
    assert.deepEqual(data, {
        title: {},
    });
});

it('multi token || usage', function() {
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
    });
    assert.deepEqual(data, {
        id: 123,
        city: 1,
        city2: 4,
        city3: 2,
    });
});
