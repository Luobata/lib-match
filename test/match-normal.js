const match = require('../dist/match');
const assert = require('assert');
let params;
let data;

it('normal key match', function() {
    params = {
        abc: 1,
    };
    data = match.parse(params, {
        title: '$${{abc}}',
    });
    assert.deepEqual(data, {
        title: 1,
    });
});
it('normal key in object', function() {
    params = {
        abc: 1,
        name: {
            id: 100,
        },
    };
    data = match.parse(params, {
        title: '$${{abc}}',
        id: {
            id: '$${{name.id}}',
        },
    });
    assert.deepEqual(data, {
        title: 1,
        id: {
            id: 100,
        },
    });
});
it('without key return empty object', function() {
    params = {};
    data = match.parse(params, {
        title: '$${{abc}}',
        data: {
            id: '$${{name.id}}',
        },
        text: {
            title: '$${{name.abc}}',
        },
    });
    assert.deepEqual(data, {
        data: {},
        text: {},
    });
});
