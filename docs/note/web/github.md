# 解决github访问慢的情况

## 修改本地hosts文件

`windows`系统的`hosts`文件的位置：
`C:\Windows\System32\drivers\etc\hosts`

`mac/linux`系统的`hosts`文件的位置：
`/etc/hosts`


## 增加映射

获取`Github`相关网站的`ip`

访问`https://www.ipaddress.com`，分别输入`github.global.ssl.fastly.net`和`github.com`，查询`ip`地址

下面是我的配置

```
199.232.68.249 global-ssl.fastly.Net
140.82.114.3    github.com
```

当访问慢的时候，再手动修改吧。

当然，后续可以写个爬虫，爬下数据。

其它网站访问慢，也可以类似处理。

## github.io无法访问问题

现在无法打开 `https://*.github.io`，原因是电信运营商 `DNS` 污染（域名指往不正确的IP地址）

这次应该是运营商行为。像封某歌是国家行为。

可以通过修改 `hosts`文件 / 修改`DNS`服务器 / 代理 的方式访问。

可将 `DNS` 修改为 `114.114.114.114`，一个良心 `DNS` 服务商。

但这样修改后，可能会导致其它代理问题。