import match from 'MATCH/match';
const expect = require('chai').expect;

// 测试tmpConfig并且链式调用
let params = {
    code: '200',
    msg: 'ok',
    http: 200,
    data: {
        cityId: '1',
        provinceId: 2,
        dis: 2
    }
};

let data = 
    match
    .tmpConfig({
        autoComplete: true,
        ignoreTokenKey: ['test']
    })
    .parse(params, {
        data: {
            city: '$${{data.cityId}}',
            province: '$${{data.provinceId}}'
        }
    });

expect(data).to.be.eql({
    code: '200',
    msg: 'ok',
    http: 200,
    data: {
        cityId: '1',
        provinceId: 2,
        dis: 2,
        city: '1',
        province: 2
    }
});

params = null;
data = match
    .tmpConfig({
        filterDefaultArray: true
    })
    .parse(params, [{
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);
expect(data).to.be.eql();

params = {
};
data = match
    .tmpConfig({
        filterDefaultArray: true
    })
    .parse(params, ['data', {
        id: '$${{id}}',
        title: 'string',
        type: "$${{type}} || 'abc'"
    }]);
expect(data).to.be.eql();

params = {
    code: 200,
    msg: 'ok',
    data: null
};
data = match
    .tmpConfig({
        filterDefaultArray: true
    })
    .parse(params, {
        code: '$${{code}}',
        msg: '$${{msg}}',
        array: '$${{array}} || []',
        data: ['data', {
            id: '$${{id}}',
            title: 'string',
            type: "$${{type}} || 'abc'"
        }]
    });

expect(data).to.be.eql({
    code: 200,
    msg: 'ok',
    array: []
});

params = {
    name: {
        id: 1
    }
};
data = match
    .tmpConfig({
        filterEmptyObject: true
        //filterDefaultObject: true
    })
    .parse(params, {
        title: '$${{abc}}',
        data: {
            id: '$${{name.id}}',
            value: {
                id: '$${{name.title}}'
            }
        },
        text: {
            title: '$${{name.abc}}'
        }
    });
expect(data).to.be.eql({
    data: {
        id: 1
    }
});

data = match
    .tmpConfig({
        filterEmptyObject: true
        //filterDefaultObject: true
    })
    .parse(params, {
        title: '$${{abc}}',
        data: {
            value: {
                id: '$${{name.title}}'
            }
        },
        text: {
            title: '$${{name.abc}}'
        }
    });
expect(data).to.be.eql(undefined);
