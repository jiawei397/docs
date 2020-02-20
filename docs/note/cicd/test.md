# 持续集成之测试篇

[[toc]]

## 单元测试（unit）

### karma
`Karma` 是`Google`开源的一个基于`Node.js` 的 `JavaScript` 测试执行过程管理工具（`Test Runner`）。该工具可用于测试所有主流`Web`浏览器，也可集成到` CI` （`Continuous integration`）工具，也可和其他代码编辑器一起使用。

我们测试用的无界面浏览器`phantomjs`。测试框架使用`mocha`和`chai`。

以下是我们项目中使用的主要配置信息：

``` js
/**
 * 测试启动的浏览器
 * 可用的浏览器：https://npmjs.org/browse/keyword/karma-launcher
 */
browsers: ['PhantomJS'],
/**
 * 测试框架
 * 可用的框架：https://npmjs.org/browse/keyword/karma-adapter
 */
frameworks: ['mocha', 'chai'],
/**
 * 需要加载到浏览器的文件列表
 */
files: [
  '../../src/plugins/jquery/jquery-1.8.1.min.js',
  '../../src/plugins/common/bluebird.min.js',
  'specs/validators.js'
],
/**
 * 排除的文件列表
 */
exclude: [
],
/**
 * 在浏览器使用之前处理匹配的文件
 * 可用的预处理: https://npmjs.org/browse/keyword/karma-preprocessor
 */
preprocessors: { //报告覆盖
  "../../src/javascripts/**/*.js": ["coverage"]
},
/**
 * 使用测试结果报告者
 * 可能的值: "dots", "progress"
 * 可用的报告者：https://npmjs.org/browse/keyword/karma-reporter
 */
reporters: ['spec', 'coverage'],
/**
 * 使用reporters为"coverage"时报告输出的类型和那目录
 */
coverageReporter: {
  type: 'html',
  dir: 'coverage/'
},
/**
 * 服务端口号
 */
port: 9876,

/**
 * 启用或禁用输出报告或者日志中的颜色
 */
colors: true,
/**
 * 日志等级
 * 可能的值：
 * config.LOG_DISABLE //不输出信息
 * config.LOG_ERROR    //只输出错误信息
 * config.LOG_WARN //只输出警告信息
 * config.LOG_INFO //输出全部信息
 * config.LOG_DEBUG //输出调试信息
 */
logLevel: config.LOG_INFO,

/**
 * 启用或禁用自动检测文件变化进行测试
 */
autoWatch: true,
/**
 * 开启或禁用持续集成模式
 * 设置为true, Karma将打开浏览器，执行测试并最后退出
 */
// singleRun: true,

/**
 * 并发级别（启动的浏览器数）
 */
concurrency: Infinity
```
在`package.json`中配置如下：

``` json
"scripts": {
  "unit": "./node_modules/.bin/karma start test/unit/karma.conf.js --single-run"
}
```
`--single-run`意思是单次执行测试，此处会覆盖上面的`singleRun`配置项。最终会在`test/unit/coverage`目录下生成测试覆盖率的html格式报告。

### mocha
`mocha`是`JavaScript`的一种单元测试框架，既可以在浏览器环境下运行，也可以在`Node.js`环境下运行。

使用`mocha`，我们就只需要专注于编写单元测试本身，然后，让`mocha`去自动运行所有的测试，并给出测试结果。

`mocha`的特点主要有：

- 既可以测试简单的`JavaScript`函数，又可以测试异步代码，因为异步是`JavaScript`的特性之一；
- 可以自动运行所有测试，也可以只运行特定的测试；
- 可以支持`before`、`after`、`beforeEach`和`afterEach`来编写初始化代码。

`describe` 表示测试套件，是一序列相关程序的测试；`it`表示单元测试(`unit test`)，也就是测试的最小单位。例：

``` js
describe("样例", function () {
  it("deep用法", function () {
    expect({a: 1}).to.deep.equal({a: 1});
    expect({a: 1}).to.not.equal({a: 1});

    expect([{a: 1}]).to.deep.include({a: 1});
    // expect([{a: 1}]).to.not.include({a: 1});
    expect([{a: 1}]).to.be.include({a: 1});
  });
});
```
`mocha`一共四个生命钩子

