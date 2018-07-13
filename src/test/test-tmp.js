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
};
let data = match.parseConfig(
    params,
    [
        'data',
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
