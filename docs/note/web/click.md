# button click

需要测试一个功能，就写了个简单页面，发现click没反应。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script>
        function click() {
            alert(1)
        }
    </script>
</head>
<body>

<button onclick="click()">click</button>

</body>
</html>
```

找原因，原来是这个function名称与dom内置的click重名了，所以不能用，改个名就好了。

基础知识还是不够过关啊。