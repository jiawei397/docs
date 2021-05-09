(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{359:function(_,v,t){_.exports=t.p+"assets/img/image2.d5a8774f.png"},360:function(_,v,t){_.exports=t.p+"assets/img/image3.5f0f92d5.png"},361:function(_,v,t){_.exports=t.p+"assets/img/image4.31671508.png"},362:function(_,v,t){_.exports=t.p+"assets/img/image5.c5f78d77.png"},363:function(_,v,t){_.exports=t.p+"assets/img/image6.59405981.png"},385:function(_,v,t){"use strict";t.r(v);var e=t(25),a=Object(e.a)({},(function(){var _=this,v=_.$createElement,e=_._self._c||v;return e("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[e("h1",{attrs:{id:"微前端笔记"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#微前端笔记"}},[_._v("#")]),_._v(" 微前端笔记")]),_._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[_._v("TIP")]),_._v(" "),e("p",[_._v("所谓架构，其实是解决人的问题；")]),_._v(" "),e("p",[_._v("所谓敏捷，其实是解决沟通的问题")])]),_._v(" "),e("h2",{attrs:{id:"概念"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#概念"}},[_._v("#")]),_._v(" 概念")]),_._v(" "),e("p",[e("strong",[_._v("微前端")]),_._v("借鉴"),e("strong",[_._v("微服务")]),_._v("的概念来应用在前端上，将一个巨大的前端工程拆分成一个的小工程，这些小工程具备独立的开发和运行能力，而整个系统就由这些小工程协同合作。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/95085796",target:"_blank",rel:"noopener noreferrer"}},[_._v("微前端的核心价值"),e("OutboundLink")],1),_._v("在于"),e("strong",[_._v("技术栈无关")]),_._v("，这才是它诞生的理由，或者说这才是能说服我们采用微前端方案的理由。")]),_._v(" "),e("p",[_._v("为什么呢？")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("遗留系统迁移。解决遗留系统，才是人们采用微前端方案最重要的原因。")])]),_._v(" "),e("li",[e("p",[_._v("聚合前端应用。微服务架构，可以解耦后端服务间依赖。而微前端，则关注于聚合前端应用。")])])]),_._v(" "),e("p",[_._v("微前端的前提，还是得有主体应用，然后才有微组件或微应用，解决的是"),e("strong",[_._v("可控体系下的前端协同开发问题")]),_._v("（含空间分离带来的协作和时间延续带来的升级维护）。")]),_._v(" "),e("p",[_._v("微前端的实现，意味着对前端应用的拆分。拆分应用的目的，并不只是为了架构上好看，还为了提升开发效率。")]),_._v(" "),e("p",[_._v("为此，微前端带来这么一系列的好处：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("应用自治。只需要遵循统一的接口规范或者框架，以便于系统集成到一起，相互之间是不存在依赖关系的。")])]),_._v(" "),e("li",[e("p",[_._v("单一职责。每个前端应用可以只关注于自己所需要完成的功能。")])]),_._v(" "),e("li",[e("p",[_._v("技术栈无关。你可以使用 "),e("code",[_._v("Angular")]),_._v(" 的同时，又可以使用 "),e("code",[_._v("React")]),_._v(" 和 "),e("code",[_._v("Vue")]),_._v("。")])])]),_._v(" "),e("p",[_._v("除此，它也有一系列的缺点：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("应用的拆分基础依赖于基础设施的构建，一旦大量应用依赖于同一基础设施，那么维护变成了一个挑战。")])]),_._v(" "),e("li",[e("p",[_._v("拆分的粒度越小，便意味着架构变得复杂、维护成本变高。")])]),_._v(" "),e("li",[e("p",[_._v("技术栈一旦多样化，便意味着技术栈混乱。")])])]),_._v(" "),e("h2",{attrs:{id:"架构模式"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#架构模式"}},[_._v("#")]),_._v(" 架构模式")]),_._v(" "),e("p",[_._v("微前端应用间的关系来看，分为两种："),e("strong",[_._v("基座模式")]),_._v("（管理式）、"),e("strong",[_._v("自组织式")]),_._v("。分别也对应了两者不同的架构模式：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("基座模式。通过一个主应用，来管理其它应用。设计难度小，方便实践，但是通用度低。")])]),_._v(" "),e("li",[e("p",[_._v("自组织模式。应用之间是平等的，不存在相互管理的模式。设计难度大，不方便实施，但是通用度高。")])])]),_._v(" "),e("p",[_._v("就当前而言，基座模式实施起来比较方便，方案上也是蛮多的。")]),_._v(" "),e("p",[_._v("而不论哪种方式，都需要提供一个查找应用的机制，在微前端中称为"),e("code",[_._v("服务的注册表模式")]),_._v("。")]),_._v(" "),e("p",[_._v("和微服务架构相似，不论是哪种微前端方式，也都需要有一个应用注册表的服务，它可以是一个固定值的配置文件，如"),e("code",[_._v("JSON")]),_._v("文件，又或者是一个可动态更新的配置，又或者是一种动态的服务。")]),_._v(" "),e("p",[_._v("它主要做这些内容：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("应用发现。让主应用可以寻找到其它应用。")])]),_._v(" "),e("li",[e("p",[_._v("应用注册。即提供新的微前端应用，向应用注册表注册的功能。")])]),_._v(" "),e("li",[e("p",[_._v("第三方应用注册。即让第三方应用，可以接入到系统中。")])]),_._v(" "),e("li",[e("p",[_._v("访问权限等相关配置。")])])]),_._v(" "),e("h2",{attrs:{id:"设计理念"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设计理念"}},[_._v("#")]),_._v(" 设计理念")]),_._v(" "),e("p",[_._v("在设计的过程中，需要关注的内容：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("中心化：应用注册表。这个应用注册表拥有每个应用及对应的入口。在前端领域里，入口的直接表现形式可以是路由，又或者对应的应用映射。")])]),_._v(" "),e("li",[e("p",[_._v("标识化应用。我们需要一个标识符来标识不同的应用，以便于在安装、卸载的时候，能寻找到指定的应用。一个简单的模式，就是通过康威定律来命名应用。")])]),_._v(" "),e("li",[e("p",[_._v("应用生命周期管理。")])]),_._v(" "),e("li",[e("p",[_._v("高内聚，低耦合。")])])]),_._v(" "),e("h2",{attrs:{id:"生命周期"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#生命周期"}},[_._v("#")]),_._v(" 生命周期")]),_._v(" "),e("p",[_._v("前端微架构与后端微架构的最大不同之处，也在于此——"),e("strong",[_._v("生命周期")]),_._v("。微前端应用作为一个客户端应用，每个应用都拥有自己的生命周期：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("Load，决定加载哪个应用，并绑定生命周期")])]),_._v(" "),e("li",[e("p",[_._v("bootstrap，获取静态资源")])]),_._v(" "),e("li",[e("p",[_._v("Mount，安装应用，如创建 DOM 节点")])]),_._v(" "),e("li",[e("p",[_._v("Unload，删除应用的生命周期")])]),_._v(" "),e("li",[e("p",[_._v("Unmount，卸载应用，如删除 DOM 节点、取消事件绑定")])])]),_._v(" "),e("p",[_._v("这部分的内容，事实上，也就是微前端的一个难点所在，如何以合适的方式来加载应用——\n毕竟每个前端框架都各自不同，其加载方式也是不同的。当我们决定支持多个框架的时候，便需要在这一部分进入更细致的研究。")]),_._v(" "),e("h2",{attrs:{id:"方案"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#方案"}},[_._v("#")]),_._v(" 方案")]),_._v(" "),e("p",[_._v("从技术实践上，微前端架构可以采用以下的几种方式进行：")]),_._v(" "),e("h3",{attrs:{id:"路由分发式"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#路由分发式"}},[_._v("#")]),_._v(" 路由分发式")]),_._v(" "),e("p",[_._v("通过 HTTP 服务器的反向代理功能，来将请求路由到对应的应用上。")]),_._v(" "),e("p",[e("img",{attrs:{src:t(359),alt:"路由分发式"}})]),_._v(" "),e("p",[_._v("其实就是普通页面跳转，使用路由重定向而已。")]),_._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[_._v("缺点")]),_._v(" "),e("p",[_._v("不同app之间切换，会重新加载页面。")])]),_._v(" "),e("h3",{attrs:{id:"前端微服务化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前端微服务化"}},[_._v("#")]),_._v(" 前端微服务化")]),_._v(" "),e("p",[_._v("在不同的框架之上设计通讯、加载机制，以在一个页面内加载对应的应用。比如 "),e("code",[_._v("Mooa")]),_._v(" 、 "),e("code",[_._v("Single-SPA")]),_._v("。")]),_._v(" "),e("p",[_._v("前端微服务化，是微服务架构在前端的实施，每个前端应用都是完全独立（技术栈、开发、部署、构建独立）、自主运行的，最后通过模块化的方式组合出完整的前端应用。")]),_._v(" "),e("p",[_._v("其架构如下图所示：")]),_._v(" "),e("p",[e("img",{attrs:{src:t(360),alt:"前端微服务化"}})]),_._v(" "),e("p",[_._v("采用这种方式意味着，一个页面上同时存在2个及以上的前端应用在运行。而路由分发式方案，则是一个页面只有唯一一个应用。")]),_._v(" "),e("h3",{attrs:{id:"微应用"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#微应用"}},[_._v("#")]),_._v(" 微应用")]),_._v(" "),e("p",[_._v("通过软件工程的方式，在部署构建环境中，组合多个独立应用成一个单体应用。")]),_._v(" "),e("p",[_._v("微应用化，即在开发时，应用都是以单一、微小应用的形式存在，而在运行时，则通过构建系统合并这些应用，组合成一个新的应用。")]),_._v(" "),e("p",[_._v("其架构如下图所示：")]),_._v(" "),e("p",[e("img",{attrs:{src:t(361),alt:"微应用"}})]),_._v(" "),e("p",[e("strong",[_._v("微应用化")]),_._v("更多的是以软件工程的方式，来完成前端应用的开发，因此又可以称之为"),e("strong",[_._v("组合式集成")]),_._v("。")]),_._v(" "),e("p",[_._v("对于一个大型的前端应用来说，采用的架构方式，往往会是通过业务作为主目录，而后在业务目录中放置相关的组件，同时拥有一些通用的共享模板。")]),_._v(" "),e("h3",{attrs:{id:"微件化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#微件化"}},[_._v("#")]),_._v(" 微件化")]),_._v(" "),e("p",[_._v("开发一个新的构建系统，将部分业务功能构建成一个独立的 chunk 代码，使用时只需要远程加载即可。")]),_._v(" "),e("p",[_._v("微件（widget），指的是一段可以直接嵌入在应用上运行的代码，它由开发人员预先编译好，在加载时不需要再做任何修改或者编译。")]),_._v(" "),e("p",[_._v("而微前端下的微件化则指的是，每个业务团队编写自己的业务代码，并将编译好的代码部署（上传或者放置）到指定的服务器上。\n在运行时，我们只需要加载相应的业务模块即可。\n对应的，在更新代码的时候，我们只需要更新对应的模块即可。")]),_._v(" "),e("p",[_._v("下图便是微件化的架构示意图：")]),_._v(" "),e("p",[e("img",{attrs:{src:t(362),alt:"微件化"}})]),_._v(" "),e("p",[_._v("在非单页面应用时代，要实现微件化方案，是一件特别容易的事。\n从远程加载来对应的 "),e("code",[_._v("JavaScript")]),_._v(" 代码，在浏览器上执行，生成对应的组件嵌入到页面的相应部分。")]),_._v(" "),e("p",[_._v("对于业务组件也是类似的，提前编写好业务组件，当需要对应的组件时再响应、执行。")]),_._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[_._v("TIP")]),_._v(" "),e("p",[_._v("我们做的业务分离，正是如此。")])]),_._v(" "),e("h3",{attrs:{id:"前端容器化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前端容器化"}},[_._v("#")]),_._v(" 前端容器化")]),_._v(" "),e("p",[_._v("通过将"),e("code",[_._v("iframe")]),_._v("作为容器，来容纳其它前端应用。这大概是最容易想到的一种方案。")]),_._v(" "),e("p",[_._v("如果不考虑体验问题，"),e("code",[_._v("iframe")]),_._v("几乎是最完美的微前端解决方案了。")]),_._v(" "),e("p",[e("code",[_._v("iframe")]),_._v(" 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。但最大问题也在于它的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。")]),_._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[_._v("缺点")]),_._v(" "),e("ol",[e("li",[e("code",[_._v("url")]),_._v(" 不同步。浏览器刷新，"),e("code",[_._v("iframe url")]),_._v(" 状态丢失、后退前进按钮无法使用。")]),_._v(" "),e("li",[e("code",[_._v("UI")]),_._v(" 不同步，"),e("code",[_._v("DOM")]),_._v(" 结构不共享。想象一下屏幕右下角 1/4 的 "),e("code",[_._v("iframe")]),_._v(" 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 "),e("code",[_._v("resize")]),_._v(" 时自动居中。")]),_._v(" "),e("li",[_._v("全局上下文完全隔离，内存变量不共享。"),e("code",[_._v("iframe")]),_._v(" 内外系统的通信、数据同步等需求，主应用的"),e("code",[_._v("cookie")]),_._v("要透传到根域名都不同的子应用中实现免登陆效果。")]),_._v(" "),e("li",[_._v("慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。")])])]),_._v(" "),e("h3",{attrs:{id:"应用组件化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#应用组件化"}},[_._v("#")]),_._v(" 应用组件化")]),_._v(" "),e("p",[_._v("借助于"),e("a",{attrs:{href:"../web/webComponents"}},[_._v("Web Components")]),_._v(" 技术，来构建跨框架的前端应用。")]),_._v(" "),e("p",[e("code",[_._v("Web Components")]),_._v(" 是一套不同的技术，允许开发者创建可重用的定制元素（它们的功能封装在代码之外），并且在 "),e("code",[_._v("Web")]),_._v(" 应用中使用它们。")]),_._v(" "),e("p",[e("img",{attrs:{src:t(363),alt:"应用组件化"}})]),_._v(" "),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[_._v("缺点")]),_._v(" "),e("p",[_._v("目前困扰 "),e("code",[_._v("Web Components")]),_._v(" 技术推广的主要因素，在于浏览器的支持程度。在 "),e("code",[_._v("Chrome")]),_._v(" 和 "),e("code",[_._v("Opera")]),_._v(" 浏览器上，对于 "),e("code",[_._v("Web Components")]),_._v(" 支持良好，而对于 "),e("code",[_._v("Safari")]),_._v("、"),e("code",[_._v("IE")]),_._v("、"),e("code",[_._v("Firefox")]),_._v(" 浏览器的支持程度，并没有那么理想。")])]),_._v(" "),e("p",[_._v("以上方案各有优劣，在真正工作中，考虑实际情况，做出做优选择。")]),_._v(" "),e("h2",{attrs:{id:"参考"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[_._v("#")]),_._v(" 参考")]),_._v(" "),e("ul",[e("li",[e("p",[e("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/95085796",target:"_blank",rel:"noopener noreferrer"}},[_._v("微前端的核心价值"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://yq.aliyun.com/articles/715922",target:"_blank",rel:"noopener noreferrer"}},[_._v("可能是你见过最完善的微前端解决方案"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://alili.tech/archive/ea599f7c/",target:"_blank",rel:"noopener noreferrer"}},[_._v("前端微服务化解决方案"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://www.jianshu.com/p/1f409df7de45",target:"_blank",rel:"noopener noreferrer"}},[_._v("「微前端」- 将微服务理念扩展到前端开发"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://segmentfault.com/a/1190000021872481",target:"_blank",rel:"noopener noreferrer"}},[_._v("Vue + qiankun 快速实现前端微服务"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://www.yuque.com/kuitos/gky7yw/gesexv",target:"_blank",rel:"noopener noreferrer"}},[_._v("Why Not Iframe"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://tech.meituan.com/2018/09/06/fe-tiny-spa.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("用微前端的方式搭建类单页应用"),e("OutboundLink")],1)])]),_._v(" "),e("li",[e("p",[e("a",{attrs:{href:"https://blog.csdn.net/csdnnews/article/details/94930460",target:"_blank",rel:"noopener noreferrer"}},[_._v("微前端如何落地"),e("OutboundLink")],1)])])])])}),[],!1,null,null,null);v.default=a.exports}}]);