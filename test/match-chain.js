const assert = require('assert');
let params;
let data;

it('chain with tmpConfig && parse', function() {
    params = {
        code: '200',
        msg: 'ok',
        http: 200,
        data: {
            cityId: '1',
            provinceId: 2,
            dis: 2,
        },
    };
    data = match
        .tmpConfig({
            autoComplete: true,
            ignoreTokenKey: ['test'],
        })
        .parse(params, {
            data: {
                city: '$${{data.cityId}}',
                province: '$${{data.provinceId}}',
            },
        });
    assert.deepEqual(data, {
        code: '200',
        msg: 'ok',
        http: 200,
        data: {
            cityId: '1',
            provinceId: 2,
            dis: 2,
            city: '1',
            province: 2,
        },
    });

    params = null;
    data = match
        .tmpConfig({
            filterDefaultArray: true,
        })
        .parse(params, [
            {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'",
            },
        ]);
    assert.deepEqual(data, undefined);

    params = {};
    data = match
        .tmpConfig({
            filterDefaultArray: true,
        })
        .parse(params, [
            'data',
            {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'",
            },
        ]);
    assert.deepEqual(data, undefined);

    params = {
        code: 200,
        msg: 'ok',
        data: null,
    };
    data = match
        .tmpConfig({
            filterDefaultArray: true,
        })
        .parse(params, {
            code: '$${{code}}',
            msg: '$${{msg}}',
            array: '$${{array}} || []',
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
        array: [],
    });

    params = {
        name: {
            id: 1,
        },
    };
    data = match
        .tmpConfig({
            filterEmptyObject: true,
            //filterDefaultObject: true
        })
        .parse(params, {
            title: '$${{abc}}',
            data: {
                id: '$${{name.id}}',
                value: {
                    id: '$${{name.title}}',
                },
            },
            text: {
                title: '$${{name.abc}}',
            },
        });
    assert.deepEqual(data, {
        data: {
            id: 1,
        },
    });

    data = match
        .tmpConfig({
            filterEmptyObject: true,
            //filterDefaultObject: true
        })
        .parse(params, {
            title: '$${{abc}}',
            data: {
                value: {
                    id: '$${{name.title}}',
                },
            },
            text: {
                title: '$${{name.abc}}',
            },
        });
    assert.deepEqual(data, undefined);

    params = {
        code: '200',
        msg: 'ok',
        data: null,
    };

    data = match.parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: {
            a: '$${{data.a}} || 123',
            b: {
                c: '$${{data.b.c}} || []',
                f: '$${{data.f}} || 2',
            },
            d: '$${{data.d}}',
        },
    });
    assert.deepEqual(data, {
        code: '200',
        msg: 'ok',
        data: {
            a: 123,
            b: {
                c: [],
                f: 2,
            },
        },
    });

    params = {
        name: {
            id: 1,
        },
    };
    data = match
        .tmpConfig({
            filterDefaultObject: true,
        })
        .parse(params, {
            data: {
                xx: '$${{name.title}}',
                value: {
                    id: '$${{name.title}}',
                },
                yy: '$${{name.title}}',
            },
            data2: {
                value2: '$${{name.title}} || {}',
            },
        });
    assert.deepEqual(data, {
        data2: {
            value2: {},
        },
    });

    params = {
        code: 200,
        msg: 'ok',
        data: [
            {
                list: [
                    {
                        roomId: 1,
                    },
                    {
                        roomId: 2,
                    },
                ],
            },
        ],
    };

    data = match
        .tmpConfig({
            filterUndefined: false,
            filterNull: false,
        })
        .parse(params, {
            code: '$${{code}}',
            msg: '$${{msg}}',
            data: [
                'data',
                {
                    checked: false,
                    list: [
                        'list',
                        {
                            roomId: '$${{roomId}}',
                            active: false,
                            empty: false,
                        },
                    ],
                },
            ],
        });
    assert.deepEqual(data, {
        code: 200,
        msg: 'ok',
        data: [
            {
                checked: false,
                list: [
                    {
                        roomId: 1,
                        active: false,
                        empty: false,
                    },
                    {
                        roomId: 2,
                        active: false,
                        empty: false,
                    },
                ],
            },
        ],
    });
});
