/**
 * @desc type declare
 */
interface config {
    filterUndefined?: boolean; // 过滤undefined
    filterNull?: boolean; // 过滤null
    filterEmptyObject?: boolean; // 过滤空对象
    filterDefaultArray?: boolean; // 过滤匹配数组产生的Array 不过滤自定义的返回值 []
    filterDefaultObject?: boolean; // 过滤匹配对象产生的Object 不过滤自定的返回值 {}
    autoComplete?: boolean; // 自动补全
    ignoreTokenKey?: string[]; // 忽略解析的key
    debug?: boolean; // debug 模式
}

export declare namespace match {
    function parse(combineData: Object | any[], keyData: Object | any[]): void;
    function parseConfig(
        combineData: Object | any[],
        keyData: Object | any[],
        configTmp: config,
    ): void;
    function tmpConfig(configTmp: config): void;
    function register(obj: Object | any[], name: string): void;
    function update(obj: Object | any[], name: string): void;
    function remove(name: string): void;
    function removeAll(): void;
}
