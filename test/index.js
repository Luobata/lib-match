const assert = require('assert');
//const match  = require('../src/index');
const match  = require('../dist/match');
let params;
let data;

describe('Test isNumber', function() {
    describe('normal match', function() {
        params = {
            abc: 1,
        };
        data = match.parse(params, {
            title: '$${{abc}}'
        });
        it('normal key match', function() {
            assert.deepEqual(data, {
                title: 1,
            });
        });
    });
});
