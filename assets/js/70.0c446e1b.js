(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{435:function(a,e,t){"use strict";t.r(e);var c=t(25),s=Object(c.a)({},(function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"使用patch-package修改node-js依赖包内容"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#使用patch-package修改node-js依赖包内容"}},[a._v("#")]),a._v(" 使用patch-package修改Node.js依赖包内容")]),a._v(" "),t("p",[a._v("最近工作中有遇到需要修改"),t("code",[a._v("node_modules")]),a._v("中开源包的情况。\n如果改动比较大，"),t("code",[a._v("fork")]),a._v("下来修改，再修改名称，重新发布下，这样比较合适。")]),a._v(" "),t("p",[a._v("但如果只是修改一两行代码，而源包也比较大的情况，就有点儿浪费了。")]),a._v(" "),t("p",[a._v("网上查了下，可以使用"),t("code",[a._v("patch-package")]),a._v("来管理依赖包，打补丁。")]),a._v(" "),t("h2",{attrs:{id:"安装patch-package"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装patch-package"}},[a._v("#")]),a._v(" 安装patch-package")]),a._v(" "),t("p",[a._v("通过"),t("code",[a._v("npm")]),a._v("进行安装")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("npm i patch-package --save-dev\n")])])]),t("p",[a._v("或者通过"),t("code",[a._v("yarn")]),a._v("进行安装")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("yarn add --dev patch-package\n")])])]),t("h2",{attrs:{id:"创建补丁"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#创建补丁"}},[a._v("#")]),a._v(" 创建补丁")]),a._v(" "),t("p",[a._v("在修改依赖包内容后，就可以运行"),t("code",[a._v("patch-package")]),a._v("创建"),t("code",[a._v("patch")]),a._v("文件了。")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("$ npx patch-package package-name   # 使用npm\n$ yarn patch-package package-name  # 使用yarn\n")])])]),t("p",[a._v("运行后通常会在项目根目录下的"),t("code",[a._v("patches")]),a._v("目录中创建一个名为"),t("code",[a._v("package-name+version.patch")]),a._v("的文件。将该"),t("code",[a._v("patch")]),a._v("文件提交至版本控制中，即可在之后应用该补丁了。")]),a._v(" "),t("p",[a._v("以我修改的"),t("code",[a._v("verdaccio")]),a._v("为例，会生成一个"),t("code",[a._v("verdaccio+4.4.0.patch")]),a._v("的文件，内容大致如下：")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v('diff --git a/node_modules/verdaccio/build/index.js b/node_modules/verdaccio/build/index.js\nindex 3a79eaa..d00974b 100644\n--- a/node_modules/verdaccio/build/index.js\n+++ b/node_modules/verdaccio/build/index.js\n@@ -5,6 +5,8 @@ Object.defineProperty(exports, "__esModule", {\n });\n exports.default = void 0;\n \n+console.log(\'---------------\')\n+\n var _bootstrap = require("./lib/bootstrap");\n')])])]),t("h2",{attrs:{id:"部署"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#部署"}},[a._v("#")]),a._v(" 部署")]),a._v(" "),t("p",[a._v("完成上述操作后，最后还需要修改"),t("code",[a._v("package.json")]),a._v("的内容，在"),t("code",[a._v("scripts")]),a._v("中加入"),t("code",[a._v('"postinstall": "patch-package"')]),a._v("。")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v('"scripts": {\n  "postinstall": "patch-package"\n}\n')])])]),t("p",[a._v("后续运行"),t("code",[a._v("npm install")]),a._v("或是"),t("code",[a._v("yarn install")]),a._v("命令时，便会自动为依赖包打上我们的补丁了。")])])}),[],!1,null,null,null);e.default=s.exports}}]);