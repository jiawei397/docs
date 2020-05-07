# log4js过期日志删除问题
`nodejs`也有`log4js`这个模块。使用方法很简单。

## 简单例子

``` js
const log4js = require('log4js');

log4js.configure({
  appenders:{
    console:{//记录器1:输出到控制台
      type : 'console',
    },
    everything: {
      type: 'dateFile',
      filename: 'logs/all-the-logs.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      pattern: '.yyyy-MM-dd',
      daysToKeep: 2 //日志保留天数
    },
    "errorLog": {
      "type": "dateFile",
      "filename": `logs/error`,
      "alwaysIncludePattern": true,
      "daysToKeep": 2,
      "pattern": "yyyy-MM-dd.log",
      "encoding": "utf-8"
    },
    "error": { //过滤出错误日志
      "type": "logLevelFilter",
      "level": "error",
      "appender": "errorLog"
    }
  },
  categories: {
    everything: { appenders: [ 'everything' ], level: 'debug' },
    default: {appenders:['console', 'error'], level:'info' },//默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
  },
});

const logger = log4js.getLogger('everything'); //不传参数时使用default的配置
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
```

## 问题
在配置了`daysToKeep`后，将生成的日期修改后，发现并没有生效，程序怎么运行，都不会删除过期的文件。
网上查了半天，懵逼了。
后来在[这篇问题](https://github.com/log4js-node/log4js-node/issues/836)找到原因。

`log4js`源码中`node_modules/log4js/lib/appenders/dateFile.js`使用了`streamroller`包，删除是在它里面处理的。
对应着找到`RollingFileWriteStream.js`文件，它里面有这样一段代码：

``` js
async _shouldRoll() {
  if (this._dateChanged() || this._tooBig()) {
    debug(
      `_shouldRoll: rolling because dateChanged? ${this._dateChanged()} or tooBig? ${this._tooBig()}`
    );
    await this._roll();
  }
}

_dateChanged() {
  // return true;
  return (
    this.state.currentDate &&
    this.state.currentDate !== format(this.options.pattern, newNow())
  );
}
```

判断是否要进行`roll`操作，有两个判断条件，一个日期是否有了变化，一个是是否文件过大。
我们可以看到，`this.state.currentDate`在一开始生成时赋值，准确说是程序初始运行的日期。
后面的`format(this.options.pattern, newNow())`是对最新时间格式化，如果格式有变化，或者不是当天了，就可以进行`roll`了。

这意味着，只有程序一直运行的情况下，到了第二天才会触发清理日志的操作。

而接下来的代码，说明也不是简单地删除。
``` js
async _clean() {
  const existingFileDetails = await this._getExistingFiles();
  debug(
    `_clean: numToKeep = ${this.options.numToKeep}, existingFiles = ${existingFileDetails.length}`
  );
  debug("_clean: existing files are: ", existingFileDetails);
  if (this._tooManyFiles(existingFileDetails.length)) {
    const fileNamesToRemove = existingFileDetails
      .slice(0, existingFileDetails.length - this.options.numToKeep - 1)
      .map(f => path.format({ dir: this.fileObject.dir, base: f.filename }));
    await deleteFiles(fileNamesToRemove);
  }
}

_tooManyFiles(numFiles) {
  return this.options.numToKeep > 0 && numFiles > this.options.numToKeep;
}
```
它会比较当前存在的日志文件的个数和`this.options.numToKeep`，后者就是之前我们传递的`daysToKeep`。
只有文件数量大于日期天数时，才会触发删除。

## 总结

善用搜索，要会看源码。
