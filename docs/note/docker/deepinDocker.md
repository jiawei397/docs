# deepin安装docker

一般在`Linux`中安装`docker`的时候都会使用这条命令

```
wget -qO- https://get.docker.com/ | sh
```
而在`deepin`这么做却不行

打开网址即可发现支持的`docker`支持的版本有

```
x86_64-centos-7
x86_64-fedora-28
x86_64-fedora-29
x86_64-debian-jessie
x86_64-debian-stretch
x86_64-debian-buster
x86_64-ubuntu-trusty
x86_64-ubuntu-xenial
x86_64-ubuntu-bionic
x86_64-ubuntu-cosmic
s390x-ubuntu-xenial
s390x-ubuntu-bionic
s390x-ubuntu-cosmic
ppc64le-ubuntu-xenial
ppc64le-ubuntu-bionic
ppc64le-ubuntu-cosmic
aarch64-ubuntu-xenial
aarch64-ubuntu-bionic
aarch64-ubuntu-cosmic
aarch64-debian-jessie
aarch64-debian-stretch
aarch64-debian-buster
aarch64-fedora-28
aarch64-fedora-29
aarch64-centos-7
armv6l-raspbian-jessie
armv7l-raspbian-jessie
armv6l-raspbian-stretch
armv7l-raspbian-stretch
armv7l-debian-jessie
armv7l-debian-stretch
armv7l-debian-buster
armv7l-ubuntu-trusty
armv7l-ubuntu-xenial
armv7l-ubuntu-bionic
armv7l-ubuntu-cosmic
```

这里我是使用的`deepin20`的版本，而`deepin`是基于`debian`的，可以看到`debian8.0`，即上述`x86_64-debian-jessie`进行的深度开发

`deepin`是基于`debian`的`sid`版进行的开发，不是`docker`官方认证的`stable`版本，故而没有支持

## 正确安装`docker`

下面就按照网上通用的方法来安装

1. 如果以前安装过老版本，请先卸载以前版本

```
sudo apt-get remove docker.io docker-engine
```
2. 安装docker-ce与密钥管理与下载相关依赖工具

```
sudo apt-get install apt-transport-https ca-certificates curl python-software-properties software-properties-common
```
3. 下载并安装密匙

```
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
```
如果成功则会返回OK

如果不成功（docker官方在墙外，需科学上网），则使用国内镜像源将上述命令换成
```
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/debian/gpg | sudo apt-key add -
```

4. 验证是否安装成功

sudo apt-key fingerprint 0EBFCD88


5. 添加软件源

```
sudo add-apt-repository  "deb [arch=amd64] https://download.docker.com/linux/debian jessie stable"
```
如果要翻墙的，请添加下面的源

```
sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/debian jessie stable"
```

但我的版本`deepin-20Beta-desktop-amd64`报错。

这条命令主要就是在我们的软件源列表里加一行docker的源，执行这条命令的时候会报错，我们通过lsb_release -cs命令可以看到我们的系统发行版信息，得到结果是 stable ，因为目前docker官方并没有针对stable的版本，所以我选择手动添加一下源,直接编辑 `/etc/apt/sources.list`

```
sudo vim /etc/apt/sources.list  
#文件最后添加一行 
deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/debian stretch stable 
# :qw 保存退出
```

6. 安装docker

```
sudo apt-get update
sudo apt-get install docker-ce
docker version
docker run hello-world
```

7. 配置完善docker

`docker`默认只能`root`用户启用

```
sudo usermod -aG docker username
```
用上面命令可以使`docker`普通用户也能

如果还是因为网络原因，`docker`下载镜像很慢

这里可以根据个人爱好切换加速器

编辑`/etc/docker/daemon.json`文件

``` json
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```

## 开机启动
最后提一点，`docker`在`deepin`中默认是开机启动

```
# 安装chkconfig
sudo apt-get install chkconfig
# 移除自启
sudo chkconfig --del docker
```
关闭开机自启就可以了

> 本文参考：
- [在Deepin中安装docker](https://www.cnblogs.com/wh4am1/p/10263272.html)
- [Deepin系统安装docker](https://blog.csdn.net/u011862015/article/details/105674376)