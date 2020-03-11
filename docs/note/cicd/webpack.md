# webpack配置 TODO

## loader

`loader`是`webpack`的核心概念之一，它的基本工作流是将一个文件以字符串的形式读入，对其进行语法分析及转换（或者直接在`loader`中引入现成的编译工具，例如`sass-loader`中就引入了`node-sass`将`SCSS`代码转换为`CSS`代码，再交由`css-loader`处理），然后交由下一环节进行处理。

所有载入的模块最终都会经过`moduleFactory`处理，转成`javascript`可以识别和运行的代码，从而完成模块的集成。

::: tip 单一职责
`loader`支持链式调用，所以开发上需要严格遵循`单一职责`原则，即每个`loader`只负责自己需要负责的事情：

将输入信息进行处理，并输出为下一个`loader`可识别的格式。
:::
