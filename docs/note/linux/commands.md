# linux常用命令

如果是用户和管理员必备的二进制文件，就会放在`/bin`；

如果是系统管理员必备，但是一般用户根本不会用到的二进制文件，就会放在`/sbin`；

如果不是用户必备的二进制文件，多半会放在`/usr/bin`；

如果不是系统管理员必备的工具，如网络管理命令，多半会放在`/usr/sbin`；

## 系统命令

``` shell
$ 查看磁盘还剩多少空间
df -h

$ 查看进程
ps -ef|grep java
ps -eflax|grep java

/usr/ucb/ps -axuwww |grep java

ps -ef|grep 进程类型root !qazxsw@

$ 结束进程
kill -9 进程编号

$ 查看端口占用
ss -lntpd | grep :4000

$ 文件赋权
chmod -R 777 文件名

$ 查看权限
ls -l

$ 文件夹赋权给用户
chown -R 用户名:组名 文件夹名称/
/home/gitlab-runner/builds

$ nohup 加在一个命令的最前面，表示不挂断的运行命令; & 加在一个命令的最后面，表示这个命令放在后台执行
nohup ./run.sh &

```


## 查看ip
``` shell
ip addr show
ifconfig
```

## 用户

``` shell
# 新建用户
useradd 用户名
# 创建密码
passwd 用户名	密码
# 删除用户
userdel 用户名
# 切换用户
su 用户名

# 查看所有用户的列表
cat /etc/passwd
# 查看当前活跃的用户列表
w
# 查看用户组
cat /etc/group

# 创建docker组（如果没有的话）
sudo groupadd docker

# 将当前用户加入docker组
sudo gpasswd -a ${USER} docker

cat /etc/passwd|grep -v nologin|grep -v halt|grep -v shutdown|awk -F":" '{ print $1"|"$3"|"$4 }'|more

# ubuntu设置root密码
sudo passwd
```

## 文件

### 压缩解压
``` shell
$ 压缩文件
zip -r myfile.zip ./*
# 将当前目录下的所有文件和文件夹全部压缩成myfile.zip文件,-r表示递归压缩子目录下所有文件.

$ 解压文件
unzip -d ecsm_web ecsm_web.zip
unzip -d custom front_custom_2017_04_21_09_35.zip
tar zxvf nginx-1.10.3.tar.gz -C /zzz/bbs

$ 解压
tar –xvf file.tar //解压 tar包
tar -xzvf file.tar.gz //解压tar.gz
tar -xjvf file.tar.bz2   //解压 tar.bz2
tar –xZvf file.tar.Z   //解压tar.Z
unrar e file.rar //解压rar
unzip file.zip //解压zip
jar -xvf project.war //解压war

$ 总结
1、*.tar 用 tar –xvf 解压
2、*.gz 用 gzip -d或者gunzip 解压
3、*.tar.gz和*.tgz 用 tar –xzf 解压
4、*.bz2 用 bzip2 -d或者用bunzip2 解压
5、*.tar.bz2用tar –xjf 解压
6、*.Z 用 uncompress 解压
7、*.tar.Z 用tar –xZf 解压
8、*.rar 用 unrar e解压
9、*.zip 用 unzip 解压
```

### 删除

linux删除目录很简单，很多人还是习惯用`rmdir`，不过一旦目录非空，就陷入深深的苦恼之中，现在使用`rm -rf`命令即可。

``` shell
rm -rf 目录名字
```

- -r 就是向下递归，不管有多少级目录，一并删除
- -f 就是直接强行删除，不作任何提示的意思

我们使用`nodejs`时，一般会在根目录下生成`node_modules`，如果进行代码`copy`时，这些是不必要的，这时可以在上级目录批量把它们全删掉：
``` shell
find ./ | grep node_modules
find . -type d -name "node_modules" | xargs rm -rf
```

### 重命名
linux下重命名文件或文件夹的命令`mv`既可以重命名，又可以移动文件或文件夹.

例子：将目录A重命名为B

```
mv A B
```
例子：将/a目录移动到/b下，并重命名为c
```
mv /a /b/c
```

### 复制文件夹

```
cp -Rf /home/user1/* /root/temp/
```
将 `/home/user1`目录下的所有东西拷到`/root/temp/`下而不拷贝`user1`目录本身。
即格式为：

`cp -Rf 原路径/ 目的路径/`

### 详细信息

stat指令：文件/文件系统的详细信息显示

使用格式：`stat 文件名`

stat命令主要用于显示文件或文件系统的详细信息，该命令的语法格式如下：
- -f　　不显示文件本身的信息，显示文件所在文件系统的信息
- -L　　显示符号链接
- -t　　简洁模式，只显示摘要信息


### 上传下载
在联网的情况下，执行命令即可：
``` shell
yum install -y lrzsz

$ 上传命令
rz 

$ 下载命令
sz 
```

## 安装图形化界面
``` shell
sudo  yum groupinstall "GNOME Desktop" "Graphical Administration Tools"

sudo ln -sf /lib/systemd/system/runlevel5.target /etc/systemd/system/default.target
```

## 安装wget
``` shell
yum -y install wget

wget https://nodejs.org/dist/v8.1.4/node-v8.1.4-linux-x64.tar.xz
```

## 编辑文件
``` shell
vim
sudo nano /
```

编辑模式，使用vi进入文本后，按i开始编辑文本

退出编辑模式，按ESC键，
然后退出vi
- :q!  不保存文件，强制退出vi命令
- :w   保存文件，不退出vi命令
- :wq  保存文件，退出vi命令


## 生成64位编码

``` shell
echo -n "aaa" | base64
```

## 安装ssh
``` shell
sudo apt-get install openssh-server
```
安装完毕后`ssh`默认已启动。可以使用下述命令查看是否有进程在`22`端口上监听，即是否已启动：

``` shell
netstat -nat | grep 22
```

如果连接不了，则我们需要关闭掉防火墙
``` shell
sudo ufw disable
```

## 安装一般软件

以`nodejs`为例，最终解压目录假设为：`/usr/local/nodejs`，其下有`bin`目录，再下有`node`、`npm`两个命令。要想全局拥有这个变量，可以这样：

``` shell
sudo ln -s /usr/local/nodejs/bin/node /usr/local/bin
sudo ln -s /usr/local/nodejs/bin/npm /usr/local/bin
```

也就是说，把可执行的命令文件，挂个软连接到`/usr/local/bin`目录下，这样系统查找命令就能找到了。可以这样测试：

``` shell
node -v
npm -v
```

## 用户环境变量

修改用户根目录下`~/.bashrc`，以`go`为例，在其中添加：

``` shell
export PATH="/usr/local/go/bin:$PATH"
```
添加完后，当下就生效了。

也可以在命令行中直接执行上述命令。