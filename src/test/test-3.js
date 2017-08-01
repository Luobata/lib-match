import match from 'MATCH/match';

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

console.log(data);
