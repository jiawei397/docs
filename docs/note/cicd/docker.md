# docker小结

[[toc]]

Docker是一个开源的容器引擎，它有助于更快地交付产品。

Docker可将应用程序和基础设施层隔离，并且将基础设施当作程序一样进行管理。使用Docker，可以更快地打包，测试以及部署应用程序，并可以缩短从编程到部署运行代码的周期。

## 安装

### 1. ubuntu

``` shell
wget -qO- https://get.docker.com/ | sh
```

当要以非`root`用户可以直接运行`docker`时，需要执行 `sudo usermod -aG docker runoob` 命令，然后重新登陆，否则会报错

或者安装`Docker`社区版仓库

``` shell
sudo apt-get -y install \
  apt-transport-https \
  ca-certificates \
  curl

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
       $(lsb_release -cs) \
       stable"

sudo apt-get update

#在Ubuntu上安装最新的Docker社区版
sudo apt-get -y install docker-ce

#测试你的Docker社区版是否安装成功
sudo docker run hello-world
```
### 2. 启动

``` shell
sudo service docker start
```
### 3. 测试运行`hello-world`

``` shell
docker run hello-world
```
### 4. 镜像加速

鉴于国内网络问题，后续拉取 `Docker` 镜像十分缓慢，我们可以需要配置加速器来解决，比如[网易的镜像地址](http://hub-mirror.c.163.com "网易镜像")。

新版的 `Docker` 使用 `/etc/docker/daemon.json`（`Linux`） 或者 `%programdata%\docker\config\daemon.json`（`Windows`） 来配置 `Daemon`。

请在该配置文件中加入（没有该文件的话，请先建一个）：

``` json
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```

或者注册[阿里云账户](https://cr.console.aliyun.com/#/accelerator)，可以获得自己的[加速器](https://××××××.mirror.aliyuncs.com)。

针对`Docker`客户端版本大于`1.10.0`的用户，可以通过修改`daemon`配置文件`/etc/docker/daemon.json`来使用加速器：

``` shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://6fzym3rt.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```
### 5. 普通用户加入`docker`组

   有时候，不想每次输入`sudo`，这时，我们可以将用户加入`docker`组。当然，这是不安全的，官方不推荐这样做。

``` shell
# 创建docker组（如果没有的话）
sudo groupadd docker

# 将当前用户加入docker组
sudo gpasswd -a ${USER} docker

# 重新启动docker服务
sudo service docker restart或sudo systemctl restart docker

# 当前用户退出系统重新登陆
su root
su franson

# 运行docker命令
docker ps
```
## 容器
### 1. 运行

``` shell
docker run alpine:latest /bin/echo "Hello world"
```
### 2. 运行交互式的容器
``` shell
docker run -i -t -v /test:/soft ubuntu:15.10 /bin/bash
```
各个参数解析：

```
-t:在新容器内指定一个伪终端或终端。

-i:允许你对容器内的标准输入 (STDIN) 进行交互。

-v:挂载容器，前者是宿主机中目录，后者是容器内目录，再加个`:`的话，是权限
```
### 3. 启动容器（后台模式）
```
docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
```

这时，容器在后台运行，当前输入容器不会打印`hello world`，只会返回一个`ID`号，通过它，可以使用`docker logs $ID`来查看输出内容。`docker logs -f $ID`可以让 `dokcer logs` 像使用 `tail -f` 一样来输出容器内部的标准输出。

指定`-p`标识来绑定指定端口。默认开放`5000`，映射到主机端口`32769`上。

``` shell
docker run -d -p 5000:5000 xx/1.0 node app.js
```

已经停止的：`docker start container_id`

正地运行的重启：`docker restart`

进入容器：`docker exec -it container_id /bin/bash`

特权方式：`docker run -it --privileged -v /test:/soft centos /bin/bash`

### 4. 查看容器

```
docker ps # 正在运行的

docker ps -a	# 所有的

docker ps -l	# 最后一次创建的

docker top determined_swanson # 查看进程

docker inspect determined_swanson	# 底层信息
```
### 5. 停止容器

``` shell
docker stop container_id
docker stop $(docker ps -a -q)	# 停止所有容器
```
### 6. 移除容器

``` shell
docker rm container_id
docker rm $(docker ps -a -q) # 删除所有未运行 Docker 容器
```

## 镜像
### 1. 查看镜像

``` shell
# 查看所有镜像
docker images
# 搜索服务器上可用的镜像
docker search httpd
```
### 2. 创建镜像

``` shell
# 下载
docker pull httpd
# 最小镜像
alpine
```

当我们从`docker`镜像仓库中下载的镜像不能满足我们的需求时，我们可以通过以下两种方式对镜像进行更改。

- 从已经创建的容器中更新镜像，并且提交这个镜像，详见下节`更新`
- 使用 `Dockerfile` 指令来创建一个新的镜像

```
docker build -t xx:1.0 .
```

::: tip 参数说明
-t ：指定要创建的目标镜像名

. ：`Dockerfile` 文件所在目录，可以指定`Dockerfile` 的绝对路径
:::

### 3. 更新

更新镜像之前，我们需要使用镜像来创建一个容器。

``` shell
docker run -t -i ubuntu:15.10 /bin/bash
```

在运行的容器内进行操作，输入`exit`命令来退出这个容器。此时这个容器，是按我们的需求更改的容器。我们可以通过命令 `docker commit`来提交容器副本。
``` shell
docker commit -m="has update" -a="runoob" e218edb10161 runoob/ubuntu:v2
```

::: tip 参数说明
-m：提交的描述信息

-a：指定镜像作者

e218edb10161：容器ID

runoob/ubuntu:v2：指定要创建的目标镜像名
:::

### 4. 删除

``` shell
# 删除特定镜像
docker rmi id
# 删除所有未打tag的镜像
docker rmi $(docker images -q | awk '/^<none>/ { print $3 }')
# 删除所有镜像
docker rmi $(docker images -q)
# 删除没有使用的镜像
docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")
```

### 5. 设置镜像标签

``` shell
docker tag 860c279d2fec runoob/centos:dev
```

## Dockerfile样例

``` dockerfile
# 用这个文件生成gitlab-ci需要的docker容器
# 同时需要有个jdk-8u161-linux-x64.tar.gz文件放在与它同级的目录下
# 构建镜像：docker build -t xx:1.0 .
# 创建容器：docker run -t -i xx:1.0  /bin/bash
FROM node:9

# 指定制作我们的镜像的联系人信息（镜像创建者）
MAINTAINER jw

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
ADD . /app/
# cd到app文件夹下
WORKDIR /app

#apt-get update
RUN apt-get update && apt-get install sshpass

#生成ssh的key
  RUN ssh-keygen -t rsa

#将jre包移动到 /usr/lib/jvm/目录下并解压
RUN mkdir /usr/lib/jvm \
    && mv /app/jdk-8u161-linux-x64.tar.gz /usr/lib/jvm \
    && cd /usr/lib/jvm \
    && tar -xzvf jdk-8u161-linux-x64.tar.gz

#设置路径
RUN update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jdk1.8.0_161/jre/bin/java" 1 \
      && update-alternatives --set java /usr/lib/jvm/jdk1.8.0_161/jre/bin/java

# 安装淘宝镜像
RUN npm install cnpm -g --registry=https://registry.npm.taobao.org

# 配置环境变量
ENV JAVA_HOME /usr/lib/jvm/jre
ENV HOST 0.0.0.0
ENV PORT 8000

# 容器对外暴露的端口号
EXPOSE 8000

# 容器启动时执行的命令，类似npm run start
#CMD ["npm", "start"]
```

## ssh

- 使用`sshpass`来调用外部的命令：

``` shell
sshpass -p 密码 ssh 用户名@IP -p 22 -o StrictHostKeyChecking=no 'ls /root'
```
- 远程文件同步到当前目录（.）下

``` shell
scp -r 192.168.1.140:/opt/docker-volume/php/owncloud/apps/edu_video.tar.gz .
```

- 从主机复制到容器

``` shell
docker cp host_path containerID:container_path
```

- 从容器复制到主机

``` shell
docker cp containerID:container_path host_path
```

- 生成ssh

``` shell
ssh-keygen -t rsa

scp -r /root/.ssh/id_rsa.pub 目标IP:/root/.ssh/authorized_keys
```
