import match from './index';

var params = {
    abc: 1
};
var data = match.parse(params, {
    title: '$${{abc}}'
});
console.log(data);

var params = {
    abc: 1,
    name: {
        id: 100
    }
};
var data = match.parse(params, {
    title: '$${{abc}}',
    id: {
        id: '$${{name.id}}'
    }
});
console.log(data);

var params = {
    abcd: 1
};
var data = match.parse(params, {
    title: '$${{abc}} || 123'
});
console.log(data);
var data = match.parse(params, {
    title: '$${{abc}} || true'
});
console.log(data);
var data = match.parse(params, {
    title: '$${{abc}} || false'
});
console.log(data);
var data = match.parse(params, {
    title: '$${{abc}} || "123"'
});
console.log(data);
var data = match.parse(params, {
    title: "$${{abc}} || '123'"
});
console.log(data);

var b = 1;
var data = match.parse(params, {
    title: '$${{abc}} || {{b}}'
});
console.log(data);

var params = {
    pid: 1,
    id: 2
};

var data = match.parse(params, {
    pid: 1,
    id: function (data) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid;
    }
});

console.log(data);


var params = [
    {
        id: 1,
        type: 2
    },
    {
        id: 2
    }
];
var data = match.parse(params, [{
    id: '$${{id}}',
    title: 'string',
    type: "$${{type}} || 'abc'"
}]);
console.log(data);

var params = {
    data: [
        {
            id: 2,
            type: 2
        },
        {
            id: 2
        }
    ]
};
var data = match.parse(params, ['data', {
    id: '$${{id}}',
    title: 'string',
    type: "$${{type}} || 'abc'"
}]);
console.log(data);
var params = {
    code: 200,
    msg: 'ok',
    data: [
        {
            id: 1,
            type: 'a'
        },
        {
            id: 2
        }
    ]
};
// 映射对象数组
var data = match.parse(params, {
    code: '$${{code}}',
    msg: '$${{msg}}',
    data: ['data', {
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]
});
console.log(data);
// 注册辅助函数或全局变量
var params = {
    pid: 1,
    id: 2
};
var format = {
    a: function () {
        return 1;
    },
    b: function () {
        return 2;
    }
};
match.register(format);
var data = match.parse(params, {
    pid: 1,
    id: function (data, format) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid + format.b();
    }
});
console.log(data);
