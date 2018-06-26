const assert = require('assert');
let params;
let data;

it('match array directly', function() {
    params = [
        {
            id: 1,
            type: 2,
        },
        {
            id: 2,
        },
    ];
    data = match.parse(params, [
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ]);
    assert.deepEqual(data, [
        {
            id: 1,
            title: 'string',
            type: 2,
        },
        {
            id: 2,
            title: 'string',
            type: 'abc',
        },
    ]);
});
it('match null or no match return empty array', function() {
    params = null;
    data = match.parse(params, [
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ]);
    assert.deepEqual(data, []);

    params = {};
    data = match.parse(params, [
        'data',
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ]);
    assert.deepEqual(data, []);

    params = {
        code: 200,
        msg: 'ok',
        data: null,
    };
    data = match.parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: [
            'data',
            {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'",
            },
        ],
    });
    assert.deepEqual(data, {
        code: 200,
        msg: 'ok',
        data: [],
    });
});
it('match array as key in object', function() {
    params = {
        data: [
            {
                id: 1,
                type: 2,
            },
            {
                id: 2,
            },
        ],
    };
    data = match.parse(params, [
        'data',
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ]);
    assert.deepEqual(data, [
        {
            id: 1,
            title: 'string',
            type: 2,
        },
        {
            id: 2,
            title: 'string',
            type: 'abc',
        },
    ]);

    params = {
        data: {
            table: [
                {
                    id: 1,
                    type: 2,
                },
                {
                    id: 2,
                },
            ],
        },
    };
    data = match.parse(params, [
        'data.table',
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ]);

    assert.deepEqual(data, [
        {
            id: 1,
            title: 'string',
            type: 2,
        },
        {
            id: 2,
            title: 'string',
            type: 'abc',
        },
    ]);
});

it('match Array<object> with default value', function() {
    params = {
        code: 200,
        msg: 'ok',
        data: [
            {
                id: 1,
                type: 'a',
            },
            {
                id: 2,
            },
        ],
    };
    data = match.parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: [
            'data',
            {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'",
            },
        ],
    });
    assert.deepEqual(data, {
        code: 200,
        msg: 'ok',
        data: [
            {
                id: 1,
                title: 'string',
                type: 'a',
            },
            {
                id: 2,
                title: 'string',
                type: 'abc',
            },
        ],
    });
});

it('match Array<object> with basic key name', function() {
    params = {
        code: 200,
        msg: 'ok',
        data: [
            {
                id: 1,
                name: 2,
            },
            {
                id: 2,
                name: 3,
            },
        ],
    };

    data = match.parse(params, ['data', 'id']);

    assert.deepEqual(data, [1, 2]);

    data = match.parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: ['data', 'id'],
    });
    assert.deepEqual(data, {
        code: 200,
        msg: 'ok',
        data: [1, 2],
    });
});
