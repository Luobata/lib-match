import match from 'MATCH/match';
const expect = require('chai').expect;

let params = {
    id: 0,
    c: 1,
    city: 2
};
let data = match
    .parse(params, {
        id: '$${{ids}} || 123',
        city: '$${{c}} || $${{city}} || 1',
        city2: '$${{province}} || 4'
    });

console.log(data);
//expect(data).to.be.eql({
//});
