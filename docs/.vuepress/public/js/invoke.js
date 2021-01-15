/**
 * node和页面之间的交互通道
 */
(function (root) {
  var isInterfaceAtLocal = !uinv.isUseNode;
  console.log('isInterfaceAtLocal:' + isInterfaceAtLocal);
  var call_back_list = {};

  var _parsePathForAttribute = function (name) {
    if (typeof name === 'string') {
      if (name.indexOf('/') != -1) {
        name = name.split('/');
      } else if (name.indexOf('\\') != -1) {
        name = name.split('\\');
      } else if (name.indexOf('.') != -1) {
        name = name.split('.');
      }
    }
    if (!Array.isArray(name)) {
      return [name];
    }
    return name;
  };

  var getAttribute = function (ctx, path) {
    path = _parsePathForAttribute(path);
    var obj = root;
    if (ctx) {
      if (typeof ctx === 'string') {
        root = root[ctx];
      } else {
        obj = ctx;
      }
    }
    for (var i = 0; i < path.length; i++) {
      if (!obj) return;
      obj = obj[path[i]];
    }
    return obj;
  };

  /**
   * 为的是不改变this的作用域
   * @author jw
   * @date 2017-08-10
   */
  var getParent = function (ctx, path) {
    path = _parsePathForAttribute(path);
    var obj = ctx ? root[ctx] : root;
    if (!path || path.length === 1) return;
    for (var i = 0; i < path.length - 1; i++) {
      if (!obj) return;
      obj = obj[path[i]];
    }
    return obj;
  };

  var handleError = function (message, params) {
    message += ' , params are ' + JSON.stringify(params);
    params.errorCb(message);
    console.error(message, params);
    // throw new Error(message);
  };

  var handleCallback = function (params) {
    var uuid = params.uuid;
    var pMethod = call_back_list[uuid];
    if (uinv.isFunction(pMethod)) {
      pMethod(params.param);
    }
    delete call_back_list[uuid];
  };

  var handleInvoke = function (method, params, parent) {
    if (!uinv.isFunction(method)) {
      if (uinv.isFunction(params.returnCb)) {
        if (method !== undefined) {
          params.returnCb(method);//代表method是对象的某一属性值。
        } else if (parent && uinv.BaseObject && uinv.instanceOf(parent, uinv.BaseObject)) { //直接返回对象转字符串时，可能会堆栈溢出，所以这里将其重要字段返回，一般够页面用了
          params.returnCb(parent.getForSceneSnapshot());
        } else {
          handleError('cannot find method : ' + method, params);
        }
      }
      return;
    }
    if (params.param === undefined) {
      params.param = [];
    } else if (!Array.isArray(params.param)) {
      params.param = [params.param];
    }
    if (uinv.isFunction(params.cb_fun)) {
      params.param[params.param.length - 1] = params.cb_fun;
    } else if (uinv.isFunction(params.cb_obj)) {
      params.param[params.param.length - 1]['func'] = params.cb_obj;
    }
    if (uinv.isFunction(params.cb)) {
      params.param.push(params.cb);
    }
    try {
      var _r = method.apply(parent, params.param);
      if (uinv.isFunction(params.returnCb)) {
        if (Q.isPromise(_r)) { //jw 2017.08.21 当返回结果是promise时，要等它完成后再返回结果给页面
          _r.then(function (result) {
            params.returnCb(result);
          }, function (err) {
            handleError(err, params);
          });
        } else {
          params.returnCb(_r);
        }
      }
    } catch (ex) {
      handleError(ex.message, params);
    }
  };

  var invokeFactory = function (params) {
    var type = params.type;//path,object,widget,callback,returnCb,error
    if (type === 'path' || params.path) {
      var path = params.path;
      if (!path) {
        handleError("path can't be empty", params);
        return;
      }
      var pMethod = getAttribute(null, path);
      if (params.method) {
        pMethod = pMethod[params.method];
      }
      var parent = getParent(null, path);
      handleInvoke(pMethod, params, parent);
    } else if (type === 'object' || params.name || params.ID) {
      //此方法用来取dcv内对象，并执行对象内置方法。example:{name:"1234",method:"test",param:[]}
      // 或者用来取对象内属性值。example:{name:"1234",attr:"_NAME_"},其中attr也可以为数组["name","_NAME_"]，这时返回的是数组包装的键值对
      var name = params.name;
      var id = params.ID;
      if (!name && !id) {
        handleError("name or id can't be empty when get object", params);
        return;
      }
      var pMethod = params.method;
      var pAttr = params.attr;
      if (!uinv.factory) {
        handleError('uinv.factory is undefined', params);
        return;
      }
      if (name) {
        var pObj = uinv.factory.getObject(name);
        if (!pObj) {
          handleError("can't find object,name: " + name, params);
          return;
        }
      }
      if (id) {
        var pObj = uinv.factory.getObjectById(id);
        if (!pObj) {
          handleError("can't find object,id: " + id, params);
          return;
        }
      }

      if (pMethod && !pObj[pMethod]) {
        handleError("can't find object,method: " + pMethod, params);
        return;
      }
      if (pMethod) {
        handleInvoke(pObj[pMethod], params, pObj);
        return;
      }
      var back;
      if (pAttr) {
        back = [];
        var b = true;
        if (Array.isArray(pAttr)) {
          pAttr.map(function (attr) {
            if (!pObj[attr]) {
              b = false;
              handleError("can't find object,attr: " + attr, params);
            }
            var obj = {};
            obj[attr] = pObj[attr];
            back.push(obj);
          });
        } else {
          if (!pObj[pAttr]) {
            b = false;
            handleError("can't find object,attr: " + pAttr, params);
          } else {
            back = pObj[pAttr];
          }
        }
        if (!b) {
          return;
        }
      }
      handleInvoke(back, params, pObj);
    } else if (type == 'widget') {
      var name = params.name;
      if (!name) {
        handleError("name can't be empty when get widget", params);
        return;
      }
      if (!uinv.baseTray || !uinv.baseTray.getWidget) {
        handleError('uinv.baseTray is empty or undefined', params);
        return;
      }
      var pWidget = uinv.baseTray.getWidget(name);
      var pMethod = getAttribute(pWidget, params.method);
      handleInvoke(pMethod, params);
    } else if (type === 'callback' || type === 'returnCb') {
      handleCallback(params);
    } else if (type === 'error') {
      // console.error(params.param);
      handleCallback(params);
    } else {
      handleError('unknow invoke type: ' + params.type, params);
    }
  };

  //node 接口调用监听，监听调用请求
  var onInvokeUinvInterface = function (params, func) {
    var result = {};
    if (!uinv.isObject(params)) {
      result.type = 'error';
      result.message = 'invoke param is not an object';
      func(params);
    }
    if (params.cb_fun) {
      var uuid_fun = params.cb_fun;
      params.cb_fun = function (data) {
        result.type = 'callback';
        result.uuid = uuid_fun;
        result.param = data;
        func(result);
      };
    } else if (params.cb_obj) {
      var uuid_obj = params.cb_obj;
      params.cb_obj = function (data) {
        result.type = 'callback';
        result.uuid = uuid_obj;
        result.param = data;
        func(result);
      };
    }
    //增加错误回调
    if (params.errorCb) {
      var uuid_errorCb = params.errorCb;
      params.errorCb = function (err) {
        result.type = 'error';
        result.uuid = uuid_errorCb;
        result.param = err;
        func(result);
      };
    }
    if (params.returnCb) {
      var uuid_returncb = params.returnCb;
      params.returnCb = function (data) {
        result.type = 'returnCb';
        result.uuid = uuid_returncb;
        result.param = data;
        func(result);
      };
    }
    invokeFactory(params);
  };

  var _invoke = function (params, func) {
    if (isInterfaceAtLocal) {
      invokeFactory(params);
      return;
    }
    if (uinv.isObject(params)) {
      if (typeof params.param !== 'undefined') {
        var item, index, uuid = uinv.util.createUUID();
        if (uinv.isFunction(params.param)) {
          item = params.param;
        } else if (params.param.length > 0) {
          index = params.param.length - 1;
          item = params.param[index];
        }
        if (uinv.isFunction(item)) {
          call_back_list[uuid] = item;
          params.cb_fun = uuid;
          if (index) {
            params.param[index] = uuid;
          }
        } else if (item && uinv.isFunction(item['func'])) {
          call_back_list[uuid] = item['func'];
          params.cb_obj = uuid;
          if (index) {
            params.param[index]['func'] = uuid;
          }
        }
      }
      if (uinv.isFunction(params.returnCb)) {
        var uuidReturn = uinv.util.createUUID();
        call_back_list[uuidReturn] = params.returnCb;
        params.returnCb = uuidReturn;
      }
      if (uinv.isFunction(params.errorCb)) {
        var uuidError = uinv.util.createUUID();
        call_back_list[uuidError] = params.errorCb;
        params.errorCb = uuidError;
      }

      if (uinv.isFunction(func)) {
        func(params);
      }
    }
  };

  var invoke = function (params, func) {
    var deferred = Q.defer(); //在函数内部，新建一个Deferred对象
    //提供一种path的最快捷方式
    if (typeof params === 'string') {
      params = {
        'path': params
      };
    }

    var _returnCb = params['returnCb'];
    params['returnCb'] = function (data) {
      uinv.isFunction(_returnCb) && _returnCb(data);
      deferred.resolve(data);
    };

    var _errorCb = params['errorCb'];
    params['errorCb'] = function (err) {
      uinv.isFunction(_errorCb) && _errorCb(err);
      deferred.reject(new Error(err));
    };
    _invoke(params, func);
    return deferred.promise;
  };

  //调用browser接口，发送调用请求
  t3djs.util.setInvokeNodeCallback(function (params) {
    onInvokeUinvInterface(params, t3djs.util.invokeBrowser);
  });

  /**
   * 调用浏览器接口
   * 相当于，浏览器端接口暴露给node，发送调用请求
   */
  uinv.invokeBrowser = function (params) {
    return invoke(params, t3djs.util.invokeBrowser);
  };

  t3djs.util.setInvokeBrowserCallback(function (params) {
    onInvokeUinvInterface(params, t3djs.util.invokeNode);
  });

  /**
   * 调用uinv接口
   * 相当于，node中接口暴露给浏览器端，发送调用请求
   */
  uinv.invokeNode = function (params) {
    return invoke(params, t3djs.util.invokeNode);
  };
})(this);
