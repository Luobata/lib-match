import match from 'MATCH/match';

var params = {
    pid: 1,
    id: 2
};
match.config({autoComplete: true});
var data = match.parse(params, {
    id: '$${{id}}'
});
console.log(data);
