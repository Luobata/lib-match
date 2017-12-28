const assert = require('assert');
//const match  = require('../src/index');
const match  = require('../dist/match');
let params;
let data;

describe('lib-match', function() {
    describe('normal match', function() {
        it('normal key match', function() {
            params = {
                abc: 1,
            };
            data = match.parse(params, {
                title: '$${{abc}}'
            });
            assert.deepEqual(data, {
                title: 1,
            });
        });
        it('normal key in object', function() {
            params = {
                abc: 1,
                name: {
                    id: 100
                }
            };
            data = match.parse(params, {
                title: '$${{abc}}',
                id: {
                    id: '$${{name.id}}'
                }
            });
            assert.deepEqual(data, {
                title: 1,
                id: {
                    id: 100
                }
            });
        });
        it('without key return empty object', function() {
            params = {
            };
            data = match.parse(params, {
                title: '$${{abc}}',
                data: {
                    id: '$${{name.id}}'
                },
                text: {
                    title: '$${{name.abc}}'
                }
            });
            assert.deepEqual(data, {
                data: {
                },
                text: {
                }
            });
        });
    });

    describe('match with default value with || token', function() {
        params = {
            abcd: 1
        };
        it('number type', function() {
            data = match.parse(params, {
                title: '$${{abc}} || 123'
            });
            assert.deepEqual(data, {
                title: 123
            });
        });
        it('boolean type', function() {
            data = match.parse(params, {
                title: '$${{abc}} || true'
            });
            assert.deepEqual(data, {
                title: true
            });

            data = match.parse(params, {
                title: '$${{abc}} || false'
            });
            assert.deepEqual(data, {
                title: false
            });
        });
        it('string type', function() {
            data = match.parse(params, {
                title: '$${{abc}} || "123"'
            });
            assert.deepEqual(data, {
                title: '123'
            });

            data = match.parse(params, {
                title: "$${{abc}} || '123'"
            });
            assert.deepEqual(data, {
                title: '123'
            });
        });
        it('array type', function() {
            data = match.parse(params, {
                title: '$${{abc}} || []'
            });
            assert.deepEqual(data, {
                title: []
            });
        });
        data = match.parse(params, {
            title: '$${{abc}} || {}'
        });
        it('object type', function() {
            assert.deepEqual(data, {
                title: {}
            });
        });
    });
    describe('match function', function() {
        it('return value calculate the function', function() {
            params = {
                pid: 1,
                id: 2
            };
            data = match.parse(params, {
                pid: 1,
                id: function (data) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid;
                }
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
                type: 2
            },
            {
                id: 2
            }
            ];
            data = match.parse(params, [{
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'"
            }]);
            assert.deepEqual(data, [
                {
                    id: 1,
                    title: 'string',
                    type: 2
                },
                {
                    id: 2,
                    title: 'string',
                    type: 'abc' 
                }
            ]);
        });
        it('match null or no match return empty array', function() {
            params = null;
            data = match.parse(params, [{
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'"
            }]);
            assert.deepEqual(data, []);

            params = {
            };
            data = match.parse(params, ['data', {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'"
            }]);
            assert.deepEqual(data, []);

            params = {
                code: 200,
                msg: 'ok',
                data: null
            };
            data = match.parse(params, {
                code: '$${{code}}',
                msg: '$${{msg}}',
                data: ['data', {
                    id: '$${{id}}',
                    title: 'string',
                    type: "$${{type}} || 'abc'"
                }]
            });
            assert.deepEqual(data, {
                code: 200,
                msg: 'ok',
                data: [
                ]
            });
        });
        it('match array as key in object', function() {
            params = {
                data: [
                {
                    id: 1,
                    type: 2
                },
                {
                    id: 2
                }
                ]
            };
            data = match.parse(params, ['data', {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'"
            }]);
            assert.deepEqual(data, [
                {
                    id: 1,
                    title: 'string',
                    type: 2
                },
                {
                    id: 2,
                    title: 'string',
                    type: 'abc'
                }
            ]);
            
            params = {
                data: {
                    table: [
                    {
                        id: 1,
                        type: 2
                    },
                    {
                        id: 2
                    }
                    ]
                }
            };
            data = match.parse(params, ['data.table', {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'"
            }]);

            assert.deepEqual(data, [
                {
                    id: 1,
                    title: 'string',
                    type: 2
                },
                {
                    id: 2,
                    title: 'string',
                    type: 'abc'
                }
            ]);
        });

        it('match Array<object> with default value', function() {
            params = {
                code: 200,
                msg: 'ok',
                data: [
                {
                    id: 1,
                    type: 'a'
                },
                {
                    id: 2
                }
                ]
            };
            data = match.parse(params, {
                code: '$${{code}}',
                msg: '$${{msg}}',
                data: ['data', {
                    id: '$${{id}}',
                    title: 'string',
                    type: "$${{type}} || 'abc'"
                }]
            });
            assert.deepEqual(data, {
                code: 200,
                msg: 'ok',
                data: [
                {
                    id: 1,
                    title: 'string',
                    type: 'a' 
                },
                {
                    id: 2,
                    title: 'string',
                    type: 'abc' 
                }
                ]
            });
        });
    });

    describe('global params of helpful function in match', function() {
        let format = {
            a: function () {
                return 1;
            },
            b: function () {
                return 2;
            }
        };
        it('register global object', function() {
            match.register(format, 'format');
            params = {
                pid: 1,
                id: 2
            };
            data = match.parse(params, {
                pid: 1,
                id: function (data, format) {
                    // this 指向自身 data 指向params
                    //return data.pid + data.id + this.pid + format.b();
                    return data.pid + data.id + this.pid + format.b();
                }
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 6 
            });
        });
        it('register global Array<object>', function() {
            match.register([format], 'format');
            params = {
                pid: 1,
                id: 2
            };
            data = match.parse(params, {
                pid: 1,
                id: function (data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                }
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 6 
            });
        });

        it('update global key', function() {
            format = {
                a: function () {
                    return 11;
                },
                b: function () {
                    return 22;
                }
            };
            match.update(format, 'format');
            params = {
                pid: 1,
                id: 2
            };
            data = match.parse(params, {
                pid: 1,
                id: function (data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                }
            });
            assert.deepEqual(data, {
                pid: 1,
                id: 26
            });
        });

        it('remove global key', function() {
            match.remove('format');
            data = match.parse(params, {
                pid: 1,
                id: function (data, format) {
                    // this 指向自身 data 指向params
                    return data.pid + data.id + this.pid + format.b();
                }
            });
            assert.deepEqual(data, {
                pid: 1
            });
        });
    });

    describe('match config', function() {
        it('filter undefined', function() {
            params = {
                pid: 1,
                id: 2
            };
            data = match.parse(params, {
                id: '$${{xx}}'
            });
            assert.deepEqual(data, {
            });
        });
        it('auto complete key with same name', function() {
            params = {
                pid: 1,
                id: 2
            };
            match.config({autoComplete: true});
            data = match.parse(params, {
                id: '$${{id}}'
            });
            assert.deepEqual(data, {
                id: 2,
                pid: 1
            });
            match.config({autoComplete: false});
        });
        it('parseConfig by only current match', function() {
            params = {
                pid: 1,
                id: 2,
                cityId: 2
            };
            data = match.parseConfig(params, {
                id: '$${{ID}}',
                pid: '$${{pid}}'
            }, {
                autoComplete: true,
                filterUndefined: false
            });
            assert.deepEqual(data, {
                id: undefined,
                pid: 1,
                cityId: 2
            });
        });
        it('ignore key without match', function() {
            params = {
                pid: 1,
                id: 2,
                cityId: 2
            };
            data = match.parseConfig(params, {
                id: '$${{id}}',
                pid: '$${{pid}}'
            }, {
                ignoreTokenKey: ['id']
            });
            assert.deepEqual(data, {
                id: '$${{id}}',
                pid: 1
            });
        });
    });
    //describe('', function() {
    //    it('', function() {
    //        assert.deepEqual(data, {
    //        });
    //    });
    //});
});
