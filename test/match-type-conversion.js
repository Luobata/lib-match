const assert = require('assert');
const match = require('../dist/match');
let params;
let data;

it('int string float boolean', function() {
    params = {
        pid: 'false',
        xid: 'true',
        name: 1,
        id: '2',
        city: 1,
        district: '1.56',
    };
    data = match.parse(params, {
        pid: '(boolean)$${{pid}}',
        pid2: '!(boolean)$${{pid}}',
        xid: '(boolean)$${{xid}}',
        xid2: '!(boolean)$${{xid}}',
        id: '(int)$${{id}}',
        city: '(string)$${{city}}',
        dis: '(float)$${{district}}',
    });
    assert.deepEqual(data, {
        pid: false,
        pid2: true,
        xid: true,
        xid2: false,
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
