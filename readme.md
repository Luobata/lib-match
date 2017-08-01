# lib-match

## 一个用于前后端完全分离的字段映射库

### 语法
1. 常规对象匹配
```
    var match = require('lib-match');

    // 映射普通字段
    var data = match.parse(params, {
        title: '$${{title}}',
        msg: 'this is string'
    });


    // 映射带有默认值
    var a = 1;
    var data = match.parse(params, {
        title: '$${{title}} || 123', // 默认值为number类型 123
        id: '$${{id}} || "123"' // 默认值为string类型 123
    });

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

    // 直接映射数组
    var data = match.parse(params, [{
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);

    // 映射 params.data
    var data = match.parse(params, ['data', {
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);

    // 映射 function
    var data = match.parse(params, {
        pid: 1,
        id: function (data) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid;
        }
    });

    // 映射枚举值
    var params = {
        type: 1
    };

    var enumConf = {
        typeOptions: [
            {
                id: 1,
                name: 'one'
            },
            {
                id: 2,
                name: 'two'
            }
        ]
    };

    var format = function (options, id, key, value) {
        let k = '';

        for (let i of options) {
            if (i[key] === id) {
                k = i[value];
            }
        }

        return k;
    };

    match.register(format, 'format');

    var data = match.parse(params, {
        typeId: '$${{type}}',
        typeName: function (data, format) {
            return format(enumConf.typeOptions, this.typeId, 'id', 'name');
        },
        typeNameAgain: (data, format) => format(enumConf.typeOptions, data.type, 'id', 'name') // es6
    });
```

2. 注册额外函数
```
    // 注册辅助函数或全局变量
    var format = {
        a: function () {
            return 1;
        },
        b: function () {
            return 2;
        }
    };
    match.register('format', format);
    var data = match.parse(params, {
        pid: 1,
        id: function (data, format) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid + format.b();
        }
    });

    // register为一个数组
    match.register([format], 'format');
    var data = match.parse(params, {
        pid: 1,
        id: function (data, format) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid + format.b();
        }
    });

    // update
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

    // remove
    match.remove('format');
    var data = match.parse(params, {
        pid: 1,
        id: function (data, format) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid + format.b();
        }
    });

```

3. 全局config配置
```
    // 默认开启过滤undefined和null
    let config = {
        filterUndefined: true, // 过滤undefined
        filterNull: true, // 过滤null
        autoComplete: false // 自动补全
    };

    // 修改默认config
    var params = {
        pid: 1,
        id: 2
    };
    match.config({autoComplete: true});
    var data = match.parse(params, {
        id: '$${{id}}'
    });
    console.log(data); // id:2 pid: 1
```
