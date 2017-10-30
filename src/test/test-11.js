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
        city2: '$${{province}} || 4',
        city3: '$${{c2}} || $${{city}} || 1',
        //city4: '$${{id}} ||| 1',
    });

expect(data).to.be.eql({
    id: 123,
    city: 1,
    city2: 4,
    city3: 2,
    //city4: 1,
});