- `before()`：在该区块的所有测试用例之前执行

- `after()`：在该区块的所有测试用例之后执行

- `beforeEach()`：在每个单元测试前执行

- `afterEach()`：在每个单元测试后执行

利用`describe.skip`可以跳过测试，而不用注释大块代码；异步只需要在函数中增加`done`回调。例：

``` js
describe.skip('异步 beforeEach 示例', function () {
  var foo = false;

  beforeEach(function (done) {
    setTimeout(function () {
      foo = true;
      done();
    }, 50);
  });

  it('全局变量异步修改应该成功', function () {
    expect(foo).to.be.equal(true);
  });

  it('read book async', function (done) {
    book.read((err, result) => {
      expect(err).equal(null);
      expect(result).to.be.a('string');
      done();
    })
  });
});
```

### chai

`chai`是断言库，可以理解为比较函数，也就是断言函数是否和预期一致，如果一致则表示测试通过，如果不一致表示测试失败。
本身`mocha`是不包含断言库的，所以必须引入第三方断言库，目前比较受欢迎的断言库有 `should.js`、`expect.js` 、`chai`，具体的语法规则需要大家去查阅相关文档。
因为`chai`既包含`should`、`expect`和`assert`三种风格，可扩展性比较强。本质是一样的，按个人习惯选择。详见[`api`](http://chaijs.com/api/assert/ "api")

下面简单的介绍一下这是那种风格

`should`例：

``` js
let num = 4+5
num.should.equal(9);
num.should.not.equal(10);

//boolean
'ok'.should.to.be.ok;
false.should.to.not.be.ok;

//type
'test'.should.to.be.a('string');
({ foo: 'bar' }).should.to.be.an('object');
```
`expect`例：

``` js
// equal or no equal
let num = 4+5
expect(num).equal(9);
expect(num).not.equal(10);

//boolean
expect('ok').to.be.ok;
expect(false).to.not.be.ok;

//type
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
```
`assert`例：

``` js
// equal or no equal
let num = 4+5
assert.equal(num,9);

//type
assert.typeOf('test', 'string', 'test is a string');
```

## 端到端测试（e2e）

`e2e`(`end to end`)测试是指端到端测试，又叫功能测试，站在用户视角，使用各种功能、各种交互，是用户的真实使用场景的仿真。

在产品高速迭代的现在，有个自动化测试，是重构、迭代的重要保障。对`web`前端来说，主要的测试就是，表单、动画、页面跳转、`dom`渲染、`Ajax`等是否按照期望。

`e2e`测试正是保证功能的最高层测试，不关注代码实现细节，专注于代码能否实现对应的功能。对我们开发人员而言，测试的主要关注点是映射到页面的逻辑（一般是存储的变量）是否正确。

我们使用`nigthwatch`来做`e2e`测试

### nightwatch
`nightwatch`是一个使用`selenium`或者`webdriver`或者`phantomjs`的`nodejs`编写的`e2e`自动测试框架，可以很方便的写出测试用例来模仿用户的操作来自动验证功能的实现。

`nightwatch`的使用很简单，一个`nightwatch.json`或者`nightwatch.config.js`（后者优先级高）配置文件，使用`runner`会自动找同级的这两个文件来获取配置信息。也可以手动使用`--config`来制定配置文件的相对路径。

### selenium
`selenium`是一个强大浏览器测试平台，支持`firefox`、`chrome`、`edge`等浏览器的模拟测试，其原理是打开浏览器时，把自己的`JavaScript`文件嵌入网页中。然后`selenium`的网页通过`frame`嵌入目标网页。这样，就可以使用`selenium`的`JavaScript`对象来控制目标网页。

项目中`nightwatch.config.js`的主要配置如下：

``` json
{
  "src_folders": ["test/e2e/specs"],//测试代码所在文件夹
  "output_folder": "test/e2e/reports",//测试报告所在文件夹
  "globals_path": "test/e2e/global.js",//全局变量所在文件夹，可以通过browser.globals.XX来获取
  "custom_commands_path": ["node_modules/nightwatch-helpers/commands"],//自定义扩展命令
  "custom_assertions_path": ["node_modules/nightwatch-helpers/assertions"],//自定义扩展断言

  "selenium": {
    "start_process": true,
    "server_path": seleniumServer.path,//selenium的服务所在地址，一般是个jar包
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": chromedriver.path,//谷歌浏览器的drvier地址，在windows下是个exe文件
      "webdriver.firefox.profile": "",
      "webdriver.ie.driver": "",
      "webdriver.phantomjs.driver": phantomjsDriver.path
    }
  },

  "test_settings": {
    "phantomjs": {
      "desiredCapabilities": {
        "browserName": "phantomjs",
        "marionette": true,
        "acceptSslCerts": true,
        "phantomjs.binary.path": phantomjsDriver.path,
        "phantomjs.cli.args": ["--ignore-ssl-errors=false"]
      }
    },

    "chrome": {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        'chromeOptions': {
          'args': [
            // "start-fullscreen"
            // '--headless',	//开启无界面
            // '--disable-gpu'
          ]
        }
      }
    },

    "firefox": {
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },

    "ie": {
      "desiredCapabilities": {
        "browserName": "internet explorer",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    }
  }
}
```
在`package.json`中配置如下：

``` json
"scripts": {
  "e2e_ci": "node test/e2e/runner.js --env phantomjs",
  "e2e_parallel": "node test/e2e/runner.js --env phantomjs,chrome"
}
```
以上2个命令都是执行`runner.js`文件，前者配置了个环境变量`phantomjs`，这样就会在上面查找`test_settings`中的`phantomjs`；后者并发执行，同时用`phantomjs`和`chrome`浏览器进行测试。

### 测试代码
凡是在上述`src_folders`文件夹下的js文件，都会被认为是测试代码，会执行测试。要跳过测试，有几种方式：

1. `@disabled`，这样整个文件会跳过测试
2. `@tags`标签，多个文件可以标记一样的标签。可以命令行中添加`--tag manager`，这样，只会测试标签为`manager`的`js`文件，其它都会略过
3. 如果只是想跳过当前文件的某个测试方法，可以将`function`转换为字符串，比如

``` js
module.exports = {
  'step1': function (browser) {
  },

  'step2': "" + function (browser) {
  }
}
```
以下是项目中一个样例，几乎涵盖了各种操作。具体可参看[http://nightwatchjs.org/api](http://nightwatchjs.org/api "官网api")

``` js
var path = require("path");
module.exports = {
  //'@disabled': true, //不执行这个测试模块
  '@tags': ["manager"],//标签
  'test manager': function (browser) {
    const batchFile = browser.globals.batchFile;
    const url = browser.globals.managerURL;
    browser
      .url(url)
      .getCookie("token", function (result) {
        if (result) {
          // browser.deleteCookie("token");
        } else {
          this
            .waitForElementVisible('#loginCode', 50)
            .setValue('#loginCode', browser.globals.userName)
            .setValue("#loginPwd", browser.globals.password)
            .element("css selector", "#mntCode", function (res) {
              if (res.status != -1) {
                browser
                  .click("#mntCode", function () {
                    browser
                      .assert.cssProperty("#mntList", "display", "block")
                      .assert.elementPresent("#mntList li[value=aa]");
                  })
                  .pause(500)
                  .moveToElement("#mntList li[value=aa]", 0, 0, function () { //将鼠标光标移动
                    browser.click("#mntList li[value=aa]", function () {
                      browser.assert.containsText("#mntCode", "abc");
                    });
                  });
              }
            })
            .click("#fm-login-submit")
            .pause(50)
            .url(function (res) {
              if (res.value !== url) {
                //这个命令可以用来截图
                browser.saveScreenshot(browser.globals.imagePath + "login.png");
              }
            })
            .assert.urlContains(url, "判断有没有跳转成功，否则即是登陆失败");
            .execute(function (param) {
              //此处可以执行页面中的代码，且得到后面传递的参数
              try {
                return utils.data("token");
              } catch (e) {

              }
            }, ["param1"], function (res) {
              //此处可以得到上面方法返回值
            });
        }
      })
      .maximizeWindow() //窗口最大化
      .waitForElementVisible("#app", 1000)
      .pause(1000)
      .elements("css selector", ".data .clear li", function (res) {
        var nums = res.value.length - 1;
        browser.expect.element('.data_num').text.to.equal('(' + nums + ')');
        browser.pause(500);
      })
      .click(".clear .last .add_data")
      .waitForElementPresent("#dcControlFrame")
      .frame("dcControlFrame", function () { //定位到页面中的iframe，需要填写iframe的id（不需要加#）
        browser
          .waitForElementPresent("#dataCenterId")
          .saveScreenshot(browser.globals.imagePath + "dcControlFrame.png")
          .setValue("#dataCenterId", browser.globals.sceneId)
          .setValue("#dataCenterName", browser.globals.sceneName)
          .setValue("#dataCenterText", "欢迎光临")
          .setValue("#up_picture[type='file']", path.resolve(batchFile + '/color.png')) //上传图片
          .click(".group-btn .save", function () {
            browser
              .pause(1000)
              .click(".layui-layer-btn0");
          })
          .waitForElementVisible("#dataCenterMenu3", 1000)
          .pause(1500)
          //上传
          .click("#dataCenterMenu3", function () {
            browser
              .setValue("#img-3d-max-model input[type='file']", path.resolve(batchFile + '/demo.zip')) //上传文件
              .waitForElementVisible(".layui-layer-btn0", 20000, function () {
                browser
                  .click(".layui-layer-btn0");
              })
              .setValue("#img-3d-max-layout input[type='file']", path.resolve(batchFile + '/demo.js')) //上传文件
              .waitForElementVisible(".layui-layer-btn0", 5000, function () {
                browser
                  .click(".layui-layer-btn0");
              });
          })
          .pause(500)
          .saveScreenshot(browser.globals.imagePath + "frameParentBefore.png");
      })
      // .frameParent() //回到iframe的父级页面;//TODO 无界面下，frame退出有问题，所以暂时改用refresh重新刷新页面
      .refresh()
      .end();
  }
};
```
以下是XX同学的使用总结

1. 有些情况下延时（`pause`）是必须的，比如在表单操作中需要上传图片，需要等文件上传成功后再点击保存按钮
2. 接着第一条说，用`pause`就必须传入一个固定时毫秒值，数值太大浪费时间，数值太小可能未执行完毕，需要反复测试。如果可以的话，可以使用 `waitForElementVisible` 类的方法，时间设置的长些也无妨。
3. `command`方法的回调函数中的返回值会是一个对象，先把这个对象打印出来看一下格式，再使用这个对象
4. 所有的`assert`和`command`最后都有一个可选参数，自定义测试通过时命令行提示信息


## 附录
### phantomjs
`PhantomJS`是一个基于`webkit`的`JavaScript API`。它使用`QtWebKit`作为它核心浏览器的功能，使用`webkit`来编译解释执行`JavaScript`代码。任何你可以在基于`webkit`浏览器做的事情，它都能做到。它不仅是个隐形的浏览器，提供了诸如`CSS`选择器、支持`Web`标准、`DOM`操作、`JSON`、`HTML5`、`Canvas`、`SVG`等，同时也提供了处理文件`I/O`的操作，从而使你可以向操作系统读写文件等。`PhantomJS`的用处可谓非常广泛，诸如网络监测、网页截屏、无需浏览器的 `Web` 测试、页面访问自动化等。

因为`phantomjs`本身并不是一个`nodejs`库，所以我们使用的其实是`phantomjs-prebuilt`这个包，它会根据当前操作系统判断从`phantomjs`官网下载驱动包。

遗憾的是，`PhantomJS` 的核心开发者之一 `Vitaly Slobodin` 近日宣布，已辞任 `maintainer` ，不再维护项目。

`Vitaly` 发文表示，`Chrome 59` 将支持 `headless` 模式，用户最终会转向去使用它。`Chrome` 比`PhantomJS` 更快，更稳定，也不会像 `PhantomJS` 这样疯狂吃内存：

“我看不到  `PhantomJS` 的未来，作为一个单独的开发者去开发 `PhantomJS 2` 和 `2.5` ，简直就像是一个血腥的地狱。即便是最近发布的 `2.5 Beta` 版本拥有全新、亮眼的 `QtWebKit` ，但我依然无法做到真正的支持 3 个平台。我们没有得到其他力量的支持！”

随着 `Vitaly` 的退出，项目仅剩下两位核心开发者进行维护。

上面也有说到，项目并未得到资源支持，如此大型的项目，就算两人正职维护，也很艰难。

#### 缺陷

- 虽然`Phantom.js` 是`fully functional headless browser`，但是它和真正的浏览器还是有很大的差别，并不能完全模拟真实的用户操作。很多时候，我们在`Phantom.js`发现一些问题，但是调试了半天发现是`Phantom.js`自己的问题。
- 将近`2k`的`issue`，仍然需要人去修复。
- `Javascript`天生单线程的弱点，需要用异步方式来模拟多线程，随之而来的`callback`地狱，对于新手而言非常痛苦，不过随着`es6`的广泛应用，我们可以用`promise`来解决多重嵌套回调函数的问题。
- 虽然`webdriver`支持`htmlunit`与`phantomjs`，但由于没有任何界面，当我们需要进行调试或复现问题时，就非常麻烦。

### Puppeteer

`Puppeteer`是谷歌官方出品的一个通过`DevTools`协议控制`headless Chrome`的`Node`库。可以通过`Puppeteer`的提供的`api`直接控制`Chrome`模拟大部分用户操作来进行`UI Test`或者作为爬虫访问页面来收集数据。类似于`webdriver`的高级别的`api`，去帮助我们通过`DevTools`协议控制无界面`Chrome`。

在`puppteteer`之前，我们要控制`chrome headless`需要使用`chrome-remote-interface`来实现，但是它比 `Puppeteer API` 更接近低层次实现，无论是阅读还是编写都要比`puppteteer`更复杂。也没有具体的`dom`操作，尤其是我们要模拟一下`click`事件，`input`事件等，就显得力不从心了。

我们用同样2段代码来对比一下2个库的区别。

首先来看看 `chrome-remote-interface`

``` js
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const fs = require('fs');

function launchChrome(headless=true) {
  return chromeLauncher.launch({
  // port: 9222, // Uncomment to force a specific port of your choice.
   chromeFlags: [
  '--window-size=412,732',
  '--disable-gpu',
     headless ? '--headless' : ''
  ]
  });
}
(async function() {
  const chrome = await launchChrome();
  const protocol = await CDP({port: chrome.port});
  const {Page, Runtime} = protocol;
  await Promise.all([Page.enable(), Runtime.enable()]);
  Page.navigate({url: 'https://www.github.com/'});
  await Page.loadEventFired(
      console.log("start")
  );
  const {data} = await Page.captureScreenshot();
  fs.writeFileSync('example.png', Buffer.from(data, 'base64'));
  // Wait for window.onload before doing stuff.
   protocol.close();
   chrome.kill(); // Kill Chrome.
})();
```
再来看看 `puppeteer`

``` js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.github.com');
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();
```
就是这么简短明了，更接近自然语言。没有`callback`，几行代码就能搞定我们所需的一切。

再来段打印阮一峰大神的`《ECMAScript 6 入门》`的`pdf`文档的例子：

``` js
const puppeteer = require('puppeteer');
const getRootDir = require('root-directory');

(async () => {
    const rootDir = await getRootDir();
    let pdfDir = rootDir + "/public/pdf/es6-pdf/";

    const browser = await puppeteer.launch({
        headless: false,
        devtools: true //开发，在headless为true时很有用
    });
    let page = await browser.newPage();

    await page.goto('http://es6.ruanyifeng.com/#README');
    await page.waitFor(2000);

    const aTags = await page.evaluate(() => {
        let as = [...document.querySelectorAll('ol li a')];
        return as.map((a) => {
            return {
                href: a.href.trim(),
                name: a.text
            };
        });
    });

    if (!aTags) {
        browser.close();
        return;
    }

    await page.pdf({path: pdfDir + `${aTags[0].name}.pdf`});
    page.close();

    // 这里也可以使用promise all，但cpu可能吃紧，谨慎操作
    for (var i = 1; i < aTags.length; i++) {
        page = await browser.newPage();

        var a = aTags[i];

        await page.goto(a.href);

        await page.waitFor(2000);

        await page.pdf({path: pdfDir + `${a.name}.pdf`});

        console.log(a.name);

        page.close();
    }

    browser.close();
})();
```
