# yarn配置全局变量

1、打开的bash_profile文件进行文件编辑

```
vim ~/.bash_profile
```

2、接下来先按 i，进入编辑模式。

3、然后再把
```
export PATH="$PATH:`yarn global bin`"
```
复制到里面。

4、复制完成之后，按`ESC`，退出当前的文本编辑模式。

5、按 `:wq` 保存并退出当前`bash_profile`文件。

6、最后执行下面这行代码，意思是“是文件立即生效”

```
source ~/.bash_profile
```
这样就大功告成了。

我是以全局安装`nrm`为例。

```
yarn global add nrm
nrm ls
```

为了提高运行效率，我们可以把源切换到淘宝的镜像源上。

```
// 更换为淘宝源
yarn config set registry https://registry.npm.taobao.org
```

转自：[yarn配置全局变量](https://blog.csdn.net/CherryLee_1210/java/article/details/83015342)