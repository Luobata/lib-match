import config, { debugArray } from 'MATCH/config';

export default (result, combineData, keyData) => {
    if (!config.debug) return;
    if (!window.Match_Debug) {
        window.Match_Debug = debugArray;
    }
    debugArray.push({
        result,
        data: combineData,
        matchObj: keyData,
        config: Object.assign({}, config),
    });
};
