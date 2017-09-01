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
