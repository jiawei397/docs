# XSS攻击
## 什么是XSS攻击？

XSS攻击指的是：

通过利用网页开发时留下的漏洞，恶意攻击者往`Web`页面里插入恶意 `Script`代码，当用户浏览时，嵌入其中`Web`里面的`Script`代码会被执行，从而达到恶意攻击用户的目的。

`XSS`全称是：跨站脚本攻击（`cross site script`）。按照国际惯例，命名应该以` CSS ` 命名，但是`CSS`与大家熟知的`层叠样式表`（`Cascading Style Sheets`）重名了，因此取名为`XSS`。

## XSS攻击的危害
据近些年`OWASP`(`OWASP`是世界上最知名的Web安全与数据库安全研究组织)统计`XSS`占所有web攻击的**22%**，高居所有`web`威胁榜首。 

主要危害有：

- 通过 document.cookie 盗取 cookie中的信息
- 使用 js或 css破坏页面正常的结构与样式
- 流量劫持（通过访问某段具有 window.location.href 定位到其他页面）
- dos攻击：利用合理的客户端请求来占用过多的服务器资源，从而使合法用户无法得到服务器响应。并且通过携带过程的 cookie信息可以使服务端返回400开头的状态码，从而拒绝合理的请求服务。
- 利用 iframe、frame、XMLHttpRequest或上述 Flash等方式，以（被攻击）用户的身份执行一些管理动作，或执行一些一般的如发微博、加好友、发私信等操作，并且攻击者还可以利用 iframe，frame进一步的进行 CSRF 攻击。 
- 控制企业数据，包括读取、篡改、添加、删除企业敏感数据的能力。

## XSS攻击分类
XSS攻击大体分为两种：`反射型`XSS攻击、`存储型`XSS攻击。

1. 存储型XSS攻击
攻击者事先将恶意代码上传或储存到漏洞服务器中，只要受害者浏览包含此恶意代码的页面就会执行恶意代码。这就意味着只要访问了这个页面的访客，都有可能会执行这段恶意脚本，因此储存型XSS的危害会更大。

存储型 XSS 一般出现在网站留言、评论、博客日志等交互处，恶意脚本存储到客户端或者服务端的数据库中，存储型XSS攻击更多时候用于攻击用户，而且在工作中的防范更多是防范存储型XSS攻击。

2. 反射型XSS攻击
反射型 XSS 一般是攻击者通过特定手法（如电子邮件），诱使用户去访问一个包含恶意代码的 URL，当受害者点击这些专门设计的链接的时候，恶意代码会直接在受害者主机上的浏览器执行。

对于访问者而言是一次性的，具体表现在我们把我们的恶意脚本通过 URL 的方式传递给了服务器，而服务器则只是不加处理的把脚本“反射”回访问者的浏览器而使访问者的浏览器执行相应的脚本。

反射型 XSS 的触发有后端的参与，要避免反射性 XSS，必须需要后端的协调，后端解析前端的数据时首先做相关的字串检测和转义处理。 此类 XSS 通常出现在网站搜索栏、用户登录等地方，常用来窃取客户端 `Cookies` 或进行钓鱼欺骗。

## XSS防御
1. XSS 防御之 HTML 编码
应用范围：将不可信数据放入到 `HTML` 标签内（例如`div`、`span`等）的时候进行`HTML`编码。

编码规则：将 `& < > " ' /` 转义为实体字符（或者十进制、十六进制）。

示例代码：

``` js
function encodeForHTML(str, kwargs){     
    return ('' + str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')     // DEC=> &#60; HEX=> &#x3c; Entity=> &lt;
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')   // &apos; 不推荐，因为它不在HTML规范中
      .replace(/\//g, '&#x2F;');
  }
```
HTML 有三种编码表现方式：十进制、十六进制、命名实体。例如小于号（<）可以编码为 "十进制> <", "十六进制=> <", "命名实体=> <" 三种方式。对于单引号（'）由于实体字符编码方式不在 HTML 规范中，所以此处使用了十六进制编码。

2. XSS 防御之 HTML Attribute 编码
应用范围：将不可信数据放入 HTML 属性时（不含src、href、style 和事件处理属性），进行 HTML Attribute 编码

编码规则：除了字母数字字符以外，使用 &#xHH;(或者可用的命名实体)格式来转义 ASCII值小于256所有的字符

示例代码：
``` js
function encodeForHTMLAttibute(str, kwargs){
    let encoded = ''
    for(let i = 0; i < str.length; i++) {       
        let ch = hex = str[i]     
        if (!/[A-Za-z0-9]/.test(str[i]) && str.charCodeAt(i) < 256) {         
            hex = '&#x' + ch.charCodeAt(0).toString(16) + ';'
        }
        encoded += hex
    }
    return encoded
}
```
3. XSS 防御之 JavaScript 编码
作用范围：将不可信数据放入事件处理属性、JavaScript值时进行 JavaScript 编码

编码规则：除字母数字字符外，请使用`\xHH`格式转义`ASCII`码小于256的所有字符

示例代码：
``` js
function encodeForJavascript(str, kwargs) {     
    let encoded = '';     
    for(let i = 0; i < str.length; i++) {       
        let cc = hex = str[i];       
        if (!/[A-Za-z0-9]/.test(str[i]) && str.charCodeAt(i) < 256) {         
            hex = '\\x' + cc.charCodeAt().toString(16);
 
        }
        encoded += hex;
    }
    return encoded;   
};
```
4. XSS 防御之 URL 编码
作用范围：将不可信数据作为 URL 参数值时需要对参数进行 URL 编码

编码规则：将参数值进行 `encodeURIComponent` 编码

示例代码：

``` js
function encodeForURL(str, kwargs){     
    return encodeURIComponent(str);   
};
```
5. XSS 防御之 CSS 编码
作用范围：将不可信数据作为 CSS 时进行 CSS 编码

编码规则：除了字母数字字符以外，使用\XXXXXX格式来转义ASCII值小于256的所有字符

示例代码：
``` js
function encodeForCSS (attr, str, kwargs){     
    let encoded = '';     
    for (let i = 0; i < str.length; i++) {       
        let ch = str.charAt(i);       
        if (!ch.match(/[a-zA-Z0-9]/) {         
            let hex = str.charCodeAt(i).toString(16);         
            let pad = '000000'.substr((hex.length));         
            encoded += '\\' + pad + hex;
        } else {         
            encoded += ch;
        }     
    }
    return encoded;
}; 
```

## 总结
任何时候用户的输入都是不可信的。对于 `HTTP` 参数，理论上都要进行验证，例如某个字段是枚举类型，其就不应该出现枚举以为的值；对于不可信数据的输出要进行相应的编码。

`XSS漏洞`有时比较难发现，所幸当下`React`、`Vue`等框架都从框架层面引入了` XSS `防御机制，一定程度上解放了我们的双手。但是作为开发人员依然要了解` XSS `基本知识、于细节处避免制造` XSS `漏洞。框架是辅助，我们仍需以人为本，规范开发习惯，提高 Web 前端安全意识。

防御XSS攻击的有效方式是对输入进行过滤，有效方式如下:

- 特殊字符过滤，最好使用市面上成熟的库，不要闭门造车
- 渲染到页面前加`encode`
- `cookie`中避免重要信息，尽可能设置为`HttpOnly`
- 接口请求尽量采用`POST`
- 利用好`CSP`([Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy))

参考：
- [什么是XSS攻击？](https://blog.csdn.net/weixin_40851188/article/details/89381563)
- [前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)