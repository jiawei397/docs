# HTTP的传输编码(Transfer-Encoding:chunked)
持续连接的问题：对于非持续连接，浏览器可以通过连接是否关闭来界定请求或响应实体的边界；而对于持续连接，这种方法显然不奏效。有时，尽管我已经发送完所有数据，但浏览器并不知道这一点，它无法得知这个打开的连接上是否还会有新数据进来，只能傻傻地等了。
用Content-length解决：计算实体长度，并通过头部告诉对方。浏览器可以通过 Content-Length 的长度信息，判断出响应实体已结束
Content-length引入的新问题：由于 Content-Length 字段必须真实反映实体长度，但是对于动态生成的内容来说，在内容创建完之前，长度是不可知的。这时候要想准确获取长度，只能开一个足够大的 buffer，等内容全部生成好再计算。但这样做一方面需要更大的内存开销，另一方面也会让客户端等更久。
我们需要一个新的机制：不依赖头部的长度信息，也能知道实体的边界——分块编码（Transfer-Encoding: chunked）

2.0 的分帧传输是在TCP和HTTP之间加了一个帧的概念，帧可以乱序传输。多个帧可以同时传输，速度快（多个buffer同时传）

1.1 的chunked是分块传递，一块一块传输，顺序（块可以理解成一个buffer，一个一个传）

1.0 是字节传输，一字一字节连续传输（没有buffer）

因为1.1没有分帧的规定，所以用了Transfer-Encoding: chunked这种机制。而http2之后因为有了原生的分帧功能，所以就没有必要用Transfer-Encoding: chunked，直接发一个大的http请求出去，协议会自动分帧加快传输效率。

参考：
- [HTTP的传输编码(Transfer-Encoding:chunked)](https://www.cnblogs.com/jamesvoid/p/11297843.html)
- [HTTP2.0的奇妙日常](http://www.alloyteam.com/2015/03/http2-0-di-qi-miao-ri-chang/)