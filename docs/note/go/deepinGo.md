# deepin安装go

1. Go安装包下载

下载Go安装包 `go1.12.9.linux-amd64.tar.gz`

下载地址：
```
https://studygolang.com/dl
```

2. 解压安装Go

可以直接->右键点击该文件->提取（解压）到当前文件夹

或者终端下命令：
```
tar zxvf go1.12.9.linux-amd64.tar.gz
```

接下来将解压的文件拷贝到系统目录下，有3种常用软件安装目录，想尽快安装golang的可以忽略。

/usr : 系统软件安装目录

/usr/local : 用户软件安装目录

/opt : 大型软件安装目录

在这里安装到`/usr/local`，移动解压后生成的go文件夹到`/usr/local/`目录下：

终端下命令（移动）：`sudo mv go /usr/local`

或者命令（拷贝）：`sudo cp -r go /usr/local`

3. Go环境变量配置

接下来来到最后一步环境变量配置，也往往是容易忽略的

终端下命令：`vim ~/.bashrc` 或者 `vim ~/profile`

(`bashrc`对系统所有用户有效，`profile`对当前用户有效）

有三个变量GOPATH、PATH、GOROOT：
·GOROOT就是go的安装路径；·GOPATH就是go的工作目录；·PATH是go安装路径下的bin目录。

输入完命令后按`insert`进行输入，将以下内容粘贴到里面（随便空白处即可，建议最开始或结尾）：

```
export GOROOT="/usr/local/go"

export GOPATH="/go"

export PATH=$PATH:/usr/local/go/bin
```
输入完后，按`ESC`退出，输入`:wq`，进行保存。保存完成后，还有一步操作，就是让更改的环境变量进行生效，在终端中输入以下命令内容：

`source ~/.bashrc` 或者 `source ~/profile`

此刻，`golang`安装配置完成，可通过以下命令检测

```
go version
```


输入go version后能看到版本号就表示安装成功了

简单的