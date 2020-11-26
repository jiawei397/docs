# 使用verdaccio搭建私有npm仓库

公司内部，如果搭建了[`gitlab`](./gitlab)后，大概率也会有需求搭建一个私有的`npm`仓库，虽然违背了开源精神，但有时候是无法避免的。

我们可以使用[`verdaccio`](https://verdaccio.org/)来做到这一点。

如果是使用`nodejs`的话，推荐直接这样安装运行
```
npm install --global verdaccio
```

当然，使用docker安装也很方便。

## 下载

```
sudo docker pull verdaccio/verdaccio
```

也可以按标签拉取：

```
docker pull verdaccio/verdaccio:4
```

## 运行

```
sudo docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

## 使用
运行成功后，我们就能用它来注册了。

### 修改镜像
```
npm set registry http://localhost:4873/
```

::: tip 一般推荐使用nrm进行镜像管理
```
# 安装nrms
npm i -g nrm

# 增加镜像，比如加个别名为abc
nrm add abc http://localhost:4873/

# 查看所有镜像
nrm ls

# 切换镜像 
nrm use abc
```
:::

### 增加用户并登陆

```
npm adduser --registry http://localhost:4873
npm profile set password --registry http://localhost:4873
```

### 发布你的npm包

```powershell
npm publish --registry http://localhost:4873
```

如果命令行提示成功，你在`http://localhost:4873`页面就可以看到效果了。