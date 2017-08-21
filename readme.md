# lib-match
一个用于前后端完全分离的字段映射库，使得前端的数据格式定义完全脱离后端的限制，做到真正的前后端完全分离。同时可用于解决复杂字段的处理场景，致力于一次match，完全转换，让data层的处理更加有序。

优势：
1. 减少代码量，一次match，解决复杂场景。
2. 丰富的api，不仅支持常规对象匹配，数组对象匹配，还提供默认值，自定义function。同时可配置多样的config来实现特殊字符过滤，相同字段直接补全等功能。

ps: 配合es6语法代码真的可以很简洁。

### 使用场景 usage scenario
1. 相同ui，不同接口：多出现于审核后台，经常针对相同的页面展示，数据来源可能是多方，这种情况后端你的接口大多是已经固定的，所以后端往往不愿意因为ui来改变他的数据结构。然而对于ui模块来说，让ui模块去兼容不同的数据格式的成本比较大，而且在模板中增加针对不同数据的兼容会降低模块的可读性，所以在前端数据层统一接口格式就体现出必要性，使得不同的数据结构最后都能生成相同格式的数据。

2. 复杂的数据层中间件，复杂的数据场景中，数据格式可能在模块传递或者框架传递中，被包装了好多层，每一层包装可能都是一段复杂的代码，较差的可读性与不规范性，比如:
```
    var params = {
    };
    params.a = 1;
    params.b = 2;
    params.c = 3;

    // 一些其他的业务代码

    params.d = 4;
```
不规范的定义 可能使得最后传递的对象是各个小情况拼凑起来的，而lib-match就是为了避免这种情况而诞生的，丰富的api使得只需要一次转换，即可生成最后的数据，让数据传递的过程变得更加清晰。

3. 前后端完全分离，并且前端先于后端开发的情况，这种情况，通常前后端之间会用wiki沟通，但是鉴于后端同学写的wiki可读性往往较差，并且wiki的滞后性较严重，在前端页面建构交互快速推进的今天，前端的开发速度总是快于后端。所以我主张前端开发的时候在遵循以下基本的数据结构之上，可以自定义页面所需数据结构，待后端接口给出后，再通过一段转换脚本转化为对应的结构即可。（尤其对于我这样不擅长交流的程序猿，能通过几行代码搞定的事情，坚决不多说一句话）

### 安装 Installation
```
npm install lib-match --save
```

### 使用方法 Usage
1. 常规对象匹配
```
    const match = require('lib-match');

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
