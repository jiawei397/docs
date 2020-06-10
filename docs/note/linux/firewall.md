# 防火墙限制
在linux启动服务后，如果在外部浏览器访问不到，这时很可能是因为端口没有开启。

```
$ 将端口加入到防火墙的public区域
firewall-cmd --zone=public --add-port=27017/tcp --permanent

$ 一定要更新防火墙规则
firewall-cmd --reload

$ 查看是否开启
firewall-cmd --zone=public --list-ports

$ 禁用端口
firewall-cmd --zone=public --remove-port=27017/tcp --permanent  # 删除

$ 关闭防火墙
systemctl stop firewalld
```

参考：[CentOS7使用firewall-cmd打开关闭防火墙与端口](https://blog.csdn.net/s_p_j/article/details/80979450)