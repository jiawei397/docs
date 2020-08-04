# docker安装mongo

基本步骤

```
# 搜索
$ sudo docker search mongo

# 下载
$ sudo docker pull mongo

# 运行容器
$ sudo docker run -p 27018:27017 -v $PWD/db:/data/db -d mongo

# 使用mongo镜像执行mongo 命令连接到刚启动的容器
$ sudo docker run -it mongo:latest mongo --host 192.168.80.132 --port 27018
```