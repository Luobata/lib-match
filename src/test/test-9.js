import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    name: {
        id: 1
    }
};
let data = match
    .tmpConfig({
        filterDefaultObject: true
    })
    .parse(params, {
        data: {
            xx: '$${{name.title}}',
            value: {
                id: '$${{name.title}}'
            },
            yy: '$${{name.title}}'
        },
        data2: {
            value2: '$${{name.title}} || {}'
        }
    });

expect(data).to.be.eql({
    data2: {
        value2: {
        }
    }
});
