# lib-match

## 一个用于前后端完全分离的字段映射库

### 语法
1. 常规对象匹配
```
    // 映射普通字段
    var data = match(params, {
        title: '$${{title}}',
        msg: 'this is string'
    });


    // 映射带有默认值
    var a = 1;
    var data = match(params, {
        title: '$${{title}} || 123', // 默认值为123
        id: '$${{id}} || {{a}}' // 默认值为变量a的值
    });

    // 映射对象数组
    var data = match(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        data: ['$${{data}}', {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'"
        }]
    });

    // 直接映射数组
    var data = match(params, [{
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);

    // 映射 params.data
    var data = match(params, ['data', {
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);

    // 映射 function
    var data = match(params, {
        pid: 1,
        id: function (data) {
            // this 指向自身 data 指向params
            return data.pid + data.id + this.pid;
        }
    });

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
    var data = match(params, {
        pid: 1,
        id: function (params, data, format) {
            // this 指向params data 指向返回值对象 params 指向输入的params对象
            return this.pid + this.id + data.pid + format.b();
        }
    });

```

