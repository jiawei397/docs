const caches = {};// 缓存所有已经请求的Promise，同一时间重复的不再请求

const getUniqueKey = config => config.url + config.method + (JSON.stringify(config.data) || '');

const getApi = () => process.env.VUE_APP_DCV_API;

const STOPAJAX_ERROR = 'Ajax has been stopped! ';
let IS_AJAX_STOP = false;
/**
 * 停止ajax
 */
const stopAjax = function () {
  IS_AJAX_STOP = true;
};

const isAjaxStopped = function () {
  return IS_AJAX_STOP;
};

// const getXhrResponseHeader = function (XMLHttpRequest, key) {
//   let value;
//   if (XMLHttpRequest.getResponseHeader) {
//     value = XMLHttpRequest.getResponseHeader(key);
//   } else if (XMLHttpRequest.headers && XMLHttpRequest.headers[key.toLowerCase()]) { // key值在headers里会被转为小写
//     value = XMLHttpRequest.headers[key.toLowerCase()];
//   }
//   return value;
// };

const showMessage = function (msg, config) {
  if (config && config.isShowAlert === false) {
    return;
  }
  if (!msg) {
    console.error(config, 'No message available');
    return;
  }
  console.error(config, msg);
};

/**
 * 取消接口请求
 * @param {AbortController} controller 取消控制器
 */
const cancel = (controller) => {
  if (controller) {
    controller.abort();
  }
};

/**
 * 取消所有接口请求
 */
const cancelAll = () => {
  Object.values(caches).forEach(({controller}) => {
    cancel(controller);
});
};


const getHeaders = (type, headers = {}) => {
  const contentType = type === 'POST' ? 'application/json; charset=utf-8' : undefined; //这个要看后台约定的格式，一般是json
  return {
    REQUEST_HEADER: 'binary-http-client-header',
    'X-Requested-With': 'XMLHttpRequest',// 后台根据这个值判断当前属于是否浏览器调用。如果不是，返回的错误信息就是html格式，那不是我们需要的
    language: getDefaultLanguage(),
    token: getToken(),
    contentType,
    ...headers
};
};

/**
 * ajax请求
 * @param {Object} config 配置
 */
const ajax = async (config) => {
  const {
    url,
    baseURL, //接着的前缀url
    headers,
    data = {},
    method = 'POST',
    credentials = 'omit',
    isFile,
    isUseOrigin,
    isOutFormat, //是否跳过系统返回格式验证
    isEncodeUrl, //get请求时是否要进行浏览器编码
...otherParams
} = config;
  let tempUrl = url;
  if (baseURL) {
    if (!url.startsWith('/') && !baseURL.endsWith('/')) {
      tempUrl = baseURL + '/' + url;
    } else {
      tempUrl = baseURL + url;
    }
  }
  let obj = data;
  if (method.toUpperCase() === 'GET') {
    obj = null;//get请求不能有body
    const exArr = [];
    for (const key in data) {
      exArr.push(key + '=' + data[key]);
    }
    if (exArr.length > 0) {
      const exUrl = isEncodeUrl ? encodeURI(encodeURI(exArr.join('&'))) : exArr.join('&'); //这里怎么加密，与后台解密方式也有关。如果不是这样的格式，就自己拼接url
      if (!tempUrl.includes('?')) {
        tempUrl += '?' + exUrl;
      } else {
        tempUrl += '&' + exUrl;
      }
    }
  } else {
    if (typeof data === 'object') {
      if (isFile) { //文件上传
        const formData = new FormData(); //构造空对象，下面用append方法赋值。
        for (const key in data) {
          formData.append(key, data[key]);//例：formData.append("file", document.getElementById('fileName').files[0]);
        }
        obj = formData;
        if (!headers || headers['Content-Type'] === undefined) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      } else {
        obj = JSON.stringify(data);
      }
    }
  }
  try {
    let response = await fetch(tempUrl, {
      headers: getHeaders(method, headers),
      body: obj,
      method,
      credentials,
      ...otherParams
  });
    if (!response.ok) {//代表网络请求失败，原因可能是token失效，这时需要跳转到登陆页
      console.error(`HTTP error, status = ${response.status}, statusText = ${response.statusText}`);
      if (response.status === 401) { //权限问题
        // showMessage('token过期！', config);
        stopAjax();
        cancelAll();
        toLogin();
      }
      return Promise.reject(response);
    }

    if (isUseOrigin) {
      return response;
    }
    //以下处理成功的结果
    const result = await response.json();
    if (isOutFormat || url.endsWith('.json')) { // isOutFormat忽略返回格式要求
      return result;
    }
    if (result && result.success) {
      return result.data === undefined ? result : result.data;
    }
    //失败
    showMessage(result.message, config);
    return Promise.reject(result);
  } catch (err) {//代表网络异常
    if (err.name === 'AbortError') {//属于主动取消的
      return Promise.reject(err);
    }
    showMessage(err, config);
  }
};

