import match from './src/index';

var params = {
    abc: 1
};
var data = match(params, {
    title: '$${{abc}}'
});
console.log(data);
var params = {
    abcd: 1
};
var data = match(params, {
    title: '$${{abc}} || 123'
});
console.log(data);
