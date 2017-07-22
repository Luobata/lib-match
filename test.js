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

var b = 1;
var data = match(params, {
    title: '$${{abc}} || {{b}}'
});

var params = {
    pid: 1,
    id: 2
};

var data = match(params, {
    pid: 1,
    id: function (data) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid;
    }
});

console.log(data);