/**
 * 实现fetch的timeout 功能
 * @param {object} fecthPromise fetch
 * @param {Number} timeout 超时设置
 * @param {AbortController} controller 取消控制器
 **/
const fetch_timeout = (fecthPromise, {timeout = 2 * 60 * 1000, controller}) => {
  let tp;
  let abortPromise = new Promise((resolve, reject) => {
    tp = setTimeout(() => {
      cancel(controller);
  reject({
    code: 504,
    message: 'DCV_REQUEST_TIMEOUT'
  });
}, timeout);
});

  return Promise.race([fecthPromise, abortPromise]).then(res => {
    clearTimeout(tp);
  return res;
});
};


/**
 * 缓存请求，现一请求的拦截不再向后台发送
 * @param {Object} config
 *    example
 *    {
 * 			url: 'getDownData',
 * 			baseURL: '/test-api/', //拼接前缀
 * 			method:'POST',//参数传递方式，默认为POST
 * 			data:{"jsonIds":["aaa","bbb"],"isAs":true}, //json或字符串
 * 			isFile:false,	//为true时，代表为formData表单上传文件，此时data中要上传的文件类似以下格式：{file:document.getElementById('fileName').files[0]}
 * 		    isDownload:false, //为true时，代表是用流的方式下载，这时是创建了一个form表单
 * 		    timeout:120000,//超时时间120s
 * 		    isShowAlert:true //为false时，不再弹出提示
 * 		    isOutFormat:false,//为true时，返回结果不再强制要求success:true，即有返回值，就认为是成功的结果
 * 		    isOutStop:false, //为true时，在所有ajax接口都停止时，它可以继续请求
 * 		    credentials:'omit', //默认是omit，忽略cookie的发送；same-origin: 表示cookie只能同域发送，不能跨域发送；include: cookie既可以同域发送，也可以跨域发送
 * 		    headers:{}, //请求头
 * 		    isUseOrigin:false, //为true时，直接返回response，不再处理结果
 * 		    mode:'same-origin' //same-origin：该模式是不允许跨域的，它需要遵守同源策略，否则浏览器会返回一个error告知不能跨域；其对应的response type为basic。
 * 		                        cors: 该模式支持跨域请求，顾名思义它是以CORS的形式跨域；当然该模式也可以同域请求不需要后端额外的CORS支持；其对应的response type为cors。
 * 		                        no-cors: 该模式用于跨域请求但是服务器不带CORS响应头，也就是服务端不支持CORS；这也是fetch的特殊跨域请求方式；其对应的response type为opaque。
 * 		}
 */
const main = (config) => {
  const {isOutStop, signal, method, type} = config;
  if (!isOutStop && isAjaxStopped()) {
    return Promise.reject(STOPAJAX_ERROR);
  }
  if (method === undefined && type !== undefined) { //兼容旧ajax的写法
    config.method = type;
  }
  const isCanAbort = signal === undefined && typeof window.AbortController === 'function';//是否可以取消
  const uniqueKey = getUniqueKey(config);
  if (!caches[uniqueKey]) {
    let controller;
    if (isCanAbort) {
      controller = new AbortController();
      config.signal = controller.signal;
    }
    const promise = ajax(config).then((result) => {
      delete caches[uniqueKey];
    return result;
  }, (err) => {
      delete caches[uniqueKey];
      throw err;
    });
    caches[uniqueKey] = {
      promise: fetch_timeout(promise, {
        timeout: config.timeout,
        controller
      }),
      controller: controller
    };
  }
  return caches[uniqueKey].promise;
};

export const get = (url, data, config) => {
  config = config || {};
  if (!config.baseURL) config.baseURL = getApi();

  config.method = 'get';
  config.url = url;
  config.data = data;

  return main(config);
};

export const post = (url, data, config) => {
  config = config || {};
  if (!config.baseURL) config.baseURL = getApi();

  config.method = 'post';
  config.url = url;
  config.data = data;

  return main(config);
};

export default main;
