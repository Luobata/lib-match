import match from 'MATCH/match';
const expect = require('chai').expect;


// 测试复杂的枚举赋值
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
    typeNameAgain: (data, format) => format(enumConf.typeOptions, data.type, 'id', 'name')
});

expect(data).to.be.eql({
    typeId: 1,
    typeName: 'one',
    typeNameAgain: 'one'
});
