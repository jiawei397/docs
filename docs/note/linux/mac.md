# mac下命令记录

## 查看端口占用情况

```shell
lsof -i tcp:3000
```

结束进程与`linux`一样：
```shell
kill -9 进程编号
```

## 从linux服务器下载文件到本地：

```shell
scp root@192.168.21.176:/home/xx.zip ./
```
