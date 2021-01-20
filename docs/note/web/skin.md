# 一键换肤

业务背景：只需要支持`chrome`，所以可以考虑的方案就多了。

网站换肤，一般有几种方案：
1. 打包时生成多套css代码，切换皮肤时动态加载对应的css。缺点是只能用有限几种颜色，不可能为每种颜色都生成文件。
2. 在根组件上加上主题类名，切换主题时改变类名，再通过CSS类来覆盖已有样式。缺点是代码结构复杂，工作量大，维护困难。
3. 使用`less`时，可用`less`的`modifyVars`方法在线生成新的样式。缺点是需要加载`less.js`，且在线解析会造成性能损耗。
4. `css3`提供了变量，可满足我们的需求。

用法如下：
```css
body {
  --themeColor: red;
}

div {
    color: var(--themeColor);
}
```

在`js`中修改颜色即可：
```js
document.body.style.setProperty('--themeColor', color);
```

假如项目中使用了`less`，这种方案依然生效：
```css
@primary-color: var(--themeColor);
div {
    color: @primary-color;
}
```
会被解析为：
```css
div {
    color: var(--themeColor);
}
```
可到这里看[例子](https://gitee.com/JiQingYun/react-change-skin)