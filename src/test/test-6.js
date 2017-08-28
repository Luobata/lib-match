import match from 'MATCH/match';
const expect = require('chai').expect;

// 测试autoComplete bug
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

let data = match.parseConfig(params, {
    data: {
        city: '$${{data.cityId}}',
        province: '$${{data.provinceId}}'
    }
}, {
    autoComplete: true
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
