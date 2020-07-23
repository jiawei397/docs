# linux安装git

## 安装

直接安装
```
$ yum install git
```
或者
```
$ sudo wget https://github.com/git/git/archive/master.zip git.zip
$ unzip git.zip
$ cd git-*
$ make prefix=/usr/local all
$ sudo make prefix=/usr/local install
```

## 使用git连接github

使用`git`连接`github`时，需要将`linux`下产生的一个`ssh`公钥放到`github`上。具体步骤详见：http://blog.sina.com.cn/s/blog_6b706e15010199p1.html。主要命令有：

客户端创建SSH公钥和私钥
```
ssh-keygen -t rsa -C "xx@xx.com"
```

然后系统提示输入文件保存位置等信息，连续敲三次回车即可，生成的`SSH key`文件保存在中`~/.ssh/id_rsa.pub`文件中。

用文本编辑工具打开该文件，在`linux`下可以用`cat`命令显示`id_rsa.pub`中的内容（`cat  ~/.ssh/id_rsa.pub`），复制其内容。

接着拷贝`.ssh/id_rsa.pub`文件内的所有内容，将它粘贴到`github`帐号管理中的添加`SSH key`界面中。

注意，使用`vim`读取`git_home/.ssh/id_rsa.pub`中的公钥内容时，可能会有较多的空格和换行，复制到`github`网站上时必须删除。
所以建议使用`cat`来读取`ssh`公钥。

将`ssh`公钥成功加入`github`后，可使用命令
```
ssh -T git@github.com
```
来验证是否成功。
如果出现：`hi xxx. You've successfully authenticated, but GitHub does not provide shell access.`则说明连接成功。

## 配置用户名和密码：

当你安装`Git`后首先要做的事情是设置你的用户名称和`email`地址。这是非常重要的，因为每次Git提交都会使用该信息。它被永远的嵌入到了你的提交中：
```　　
$ git config --global user.name "your name"
$ git config --global user.email xx@xx.com
```

## 将git指令添加到bash中

`vi /etc/profile`

在最后一行加入

```
export PATH=$PATH:/usr/local/git/bin
```

让该配置文件立即生效
```
source /etc/profile
```
这个文件是所有用户都生效，也可以修改`~/.bashrc`或者`~/.bash_profile`文件，不过只对当前用户生效。