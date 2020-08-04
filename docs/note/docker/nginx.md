# docker中安装nginx

```
# 搜索
$ docker search nginx

# 下载
$ docker pull nginx

# 运行容器
# 下面挂载的方式未试验成功
$ docker run -p 8089:8080 --name mynginx -v $PWD/www:/www -v $PWD/html:/usr/share/nginx/html -v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf -v $PWD/logs:/wwwlogs  -d nginx
$ docker run -p 8089:80 --name mynginx  -d nginx
```