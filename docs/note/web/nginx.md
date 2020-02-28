# nginx相关

## 常用命令

### windows环境

到`nginx`的安装目录下，即`nginx.exe`所在的目录执行：
``` shell
# 启动
start nginx    //启动

# 停止
nginx -s stop    // 停止nginx

# 重启
nginx -s reload   // 重新加载配置文件并重起
```

### linux环境

``` shell
# 启动命令
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

# 停止
/usr/local/nginx/sbin/nginx -s  stop

# 重启
/usr/local/nginx/sbin/nginx -s  reload

# 查看进程命令
ps -ef | grep nginx

# 关闭进程
kill -HUP Nginx主进程号
```

::: tip
`-c`：制定配置文件的路径

不加`-nginx`会自动加载默认路径的配置文件
:::

## root与alias

### alias

```
location /img/ {
  alias /var/www/image/;
}
```
若按照上述配置的话，则访问`/img/`目录里面的文件时，`ningx`会自动去`/var/www/image/`目录找文件

### root
```
location /img/ {
  root /var/www/image;
}
```
若按照这种配置的话，则访问`/img/`目录下的文件时，`nginx`会去`/var/www/image/img/`目录下找文件。

::: tip
`alias`是一个目录别名的定义，`root`则是最上层目录的定义。

还有一个重要的区别是`alias`后面必须要用`/`结束，否则会找不到文件的。而`root`则可有可无
:::

## 常用例子

### 主配置

<<< @/docs/.vuepress/public/conf/nginx.conf

### 子配置

<<< @/docs/.vuepress/public/conf/nginx-fl.conf
