# Golang1.13.x 解决go get 无法下载问题

众所周知的原因，国内获取资源经常有问题。像nodejs一样，可以设置国内镜像。
比如使用七牛云 `go module `镜像

`golang1.13.x` 可以直接执行：

```
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```
然后再次使用 `go get` 下载 `gin` 依赖就可以了。

