# vscode调试

`vscode`的调试功能，需要在根目录下创建`.vscode`文件夹，里面新增一个配置文件`launch.json`，在需要打断点的地方打好断点，调试窗口点击配置好的任务就可以了。

## 调试script标签

增加3个标签：`runtimeExecutable`、`runtimeArgs`、`port`，其中，`runtimeArgs`后面的参数就是`script`的标签名称。

``` json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "调试script",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script",
                "serve"
            ],
            "port": 5858
        }
    ]
}
```

## 调试js文件

以根目录下`aa.js`为例：

``` json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "调试node",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "aa.js"
        }
    ]
}
```
