# docker安装gitlab

`gitlab`类似于`github`，可以搭建到公司的私有服务器，对代码的隐私性有保障，另外，它也提供了丰富的功能，比如进行持续集成、代码审核，非常方便。

使用`docker`安装，很简单。

## 安装

### 下载
```
sudo docker pull gitlab/gitlab-ce
```

### 运行

```
sudo docker run -p 443:443  -p 80:80 -p 22:22  --volume ~/docker/gitlab/config:/etc/gitlab --name gitlab gitlab/gitlab-ce
```

::: tip 提示
`gitlab`体量比较大，启动比较耗时，如果运行成功，没有报错，以后可以在后台运行，在`run`后面添加`-d`参数。
:::

已经运行过后，下次就可以直接用命名启动了：

```
sudo docker start gitlab
```

### 停止

```
sudo docker stop gitlab
```

## gitlab-runner

`gitlab-runner`的详细介绍与使用，参考我的[这篇文章](../cicd/gitlab)

### 下载
```
docker pull gitlab/gitlab-runner
```

### 运行
```powershell
docker run -d --name gitlab-runner --restart always -v /docker/gitlab/runner/config:/etc/gitlab-runner -v /docker/gitlab/runner/run/docker.sock:/var/run/docker.sock gitlab/gitlab-runner	  
```

> 如果需要搭建npm私有仓库，可以参考[这篇](./npm)