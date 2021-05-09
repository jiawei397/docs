(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{425:function(s,t,a){"use strict";a.r(t);var e=a(25),n=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"es6代码不再打包为es5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#es6代码不再打包为es5"}},[s._v("#")]),s._v(" es6代码不再打包为es5")]),s._v(" "),a("p",[s._v("最近，因为业务需要，终于摆脱了"),a("code",[s._v("IE")]),s._v("，彻底投入"),a("code",[s._v("chrome")]),s._v("怀抱，不用再考虑各种兼容性问题。")]),s._v(" "),a("h2",{attrs:{id:"vue改造"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vue改造"}},[s._v("#")]),s._v(" vue改造")]),s._v(" "),a("p",[s._v("主项目使用的"),a("code",[s._v("vue")]),s._v("，痛苦的是代码中的"),a("code",[s._v("async/await")]),s._v("被编译后，堆栈复杂难追，太对不起"),a("code",[s._v("chrome")]),s._v("对"),a("code",[s._v("es6")]),s._v("的支持了。\n碎碎念了一段时间，这两天终于有时间看了下。其实挺简单，把"),a("code",[s._v("babel")]),s._v("配置的"),a("code",[s._v("presets")]),s._v("去掉就好了，之后是"),a("code",[s._v("plugins")]),s._v("缺什么补什么。")]),s._v(" "),a("p",[s._v("这是我项目中例子：")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// presets: [")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     '@vue/app',")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// ],")]),s._v("\n    plugins"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'@babel/plugin-proposal-optional-chaining'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'@babel/plugin-proposal-class-properties'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'@babel/plugin-syntax-dynamic-import'")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),a("p",[s._v("另一种方案，修改根目录下的"),a("code",[s._v(".browserslistrc")]),s._v("文件：")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("last 2 Chrome versions\n")])])]),a("p",[s._v("这种更稳妥一些。")]),s._v(" "),a("h2",{attrs:{id:"rollup改造"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#rollup改造"}},[s._v("#")]),s._v(" rollup改造")]),s._v(" "),a("p",[s._v("还有个老项目，直接用"),a("code",[s._v("rollup")]),s._v("打包的，也是一样修改（它的"),a("code",[s._v("presets")]),s._v("用的是"),a("code",[s._v("@babel/preset-env")]),s._v("）。\n但有个问题，开发时还好，发布时因为要压缩，我使用的是"),a("code",[s._v("rollup-plugin-uglify")]),s._v("。这个插件不支持压缩"),a("code",[s._v("es6")]),s._v("。\n试了下"),a("code",[s._v("webpack")]),s._v("，它可以，我甚至想要用它把"),a("code",[s._v("rollup")]),s._v("替换掉了。\n看了下"),a("code",[s._v("rollup-plugin-uglify")]),s._v("的源码，它底层调用的是"),a("code",[s._v("uglify-js")]),s._v("来压缩，修改为"),a("code",[s._v("uglify-es")]),s._v("就可以了。\n想着发布个插件吧，没想到看到人家说明文档里面这句：")]),s._v(" "),a("blockquote",[a("p",[a("em",[s._v("Note: uglify-js is able to transpile only es5 syntax. If you want to transpile es6+ syntax use "),a("a",{attrs:{href:"https://github.com/TrySound/rollup-plugin-terser",target:"_blank",rel:"noopener noreferrer"}},[s._v("terser"),a("OutboundLink")],1),s._v(" instead")])])]),s._v(" "),a("p",[s._v("改用"),a("code",[s._v("rollup-plugin-terser")]),s._v("就可以了。\n大写的尴尬！以后还是要多看README。")]),s._v(" "),a("h2",{attrs:{id:"gulp改造"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gulp改造"}},[s._v("#")]),s._v(" gulp改造")]),s._v(" "),a("p",[a("code",[s._v("gulp")]),s._v("也类似，这次学乖了，先看的文档。\n我用的是插件是："),a("code",[s._v("gulp-uglify")]),s._v("。原来是这样写的：")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" uglify "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'gulp-uglify'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("...")]),s._v("\n")])])]),a("p",[s._v("api里有个例子：")]),s._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" uglifyEs  "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'uglify-es'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" composer "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'gulp-uglify/composer'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" uglify "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("composer")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("uglifyEs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("...")]),s._v("\n")])])]),a("p",[s._v("当然，在"),a("code",[s._v("npm")]),s._v("上发现还有个插件叫："),a("code",[s._v("gulp-terser")]),s._v("。\n又叫"),a("code",[s._v("terser")]),s._v("！\n早该想到的！")])])}),[],!1,null,null,null);t.default=n.exports}}]);