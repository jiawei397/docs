# docker中安装redis

```
# 搜索
$ docker search redis

# 下载
$ docker pull redis

# 运行容器
$ sudo docker run -p 6379:6379 -d --name redis redis:latest redis-server
```