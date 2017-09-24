## Intro 介绍 
一个用于前后端完全分离的字段映射库，使得前端的数据格式定义完全脱离后端的限制，做到真正的前后端完全分离。同时可用于解决复杂字段的处理场景，致力于一次match，完全转换，让data层的处理更加有序。

- 减少代码量，一次match，解决复杂场景。
- 丰富的api，不仅支持常规对象匹配，数组对象匹配，还提供默认值，自定义function。同时可配置多样的config来实现特殊字符过滤，相同字段直接补全等功能。

ps: 配合es6语法代码真的可以很简洁。

## Scenario 使用场景 
- 相同ui，不同接口：相同的页面展示，数据来源多方。让ui兼容不同的数据格式的成本比较大，而且在模板中增加针对不同数据的兼容会降低模块的可读性，match可以使得不同的数据结构最后都能生成相同格式的数据。

- 复杂的数据层中间件，复杂的数据场景：使用match，一次转换让数据层之间的数据传递更清晰透明。

- 前后端完全分离，并且前端先于后端开发：前端在开发过程中可以自定义页面所需数据结构，待后端接口给出后，再通过match转化为对应的结构即可。（talk less, code more）

## Installation 安装 
```
npm install lib-match --save-dev
```

## Advantage 优势 
- 兼容普通对象与数组对象与数组的映射
- 支持多对一的映射（多个映射params，一个match输出）
- 支持function映射（功能强大）
- 支持映射结果带有默认值 并可区分默认值的数据类型
- 支持映射结果数据类型转换(int float string boolean Boolean)
- 支持注册全局函数
- 支持过滤、自动补全、关键词忽略的config配置

## Usage 使用方法 
[API](https://luobata.github.io/luobata-wiki/lib-match-wiki/match-parse.html)
