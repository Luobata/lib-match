const assert = require('assert');
//const match  = require('../src/index');
const match = require('../dist/match');
let params;
let data;

describe('lib-match', function() {
    describe('normal match', function() {
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
    });

    describe('match with default value with || token', function() {
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
    });
    describe('match with default value with ||| token', function() {
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
    });
    describe('match function', function() {
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
    });
    describe('match Array<object>', function() {
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
    });

    describe('global params of helpful function in match', function() {
        let format = {
            a: function() {
                return 1;
            },
            b: function() {
                return 2;
            },
        };
        it('register global object', function() {
            match.register(format, 'format');
            params = {
                pid: 1,
                id: 2,
            };
            data = match.parse(params, {
                pid: 1,
                id: function(data, format) {
                    // this 指向自身 data 指向params
                    //return data.pid + data.id + this.pid + format.b();
                    return data.pid + data.id + this.pid + format.b();
                },
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 6,
            });
        });
        it('register global Array<object>', function() {
            match.register([format], 'format');
            params = {
                pid: 1,
                id: 2,
            };
            data = match.parse(params, {
                pid: 1,
                id: function(data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                },
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 6,
            });
        });

        it('update global key', function() {
            format = {
                a: function() {
                    return 11;
                },
                b: function() {
                    return 22;
                },
            };
            match.update(format, 'format');
            params = {
                pid: 1,
                id: 2,
            };
            data = match.parse(params, {
                pid: 1,
                id: function(data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                },
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 26,
            });

            params = {
                type: 1,
            };

            const enumConf = {
                typeOptions: [
                    {
                        id: 1,
                        name: 'one',
                    },
                    {
                        id: 2,
                        name: 'two',
                    },
                ],
            };

            format = function(options, id, key, value) {
                let k = '';

                for (let i of options) {
                    if (i[key] === id) {
                        k = i[value];
                    }
                }

                return k;
            };
            match.update(format, 'format');
            data = match.parse(params, {
                typeId: '$${{type}}',
                typeName: function(data, format) {
                    return format(
                        enumConf.typeOptions,
                        this.typeId,
                        'id',
                        'name',
                    );
                },
                typeNameAgain: (data, format) =>
                    format(enumConf.typeOptions, data.type, 'id', 'name'),
            });
            assert.deepEqual(data, {
                typeId: 1,
                typeName: 'one',
                typeNameAgain: 'one',
            });
        });

        it('remove global key', function() {
            match.remove('format');
            data = match.parse(params, {
                pid: 1,
                id: function(data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                },
            });
            assert.deepEqual(data, {
                pid: 1,
            });
        });
    });

    describe('match config', function() {
        // miss some case here
        it('filter undefined', function() {
            params = {
                pid: 1,
                id: 2,
            };
            data = match.parse(params, {
                id: '$${{xx}}',
            });
            assert.deepEqual(data, {});
        });
        it('auto complete key with same name', function() {
            params = {
                pid: 1,
                id: 2,
            };
            match.config({autoComplete: true});
            data = match.parse(params, {
                id: '$${{id}}',
            });
            assert.deepEqual(data, {
                id: 2,
                pid: 1,
            });
            match.config({autoComplete: false});

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

            data = match.parseConfig(
                params,
                {
                    data: {
                        city: '$${{data.cityId}}',
                        province: '$${{data.provinceId}}',
                    },
                },
                {
                    autoComplete: true,
                },
            );
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
        });
        it('parseConfig by only current match', function() {
            params = {
                pid: 1,
                id: 2,
                cityId: 2,
            };
            data = match.parseConfig(
                params,
                {
                    id: '$${{ID}}',
                    pid: '$${{pid}}',
                },
                {
                    autoComplete: true,
                    filterUndefined: false,
                },
            );
            assert.deepEqual(data, {
                id: undefined,
                pid: 1,
                cityId: 2,
            });
        });
        it('ignore key without match', function() {
            params = {
                pid: 1,
                id: 2,
                cityId: 2,
            };
            data = match.parseConfig(
                params,
                {
                    id: '$${{id}}',
                    pid: '$${{pid}}',
                },
                {
                    ignoreTokenKey: ['id'],
                },
            );
            assert.deepEqual(data, {
                id: '$${{id}}',
                pid: 1,
            });
        });
    });
    describe('match multi input', function() {
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
    });
    describe('match and trans the type', function() {
        it('int string float boolean', function() {
            params = {
                pid: 'false',
                name: 1,
                id: '2',
                city: 1,
                district: '1.56',
            };
            data = match.parse(params, {
                pid: '(boolean)$${{pid}}',
                id: '(int)$${{id}}',
                city: '(string)$${{city}}',
                dis: '(float)$${{district}}',
            });
            assert.deepEqual(data, {
                pid: false,
                id: 2,
                city: '1',
                dis: 1.56,
            });
        });
        it('Int Boolean', function() {
            params = {
                pid: 'false',
                name: 1,
                id: '2',
                city: 1,
                district: '1.56',
            };
            data = match.parse(params, {
                Pid: '(Boolean)$${{pid}}',
                id: '(Int)$${{id}}',
                id2: '(Int)$${{pid}}',
            });
            assert.deepEqual(data, {
                Pid: true,
                id: 2,
                id2: 0,
            });
        });
        it('trans with different situation', function() {
            params = {
                pid: 'false',
                name: 1,
                id: '2',
                city: 1,
                district: '1.56',
            };
            data = match.parse([params], {
                pid: '(boolean)${0.pid}',
                Pid: '(Boolean)${0.pid}',
                name: '(Boolean)${0.name}',
                id: '(int)${0.id}',
                id2: '(Int)${0.pid}',
                id3: '(Int)${0.name}',
                id4: '(Int)${0.district}',
                city: '(string)${0.city}',
                dis: '(float)${0.district}',
            });
            assert.deepEqual(data, {
                pid: false,
                Pid: true,
                name: true,
                id: 2,
                id2: 0,
                id3: 1,
                id4: 1,
                city: '1',
                dis: 1.56,
            });
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
                    id: '(string)$${{id}}',
                    title: 'string',
                    type: "$${{type}} || 'abc'",
                },
            ]);
            assert.deepEqual(data, [
                {
                    id: '1',
                    title: 'string',
                    type: 2,
                },
                {
                    id: '2',
                    title: 'string',
                    type: 'abc',
                },
            ]);
        });
        it('type transform by error to NaN and default value', function() {
            params = {
                code: '200',
                msg: 'ok',
            };
            data = match.parse(params, {
                code: '(int)$${{code2}} || 2',
                code2: '(int)$${{code}} || 2',
                msg: '$${{msg}}',
            });
            assert.deepEqual(data, {
                code: 2,
                code2: 200,
                msg: 'ok',
            });
        });
    });
    describe('match with chain use', function() {
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
    });
});
