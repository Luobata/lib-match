import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    code: 200,
    msg: 'ok',
    data: [
        {
            list: [
                {
                    roomId: 1
                },
                {
                    roomId: 2
                }
            ]
        }
    ]
};

let data = match
    .tmpConfig({
        filterUndefined: false,
        filterNull: false
    })
    .parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: ['data', {
            checked: false,
            list: ['list', {
                roomId: '$${{roomId}}',
                active: false,
                empty: false
            }]
        }]
    });
expect(data).to.be.eql({
    code: 200,
    msg: 'ok',
    data: [
        {
            checked: false,
            list: [
                {
                    roomId: 1,
                    active: false,
                    empty: false
                },
                {
                    roomId: 2,
                    active: false,
                    empty: false
                }
            ]
        }
    ]
});

//params = {
//    id: 0,
//    c: 1,
//    city: 2
//};
//data = match
//    .parse(params, {
//        id: '$${{ids}} || 123',
//        city: '$${{c}} || $${{city}} || 1',
//        city2: '$${{province}} || 4'
//    });
//
//console.log(data);
//expect(data).to.be.eql({
//});
