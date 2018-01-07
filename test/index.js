const assert = require('assert');
//const match  = require('../src/index');
const match = require('../dist/match');
let params;
let data;

describe('lib-match', function() {
    describe('normal match', function() {
        require('./match-normal');
    });
    describe('match with default value with || token', function() {
        require('./match-default');
    });
    describe('match with default value with ||| token', function() {
        require('./match-default-advance');
    });
    describe('match function', function() {
        require('./match-function');
    });
    describe('match Array<object>', function() {
        require('./match-array');
    });
    describe('global params of helpful function in match', function() {
        require('./match-global');
    });
    describe('match config', function() {
        require('./match-config');
    });
    describe('match multi input', function() {
        require('./match-mulit-input');
    });
    describe('match and type conversion', function() {
        require('./match-type-conversion');
    });
    describe('match with chain use', function() {
        require('./match-chain');
    });
});
