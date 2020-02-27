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
```

::: tip
`-c`：制定配置文件的路径

不加`-nginx`会自动加载默认路径的配置文件
:::
