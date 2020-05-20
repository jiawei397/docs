# docker-compose小结

[[toc]]

`docker-compose`是基于`docker`的，可以组装`docker`镜像的工具，用来定义和运行由多个容器组成的应用。
可以使用 `YML` 文件来配置应用程序需要的所有服务。
使用一个命令，就可以从 `YML` 文件配置中创建并启动所有服务。

## 安装

windows各种坑，只说linux环境下[安装](https://docs.docker.com/compose/install)。

``` shell
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose

$ docker-compose --version
docker-compose version 1.25.5, build 1110ad01
```

## 配置样例

正如`docker`的配置镜像文件是`Dockerfile`，`docker-compose`的配置文件是：`docker-compose.yml`。

一个简单例子如下：
```
version: '3' # 指定的`docker-compose`对应的版本。以前用的是2，现在都改用3了。

services:
  qserver:
    build: ./dir  # 指定为构建镜像上下文路径，此处为 ./dir/Dockerfile 所构建的镜像
    restart: always # 重启策略，如果容器退出后，是否要重启，怎样重启
    image: qserver:1.0
    ports:
      - "3000:3000"
      - "3001:3001"
    volumes: # 挂载文件，冒号前是本地，后面是docker容器内文件夹
      - /home/logs:/app/logs
      - /home/config:/app/config
    depends_on: # 依赖于下一个服务
      - db  
    environment: # 设置环境变量
      - NODE_ENV=production
  db:
    image: docker.io/mongo
    restart: on-failure:5
    ports:
      - "27018:27017"
```

这里使用了2个镜像，启动了2个服务，前者依赖于后者。
比如我这里使用了`mongodb`的镜像，在前者的生产代码里，`db`的地址是这样的：`mongodb://db:27017/test`。
也就是说，`ip地址`用这里服务的名称就可以，端口号用默认的`27017`，与暴露到外界的无关。
我这里故意暴露一个`27018`，来加深印象。

## 启动

``` shell
docker-compose up

# 后台启动
docker-compose up -d

# 只启动某个服务，例如：qserver
docker-compose up qserver
```
## 停止

``` shell
docker-compose stop
```

再复杂的配置，就需要参考[官网](https://docs.docker.com/compose/)了。