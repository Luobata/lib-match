import match from 'MATCH/match';
const expect = require('chai').expect;


// 直接匹配
var params = {
    abc: 1
};
var data = match.parse(params, {
    title: '$${{abc}}'
});
expect(data).to.be.eql({
    title: 1
});


// 匹配对象嵌套
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
expect(data).to.be.eql({
    title: 1,
    id: {
        id: 100
    }
});

// 匹配默认值
var params = {
    abcd: 1
};
var data = match.parse(params, {
    title: '$${{abc}} || 123'
});
expect(data).to.be.eql({
    title: 123
});

var data = match.parse(params, {
    title: '$${{abc}} || true'
});
expect(data).to.be.eql({
    title: true
});

var data = match.parse(params, {
    title: '$${{abc}} || false'
});
expect(data).to.be.eql({
    title: false
});

var data = match.parse(params, {
    title: '$${{abc}} || "123"'
});
expect(data).to.be.eql({
    title: '123'
});

var data = match.parse(params, {
    title: "$${{abc}} || '123'"
});
expect(data).to.be.eql({
    title: '123'
});


// 暂时没有完成的匹配
var b = 1;
var data = match.parse(params, {
    title: '$${{abc}} || {{b}}'
});
// console.log(data);


// 匹配function
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
expect(data).to.be.eql({
    pid: 1,
    id: 4
});



// 匹配对象数组
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
expect(data).to.be.eql([
    {
        id: 1,
        title: 'string',
        type: 2
    },
    {
        id: 2,
        title: 'string',
        type: 'abc' 
    }
]);

var params = {
    data: [
        {
            id: 1,
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
expect(data).to.be.eql([
    {
        id: 1,
        title: 'string',
        type: 2
    },
    {
        id: 2,
        title: 'string',
        type: 'abc' 
    }
]);

// 映射对象数组
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
var data = match.parse(params, {
    code: '$${{code}}',
    msg: '$${{msg}}',
    data: ['data', {
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]
});
expect(data).to.be.eql({
    code: 200,
    msg: 'ok',
    data: [
        {
            id: 1,
            title: 'string',
            type: 'a' 
        },
        {
            id: 2,
            title: 'string',
            type: 'abc' 
        }
    ]
});
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

// 测试register为一个对象
match.register(format, 'format');
var data = match.parse(params, {
    pid: 1,
    id: function (data, format) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid + format.b();
    }
});
expect(data).to.be.eql({
    pid: 1,
    id: 6 
});

// 测试register为一个数组
match.register([format], 'format');
var data = match.parse(params, {
    pid: 1,
    id: function (data, format) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid + format.b();
    }
});
expect(data).to.be.eql({
    pid: 1,
    id: 6
});

// 测试update
var format = {
    a: function () {
        return 11;
    },
    b: function () {
        return 22;
    }
};
match.update(format, 'format');
var data = match.parse(params, {
    pid: 1,
    id: function (data, format) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid + format.b();
    }
});
expect(data).to.be.eql({
    pid: 1,
    id: 26
});


// 移除format 抛出异常
match.remove('format');
var data = match.parse(params, {
    pid: 1,
    id: function (data, format) {
        // this 指向自身 data 指向params
        return data.pid + data.id + this.pid + format.b();
    }
});
expect(data).to.be.eql({
    pid: 1
});


// 测试过滤undefined
var data = match.parse(params, {
    id: '$${{xx}}'
});
expect(data).to.be.eql({
});
