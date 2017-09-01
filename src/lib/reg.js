/**
 * 正则match可以匹配上第一个缓存
 */
export const hasReg = (
    token: Any
) => {
    return (token && token.length && token.length >= 1);
};
