const assert = require('assert');
const match = require('../dist/match');
let params;
let data;
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
            return format(enumConf.typeOptions, this.typeId, 'id', 'name');
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
