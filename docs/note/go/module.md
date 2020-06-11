# Golang 模块化

使用模块化，需要添加以下
```
export GO111MODULE=on 
export GOROOT=/opt/go 
export PATH=$PATH:$GOROOT/bin
```

使配置生效：

```
source /etc/profile
```

初始化一个mod环境，这里后面跟的是一个mod(modules)名称，名称可以随意。但是不能存在相同名字的。

```
go mod init goDataTest 
```

如果导入本地包，需要在import里带上模块的名字，例如：

```
import "goDataTest/api"
```