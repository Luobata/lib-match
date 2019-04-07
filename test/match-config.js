const assert = require('assert');
let params;
let data;

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
    match.config({ autoComplete: true });
    data = match.parse(params, {
        id: '$${{id}}',
    });
    assert.deepEqual(data, {
        id: 2,
        pid: 1,
    });
    match.config({ autoComplete: false });

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

    params = {
        data: {
            status: 'success',
            data: {
                total: 23801,
                page_data: [
                    {
                        advertiser_id: '3526908054',
                        is_auto_rebate: 3,
                    },
                ],
            },
        },
    };
    data = match.parseConfig(
        params.data.data,
        {
            data: [
                'page_data',
                {
                    adId: '$${{advertiser_id}}',
                },
            ],
            data2: [
                'page_data',
                {
                    adId: '$${{advertiser_id}}',
                },
            ],
        },
        {
            autoComplete: true,
        },
    );

    assert.deepEqual(data, {
        data: [
            {
                adId: '3526908054',
                advertiser_id: '3526908054',
                is_auto_rebate: 3,
            },
        ],
        data2: [
            {
                adId: '3526908054',
                advertiser_id: '3526908054',
                is_auto_rebate: 3,
            },
        ],
        page_data: [
            {
                advertiser_id: '3526908054',
                is_auto_rebate: 3,
            },
        ],
        total: 23801,
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
it('filter empty object in result', function() {
    params = {
        name: {
            id: 1,
        },
    };
    data = match
        .tmpConfig({
            filterEmptyObject: true,
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
            name: '$${{name.value}} || {}',
        });
    assert.deepEqual(data, {
        data: {
            id: 1,
        },
    });
});

it('filter default array in result(keep the array with || expression)', function() {
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
});

it('filter default object in result(keep the object with || expression)', function() {
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
});
