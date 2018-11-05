import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    data: [
        {
            id: 1,
            type: 2,
            c: 1,
        },
        {
            id: 2,
        },
    ],
    title: '234',
};
let data = match.parseConfig(
    params,
    {
        data: [
            'data',
            {
                id: '$${{id}}',
                title: 'string',
                type: "$${{type}} || 'abc'",
            },
        ],
    },
    {
        autoComplete: true,
    },
);

console.log(data);
data = match.parseConfig(
    params.data,
    [
        {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'",
        },
    ],
    {
        autoComplete: true,
    },
);
console.log(data);

params.data = {
    status: 'success',
    data: {
        total: 23801,
        page_data: [
            {
                super_group_id: '1600044646254605',
                apply_time: '1533209695',
                name: '\u5934\u6761\u5f00\u53d1',
                advertiser_id: '3526908054',
                modify_time: '1533209695',
                is_auto_rebate: 3,
            },
        ],
    },
};
data = match.parseConfig(
    params.data.data,
    {
        page_data: [
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

console.log(data);

// 此时应该补全data 但是没有 是个bug
data = match.parseConfig(
    params.data.data,
    {
        data: [
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

console.log(data);
