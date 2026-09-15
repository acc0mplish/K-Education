function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production = {};
var hasRequiredReactJsxRuntime_production;
function requireReactJsxRuntime_production() {
  if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
  hasRequiredReactJsxRuntime_production = 1;
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config)
        "key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey
    };
  }
  reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_production.jsx = jsxProd;
  reactJsxRuntime_production.jsxs = jsxProd;
  return reactJsxRuntime_production;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var react = { exports: {} };
var react_production = {};
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production) return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ReactNoopUpdateQueue = {
    isMounted: function() {
      return false;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, assign = Object.assign, emptyObject = {};
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  Component.prototype.setState = function(partialState, callback) {
    if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var ReactSharedInternals = { H: null, A: null, T: null, S: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      array = String(children);
      throw Error(
        "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function(moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 1, payload._result = moduleObject;
        },
        function(error) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 2, payload._result = error;
        }
      );
      -1 === payload._status && (payload._status = 0, payload._result = ctor);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  }, Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return children;
    }
  };
  react_production.Activity = REACT_ACTIVITY_TYPE;
  react_production.Children = Children;
  react_production.Component = Component;
  react_production.Fragment = REACT_FRAGMENT_TYPE;
  react_production.Profiler = REACT_PROFILER_TYPE;
  react_production.PureComponent = PureComponent;
  react_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_production.Suspense = REACT_SUSPENSE_TYPE;
  react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
      return ReactSharedInternals.H.useMemoCache(size);
    }
  };
  react_production.cache = function(fn) {
    return function() {
      return fn.apply(null, arguments);
    };
  };
  react_production.cacheSignal = function() {
    return null;
  };
  react_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error(
        "The argument must be a React element, but you passed " + element + "."
      );
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_production.createContext = function(defaultValue) {
    defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue
    };
    return defaultValue;
  };
  react_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_production.createRef = function() {
    return { current: null };
  };
  react_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_production.isValidElement = isValidElement;
  react_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_production.startTransition = function(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
    } catch (error) {
      reportGlobalError(error);
    } finally {
      null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  };
  react_production.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
  };
  react_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_production.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  };
  react_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_production.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
  };
  react_production.useDebugValue = function() {
  };
  react_production.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  };
  react_production.useEffect = function(create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
  };
  react_production.useEffectEvent = function(callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
  };
  react_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_production.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  };
  react_production.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  };
  react_production.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  };
  react_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_production.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  };
  react_production.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  };
  react_production.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  };
  react_production.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
  };
  react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
    );
  };
  react_production.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
  };
  react_production.version = "19.2.7";
  return react_production;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production();
  }
  return react.exports;
}
var reactExports = requireReact();
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var client = { exports: {} };
var reactDomClient_production = {};
var scheduler = { exports: {} };
var scheduler_production = {};
var hasRequiredScheduler_production;
function requireScheduler_production() {
  if (hasRequiredScheduler_production) return scheduler_production;
  hasRequiredScheduler_production = 1;
  (function(exports) {
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      a: for (; 0 < index; ) {
        var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
        if (0 < compare(parent, node))
          heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        else break a;
      }
    }
    function peek(heap) {
      return 0 === heap.length ? null : heap[0];
    }
    function pop(heap) {
      if (0 === heap.length) return null;
      var first = heap[0], last = heap.pop();
      if (last !== first) {
        heap[0] = last;
        a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
          var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
          if (0 > compare(left, last))
            rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
          else if (rightIndex < length && 0 > compare(right, last))
            heap[index] = right, heap[rightIndex] = last, index = rightIndex;
          else break a;
        }
      }
      return first;
    }
    function compare(a, b) {
      var diff = a.sortIndex - b.sortIndex;
      return 0 !== diff ? diff : a.id - b.id;
    }
    exports.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date, initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }
    var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
    function advanceTimers(currentTime) {
      for (var timer = peek(timerQueue); null !== timer; ) {
        if (null === timer.callback) pop(timerQueue);
        else if (timer.startTime <= currentTime)
          pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else break;
        timer = peek(timerQueue);
      }
    }
    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);
      if (!isHostCallbackScheduled)
        if (null !== peek(taskQueue))
          isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
        else {
          var firstTimer = peek(timerQueue);
          null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
    var isMessageLoopRunning = false, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
    function shouldYieldToHost() {
      return needsPaint ? true : exports.unstable_now() - startTime < frameInterval ? false : true;
    }
    function performWorkUntilDeadline() {
      needsPaint = false;
      if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = true;
        try {
          a: {
            isHostCallbackScheduled = false;
            isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
            isPerformingWork = true;
            var previousPriorityLevel = currentPriorityLevel;
            try {
              b: {
                advanceTimers(currentTime);
                for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                  var callback = currentTask.callback;
                  if ("function" === typeof callback) {
                    currentTask.callback = null;
                    currentPriorityLevel = currentTask.priorityLevel;
                    var continuationCallback = callback(
                      currentTask.expirationTime <= currentTime
                    );
                    currentTime = exports.unstable_now();
                    if ("function" === typeof continuationCallback) {
                      currentTask.callback = continuationCallback;
                      advanceTimers(currentTime);
                      hasMoreWork = true;
                      break b;
                    }
                    currentTask === peek(taskQueue) && pop(taskQueue);
                    advanceTimers(currentTime);
                  } else pop(taskQueue);
                  currentTask = peek(taskQueue);
                }
                if (null !== currentTask) hasMoreWork = true;
                else {
                  var firstTimer = peek(timerQueue);
                  null !== firstTimer && requestHostTimeout(
                    handleTimeout,
                    firstTimer.startTime - currentTime
                  );
                  hasMoreWork = false;
                }
              }
              break a;
            } finally {
              currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
            }
            hasMoreWork = void 0;
          }
        } finally {
          hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
        }
      }
    }
    var schedulePerformWorkUntilDeadline;
    if ("function" === typeof localSetImmediate)
      schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    else if ("undefined" !== typeof MessageChannel) {
      var channel = new MessageChannel(), port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;
      schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    };
    exports.unstable_forceFrameRate = function(fps) {
      0 > fps || 125 < fps ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    };
    exports.unstable_next = function(eventHandler) {
      switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
          var priorityLevel = 3;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_requestPaint = function() {
      needsPaint = true;
    };
    exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          priorityLevel = 3;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
      switch (priorityLevel) {
        case 1:
          var timeout = -1;
          break;
        case 2:
          timeout = 250;
          break;
        case 5:
          timeout = 1073741823;
          break;
        case 4:
          timeout = 1e4;
          break;
        default:
          timeout = 5e3;
      }
      timeout = options + timeout;
      priorityLevel = {
        id: taskIdCounter++,
        callback,
        priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
      };
      options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
      return priorityLevel;
    };
    exports.unstable_shouldYield = shouldYieldToHost;
    exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    };
  })(scheduler_production);
  return scheduler_production;
}
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler) return scheduler.exports;
  hasRequiredScheduler = 1;
  {
    scheduler.exports = requireScheduler_production();
  }
  return scheduler.exports;
}
var reactDom = { exports: {} };
var reactDom_production = {};
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React2 = requireReact();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: null == key ? null : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_production.createPortal = function(children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  };
  reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  };
  reactDom_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(
        href,
        "string" === typeof options.precedence ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  };
  reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  };
  reactDom_production.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
  };
  reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  };
  reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  };
  reactDom_production.version = "19.2.7";
  return reactDom_production;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production();
  }
  return reactDom.exports;
}
var hasRequiredReactDomClient_production;
function requireReactDomClient_production() {
  if (hasRequiredReactDomClient_production) return reactDomClient_production;
  hasRequiredReactDomClient_production = 1;
  var Scheduler = requireScheduler(), React2 = requireReact(), ReactDOM = requireReactDom();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function isValidContainer(node) {
    return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
  }
  function getNearestMountedFiber(fiber) {
    var node = fiber, nearestMounted = fiber;
    if (fiber.alternate) for (; node.return; ) node = node.return;
    else {
      fiber = node;
      do
        node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
      while (fiber);
    }
    return 3 === node.tag ? nearestMounted : null;
  }
  function getSuspenseInstanceFromFiber(fiber) {
    if (13 === fiber.tag) {
      var suspenseState = fiber.memoizedState;
      null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
      if (null !== suspenseState) return suspenseState.dehydrated;
    }
    return null;
  }
  function getActivityInstanceFromFiber(fiber) {
    if (31 === fiber.tag) {
      var activityState = fiber.memoizedState;
      null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
      if (null !== activityState) return activityState.dehydrated;
    }
    return null;
  }
  function assertIsMounted(fiber) {
    if (getNearestMountedFiber(fiber) !== fiber)
      throw Error(formatProdErrorMessage(188));
  }
  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
      alternate = getNearestMountedFiber(fiber);
      if (null === alternate) throw Error(formatProdErrorMessage(188));
      return alternate !== fiber ? null : fiber;
    }
    for (var a = fiber, b = alternate; ; ) {
      var parentA = a.return;
      if (null === parentA) break;
      var parentB = parentA.alternate;
      if (null === parentB) {
        b = parentA.return;
        if (null !== b) {
          a = b;
          continue;
        }
        break;
      }
      if (parentA.child === parentB.child) {
        for (parentB = parentA.child; parentB; ) {
          if (parentB === a) return assertIsMounted(parentA), fiber;
          if (parentB === b) return assertIsMounted(parentA), alternate;
          parentB = parentB.sibling;
        }
        throw Error(formatProdErrorMessage(188));
      }
      if (a.return !== b.return) a = parentA, b = parentB;
      else {
        for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
          if (child$0 === a) {
            didFindChild = true;
            a = parentA;
            b = parentB;
            break;
          }
          if (child$0 === b) {
            didFindChild = true;
            b = parentA;
            a = parentB;
            break;
          }
          child$0 = child$0.sibling;
        }
        if (!didFindChild) {
          for (child$0 = parentB.child; child$0; ) {
            if (child$0 === a) {
              didFindChild = true;
              a = parentB;
              b = parentA;
              break;
            }
            if (child$0 === b) {
              didFindChild = true;
              b = parentB;
              a = parentA;
              break;
            }
            child$0 = child$0.sibling;
          }
          if (!didFindChild) throw Error(formatProdErrorMessage(189));
        }
      }
      if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
    }
    if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
    return a.stateNode.current === a ? fiber : alternate;
  }
  function findCurrentHostFiberImpl(node) {
    var tag = node.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
    for (node = node.child; null !== node; ) {
      tag = findCurrentHostFiberImpl(node);
      if (null !== tag) return tag;
      node = node.sibling;
    }
    return null;
  }
  var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
  var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
  var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
          return type;
        case REACT_MEMO_TYPE:
          return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x) {
          }
      }
    return null;
  }
  var isArrayImpl = Array.isArray, ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, valueStack = [], index = -1;
  function createCursor(defaultValue) {
    return { current: defaultValue };
  }
  function pop(cursor) {
    0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
  }
  function push(cursor, value) {
    index++;
    valueStack[index] = cursor.current;
    cursor.current = value;
  }
  var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
  function pushHostContainer(fiber, nextRootInstance) {
    push(rootInstanceStackCursor, nextRootInstance);
    push(contextFiberStackCursor, fiber);
    push(contextStackCursor, null);
    switch (nextRootInstance.nodeType) {
      case 9:
      case 11:
        fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
        break;
      default:
        if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
          nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
        else
          switch (fiber) {
            case "svg":
              fiber = 1;
              break;
            case "math":
              fiber = 2;
              break;
            default:
              fiber = 0;
          }
    }
    pop(contextStackCursor);
    push(contextStackCursor, fiber);
  }
  function popHostContainer() {
    pop(contextStackCursor);
    pop(contextFiberStackCursor);
    pop(rootInstanceStackCursor);
  }
  function pushHostContext(fiber) {
    null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
    var context = contextStackCursor.current;
    var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
    context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
  }
  function popHostContext(fiber) {
    contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
    hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
  }
  var prefix, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix)
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return "\n" + prefix + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function() {
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  var control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$1) {
                  control = x$1;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$2) {
                control = x$2;
              }
              (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
              });
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        }
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name"
      );
      namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
        for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
          RunInRootFrame++;
        for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
          "DetermineComponentFrameRoot"
        ); )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
            namePropDescriptor--;
        for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
  }
  function describeFiber(fiber, childFiber) {
    switch (fiber.tag) {
      case 26:
      case 27:
      case 5:
        return describeBuiltInComponentFrame(fiber.type);
      case 16:
        return describeBuiltInComponentFrame("Lazy");
      case 13:
        return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
      case 19:
        return describeBuiltInComponentFrame("SuspenseList");
      case 0:
      case 15:
        return describeNativeComponentFrame(fiber.type, false);
      case 11:
        return describeNativeComponentFrame(fiber.type.render, false);
      case 1:
        return describeNativeComponentFrame(fiber.type, true);
      case 31:
        return describeBuiltInComponentFrame("Activity");
      default:
        return "";
    }
  }
  function getStackByFiberInDevAndProd(workInProgress2) {
    try {
      var info = "", previous = null;
      do
        info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
      while (workInProgress2);
      return info;
    } catch (x) {
      return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
  function setIsStrictModeForDevtools(newIsStrictMode) {
    "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
    if (injectedHook && "function" === typeof injectedHook.setStrictMode)
      try {
        injectedHook.setStrictMode(rendererID, newIsStrictMode);
      } catch (err) {
      }
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
  function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
  }
  var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
  function getHighestPriorityLanes(lanes) {
    var pendingSyncLanes = lanes & 42;
    if (0 !== pendingSyncLanes) return pendingSyncLanes;
    switch (lanes & -lanes) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return lanes & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return lanes & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return lanes & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return lanes;
    }
  }
  function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
    var pendingLanes = root2.pendingLanes;
    if (0 === pendingLanes) return 0;
    var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
    root2 = root2.warmLanes;
    var nonIdlePendingLanes = pendingLanes & 134217727;
    0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
    return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
  }
  function checkIfRootIsPrerendering(root2, renderLanes2) {
    return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
  }
  function computeExpirationTime(lane, currentTime) {
    switch (lane) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return currentTime + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return currentTime + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function claimNextRetryLane() {
    var lane = nextRetryLane;
    nextRetryLane <<= 1;
    0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
    return lane;
  }
  function createLaneMap(initial) {
    for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
    return laneMap;
  }
  function markRootUpdated$1(root2, updateLane) {
    root2.pendingLanes |= updateLane;
    268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
  }
  function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
    var previouslyPendingLanes = root2.pendingLanes;
    root2.pendingLanes = remainingLanes;
    root2.suspendedLanes = 0;
    root2.pingedLanes = 0;
    root2.warmLanes = 0;
    root2.expiredLanes &= remainingLanes;
    root2.entangledLanes &= remainingLanes;
    root2.errorRecoveryDisabledLanes &= remainingLanes;
    root2.shellSuspendCounter = 0;
    var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
    for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
      var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
      entanglements[index$7] = 0;
      expirationTimes[index$7] = -1;
      var hiddenUpdatesForLane = hiddenUpdates[index$7];
      if (null !== hiddenUpdatesForLane)
        for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
          var update = hiddenUpdatesForLane[index$7];
          null !== update && (update.lane &= -536870913);
        }
      remainingLanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
    0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
  }
  function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
    root2.pendingLanes |= spawnedLane;
    root2.suspendedLanes &= ~spawnedLane;
    var spawnedLaneIndex = 31 - clz32(spawnedLane);
    root2.entangledLanes |= spawnedLane;
    root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
  }
  function markRootEntangled(root2, entangledLanes) {
    var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
    for (root2 = root2.entanglements; rootEntangledLanes; ) {
      var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
      lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
      rootEntangledLanes &= ~lane;
    }
  }
  function getBumpedLaneForHydration(root2, renderLanes2) {
    var renderLane = renderLanes2 & -renderLanes2;
    renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
    return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
  }
  function getBumpedLaneForHydrationByLane(lane) {
    switch (lane) {
      case 2:
        lane = 1;
        break;
      case 8:
        lane = 4;
        break;
      case 32:
        lane = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        lane = 128;
        break;
      case 268435456:
        lane = 134217728;
        break;
      default:
        lane = 0;
    }
    return lane;
  }
  function lanesToEventPriority(lanes) {
    lanes &= -lanes;
    return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
  }
  function resolveUpdatePriority() {
    var updatePriority = ReactDOMSharedInternals.p;
    if (0 !== updatePriority) return updatePriority;
    updatePriority = window.event;
    return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
  }
  function runWithPriority(priority, fn) {
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      return ReactDOMSharedInternals.p = priority, fn();
    } finally {
      ReactDOMSharedInternals.p = previousPriority;
    }
  }
  var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
  function detachDeletedInstance(node) {
    delete node[internalInstanceKey];
    delete node[internalPropsKey];
    delete node[internalEventHandlersKey];
    delete node[internalEventHandlerListenersKey];
    delete node[internalEventHandlesSetKey];
  }
  function getClosestInstanceFromNode(targetNode) {
    var targetInst = targetNode[internalInstanceKey];
    if (targetInst) return targetInst;
    for (var parentNode = targetNode.parentNode; parentNode; ) {
      if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
        parentNode = targetInst.alternate;
        if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
          for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
            if (parentNode = targetNode[internalInstanceKey]) return parentNode;
            targetNode = getParentHydrationBoundary(targetNode);
          }
        return targetInst;
      }
      targetNode = parentNode;
      parentNode = targetNode.parentNode;
    }
    return null;
  }
  function getInstanceFromNode(node) {
    if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
      var tag = node.tag;
      if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
        return node;
    }
    return null;
  }
  function getNodeFromInstance(inst) {
    var tag = inst.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
    throw Error(formatProdErrorMessage(33));
  }
  function getResourcesFromRoot(root2) {
    var resources = root2[internalRootNodeResourcesKey];
    resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
    return resources;
  }
  function markNodeAsHoistable(node) {
    node[internalHoistableMarker] = true;
  }
  var allNativeEvents = /* @__PURE__ */ new Set(), registrationNameDependencies = {};
  function registerTwoPhaseEvent(registrationName, dependencies) {
    registerDirectEvent(registrationName, dependencies);
    registerDirectEvent(registrationName + "Capture", dependencies);
  }
  function registerDirectEvent(registrationName, dependencies) {
    registrationNameDependencies[registrationName] = dependencies;
    for (registrationName = 0; registrationName < dependencies.length; registrationName++)
      allNativeEvents.add(dependencies[registrationName]);
  }
  var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
      return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return validatedAttributeNameCache[attributeName] = true;
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  function setValueForAttribute(node, name, value) {
    if (isAttributeNameSafe(name))
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
            node.removeAttribute(name);
            return;
          case "boolean":
            var prefix$10 = name.toLowerCase().slice(0, 5);
            if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
              node.removeAttribute(name);
              return;
            }
        }
        node.setAttribute(name, "" + value);
      }
  }
  function setValueForKnownAttribute(node, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttribute(name, "" + value);
    }
  }
  function setValueForNamespacedAttribute(node, namespace, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttributeNS(namespace, name, "" + value);
    }
  }
  function getToStringValue(value) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return value;
      case "object":
        return value;
      default:
        return "";
    }
  }
  function isCheckable(elem) {
    var type = elem.type;
    return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
  }
  function trackValueOnNode(node, valueField, currentValue) {
    var descriptor = Object.getOwnPropertyDescriptor(
      node.constructor.prototype,
      valueField
    );
    if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
      var get = descriptor.get, set = descriptor.set;
      Object.defineProperty(node, valueField, {
        configurable: true,
        get: function() {
          return get.call(this);
        },
        set: function(value) {
          currentValue = "" + value;
          set.call(this, value);
        }
      });
      Object.defineProperty(node, valueField, {
        enumerable: descriptor.enumerable
      });
      return {
        getValue: function() {
          return currentValue;
        },
        setValue: function(value) {
          currentValue = "" + value;
        },
        stopTracking: function() {
          node._valueTracker = null;
          delete node[valueField];
        }
      };
    }
  }
  function track(node) {
    if (!node._valueTracker) {
      var valueField = isCheckable(node) ? "checked" : "value";
      node._valueTracker = trackValueOnNode(
        node,
        valueField,
        "" + node[valueField]
      );
    }
  }
  function updateValueIfChanged(node) {
    if (!node) return false;
    var tracker = node._valueTracker;
    if (!tracker) return true;
    var lastValue = tracker.getValue();
    var value = "";
    node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
    node = value;
    return node !== lastValue ? (tracker.setValue(node), true) : false;
  }
  function getActiveElement(doc) {
    doc = doc || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof doc) return null;
    try {
      return doc.activeElement || doc.body;
    } catch (e) {
      return doc.body;
    }
  }
  var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
  function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
    return value.replace(
      escapeSelectorAttributeValueInsideDoubleQuotesRegex,
      function(ch) {
        return "\\" + ch.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
    element.name = "";
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
    if (null != value)
      if ("number" === type) {
        if (0 === value && "" === element.value || element.value != value)
          element.value = "" + getToStringValue(value);
      } else
        element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
    else
      "submit" !== type && "reset" !== type || element.removeAttribute("value");
    null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
    null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
    null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
  }
  function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
    if (null != value || null != defaultValue) {
      if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
        track(element);
        return;
      }
      defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
      value = null != value ? "" + getToStringValue(value) : defaultValue;
      isHydrating2 || value === element.value || (element.value = value);
      element.defaultValue = value;
    }
    checked = null != checked ? checked : defaultChecked;
    checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
    element.checked = isHydrating2 ? element.checked : !!checked;
    element.defaultChecked = !!checked;
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
    track(element);
  }
  function setDefaultValue(node, type, value) {
    "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
  }
  function updateOptions(node, multiple, propValue, setDefaultSelected) {
    node = node.options;
    if (multiple) {
      multiple = {};
      for (var i = 0; i < propValue.length; i++)
        multiple["$" + propValue[i]] = true;
      for (propValue = 0; propValue < node.length; propValue++)
        i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
    } else {
      propValue = "" + getToStringValue(propValue);
      multiple = null;
      for (i = 0; i < node.length; i++) {
        if (node[i].value === propValue) {
          node[i].selected = true;
          setDefaultSelected && (node[i].defaultSelected = true);
          return;
        }
        null !== multiple || node[i].disabled || (multiple = node[i]);
      }
      null !== multiple && (multiple.selected = true);
    }
  }
  function updateTextarea(element, value, defaultValue) {
    if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
      element.defaultValue !== value && (element.defaultValue = value);
      return;
    }
    element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
  }
  function initTextarea(element, value, defaultValue, children) {
    if (null == value) {
      if (null != children) {
        if (null != defaultValue) throw Error(formatProdErrorMessage(92));
        if (isArrayImpl(children)) {
          if (1 < children.length) throw Error(formatProdErrorMessage(93));
          children = children[0];
        }
        defaultValue = children;
      }
      null == defaultValue && (defaultValue = "");
      value = defaultValue;
    }
    defaultValue = getToStringValue(value);
    element.defaultValue = defaultValue;
    children = element.textContent;
    children === defaultValue && "" !== children && null !== children && (element.value = children);
    track(element);
  }
  function setTextContent(node, text) {
    if (text) {
      var firstChild = node.firstChild;
      if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
        firstChild.nodeValue = text;
        return;
      }
    }
    node.textContent = text;
  }
  var unitlessNumbers = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function setValueForStyle(style2, styleName, value) {
    var isCustomProperty = 0 === styleName.indexOf("--");
    null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
  }
  function setValueForStyles(node, styles, prevStyles) {
    if (null != styles && "object" !== typeof styles)
      throw Error(formatProdErrorMessage(62));
    node = node.style;
    if (null != prevStyles) {
      for (var styleName in prevStyles)
        !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
      for (var styleName$16 in styles)
        styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
    } else
      for (var styleName$17 in styles)
        styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
  }
  function isCustomElement(tagName) {
    if (-1 === tagName.indexOf("-")) return false;
    switch (tagName) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var aliases = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
  }
  function noop$1() {
  }
  var currentReplayingEvent = null;
  function getEventTarget(nativeEvent) {
    nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
    nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
    return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
  }
  var restoreTarget = null, restoreQueue = null;
  function restoreStateOfTarget(target) {
    var internalInstance = getInstanceFromNode(target);
    if (internalInstance && (target = internalInstance.stateNode)) {
      var props = target[internalPropsKey] || null;
      a: switch (target = internalInstance.stateNode, internalInstance.type) {
        case "input":
          updateInput(
            target,
            props.value,
            props.defaultValue,
            props.defaultValue,
            props.checked,
            props.defaultChecked,
            props.type,
            props.name
          );
          internalInstance = props.name;
          if ("radio" === props.type && null != internalInstance) {
            for (props = target; props.parentNode; ) props = props.parentNode;
            props = props.querySelectorAll(
              'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
                "" + internalInstance
              ) + '"][type="radio"]'
            );
            for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
              var otherNode = props[internalInstance];
              if (otherNode !== target && otherNode.form === target.form) {
                var otherProps = otherNode[internalPropsKey] || null;
                if (!otherProps) throw Error(formatProdErrorMessage(90));
                updateInput(
                  otherNode,
                  otherProps.value,
                  otherProps.defaultValue,
                  otherProps.defaultValue,
                  otherProps.checked,
                  otherProps.defaultChecked,
                  otherProps.type,
                  otherProps.name
                );
              }
            }
            for (internalInstance = 0; internalInstance < props.length; internalInstance++)
              otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
          }
          break a;
        case "textarea":
          updateTextarea(target, props.value, props.defaultValue);
          break a;
        case "select":
          internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
      }
    }
  }
  var isInsideEventHandler = false;
  function batchedUpdates$1(fn, a, b) {
    if (isInsideEventHandler) return fn(a, b);
    isInsideEventHandler = true;
    try {
      var JSCompiler_inline_result = fn(a);
      return JSCompiler_inline_result;
    } finally {
      if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
        if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
          for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
      }
    }
  }
  function getListener(inst, registrationName) {
    var stateNode = inst.stateNode;
    if (null === stateNode) return null;
    var props = stateNode[internalPropsKey] || null;
    if (null === props) return null;
    stateNode = props[registrationName];
    a: switch (registrationName) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
        inst = !props;
        break a;
      default:
        inst = false;
    }
    if (inst) return null;
    if (stateNode && "function" !== typeof stateNode)
      throw Error(
        formatProdErrorMessage(231, registrationName, typeof stateNode)
      );
    return stateNode;
  }
  var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
  if (canUseDOM)
    try {
      var options = {};
      Object.defineProperty(options, "passive", {
        get: function() {
          passiveBrowserEventsSupported = true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (e) {
      passiveBrowserEventsSupported = false;
    }
  var root = null, startText = null, fallbackText = null;
  function getData() {
    if (fallbackText) return fallbackText;
    var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
    for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
    var minEnd = startLength - start;
    for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
    return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
  }
  function getEventCharCode(nativeEvent) {
    var keyCode = nativeEvent.keyCode;
    "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
    10 === nativeEvent && (nativeEvent = 13);
    return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
  }
  function functionThatReturnsTrue() {
    return true;
  }
  function functionThatReturnsFalse() {
    return false;
  }
  function createSyntheticEvent(Interface) {
    function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
      this._reactName = reactName;
      this._targetInst = targetInst;
      this.type = reactEventType;
      this.nativeEvent = nativeEvent;
      this.target = nativeEventTarget;
      this.currentTarget = null;
      for (var propName in Interface)
        Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
      this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
      this.isPropagationStopped = functionThatReturnsFalse;
      return this;
    }
    assign(SyntheticBaseEvent.prototype, {
      preventDefault: function() {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
      },
      stopPropagation: function() {
        var event = this.nativeEvent;
        event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
      },
      persist: function() {
      },
      isPersistent: functionThatReturnsTrue
    });
    return SyntheticBaseEvent;
  }
  var EventInterface = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: getEventModifierState,
    button: 0,
    buttons: 0,
    relatedTarget: function(event) {
      return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
    },
    movementX: function(event) {
      if ("movementX" in event) return event.movementX;
      event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
      return lastMovementX;
    },
    movementY: function(event) {
      return "movementY" in event ? event.movementY : lastMovementY;
    }
  }), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
    clipboardData: function(event) {
      return "clipboardData" in event ? event.clipboardData : window.clipboardData;
    }
  }), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function modifierStateGetter(keyArg) {
    var nativeEvent = this.nativeEvent;
    return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
  }
  function getEventModifierState() {
    return modifierStateGetter;
  }
  var KeyboardEventInterface = assign({}, UIEventInterface, {
    key: function(nativeEvent) {
      if (nativeEvent.key) {
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
        if ("Unidentified" !== key) return key;
      }
      return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: getEventModifierState,
    charCode: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : 0;
    },
    keyCode: function(event) {
      return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    },
    which: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    }
  }), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: getEventModifierState
  }), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
    deltaX: function(event) {
      return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    },
    deltaY: function(event) {
      return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
    newState: 0,
    oldState: 0
  }), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [9, 13, 27, 32], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
  canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
  var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
  function isFallbackCompositionEnd(domEventName, nativeEvent) {
    switch (domEventName) {
      case "keyup":
        return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
      case "keydown":
        return 229 !== nativeEvent.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function getDataFromCustomEvent(nativeEvent) {
    nativeEvent = nativeEvent.detail;
    return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
  }
  var isComposing = false;
  function getNativeBeforeInputChars(domEventName, nativeEvent) {
    switch (domEventName) {
      case "compositionend":
        return getDataFromCustomEvent(nativeEvent);
      case "keypress":
        if (32 !== nativeEvent.which) return null;
        hasSpaceKeypress = true;
        return SPACEBAR_CHAR;
      case "textInput":
        return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
      default:
        return null;
    }
  }
  function getFallbackBeforeInputChars(domEventName, nativeEvent) {
    if (isComposing)
      return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
    switch (domEventName) {
      case "paste":
        return null;
      case "keypress":
        if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
          if (nativeEvent.char && 1 < nativeEvent.char.length)
            return nativeEvent.char;
          if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
        }
        return null;
      case "compositionend":
        return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
      default:
        return null;
    }
  }
  var supportedInputTypes = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
  };
  function isTextInputElement(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
  }
  function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
    restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
    inst = accumulateTwoPhaseListeners(inst, "onChange");
    0 < inst.length && (nativeEvent = new SyntheticEvent(
      "onChange",
      "change",
      null,
      nativeEvent,
      target
    ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
  }
  var activeElement$1 = null, activeElementInst$1 = null;
  function runEventInBatch(dispatchQueue) {
    processDispatchQueue(dispatchQueue, 0);
  }
  function getInstIfValueChanged(targetInst) {
    var targetNode = getNodeFromInstance(targetInst);
    if (updateValueIfChanged(targetNode)) return targetInst;
  }
  function getTargetInstForChangeEvent(domEventName, targetInst) {
    if ("change" === domEventName) return targetInst;
  }
  var isInputEventSupported = false;
  if (canUseDOM) {
    var JSCompiler_inline_result$jscomp$286;
    if (canUseDOM) {
      var isSupported$jscomp$inline_427 = "oninput" in document;
      if (!isSupported$jscomp$inline_427) {
        var element$jscomp$inline_428 = document.createElement("div");
        element$jscomp$inline_428.setAttribute("oninput", "return;");
        isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
      }
      JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
    } else JSCompiler_inline_result$jscomp$286 = false;
    isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
  }
  function stopWatchingForValueChange() {
    activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
  }
  function handlePropertyChange(nativeEvent) {
    if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
      var dispatchQueue = [];
      createAndAccumulateChangeEvent(
        dispatchQueue,
        activeElementInst$1,
        nativeEvent,
        getEventTarget(nativeEvent)
      );
      batchedUpdates$1(runEventInBatch, dispatchQueue);
    }
  }
  function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
    "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
  }
  function getTargetInstForInputEventPolyfill(domEventName) {
    if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
      return getInstIfValueChanged(activeElementInst$1);
  }
  function getTargetInstForClickEvent(domEventName, targetInst) {
    if ("click" === domEventName) return getInstIfValueChanged(targetInst);
  }
  function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
    if ("input" === domEventName || "change" === domEventName)
      return getInstIfValueChanged(targetInst);
  }
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is;
  function shallowEqual(objA, objB) {
    if (objectIs(objA, objB)) return true;
    if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
      return false;
    var keysA = Object.keys(objA), keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (keysB = 0; keysB < keysA.length; keysB++) {
      var currentKey = keysA[keysB];
      if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
        return false;
    }
    return true;
  }
  function getLeafNode(node) {
    for (; node && node.firstChild; ) node = node.firstChild;
    return node;
  }
  function getNodeForCharacterOffset(root2, offset) {
    var node = getLeafNode(root2);
    root2 = 0;
    for (var nodeEnd; node; ) {
      if (3 === node.nodeType) {
        nodeEnd = root2 + node.textContent.length;
        if (root2 <= offset && nodeEnd >= offset)
          return { node, offset: offset - root2 };
        root2 = nodeEnd;
      }
      a: {
        for (; node; ) {
          if (node.nextSibling) {
            node = node.nextSibling;
            break a;
          }
          node = node.parentNode;
        }
        node = void 0;
      }
      node = getLeafNode(node);
    }
  }
  function containsNode(outerNode, innerNode) {
    return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
  }
  function getActiveElementDeep(containerInfo) {
    containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
    for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
      try {
        var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
      } catch (err) {
        JSCompiler_inline_result = false;
      }
      if (JSCompiler_inline_result) containerInfo = element.contentWindow;
      else break;
      element = getActiveElement(containerInfo.document);
    }
    return element;
  }
  function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
  }
  var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
  function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
    var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
    mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
      anchorNode: doc.anchorNode,
      anchorOffset: doc.anchorOffset,
      focusNode: doc.focusNode,
      focusOffset: doc.focusOffset
    }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
      "onSelect",
      "select",
      null,
      nativeEvent,
      nativeEventTarget
    ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
  }
  function makePrefixMap(styleProp, eventName) {
    var prefixes = {};
    prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes["Webkit" + styleProp] = "webkit" + eventName;
    prefixes["Moz" + styleProp] = "moz" + eventName;
    return prefixes;
  }
  var vendorPrefixes = {
    animationend: makePrefixMap("Animation", "AnimationEnd"),
    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
    animationstart: makePrefixMap("Animation", "AnimationStart"),
    transitionrun: makePrefixMap("Transition", "TransitionRun"),
    transitionstart: makePrefixMap("Transition", "TransitionStart"),
    transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
    transitionend: makePrefixMap("Transition", "TransitionEnd")
  }, prefixedEventNames = {}, style = {};
  canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
  function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
    if (!vendorPrefixes[eventName]) return eventName;
    var prefixMap = vendorPrefixes[eventName], styleProp;
    for (styleProp in prefixMap)
      if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
        return prefixedEventNames[eventName] = prefixMap[styleProp];
    return eventName;
  }
  var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = /* @__PURE__ */ new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  simpleEventPluginEvents.push("scrollEnd");
  function registerSimpleEvent(domEventName, reactName) {
    topLevelEventsToReactNames.set(domEventName, reactName);
    registerTwoPhaseEvent(reactName, [domEventName]);
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  }, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
  function finishQueueingConcurrentUpdates() {
    for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
      var fiber = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var queue = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var update = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var lane = concurrentQueues[i];
      concurrentQueues[i++] = null;
      if (null !== queue && null !== update) {
        var pending = queue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        queue.pending = update;
      }
      0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
  }
  function enqueueUpdate$1(fiber, queue, update, lane) {
    concurrentQueues[concurrentQueuesIndex++] = fiber;
    concurrentQueues[concurrentQueuesIndex++] = queue;
    concurrentQueues[concurrentQueuesIndex++] = update;
    concurrentQueues[concurrentQueuesIndex++] = lane;
    concurrentlyUpdatedLanes |= lane;
    fiber.lanes |= lane;
    fiber = fiber.alternate;
    null !== fiber && (fiber.lanes |= lane);
  }
  function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
    enqueueUpdate$1(fiber, queue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function enqueueConcurrentRenderForLane(fiber, lane) {
    enqueueUpdate$1(fiber, null, null, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
    sourceFiber.lanes |= lane;
    var alternate = sourceFiber.alternate;
    null !== alternate && (alternate.lanes |= lane);
    for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
      parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
    return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
  }
  function getRootForUpdatedFiber(sourceFiber) {
    if (50 < nestedUpdateCount)
      throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
    for (var parent = sourceFiber.return; null !== parent; )
      sourceFiber = parent, parent = sourceFiber.return;
    return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
  }
  var emptyContextObject = {};
  function FiberNode(tag, pendingProps, key, mode) {
    this.tag = tag;
    this.key = key;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.refCleanup = this.ref = null;
    this.pendingProps = pendingProps;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = mode;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function createFiberImplClass(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
  }
  function shouldConstruct(Component) {
    Component = Component.prototype;
    return !(!Component || !Component.isReactComponent);
  }
  function createWorkInProgress(current, pendingProps) {
    var workInProgress2 = current.alternate;
    null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
    workInProgress2.flags = current.flags & 65011712;
    workInProgress2.childLanes = current.childLanes;
    workInProgress2.lanes = current.lanes;
    workInProgress2.child = current.child;
    workInProgress2.memoizedProps = current.memoizedProps;
    workInProgress2.memoizedState = current.memoizedState;
    workInProgress2.updateQueue = current.updateQueue;
    pendingProps = current.dependencies;
    workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
    workInProgress2.sibling = current.sibling;
    workInProgress2.index = current.index;
    workInProgress2.ref = current.ref;
    workInProgress2.refCleanup = current.refCleanup;
    return workInProgress2;
  }
  function resetWorkInProgress(workInProgress2, renderLanes2) {
    workInProgress2.flags &= 65011714;
    var current = workInProgress2.alternate;
    null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
      lanes: renderLanes2.lanes,
      firstContext: renderLanes2.firstContext
    });
    return workInProgress2;
  }
  function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
    var fiberTag = 0;
    owner = type;
    if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
    else if ("string" === typeof type)
      fiberTag = isHostHoistableType(
        type,
        pendingProps,
        contextStackCursor.current
      ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
    else
      a: switch (type) {
        case REACT_ACTIVITY_TYPE:
          return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        case REACT_STRICT_MODE_TYPE:
          fiberTag = 8;
          mode |= 24;
          break;
        case REACT_PROFILER_TYPE:
          return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_TYPE:
          return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_LIST_TYPE:
          return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
        default:
          if ("object" === typeof type && null !== type)
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                fiberTag = 10;
                break a;
              case REACT_CONSUMER_TYPE:
                fiberTag = 9;
                break a;
              case REACT_FORWARD_REF_TYPE:
                fiberTag = 11;
                break a;
              case REACT_MEMO_TYPE:
                fiberTag = 14;
                break a;
              case REACT_LAZY_TYPE:
                fiberTag = 16;
                owner = null;
                break a;
            }
          fiberTag = 29;
          pendingProps = Error(
            formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
          );
          owner = null;
      }
    key = createFiberImplClass(fiberTag, pendingProps, key, mode);
    key.elementType = type;
    key.type = owner;
    key.lanes = lanes;
    return key;
  }
  function createFiberFromFragment(elements, mode, lanes, key) {
    elements = createFiberImplClass(7, elements, key, mode);
    elements.lanes = lanes;
    return elements;
  }
  function createFiberFromText(content, mode, lanes) {
    content = createFiberImplClass(6, content, null, mode);
    content.lanes = lanes;
    return content;
  }
  function createFiberFromDehydratedFragment(dehydratedNode) {
    var fiber = createFiberImplClass(18, null, null, 0);
    fiber.stateNode = dehydratedNode;
    return fiber;
  }
  function createFiberFromPortal(portal, mode, lanes) {
    mode = createFiberImplClass(
      4,
      null !== portal.children ? portal.children : [],
      portal.key,
      mode
    );
    mode.lanes = lanes;
    mode.stateNode = {
      containerInfo: portal.containerInfo,
      pendingChildren: null,
      implementation: portal.implementation
    };
    return mode;
  }
  var CapturedStacks = /* @__PURE__ */ new WeakMap();
  function createCapturedValueAtFiber(value, source) {
    if ("object" === typeof value && null !== value) {
      var existing = CapturedStacks.get(value);
      if (void 0 !== existing) return existing;
      source = {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
      CapturedStacks.set(value, source);
      return source;
    }
    return {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
  }
  var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
  function pushTreeFork(workInProgress2, totalChildren) {
    forkStack[forkStackIndex++] = treeForkCount;
    forkStack[forkStackIndex++] = treeForkProvider;
    treeForkProvider = workInProgress2;
    treeForkCount = totalChildren;
  }
  function pushTreeId(workInProgress2, totalChildren, index2) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextProvider = workInProgress2;
    var baseIdWithLeadingBit = treeContextId;
    workInProgress2 = treeContextOverflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index2 += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - baseLength % 5;
      length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
      treeContextOverflow = length + workInProgress2;
    } else
      treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
  }
  function pushMaterializedTreeId(workInProgress2) {
    null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
  }
  function popTreeContext(workInProgress2) {
    for (; workInProgress2 === treeForkProvider; )
      treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
    for (; workInProgress2 === treeContextProvider; )
      treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
  }
  function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextId = suspendedContext.id;
    treeContextOverflow = suspendedContext.overflow;
    treeContextProvider = workInProgress2;
  }
  var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
  function throwOnHydrationMismatch(fiber) {
    var error = Error(
      formatProdErrorMessage(
        418,
        1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    queueHydrationError(createCapturedValueAtFiber(error, fiber));
    throw HydrationMismatchException;
  }
  function prepareToHydrateHostInstance(fiber) {
    var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
    instance[internalInstanceKey] = fiber;
    instance[internalPropsKey] = props;
    switch (type) {
      case "dialog":
        listenToNonDelegatedEvent("cancel", instance);
        listenToNonDelegatedEvent("close", instance);
        break;
      case "iframe":
      case "object":
      case "embed":
        listenToNonDelegatedEvent("load", instance);
        break;
      case "video":
      case "audio":
        for (type = 0; type < mediaEventTypes.length; type++)
          listenToNonDelegatedEvent(mediaEventTypes[type], instance);
        break;
      case "source":
        listenToNonDelegatedEvent("error", instance);
        break;
      case "img":
      case "image":
      case "link":
        listenToNonDelegatedEvent("error", instance);
        listenToNonDelegatedEvent("load", instance);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", instance);
        break;
      case "input":
        listenToNonDelegatedEvent("invalid", instance);
        initInput(
          instance,
          props.value,
          props.defaultValue,
          props.checked,
          props.defaultChecked,
          props.type,
          props.name,
          true
        );
        break;
      case "select":
        listenToNonDelegatedEvent("invalid", instance);
        break;
      case "textarea":
        listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
    }
    type = props.children;
    "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
    instance || throwOnHydrationMismatch(fiber, true);
  }
  function popToNextHostParent(fiber) {
    for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
      switch (hydrationParentFiber.tag) {
        case 5:
        case 31:
        case 13:
          rootOrSingletonContext = false;
          return;
        case 27:
        case 3:
          rootOrSingletonContext = true;
          return;
        default:
          hydrationParentFiber = hydrationParentFiber.return;
      }
  }
  function popHydrationState(fiber) {
    if (fiber !== hydrationParentFiber) return false;
    if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
    var tag = fiber.tag, JSCompiler_temp;
    if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
      if (JSCompiler_temp = 5 === tag)
        JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
      JSCompiler_temp = !JSCompiler_temp;
    }
    JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
    popToNextHostParent(fiber);
    if (13 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber) throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else if (31 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber) throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else
      27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
    return true;
  }
  function resetHydrationState() {
    nextHydratableInstance = hydrationParentFiber = null;
    isHydrating = false;
  }
  function upgradeHydrationErrorsToRecoverable() {
    var queuedErrors = hydrationErrors;
    null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
      workInProgressRootRecoverableErrors,
      queuedErrors
    ), hydrationErrors = null);
    return queuedErrors;
  }
  function queueHydrationError(error) {
    null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
  }
  var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
  function pushProvider(providerFiber, context, nextValue) {
    push(valueCursor, context._currentValue);
    context._currentValue = nextValue;
  }
  function popProvider(context) {
    context._currentValue = valueCursor.current;
    pop(valueCursor);
  }
  function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
    for (; null !== parent; ) {
      var alternate = parent.alternate;
      (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
      if (parent === propagationRoot) break;
      parent = parent.return;
    }
  }
  function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
    var fiber = workInProgress2.child;
    null !== fiber && (fiber.return = workInProgress2);
    for (; null !== fiber; ) {
      var list = fiber.dependencies;
      if (null !== list) {
        var nextFiber = fiber.child;
        list = list.firstContext;
        a: for (; null !== list; ) {
          var dependency = list;
          list = fiber;
          for (var i = 0; i < contexts.length; i++)
            if (dependency.context === contexts[i]) {
              list.lanes |= renderLanes2;
              dependency = list.alternate;
              null !== dependency && (dependency.lanes |= renderLanes2);
              scheduleContextWorkOnParentPath(
                list.return,
                renderLanes2,
                workInProgress2
              );
              forcePropagateEntireTree || (nextFiber = null);
              break a;
            }
          list = dependency.next;
        }
      } else if (18 === fiber.tag) {
        nextFiber = fiber.return;
        if (null === nextFiber) throw Error(formatProdErrorMessage(341));
        nextFiber.lanes |= renderLanes2;
        list = nextFiber.alternate;
        null !== list && (list.lanes |= renderLanes2);
        scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
        nextFiber = null;
      } else nextFiber = fiber.child;
      if (null !== nextFiber) nextFiber.return = fiber;
      else
        for (nextFiber = fiber; null !== nextFiber; ) {
          if (nextFiber === workInProgress2) {
            nextFiber = null;
            break;
          }
          fiber = nextFiber.sibling;
          if (null !== fiber) {
            fiber.return = nextFiber.return;
            nextFiber = fiber;
            break;
          }
          nextFiber = nextFiber.return;
        }
      fiber = nextFiber;
    }
  }
  function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
    current = null;
    for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
      if (!isInsidePropagationBailout) {
        if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
        else if (0 !== (parent.flags & 262144)) break;
      }
      if (10 === parent.tag) {
        var currentParent = parent.alternate;
        if (null === currentParent) throw Error(formatProdErrorMessage(387));
        currentParent = currentParent.memoizedProps;
        if (null !== currentParent) {
          var context = parent.type;
          objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
        }
      } else if (parent === hostTransitionProviderCursor.current) {
        currentParent = parent.alternate;
        if (null === currentParent) throw Error(formatProdErrorMessage(387));
        currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
      }
      parent = parent.return;
    }
    null !== current && propagateContextChanges(
      workInProgress2,
      current,
      renderLanes2,
      forcePropagateEntireTree
    );
    workInProgress2.flags |= 262144;
  }
  function checkIfContextChanged(currentDependencies) {
    for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
      if (!objectIs(
        currentDependencies.context._currentValue,
        currentDependencies.memoizedValue
      ))
        return true;
      currentDependencies = currentDependencies.next;
    }
    return false;
  }
  function prepareToReadContext(workInProgress2) {
    currentlyRenderingFiber$1 = workInProgress2;
    lastContextDependency = null;
    workInProgress2 = workInProgress2.dependencies;
    null !== workInProgress2 && (workInProgress2.firstContext = null);
  }
  function readContext(context) {
    return readContextForConsumer(currentlyRenderingFiber$1, context);
  }
  function readContextDuringReconciliation(consumer, context) {
    null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
    return readContextForConsumer(consumer, context);
  }
  function readContextForConsumer(consumer, context) {
    var value = context._currentValue;
    context = { context, memoizedValue: value, next: null };
    if (null === lastContextDependency) {
      if (null === consumer) throw Error(formatProdErrorMessage(308));
      lastContextDependency = context;
      consumer.dependencies = { lanes: 0, firstContext: context };
      consumer.flags |= 524288;
    } else lastContextDependency = lastContextDependency.next = context;
    return value;
  }
  var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
    var listeners = [], signal = this.signal = {
      aborted: false,
      addEventListener: function(type, listener) {
        listeners.push(listener);
      }
    };
    this.abort = function() {
      signal.aborted = true;
      listeners.forEach(function(listener) {
        return listener();
      });
    };
  }, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function createCache() {
    return {
      controller: new AbortControllerLocal(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function releaseCache(cache) {
    cache.refCount--;
    0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
      cache.controller.abort();
    });
  }
  var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
  function entangleAsyncAction(transition, thenable) {
    if (null === currentEntangledListeners) {
      var entangledListeners = currentEntangledListeners = [];
      currentEntangledPendingCount = 0;
      currentEntangledLane = requestTransitionLane();
      currentEntangledActionThenable = {
        status: "pending",
        value: void 0,
        then: function(resolve) {
          entangledListeners.push(resolve);
        }
      };
    }
    currentEntangledPendingCount++;
    thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
    return thenable;
  }
  function pingEngtangledActionScope() {
    if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
      null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
      var listeners = currentEntangledListeners;
      currentEntangledListeners = null;
      currentEntangledLane = 0;
      currentEntangledActionThenable = null;
      for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
    }
  }
  function chainThenableValue(thenable, result) {
    var listeners = [], thenableWithOverride = {
      status: "pending",
      value: null,
      reason: null,
      then: function(resolve) {
        listeners.push(resolve);
      }
    };
    thenable.then(
      function() {
        thenableWithOverride.status = "fulfilled";
        thenableWithOverride.value = result;
        for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
      },
      function(error) {
        thenableWithOverride.status = "rejected";
        thenableWithOverride.reason = error;
        for (error = 0; error < listeners.length; error++)
          (0, listeners[error])(void 0);
      }
    );
    return thenableWithOverride;
  }
  var prevOnStartTransitionFinish = ReactSharedInternals.S;
  ReactSharedInternals.S = function(transition, returnValue) {
    globalMostRecentTransitionTime = now();
    "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
    null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
  };
  var resumedCache = createCursor(null);
  function peekCacheFromPool() {
    var cacheResumedFromPreviousRender = resumedCache.current;
    return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
  }
  function pushTransition(offscreenWorkInProgress, prevCachePool) {
    null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
  }
  function getSuspendedCache() {
    var cacheFromPool = peekCacheFromPool();
    return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
  }
  var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {
  } };
  function isThenableResolved(thenable) {
    thenable = thenable.status;
    return "fulfilled" === thenable || "rejected" === thenable;
  }
  function trackUsedThenable(thenableState2, thenable, index2) {
    index2 = thenableState2[index2];
    void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
      default:
        if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
        else {
          thenableState2 = workInProgressRoot;
          if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
            throw Error(formatProdErrorMessage(482));
          thenableState2 = thenable;
          thenableState2.status = "pending";
          thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          );
        }
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  function resolveLazy(lazyType) {
    try {
      var init = lazyType._init;
      return init(lazyType._payload);
    } catch (x) {
      if (null !== x && "object" === typeof x && "function" === typeof x.then)
        throw suspendedThenable = x, SuspenseException;
      throw x;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function checkIfUseWrappedInAsyncCatch(rejectedReason) {
    if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
      throw Error(formatProdErrorMessage(483));
  }
  var thenableState$1 = null, thenableIndexCounter$1 = 0;
  function unwrapThenable(thenable) {
    var index2 = thenableIndexCounter$1;
    thenableIndexCounter$1 += 1;
    null === thenableState$1 && (thenableState$1 = []);
    return trackUsedThenable(thenableState$1, thenable, index2);
  }
  function coerceRef(workInProgress2, element) {
    element = element.props.ref;
    workInProgress2.ref = void 0 !== element ? element : null;
  }
  function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
    if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
      throw Error(formatProdErrorMessage(525));
    returnFiber = Object.prototype.toString.call(newChild);
    throw Error(
      formatProdErrorMessage(
        31,
        "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
      )
    );
  }
  function createChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (shouldTrackSideEffects) {
        var deletions = returnFiber.deletions;
        null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
      }
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects) return null;
      for (; null !== currentFirstChild; )
        deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return null;
    }
    function mapRemainingChildren(currentFirstChild) {
      for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild; )
        null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return existingChildren;
    }
    function useFiber(fiber, pendingProps) {
      fiber = createWorkInProgress(fiber, pendingProps);
      fiber.index = 0;
      fiber.sibling = null;
      return fiber;
    }
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
      newFiber.index = newIndex;
      if (!shouldTrackSideEffects)
        return newFiber.flags |= 1048576, lastPlacedIndex;
      newIndex = newFiber.alternate;
      if (null !== newIndex)
        return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
      newFiber.flags |= 67108866;
      return lastPlacedIndex;
    }
    function placeSingleChild(newFiber) {
      shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
      return newFiber;
    }
    function updateTextNode(returnFiber, current, textContent, lanes) {
      if (null === current || 6 !== current.tag)
        return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, textContent);
      current.return = returnFiber;
      return current;
    }
    function updateElement(returnFiber, current, element, lanes) {
      var elementType = element.type;
      if (elementType === REACT_FRAGMENT_TYPE)
        return updateFragment(
          returnFiber,
          current,
          element.props.children,
          lanes,
          element.key
        );
      if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
        return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
      current = createFiberFromTypeAndProps(
        element.type,
        element.key,
        element.props,
        null,
        returnFiber.mode,
        lanes
      );
      coerceRef(current, element);
      current.return = returnFiber;
      return current;
    }
    function updatePortal(returnFiber, current, portal, lanes) {
      if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
        return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, portal.children || []);
      current.return = returnFiber;
      return current;
    }
    function updateFragment(returnFiber, current, fragment, lanes, key) {
      if (null === current || 7 !== current.tag)
        return current = createFiberFromFragment(
          fragment,
          returnFiber.mode,
          lanes,
          key
        ), current.return = returnFiber, current;
      current = useFiber(current, fragment);
      current.return = returnFiber;
      return current;
    }
    function createChild(returnFiber, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return newChild = createFiberFromText(
          "" + newChild,
          returnFiber.mode,
          lanes
        ), newChild.return = returnFiber, newChild;
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return lanes = createFiberFromTypeAndProps(
              newChild.type,
              newChild.key,
              newChild.props,
              null,
              returnFiber.mode,
              lanes
            ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
          case REACT_PORTAL_TYPE:
            return newChild = createFiberFromPortal(
              newChild,
              returnFiber.mode,
              lanes
            ), newChild.return = returnFiber, newChild;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return newChild = createFiberFromFragment(
            newChild,
            returnFiber.mode,
            lanes,
            null
          ), newChild.return = returnFiber, newChild;
        if ("function" === typeof newChild.then)
          return createChild(returnFiber, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return createChild(
            returnFiber,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
      var key = null !== oldFiber ? oldFiber.key : null;
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_PORTAL_TYPE:
            return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateSlot(
            returnFiber,
            oldFiber,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateSlot(
            returnFiber,
            oldFiber,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return existingChildren = existingChildren.get(
              null === newChild.key ? newIdx : newChild.key
            ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
          case REACT_PORTAL_TYPE:
            return existingChildren = existingChildren.get(
              null === newChild.key ? newIdx : newChild.key
            ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              newChild,
              lanes
            );
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(
          returnFiber,
          oldFiber,
          newChildren[newIdx],
          lanes
        );
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (newIdx === newChildren.length)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; newIdx < newChildren.length; newIdx++)
          oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
            oldFiber,
            currentFirstChild,
            newIdx
          ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
        nextOldFiber = updateFromMap(
          oldFiber,
          returnFiber,
          newIdx,
          newChildren[newIdx],
          lanes
        ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
          null === nextOldFiber.key ? newIdx : nextOldFiber.key
        ), currentFirstChild = placeChild(
          nextOldFiber,
          currentFirstChild,
          newIdx
        ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
      if (null == newChildren) throw Error(formatProdErrorMessage(151));
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (step.done)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; !step.done; newIdx++, step = newChildren.next())
          step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
        step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
      "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            a: {
              for (var key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key) {
                  key = newChild.type;
                  if (key === REACT_FRAGMENT_TYPE) {
                    if (7 === currentFirstChild.tag) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(
                        currentFirstChild,
                        newChild.props.children
                      );
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    }
                  } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                    deleteRemainingChildren(
                      returnFiber,
                      currentFirstChild.sibling
                    );
                    lanes = useFiber(currentFirstChild, newChild.props);
                    coerceRef(lanes, newChild);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  }
                  deleteRemainingChildren(returnFiber, currentFirstChild);
                  break;
                } else deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
                newChild.props.children,
                returnFiber.mode,
                lanes,
                newChild.key
              ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
                newChild.type,
                newChild.key,
                newChild.props,
                null,
                returnFiber.mode,
                lanes
              ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
            }
            return placeSingleChild(returnFiber);
          case REACT_PORTAL_TYPE:
            a: {
              for (key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key)
                  if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                    deleteRemainingChildren(
                      returnFiber,
                      currentFirstChild.sibling
                    );
                    lanes = useFiber(currentFirstChild, newChild.children || []);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  } else {
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  }
                else deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
              lanes.return = returnFiber;
              returnFiber = lanes;
            }
            return placeSingleChild(returnFiber);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
        }
        if (isArrayImpl(newChild))
          return reconcileChildrenArray(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
        if (getIteratorFn(newChild)) {
          key = getIteratorFn(newChild);
          if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
          newChild = key.call(newChild);
          return reconcileChildrenIterator(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
        }
        if ("function" === typeof newChild.then)
          return reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return function(returnFiber, currentFirstChild, newChild, lanes) {
      try {
        thenableIndexCounter$1 = 0;
        var firstChildFiber = reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
        thenableState$1 = null;
        return firstChildFiber;
      } catch (x) {
        if (x === SuspenseException || x === SuspenseActionException) throw x;
        var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
        fiber.lanes = lanes;
        fiber.return = returnFiber;
        return fiber;
      } finally {
      }
    };
  }
  var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
  function initializeUpdateQueue(fiber) {
    fiber.updateQueue = {
      baseState: fiber.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function cloneUpdateQueue(current, workInProgress2) {
    current = current.updateQueue;
    workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
      baseState: current.baseState,
      firstBaseUpdate: current.firstBaseUpdate,
      lastBaseUpdate: current.lastBaseUpdate,
      shared: current.shared,
      callbacks: null
    });
  }
  function createUpdate(lane) {
    return { lane, tag: 0, payload: null, callback: null, next: null };
  }
  function enqueueUpdate(fiber, update, lane) {
    var updateQueue = fiber.updateQueue;
    if (null === updateQueue) return null;
    updateQueue = updateQueue.shared;
    if (0 !== (executionContext & 2)) {
      var pending = updateQueue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      updateQueue.pending = update;
      update = getRootForUpdatedFiber(fiber);
      markUpdateLaneFromFiberToRoot(fiber, null, lane);
      return update;
    }
    enqueueUpdate$1(fiber, updateQueue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function entangleTransitions(root2, fiber, lane) {
    fiber = fiber.updateQueue;
    if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
      var queueLanes = fiber.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      fiber.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
    var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
    if (null !== current && (current = current.updateQueue, queue === current)) {
      var newFirst = null, newLast = null;
      queue = queue.firstBaseUpdate;
      if (null !== queue) {
        do {
          var clone = {
            lane: queue.lane,
            tag: queue.tag,
            payload: queue.payload,
            callback: null,
            next: null
          };
          null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
          queue = queue.next;
        } while (null !== queue);
        null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
      } else newFirst = newLast = capturedUpdate;
      queue = {
        baseState: current.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: current.shared,
        callbacks: current.callbacks
      };
      workInProgress2.updateQueue = queue;
      return;
    }
    workInProgress2 = queue.lastBaseUpdate;
    null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
    queue.lastBaseUpdate = capturedUpdate;
  }
  var didReadFromEntangledAsyncAction = false;
  function suspendIfUpdateReadFromEntangledAsyncAction() {
    if (didReadFromEntangledAsyncAction) {
      var entangledActionThenable = currentEntangledActionThenable;
      if (null !== entangledActionThenable) throw entangledActionThenable;
    }
  }
  function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
    didReadFromEntangledAsyncAction = false;
    var queue = workInProgress$jscomp$0.updateQueue;
    hasForceUpdate = false;
    var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
    if (null !== pendingQueue) {
      queue.shared.pending = null;
      var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
      lastPendingUpdate.next = null;
      null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
      lastBaseUpdate = lastPendingUpdate;
      var current = workInProgress$jscomp$0.alternate;
      null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
    }
    if (null !== firstBaseUpdate) {
      var newState = queue.baseState;
      lastBaseUpdate = 0;
      current = firstPendingUpdate = lastPendingUpdate = null;
      pendingQueue = firstBaseUpdate;
      do {
        var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
        if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
          0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
          null !== current && (current = current.next = {
            lane: 0,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: null,
            next: null
          });
          a: {
            var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
            updateLane = props;
            var instance = instance$jscomp$0;
            switch (update.tag) {
              case 1:
                workInProgress2 = update.payload;
                if ("function" === typeof workInProgress2) {
                  newState = workInProgress2.call(instance, newState, updateLane);
                  break a;
                }
                newState = workInProgress2;
                break a;
              case 3:
                workInProgress2.flags = workInProgress2.flags & -65537 | 128;
              case 0:
                workInProgress2 = update.payload;
                updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                if (null === updateLane || void 0 === updateLane) break a;
                newState = assign({}, newState, updateLane);
                break a;
              case 2:
                hasForceUpdate = true;
            }
          }
          updateLane = pendingQueue.callback;
          null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
        } else
          isHiddenUpdate = {
            lane: updateLane,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: pendingQueue.callback,
            next: null
          }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
        pendingQueue = pendingQueue.next;
        if (null === pendingQueue)
          if (pendingQueue = queue.shared.pending, null === pendingQueue)
            break;
          else
            isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
      } while (1);
      null === current && (lastPendingUpdate = newState);
      queue.baseState = lastPendingUpdate;
      queue.firstBaseUpdate = firstPendingUpdate;
      queue.lastBaseUpdate = current;
      null === firstBaseUpdate && (queue.shared.lanes = 0);
      workInProgressRootSkippedLanes |= lastBaseUpdate;
      workInProgress$jscomp$0.lanes = lastBaseUpdate;
      workInProgress$jscomp$0.memoizedState = newState;
    }
  }
  function callCallback(callback, context) {
    if ("function" !== typeof callback)
      throw Error(formatProdErrorMessage(191, callback));
    callback.call(context);
  }
  function commitCallbacks(updateQueue, context) {
    var callbacks = updateQueue.callbacks;
    if (null !== callbacks)
      for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
        callCallback(callbacks[updateQueue], context);
  }
  var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
  function pushHiddenContext(fiber, context) {
    fiber = entangledRenderLanes;
    push(prevEntangledRenderLanesCursor, fiber);
    push(currentTreeHiddenStackCursor, context);
    entangledRenderLanes = fiber | context.baseLanes;
  }
  function reuseHiddenContextOnStack() {
    push(prevEntangledRenderLanesCursor, entangledRenderLanes);
    push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
  }
  function popHiddenContext() {
    entangledRenderLanes = prevEntangledRenderLanesCursor.current;
    pop(currentTreeHiddenStackCursor);
    pop(prevEntangledRenderLanesCursor);
  }
  var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
  function pushPrimaryTreeSuspenseHandler(handler) {
    var current = handler.alternate;
    push(suspenseStackCursor, suspenseStackCursor.current & 1);
    push(suspenseHandlerStackCursor, handler);
    null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
  }
  function pushDehydratedActivitySuspenseHandler(fiber) {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, fiber);
    null === shellBoundary && (shellBoundary = fiber);
  }
  function pushOffscreenSuspenseHandler(fiber) {
    22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
  }
  function reuseSuspenseHandlerOnStack() {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
  }
  function popSuspenseHandler(fiber) {
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
    pop(suspenseStackCursor);
  }
  var suspenseStackCursor = createCursor(0);
  function findFirstSuspended(row) {
    for (var node = row; null !== node; ) {
      if (13 === node.tag) {
        var state = node.memoizedState;
        if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
          return node;
      } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
        if (0 !== (node.flags & 128)) return node;
      } else if (null !== node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === row) break;
      for (; null === node.sibling; ) {
        if (null === node.return || node.return === row) return null;
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
    return null;
  }
  var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
  function throwInvalidHookError() {
    throw Error(formatProdErrorMessage(321));
  }
  function areHookInputsEqual(nextDeps, prevDeps) {
    if (null === prevDeps) return false;
    for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
      if (!objectIs(nextDeps[i], prevDeps[i])) return false;
    return true;
  }
  function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
    renderLanes = nextRenderLanes;
    currentlyRenderingFiber = workInProgress2;
    workInProgress2.memoizedState = null;
    workInProgress2.updateQueue = null;
    workInProgress2.lanes = 0;
    ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    nextRenderLanes = Component(props, secondArg);
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
      workInProgress2,
      Component,
      props,
      secondArg
    ));
    finishRenderingHooks(current);
    return nextRenderLanes;
  }
  function finishRenderingHooks(current) {
    ReactSharedInternals.H = ContextOnlyDispatcher;
    var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdate = false;
    thenableIndexCounter = 0;
    thenableState = null;
    if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
    null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
  }
  function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
    currentlyRenderingFiber = workInProgress2;
    var numberOfReRenders = 0;
    do {
      didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
      thenableIndexCounter = 0;
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
      numberOfReRenders += 1;
      workInProgressHook = currentHook = null;
      if (null != workInProgress2.updateQueue) {
        var children = workInProgress2.updateQueue;
        children.lastEffect = null;
        children.events = null;
        children.stores = null;
        null != children.memoCache && (children.memoCache.index = 0);
      }
      ReactSharedInternals.H = HooksDispatcherOnRerender;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
    return children;
  }
  function TransitionAwareHostComponent() {
    var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
    maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
    dispatcher = dispatcher.useState()[0];
    (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
    return maybeThenable;
  }
  function checkDidRenderIdHook() {
    var didRenderIdHook = 0 !== localIdCounter;
    localIdCounter = 0;
    return didRenderIdHook;
  }
  function bailoutHooks(current, workInProgress2, lanes) {
    workInProgress2.updateQueue = current.updateQueue;
    workInProgress2.flags &= -2053;
    current.lanes &= ~lanes;
  }
  function resetHooksOnUnwind(workInProgress2) {
    if (didScheduleRenderPhaseUpdate) {
      for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
        var queue = workInProgress2.queue;
        null !== queue && (queue.pending = null);
        workInProgress2 = workInProgress2.next;
      }
      didScheduleRenderPhaseUpdate = false;
    }
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdateDuringThisPass = false;
    thenableIndexCounter = localIdCounter = 0;
    thenableState = null;
  }
  function mountWorkInProgressHook() {
    var hook = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
    return workInProgressHook;
  }
  function updateWorkInProgressHook() {
    if (null === currentHook) {
      var nextCurrentHook = currentlyRenderingFiber.alternate;
      nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
    } else nextCurrentHook = currentHook.next;
    var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
    if (null !== nextWorkInProgressHook)
      workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
    else {
      if (null === nextCurrentHook) {
        if (null === currentlyRenderingFiber.alternate)
          throw Error(formatProdErrorMessage(467));
        throw Error(formatProdErrorMessage(310));
      }
      currentHook = nextCurrentHook;
      nextCurrentHook = {
        memoizedState: currentHook.memoizedState,
        baseState: currentHook.baseState,
        baseQueue: currentHook.baseQueue,
        queue: currentHook.queue,
        next: null
      };
      null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
    }
    return workInProgressHook;
  }
  function createFunctionComponentUpdateQueue() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function useThenable(thenable) {
    var index2 = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    thenable = trackUsedThenable(thenableState, thenable, index2);
    index2 = currentlyRenderingFiber;
    null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
    return thenable;
  }
  function use(usable) {
    if (null !== usable && "object" === typeof usable) {
      if ("function" === typeof usable.then) return useThenable(usable);
      if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
    }
    throw Error(formatProdErrorMessage(438, String(usable)));
  }
  function useMemoCache(size) {
    var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
    null !== updateQueue && (memoCache = updateQueue.memoCache);
    if (null == memoCache) {
      var current = currentlyRenderingFiber.alternate;
      null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
        data: current.data.map(function(array) {
          return array.slice();
        }),
        index: 0
      })));
    }
    null == memoCache && (memoCache = { data: [], index: 0 });
    null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
    updateQueue.memoCache = memoCache;
    updateQueue = memoCache.data[memoCache.index];
    if (void 0 === updateQueue)
      for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
        updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
    memoCache.index++;
    return updateQueue;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function updateReducer(reducer) {
    var hook = updateWorkInProgressHook();
    return updateReducerImpl(hook, currentHook, reducer);
  }
  function updateReducerImpl(hook, current, reducer) {
    var queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
    if (null !== pendingQueue) {
      if (null !== baseQueue) {
        var baseFirst = baseQueue.next;
        baseQueue.next = pendingQueue.next;
        pendingQueue.next = baseFirst;
      }
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }
    pendingQueue = hook.baseState;
    if (null === baseQueue) hook.memoizedState = pendingQueue;
    else {
      current = baseQueue.next;
      var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
      do {
        var updateLane = update.lane & -536870913;
        if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
          var revertLane = update.revertLane;
          if (0 === revertLane)
            null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
          else if ((renderLanes & revertLane) === revertLane) {
            update = update.next;
            revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
            continue;
          } else
            updateLane = {
              lane: 0,
              revertLane: update.revertLane,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
          updateLane = update.action;
          shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
          pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
        } else
          revertLane = {
            lane: updateLane,
            revertLane: update.revertLane,
            gesture: update.gesture,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
        update = update.next;
      } while (null !== update && update !== current);
      null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
      if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
        throw reducer;
      hook.memoizedState = pendingQueue;
      hook.baseState = baseFirst;
      hook.baseQueue = newBaseQueueLast;
      queue.lastRenderedState = pendingQueue;
    }
    null === baseQueue && (queue.lanes = 0);
    return [hook.memoizedState, queue.dispatch];
  }
  function rerenderReducer(reducer) {
    var hook = updateWorkInProgressHook(), queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
    if (null !== lastRenderPhaseUpdate) {
      queue.pending = null;
      var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      do
        newState = reducer(newState, update.action), update = update.next;
      while (update !== lastRenderPhaseUpdate);
      objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
      hook.memoizedState = newState;
      null === hook.baseQueue && (hook.baseState = newState);
      queue.lastRenderedState = newState;
    }
    return [newState, dispatch];
  }
  function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
    if (isHydrating$jscomp$0) {
      if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
      getServerSnapshot = getServerSnapshot();
    } else getServerSnapshot = getSnapshot();
    var snapshotChanged = !objectIs(
      (currentHook || hook).memoizedState,
      getServerSnapshot
    );
    snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
    hook = hook.queue;
    updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
      subscribe
    ]);
    if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
      fiber.flags |= 2048;
      pushSimpleEffect(
        9,
        { destroy: void 0 },
        updateStoreInstance.bind(
          null,
          fiber,
          hook,
          getServerSnapshot,
          getSnapshot
        ),
        null
      );
      if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
      isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
    }
    return getServerSnapshot;
  }
  function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
    fiber.flags |= 16384;
    fiber = { getSnapshot, value: renderedSnapshot };
    getSnapshot = currentlyRenderingFiber.updateQueue;
    null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
  }
  function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
    inst.value = nextSnapshot;
    inst.getSnapshot = getSnapshot;
    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
  }
  function subscribeToStore(fiber, inst, subscribe) {
    return subscribe(function() {
      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    });
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function forceStoreRerender(fiber) {
    var root2 = enqueueConcurrentRenderForLane(fiber, 2);
    null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
  }
  function mountStateImpl(initialState) {
    var hook = mountWorkInProgressHook();
    if ("function" === typeof initialState) {
      var initialStateInitializer = initialState;
      initialState = initialStateInitializer();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          initialStateInitializer();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    }
    hook.memoizedState = hook.baseState = initialState;
    hook.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: initialState
    };
    return hook;
  }
  function updateOptimisticImpl(hook, current, passthrough, reducer) {
    hook.baseState = passthrough;
    return updateReducerImpl(
      hook,
      currentHook,
      "function" === typeof reducer ? reducer : basicStateReducer
    );
  }
  function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
    if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
    fiber = actionQueue.action;
    if (null !== fiber) {
      var actionNode = {
        payload,
        action: fiber,
        next: null,
        isTransition: true,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(listener) {
          actionNode.listeners.push(listener);
        }
      };
      null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
      setState(actionNode);
      setPendingState = actionQueue.pending;
      null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
    }
  }
  function runActionStateAction(actionQueue, node) {
    var action = node.action, payload = node.payload, prevState = actionQueue.state;
    if (node.isTransition) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        handleActionReturnValue(actionQueue, node, returnValue);
      } catch (error) {
        onActionError(actionQueue, node, error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    } else
      try {
        prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
      } catch (error$66) {
        onActionError(actionQueue, node, error$66);
      }
  }
  function handleActionReturnValue(actionQueue, node, returnValue) {
    null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
      function(nextState) {
        onActionSuccess(actionQueue, node, nextState);
      },
      function(error) {
        return onActionError(actionQueue, node, error);
      }
    ) : onActionSuccess(actionQueue, node, returnValue);
  }
  function onActionSuccess(actionQueue, actionNode, nextState) {
    actionNode.status = "fulfilled";
    actionNode.value = nextState;
    notifyActionListeners(actionNode);
    actionQueue.state = nextState;
    actionNode = actionQueue.pending;
    null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
  }
  function onActionError(actionQueue, actionNode, error) {
    var last = actionQueue.pending;
    actionQueue.pending = null;
    if (null !== last) {
      last = last.next;
      do
        actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
      while (actionNode !== last);
    }
    actionQueue.action = null;
  }
  function notifyActionListeners(actionNode) {
    actionNode = actionNode.listeners;
    for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
  }
  function actionStateReducer(oldState, newState) {
    return newState;
  }
  function mountActionState(action, initialStateProp) {
    if (isHydrating) {
      var ssrFormState = workInProgressRoot.formState;
      if (null !== ssrFormState) {
        a: {
          var JSCompiler_inline_result = currentlyRenderingFiber;
          if (isHydrating) {
            if (nextHydratableInstance) {
              b: {
                var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                  if (!inRootOrSingleton) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                  JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                    JSCompiler_inline_result$jscomp$0.nextSibling
                  );
                  if (null === JSCompiler_inline_result$jscomp$0) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                }
                inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
              }
              if (JSCompiler_inline_result$jscomp$0) {
                nextHydratableInstance = getNextHydratable(
                  JSCompiler_inline_result$jscomp$0.nextSibling
                );
                JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                break a;
              }
            }
            throwOnHydrationMismatch(JSCompiler_inline_result);
          }
          JSCompiler_inline_result = false;
        }
        JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
      }
    }
    ssrFormState = mountWorkInProgressHook();
    ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
    JSCompiler_inline_result = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: actionStateReducer,
      lastRenderedState: initialStateProp
    };
    ssrFormState.queue = JSCompiler_inline_result;
    ssrFormState = dispatchSetState.bind(
      null,
      currentlyRenderingFiber,
      JSCompiler_inline_result
    );
    JSCompiler_inline_result.dispatch = ssrFormState;
    JSCompiler_inline_result = mountStateImpl(false);
    inRootOrSingleton = dispatchOptimisticSetState.bind(
      null,
      currentlyRenderingFiber,
      false,
      JSCompiler_inline_result.queue
    );
    JSCompiler_inline_result = mountWorkInProgressHook();
    JSCompiler_inline_result$jscomp$0 = {
      state: initialStateProp,
      dispatch: null,
      action,
      pending: null
    };
    JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
    ssrFormState = dispatchActionState.bind(
      null,
      currentlyRenderingFiber,
      JSCompiler_inline_result$jscomp$0,
      inRootOrSingleton,
      ssrFormState
    );
    JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
    JSCompiler_inline_result.memoizedState = action;
    return [initialStateProp, ssrFormState, false];
  }
  function updateActionState(action) {
    var stateHook = updateWorkInProgressHook();
    return updateActionStateImpl(stateHook, currentHook, action);
  }
  function updateActionStateImpl(stateHook, currentStateHook, action) {
    currentStateHook = updateReducerImpl(
      stateHook,
      currentStateHook,
      actionStateReducer
    )[0];
    stateHook = updateReducer(basicStateReducer)[0];
    if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
      try {
        var state = useThenable(currentStateHook);
      } catch (x) {
        if (x === SuspenseException) throw SuspenseActionException;
        throw x;
      }
    else state = currentStateHook;
    currentStateHook = updateWorkInProgressHook();
    var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
    action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
      9,
      { destroy: void 0 },
      actionStateActionEffect.bind(null, actionQueue, action),
      null
    ));
    return [state, dispatch, stateHook];
  }
  function actionStateActionEffect(actionQueue, action) {
    actionQueue.action = action;
  }
  function rerenderActionState(action) {
    var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
    if (null !== currentStateHook)
      return updateActionStateImpl(stateHook, currentStateHook, action);
    updateWorkInProgressHook();
    stateHook = stateHook.memoizedState;
    currentStateHook = updateWorkInProgressHook();
    var dispatch = currentStateHook.queue.dispatch;
    currentStateHook.memoizedState = action;
    return [stateHook, dispatch, false];
  }
  function pushSimpleEffect(tag, inst, create, deps) {
    tag = { tag, create, deps, inst, next: null };
    inst = currentlyRenderingFiber.updateQueue;
    null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
    create = inst.lastEffect;
    null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
    return tag;
  }
  function updateRef() {
    return updateWorkInProgressHook().memoizedState;
  }
  function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = mountWorkInProgressHook();
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushSimpleEffect(
      1 | hookFlags,
      { destroy: void 0 },
      create,
      void 0 === deps ? null : deps
    );
  }
  function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var inst = hook.memoizedState.inst;
    null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
      1 | hookFlags,
      inst,
      create,
      deps
    ));
  }
  function mountEffect(create, deps) {
    mountEffectImpl(8390656, 8, create, deps);
  }
  function updateEffect(create, deps) {
    updateEffectImpl(2048, 8, create, deps);
  }
  function useEffectEventImpl(payload) {
    currentlyRenderingFiber.flags |= 4;
    var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (null === componentUpdateQueue)
      componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
    else {
      var events = componentUpdateQueue.events;
      null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
    }
  }
  function updateEvent(callback) {
    var ref = updateWorkInProgressHook().memoizedState;
    useEffectEventImpl({ ref, nextImpl: callback });
    return function() {
      if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
      return ref.impl.apply(void 0, arguments);
    };
  }
  function updateInsertionEffect(create, deps) {
    return updateEffectImpl(4, 2, create, deps);
  }
  function updateLayoutEffect(create, deps) {
    return updateEffectImpl(4, 4, create, deps);
  }
  function imperativeHandleEffect(create, ref) {
    if ("function" === typeof ref) {
      create = create();
      var refCleanup = ref(create);
      return function() {
        "function" === typeof refCleanup ? refCleanup() : ref(null);
      };
    }
    if (null !== ref && void 0 !== ref)
      return create = create(), ref.current = create, function() {
        ref.current = null;
      };
  }
  function updateImperativeHandle(ref, create, deps) {
    deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
    updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
  }
  function mountDebugValue() {
  }
  function updateCallback(callback, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    hook.memoizedState = [callback, deps];
    return callback;
  }
  function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    prevState = nextCreate();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        nextCreate();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    hook.memoizedState = [prevState, deps];
    return prevState;
  }
  function mountDeferredValueImpl(hook, value, initialValue) {
    if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return hook.memoizedState = value;
    hook.memoizedState = initialValue;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return initialValue;
  }
  function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
    if (objectIs(value, prevValue)) return value;
    if (null !== currentTreeHiddenStackCursor.current)
      return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
    if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return didReceiveUpdate = true, hook.memoizedState = value;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return prevValue;
  }
  function startTransition(fiber, queue, pendingState, finishedState, callback) {
    var previousPriority = ReactDOMSharedInternals.p;
    ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, false, queue, pendingState);
    try {
      var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
        var thenableForFinishedState = chainThenableValue(
          returnValue,
          finishedState
        );
        dispatchSetStateInternal(
          fiber,
          queue,
          thenableForFinishedState,
          requestUpdateLane(fiber)
        );
      } else
        dispatchSetStateInternal(
          fiber,
          queue,
          finishedState,
          requestUpdateLane(fiber)
        );
    } catch (error) {
      dispatchSetStateInternal(
        fiber,
        queue,
        { then: function() {
        }, status: "rejected", reason: error },
        requestUpdateLane()
      );
    } finally {
      ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  }
  function noop() {
  }
  function startHostTransition(formFiber, pendingState, action, formData) {
    if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
    var queue = ensureFormComponentIsStateful(formFiber).queue;
    startTransition(
      formFiber,
      queue,
      pendingState,
      sharedNotPendingObject,
      null === action ? noop : function() {
        requestFormReset$1(formFiber);
        return action(formData);
      }
    );
  }
  function ensureFormComponentIsStateful(formFiber) {
    var existingStateHook = formFiber.memoizedState;
    if (null !== existingStateHook) return existingStateHook;
    existingStateHook = {
      memoizedState: sharedNotPendingObject,
      baseState: sharedNotPendingObject,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: sharedNotPendingObject
      },
      next: null
    };
    var initialResetState = {};
    existingStateHook.next = {
      memoizedState: initialResetState,
      baseState: initialResetState,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialResetState
      },
      next: null
    };
    formFiber.memoizedState = existingStateHook;
    formFiber = formFiber.alternate;
    null !== formFiber && (formFiber.memoizedState = existingStateHook);
    return existingStateHook;
  }
  function requestFormReset$1(formFiber) {
    var stateHook = ensureFormComponentIsStateful(formFiber);
    null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
    dispatchSetStateInternal(
      formFiber,
      stateHook.next.queue,
      {},
      requestUpdateLane()
    );
  }
  function useHostTransitionStatus() {
    return readContext(HostTransitionContext);
  }
  function updateId() {
    return updateWorkInProgressHook().memoizedState;
  }
  function updateRefresh() {
    return updateWorkInProgressHook().memoizedState;
  }
  function refreshCache(fiber) {
    for (var provider = fiber.return; null !== provider; ) {
      switch (provider.tag) {
        case 24:
        case 3:
          var lane = requestUpdateLane();
          fiber = createUpdate(lane);
          var root$69 = enqueueUpdate(provider, fiber, lane);
          null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
          provider = { cache: createCache() };
          fiber.payload = provider;
          return;
      }
      provider = provider.return;
    }
  }
  function dispatchReducerAction(fiber, queue, action) {
    var lane = requestUpdateLane();
    action = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
  }
  function dispatchSetState(fiber, queue, action) {
    var lane = requestUpdateLane();
    dispatchSetStateInternal(fiber, queue, action, lane);
  }
  function dispatchSetStateInternal(fiber, queue, action, lane) {
    var update = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
    else {
      var alternate = fiber.alternate;
      if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
        try {
          var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (objectIs(eagerState, currentState))
            return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
        } catch (error) {
        } finally {
        }
      action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
      if (null !== action)
        return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
    }
    return false;
  }
  function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
    action = {
      lane: 2,
      revertLane: requestTransitionLane(),
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber)) {
      if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
    } else
      throwIfDuringRender = enqueueConcurrentHookUpdate(
        fiber,
        queue,
        action,
        2
      ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
  }
  function isRenderPhaseUpdate(fiber) {
    var alternate = fiber.alternate;
    return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
  }
  function enqueueRenderPhaseUpdate(queue, update) {
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
    var pending = queue.pending;
    null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
    queue.pending = update;
  }
  function entangleTransitionUpdate(root2, queue, lane) {
    if (0 !== (lane & 4194048)) {
      var queueLanes = queue.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      queue.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  var ContextOnlyDispatcher = {
    readContext,
    use,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useInsertionEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useDeferredValue: throwInvalidHookError,
    useTransition: throwInvalidHookError,
    useSyncExternalStore: throwInvalidHookError,
    useId: throwInvalidHookError,
    useHostTransitionStatus: throwInvalidHookError,
    useFormState: throwInvalidHookError,
    useActionState: throwInvalidHookError,
    useOptimistic: throwInvalidHookError,
    useMemoCache: throwInvalidHookError,
    useCacheRefresh: throwInvalidHookError
  };
  ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
  var HooksDispatcherOnMount = {
    readContext,
    use,
    useCallback: function(callback, deps) {
      mountWorkInProgressHook().memoizedState = [
        callback,
        void 0 === deps ? null : deps
      ];
      return callback;
    },
    useContext: readContext,
    useEffect: mountEffect,
    useImperativeHandle: function(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      mountEffectImpl(
        4194308,
        4,
        imperativeHandleEffect.bind(null, create, ref),
        deps
      );
    },
    useLayoutEffect: function(create, deps) {
      return mountEffectImpl(4194308, 4, create, deps);
    },
    useInsertionEffect: function(create, deps) {
      mountEffectImpl(4, 2, create, deps);
    },
    useMemo: function(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var nextValue = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
      hook.memoizedState = [nextValue, deps];
      return nextValue;
    },
    useReducer: function(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      if (void 0 !== init) {
        var initialState = init(initialArg);
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            init(initialArg);
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
      } else initialState = initialArg;
      hook.memoizedState = hook.baseState = initialState;
      reducer = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState
      };
      hook.queue = reducer;
      reducer = reducer.dispatch = dispatchReducerAction.bind(
        null,
        currentlyRenderingFiber,
        reducer
      );
      return [hook.memoizedState, reducer];
    },
    useRef: function(initialValue) {
      var hook = mountWorkInProgressHook();
      initialValue = { current: initialValue };
      return hook.memoizedState = initialValue;
    },
    useState: function(initialState) {
      initialState = mountStateImpl(initialState);
      var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
      queue.dispatch = dispatch;
      return [initialState.memoizedState, dispatch];
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = mountWorkInProgressHook();
      return mountDeferredValueImpl(hook, value, initialValue);
    },
    useTransition: function() {
      var stateHook = mountStateImpl(false);
      stateHook = startTransition.bind(
        null,
        currentlyRenderingFiber,
        stateHook.queue,
        true,
        false
      );
      mountWorkInProgressHook().memoizedState = stateHook;
      return [false, stateHook];
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
      if (isHydrating) {
        if (void 0 === getServerSnapshot)
          throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
      } else {
        getServerSnapshot = getSnapshot();
        if (null === workInProgressRoot)
          throw Error(formatProdErrorMessage(349));
        0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      hook.memoizedState = getServerSnapshot;
      var inst = { value: getServerSnapshot, getSnapshot };
      hook.queue = inst;
      mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
        subscribe
      ]);
      fiber.flags |= 2048;
      pushSimpleEffect(
        9,
        { destroy: void 0 },
        updateStoreInstance.bind(
          null,
          fiber,
          inst,
          getServerSnapshot,
          getSnapshot
        ),
        null
      );
      return getServerSnapshot;
    },
    useId: function() {
      var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
      if (isHydrating) {
        var JSCompiler_inline_result = treeContextOverflow;
        var idWithLeadingBit = treeContextId;
        JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
        identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
        JSCompiler_inline_result = localIdCounter++;
        0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
        identifierPrefix += "_";
      } else
        JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
      return hook.memoizedState = identifierPrefix;
    },
    useHostTransitionStatus,
    useFormState: mountActionState,
    useActionState: mountActionState,
    useOptimistic: function(passthrough) {
      var hook = mountWorkInProgressHook();
      hook.memoizedState = hook.baseState = passthrough;
      var queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      hook.queue = queue;
      hook = dispatchOptimisticSetState.bind(
        null,
        currentlyRenderingFiber,
        true,
        queue
      );
      queue.dispatch = hook;
      return [passthrough, hook];
    },
    useMemoCache,
    useCacheRefresh: function() {
      return mountWorkInProgressHook().memoizedState = refreshCache.bind(
        null,
        currentlyRenderingFiber
      );
    },
    useEffectEvent: function(callback) {
      var hook = mountWorkInProgressHook(), ref = { impl: callback };
      hook.memoizedState = ref;
      return function() {
        if (0 !== (executionContext & 2))
          throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
      };
    }
  }, HooksDispatcherOnUpdate = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: updateReducer,
    useRef: updateRef,
    useState: function() {
      return updateReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return updateDeferredValueImpl(
        hook,
        currentHook.memoizedState,
        value,
        initialValue
      );
    },
    useTransition: function() {
      var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: updateActionState,
    useActionState: updateActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    },
    useMemoCache,
    useCacheRefresh: updateRefresh
  };
  HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
  var HooksDispatcherOnRerender = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: rerenderReducer,
    useRef: updateRef,
    useState: function() {
      return rerenderReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
        hook,
        currentHook.memoizedState,
        value,
        initialValue
      );
    },
    useTransition: function() {
      var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: rerenderActionState,
    useActionState: rerenderActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      if (null !== currentHook)
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      hook.baseState = passthrough;
      return [passthrough, hook.queue.dispatch];
    },
    useMemoCache,
    useCacheRefresh: updateRefresh
  };
  HooksDispatcherOnRerender.useEffectEvent = updateEvent;
  function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
    ctor = workInProgress2.memoizedState;
    getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
    getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
    workInProgress2.memoizedState = getDerivedStateFromProps;
    0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
  }
  var classComponentUpdater = {
    enqueueSetState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueReplaceState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 1;
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueForceUpdate: function(inst, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 2;
      void 0 !== callback && null !== callback && (update.callback = callback);
      callback = enqueueUpdate(inst, update, lane);
      null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
    }
  };
  function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
    workInProgress2 = workInProgress2.stateNode;
    return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
  }
  function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
    workInProgress2 = instance.state;
    "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
    "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
    instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
  function resolveClassComponentProps(Component, baseProps) {
    var newProps = baseProps;
    if ("ref" in baseProps) {
      newProps = {};
      for (var propName in baseProps)
        "ref" !== propName && (newProps[propName] = baseProps[propName]);
    }
    if (Component = Component.defaultProps) {
      newProps === baseProps && (newProps = assign({}, newProps));
      for (var propName$73 in Component)
        void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
    }
    return newProps;
  }
  function defaultOnUncaughtError(error) {
    reportGlobalError(error);
  }
  function defaultOnCaughtError(error) {
    console.error(error);
  }
  function defaultOnRecoverableError(error) {
    reportGlobalError(error);
  }
  function logUncaughtError(root2, errorInfo) {
    try {
      var onUncaughtError = root2.onUncaughtError;
      onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
    } catch (e$74) {
      setTimeout(function() {
        throw e$74;
      });
    }
  }
  function logCaughtError(root2, boundary, errorInfo) {
    try {
      var onCaughtError = root2.onCaughtError;
      onCaughtError(errorInfo.value, {
        componentStack: errorInfo.stack,
        errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
      });
    } catch (e$75) {
      setTimeout(function() {
        throw e$75;
      });
    }
  }
  function createRootErrorUpdate(root2, errorInfo, lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    lane.payload = { element: null };
    lane.callback = function() {
      logUncaughtError(root2, errorInfo);
    };
    return lane;
  }
  function createClassErrorUpdate(lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    return lane;
  }
  function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
    if ("function" === typeof getDerivedStateFromError) {
      var error = errorInfo.value;
      update.payload = function() {
        return getDerivedStateFromError(error);
      };
      update.callback = function() {
        logCaughtError(root2, fiber, errorInfo);
      };
    }
    var inst = fiber.stateNode;
    null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
      logCaughtError(root2, fiber, errorInfo);
      "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
      var stack = errorInfo.stack;
      this.componentDidCatch(errorInfo.value, {
        componentStack: null !== stack ? stack : ""
      });
    });
  }
  function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
    sourceFiber.flags |= 32768;
    if (null !== value && "object" === typeof value && "function" === typeof value.then) {
      returnFiber = sourceFiber.alternate;
      null !== returnFiber && propagateParentContextChanges(
        returnFiber,
        sourceFiber,
        rootRenderLanes,
        true
      );
      sourceFiber = suspenseHandlerStackCursor.current;
      if (null !== sourceFiber) {
        switch (sourceFiber.tag) {
          case 31:
          case 13:
            return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
          case 22:
            return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([value])
            }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
        }
        throw Error(formatProdErrorMessage(435, sourceFiber.tag));
      }
      attachPingListener(root2, value, rootRenderLanes);
      renderDidSuspendDelayIfPossible();
      return false;
    }
    if (isHydrating)
      return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
        cause: value
      }), queueHydrationError(
        createCapturedValueAtFiber(returnFiber, sourceFiber)
      )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
        root2.stateNode,
        value,
        rootRenderLanes
      ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
    var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
    wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
    null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
    4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
    if (null === returnFiber) return true;
    value = createCapturedValueAtFiber(value, sourceFiber);
    sourceFiber = returnFiber;
    do {
      switch (sourceFiber.tag) {
        case 3:
          return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
        case 1:
          if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
            return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
              rootRenderLanes,
              root2,
              sourceFiber,
              value
            ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
      }
      sourceFiber = sourceFiber.return;
    } while (null !== sourceFiber);
    return false;
  }
  var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
  function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
    workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
      workInProgress2,
      current.child,
      nextChildren,
      renderLanes2
    );
  }
  function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
    Component = Component.render;
    var ref = workInProgress2.ref;
    if ("ref" in nextProps) {
      var propsWithoutRef = {};
      for (var key in nextProps)
        "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
    } else propsWithoutRef = nextProps;
    prepareToReadContext(workInProgress2);
    nextProps = renderWithHooks(
      current,
      workInProgress2,
      Component,
      propsWithoutRef,
      ref,
      renderLanes2
    );
    key = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && key && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null === current) {
      var type = Component.type;
      if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
        return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
          current,
          workInProgress2,
          type,
          nextProps,
          renderLanes2
        );
      current = createFiberFromTypeAndProps(
        Component.type,
        null,
        nextProps,
        workInProgress2,
        workInProgress2.mode,
        renderLanes2
      );
      current.ref = workInProgress2.ref;
      current.return = workInProgress2;
      return workInProgress2.child = current;
    }
    type = current.child;
    if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
      var prevProps = type.memoizedProps;
      Component = Component.compare;
      Component = null !== Component ? Component : shallowEqual;
      if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
        return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    workInProgress2.flags |= 1;
    current = createWorkInProgress(type, nextProps);
    current.ref = workInProgress2.ref;
    current.return = workInProgress2;
    return workInProgress2.child = current;
  }
  function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null !== current) {
      var prevProps = current.memoizedProps;
      if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
        if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
          0 !== (current.flags & 131072) && (didReceiveUpdate = true);
        else
          return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    return updateFunctionComponent(
      current,
      workInProgress2,
      Component,
      nextProps,
      renderLanes2
    );
  }
  function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
    var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
    null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    if ("hidden" === nextProps.mode) {
      if (0 !== (workInProgress2.flags & 128)) {
        prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
        if (null !== current) {
          nextProps = workInProgress2.child = current.child;
          for (nextChildren = 0; null !== nextProps; )
            nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
          nextProps = nextChildren & ~prevState;
        } else nextProps = 0, workInProgress2.child = null;
        return deferHiddenOffscreenComponent(
          current,
          workInProgress2,
          prevState,
          renderLanes2,
          nextProps
        );
      }
      if (0 !== (renderLanes2 & 536870912))
        workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
          workInProgress2,
          null !== prevState ? prevState.cachePool : null
        ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
      else
        return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
          current,
          workInProgress2,
          null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
          renderLanes2,
          nextProps
        );
    } else
      null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  function bailoutOffscreenComponent(current, workInProgress2) {
    null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    return workInProgress2.sibling;
  }
  function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
    var JSCompiler_inline_result = peekCacheFromPool();
    JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
    workInProgress2.memoizedState = {
      baseLanes: nextBaseLanes,
      cachePool: JSCompiler_inline_result
    };
    null !== current && pushTransition(workInProgress2, null);
    reuseHiddenContextOnStack();
    pushOffscreenSuspenseHandler(workInProgress2);
    null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
    workInProgress2.childLanes = remainingChildLanes;
    return null;
  }
  function mountActivityChildren(workInProgress2, nextProps) {
    nextProps = mountWorkInProgressOffscreenFiber(
      { mode: nextProps.mode, children: nextProps.children },
      workInProgress2.mode
    );
    nextProps.ref = workInProgress2.ref;
    workInProgress2.child = nextProps;
    nextProps.return = workInProgress2;
    return nextProps;
  }
  function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
    current.flags |= 2;
    popSuspenseHandler(workInProgress2);
    workInProgress2.memoizedState = null;
    return current;
  }
  function updateActivityComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
    workInProgress2.flags &= -129;
    if (null === current) {
      if (isHydrating) {
        if ("hidden" === nextProps.mode)
          return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
        pushDehydratedActivitySuspenseHandler(workInProgress2);
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
          current,
          rootOrSingletonContext
        ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current) throw throwOnHydrationMismatch(workInProgress2);
        workInProgress2.lanes = 536870912;
        return null;
      }
      return mountActivityChildren(workInProgress2, nextProps);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
      var dehydrated = prevState.dehydrated;
      pushDehydratedActivitySuspenseHandler(workInProgress2);
      if (didSuspend)
        if (workInProgress2.flags & 256)
          workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        else if (null !== workInProgress2.memoizedState)
          workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
        else throw Error(formatProdErrorMessage(558));
      else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
        nextProps = workInProgressRoot;
        if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
          throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
        renderDidSuspendDelayIfPossible();
        workInProgress2 = retryActivityComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else
        current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
      return workInProgress2;
    }
    current = createWorkInProgress(current.child, {
      mode: nextProps.mode,
      children: nextProps.children
    });
    current.ref = workInProgress2.ref;
    workInProgress2.child = current;
    current.return = workInProgress2;
    return current;
  }
  function markRef(current, workInProgress2) {
    var ref = workInProgress2.ref;
    if (null === ref)
      null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
    else {
      if ("function" !== typeof ref && "object" !== typeof ref)
        throw Error(formatProdErrorMessage(284));
      if (null === current || current.ref !== ref)
        workInProgress2.flags |= 4194816;
    }
  }
  function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    Component = renderWithHooks(
      current,
      workInProgress2,
      Component,
      nextProps,
      void 0,
      renderLanes2
    );
    nextProps = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, Component, renderLanes2);
    return workInProgress2.child;
  }
  function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
    prepareToReadContext(workInProgress2);
    workInProgress2.updateQueue = null;
    nextProps = renderWithHooksAgain(
      workInProgress2,
      Component,
      nextProps,
      secondArg
    );
    finishRenderingHooks(current);
    Component = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && Component && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    if (null === workInProgress2.stateNode) {
      var context = emptyContextObject, contextType = Component.contextType;
      "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
      context = new Component(nextProps, context);
      workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
      context.updater = classComponentUpdater;
      workInProgress2.stateNode = context;
      context._reactInternals = workInProgress2;
      context = workInProgress2.stateNode;
      context.props = nextProps;
      context.state = workInProgress2.memoizedState;
      context.refs = {};
      initializeUpdateQueue(workInProgress2);
      contextType = Component.contextType;
      context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
      context.state = workInProgress2.memoizedState;
      contextType = Component.getDerivedStateFromProps;
      "function" === typeof contextType && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        contextType,
        nextProps
      ), context.state = workInProgress2.memoizedState);
      "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
      "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
      nextProps = true;
    } else if (null === current) {
      context = workInProgress2.stateNode;
      var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
      context.props = oldProps;
      var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
      contextType = emptyContextObject;
      "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
      var getDerivedStateFromProps = Component.getDerivedStateFromProps;
      contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
      unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
      contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
        workInProgress2,
        context,
        nextProps,
        contextType
      );
      hasForceUpdate = false;
      var oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      oldContext = workInProgress2.memoizedState;
      unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        getDerivedStateFromProps,
        nextProps
      ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
        workInProgress2,
        Component,
        oldProps,
        nextProps,
        oldState,
        oldContext,
        contextType
      )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
    } else {
      context = workInProgress2.stateNode;
      cloneUpdateQueue(current, workInProgress2);
      contextType = workInProgress2.memoizedProps;
      contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
      context.props = contextType$jscomp$0;
      getDerivedStateFromProps = workInProgress2.pendingProps;
      oldState = context.context;
      oldContext = Component.contextType;
      oldProps = emptyContextObject;
      "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
      unresolvedOldProps = Component.getDerivedStateFromProps;
      (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
        workInProgress2,
        context,
        nextProps,
        oldProps
      );
      hasForceUpdate = false;
      oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      var newState = workInProgress2.memoizedState;
      contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        unresolvedOldProps,
        nextProps
      ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
        workInProgress2,
        Component,
        contextType$jscomp$0,
        nextProps,
        oldState,
        newState,
        oldProps
      ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
        nextProps,
        newState,
        oldProps
      )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
    }
    context = nextProps;
    markRef(current, workInProgress2);
    nextProps = 0 !== (workInProgress2.flags & 128);
    context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
      workInProgress2,
      current.child,
      null,
      renderLanes2
    ), workInProgress2.child = reconcileChildFibers(
      workInProgress2,
      null,
      Component,
      renderLanes2
    )) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
      current,
      workInProgress2,
      renderLanes2
    );
    return current;
  }
  function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
    resetHydrationState();
    workInProgress2.flags |= 256;
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  var SUSPENDED_MARKER = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mountSuspenseOffscreenState(renderLanes2) {
    return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
  }
  function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
    current = null !== current ? current.childLanes & ~renderLanes2 : 0;
    primaryTreeDidDefer && (current |= workInProgressDeferredLane);
    return current;
  }
  function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
    (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
    JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
    JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
    workInProgress2.flags &= -33;
    if (null === current) {
      if (isHydrating) {
        showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack();
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
          current,
          rootOrSingletonContext
        ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current) throw throwOnHydrationMismatch(workInProgress2);
        isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
        return null;
      }
      var nextPrimaryChildren = nextProps.children;
      nextProps = nextProps.fallback;
      if (showFallback)
        return reuseSuspenseHandlerOnStack(), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
          { mode: "hidden", children: nextPrimaryChildren },
          showFallback
        ), nextProps = createFiberFromFragment(
          nextProps,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
    }
    var prevState = current.memoizedState;
    if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
      if (didSuspend)
        workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
          { mode: "visible", children: nextProps.children },
          showFallback
        ), nextPrimaryChildren = createFiberFromFragment(
          nextPrimaryChildren,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
          workInProgress2,
          current.child,
          null,
          renderLanes2
        ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
      else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
        JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
        if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
        JSCompiler_temp = digest;
        nextProps = Error(formatProdErrorMessage(419));
        nextProps.stack = "";
        nextProps.digest = JSCompiler_temp;
        queueHydrationError({ value: nextProps, source: null, stack: null });
        workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
        JSCompiler_temp = workInProgressRoot;
        if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
          throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
        isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
        workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else
        isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
          nextPrimaryChildren.nextSibling
        ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
          workInProgress2,
          nextProps.children
        ), workInProgress2.flags |= 4096);
      return workInProgress2;
    }
    if (showFallback)
      return reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
        mode: "hidden",
        children: nextProps.children
      }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
        digest,
        nextPrimaryChildren
      ) : (nextPrimaryChildren = createFiberFromFragment(
        nextPrimaryChildren,
        showFallback,
        renderLanes2,
        null
      ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
        baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
        cachePool: showFallback
      }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
        current,
        JSCompiler_temp,
        renderLanes2
      ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
    pushPrimaryTreeSuspenseHandler(workInProgress2);
    renderLanes2 = current.child;
    current = renderLanes2.sibling;
    renderLanes2 = createWorkInProgress(renderLanes2, {
      mode: "visible",
      children: nextProps.children
    });
    renderLanes2.return = workInProgress2;
    renderLanes2.sibling = null;
    null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
    workInProgress2.child = renderLanes2;
    workInProgress2.memoizedState = null;
    return renderLanes2;
  }
  function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
    primaryChildren = mountWorkInProgressOffscreenFiber(
      { mode: "visible", children: primaryChildren },
      workInProgress2.mode
    );
    primaryChildren.return = workInProgress2;
    return workInProgress2.child = primaryChildren;
  }
  function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
    offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
    offscreenProps.lanes = 0;
    return offscreenProps;
  }
  function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountSuspensePrimaryChildren(
      workInProgress2,
      workInProgress2.pendingProps.children
    );
    current.flags |= 2;
    workInProgress2.memoizedState = null;
    return current;
  }
  function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
    fiber.lanes |= renderLanes2;
    var alternate = fiber.alternate;
    null !== alternate && (alternate.lanes |= renderLanes2);
    scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
  }
  function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
    var renderState = workInProgress2.memoizedState;
    null === renderState ? workInProgress2.memoizedState = {
      isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail,
      tailMode,
      treeForkCount: treeForkCount2
    } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
  }
  function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
    nextProps = nextProps.children;
    var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
    shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
    push(suspenseStackCursor, suspenseContext);
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    nextProps = isHydrating ? treeForkCount : 0;
    if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
      a: for (current = workInProgress2.child; null !== current; ) {
        if (13 === current.tag)
          null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (19 === current.tag)
          scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (null !== current.child) {
          current.child.return = current;
          current = current.child;
          continue;
        }
        if (current === workInProgress2) break a;
        for (; null === current.sibling; ) {
          if (null === current.return || current.return === workInProgress2)
            break a;
          current = current.return;
        }
        current.sibling.return = current.return;
        current = current.sibling;
      }
    switch (revealOrder) {
      case "forwards":
        renderLanes2 = workInProgress2.child;
        for (revealOrder = null; null !== renderLanes2; )
          current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
        renderLanes2 = revealOrder;
        null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
        initSuspenseListRenderState(
          workInProgress2,
          false,
          revealOrder,
          renderLanes2,
          tailMode,
          nextProps
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        renderLanes2 = null;
        revealOrder = workInProgress2.child;
        for (workInProgress2.child = null; null !== revealOrder; ) {
          current = revealOrder.alternate;
          if (null !== current && null === findFirstSuspended(current)) {
            workInProgress2.child = revealOrder;
            break;
          }
          current = revealOrder.sibling;
          revealOrder.sibling = renderLanes2;
          renderLanes2 = revealOrder;
          revealOrder = current;
        }
        initSuspenseListRenderState(
          workInProgress2,
          true,
          renderLanes2,
          null,
          tailMode,
          nextProps
        );
        break;
      case "together":
        initSuspenseListRenderState(
          workInProgress2,
          false,
          null,
          null,
          void 0,
          nextProps
        );
        break;
      default:
        workInProgress2.memoizedState = null;
    }
    return workInProgress2.child;
  }
  function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
    null !== current && (workInProgress2.dependencies = current.dependencies);
    workInProgressRootSkippedLanes |= workInProgress2.lanes;
    if (0 === (renderLanes2 & workInProgress2.childLanes))
      if (null !== current) {
        if (propagateParentContextChanges(
          current,
          workInProgress2,
          renderLanes2,
          false
        ), 0 === (renderLanes2 & workInProgress2.childLanes))
          return null;
      } else return null;
    if (null !== current && workInProgress2.child !== current.child)
      throw Error(formatProdErrorMessage(153));
    if (null !== workInProgress2.child) {
      current = workInProgress2.child;
      renderLanes2 = createWorkInProgress(current, current.pendingProps);
      workInProgress2.child = renderLanes2;
      for (renderLanes2.return = workInProgress2; null !== current.sibling; )
        current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
      renderLanes2.sibling = null;
    }
    return workInProgress2.child;
  }
  function checkScheduledUpdateOrContext(current, renderLanes2) {
    if (0 !== (current.lanes & renderLanes2)) return true;
    current = current.dependencies;
    return null !== current && checkIfContextChanged(current) ? true : false;
  }
  function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
    switch (workInProgress2.tag) {
      case 3:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
        resetHydrationState();
        break;
      case 27:
      case 5:
        pushHostContext(workInProgress2);
        break;
      case 4:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        break;
      case 10:
        pushProvider(
          workInProgress2,
          workInProgress2.type,
          workInProgress2.memoizedProps.value
        );
        break;
      case 31:
        if (null !== workInProgress2.memoizedState)
          return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
        break;
      case 13:
        var state$102 = workInProgress2.memoizedState;
        if (null !== state$102) {
          if (null !== state$102.dehydrated)
            return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
          if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
            return updateSuspenseComponent(current, workInProgress2, renderLanes2);
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          current = bailoutOnAlreadyFinishedWork(
            current,
            workInProgress2,
            renderLanes2
          );
          return null !== current ? current.sibling : null;
        }
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        break;
      case 19:
        var didSuspendBefore = 0 !== (current.flags & 128);
        state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
        state$102 || (propagateParentContextChanges(
          current,
          workInProgress2,
          renderLanes2,
          false
        ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
        if (didSuspendBefore) {
          if (state$102)
            return updateSuspenseListComponent(
              current,
              workInProgress2,
              renderLanes2
            );
          workInProgress2.flags |= 128;
        }
        didSuspendBefore = workInProgress2.memoizedState;
        null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
        push(suspenseStackCursor, suspenseStackCursor.current);
        if (state$102) break;
        else return null;
      case 22:
        return workInProgress2.lanes = 0, updateOffscreenComponent(
          current,
          workInProgress2,
          renderLanes2,
          workInProgress2.pendingProps
        );
      case 24:
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  function beginWork(current, workInProgress2, renderLanes2) {
    if (null !== current)
      if (current.memoizedProps !== workInProgress2.pendingProps)
        didReceiveUpdate = true;
      else {
        if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
          return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
            current,
            workInProgress2,
            renderLanes2
          );
        didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
      }
    else
      didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
    workInProgress2.lanes = 0;
    switch (workInProgress2.tag) {
      case 16:
        a: {
          var props = workInProgress2.pendingProps;
          current = resolveLazy(workInProgress2.elementType);
          workInProgress2.type = current;
          if ("function" === typeof current)
            shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
              null,
              workInProgress2,
              current,
              props,
              renderLanes2
            )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
              null,
              workInProgress2,
              current,
              props,
              renderLanes2
            ));
          else {
            if (void 0 !== current && null !== current) {
              var $$typeof = current.$$typeof;
              if ($$typeof === REACT_FORWARD_REF_TYPE) {
                workInProgress2.tag = 11;
                workInProgress2 = updateForwardRef(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                );
                break a;
              } else if ($$typeof === REACT_MEMO_TYPE) {
                workInProgress2.tag = 14;
                workInProgress2 = updateMemoComponent(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                );
                break a;
              }
            }
            workInProgress2 = getComponentNameFromType(current) || current;
            throw Error(formatProdErrorMessage(306, workInProgress2, ""));
          }
        }
        return workInProgress2;
      case 0:
        return updateFunctionComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 1:
        return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
          props,
          workInProgress2.pendingProps
        ), updateClassComponent(
          current,
          workInProgress2,
          props,
          $$typeof,
          renderLanes2
        );
      case 3:
        a: {
          pushHostContainer(
            workInProgress2,
            workInProgress2.stateNode.containerInfo
          );
          if (null === current) throw Error(formatProdErrorMessage(387));
          props = workInProgress2.pendingProps;
          var prevState = workInProgress2.memoizedState;
          $$typeof = prevState.element;
          cloneUpdateQueue(current, workInProgress2);
          processUpdateQueue(workInProgress2, props, null, renderLanes2);
          var nextState = workInProgress2.memoizedState;
          props = nextState.cache;
          pushProvider(workInProgress2, CacheContext, props);
          props !== prevState.cache && propagateContextChanges(
            workInProgress2,
            [CacheContext],
            renderLanes2,
            true
          );
          suspendIfUpdateReadFromEntangledAsyncAction();
          props = nextState.element;
          if (prevState.isDehydrated)
            if (prevState = {
              element: props,
              isDehydrated: false,
              cache: nextState.cache
            }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
              workInProgress2 = mountHostRootWithoutHydrating(
                current,
                workInProgress2,
                props,
                renderLanes2
              );
              break a;
            } else if (props !== $$typeof) {
              $$typeof = createCapturedValueAtFiber(
                Error(formatProdErrorMessage(424)),
                workInProgress2
              );
              queueHydrationError($$typeof);
              workInProgress2 = mountHostRootWithoutHydrating(
                current,
                workInProgress2,
                props,
                renderLanes2
              );
              break a;
            } else {
              current = workInProgress2.stateNode.containerInfo;
              switch (current.nodeType) {
                case 9:
                  current = current.body;
                  break;
                default:
                  current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
              }
              nextHydratableInstance = getNextHydratable(current.firstChild);
              hydrationParentFiber = workInProgress2;
              isHydrating = true;
              hydrationErrors = null;
              rootOrSingletonContext = true;
              renderLanes2 = mountChildFibers(
                workInProgress2,
                null,
                props,
                renderLanes2
              );
              for (workInProgress2.child = renderLanes2; renderLanes2; )
                renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
            }
          else {
            resetHydrationState();
            if (props === $$typeof) {
              workInProgress2 = bailoutOnAlreadyFinishedWork(
                current,
                workInProgress2,
                renderLanes2
              );
              break a;
            }
            reconcileChildren(current, workInProgress2, props, renderLanes2);
          }
          workInProgress2 = workInProgress2.child;
        }
        return workInProgress2;
      case 26:
        return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
          workInProgress2.type,
          null,
          workInProgress2.pendingProps,
          null
        )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
          rootInstanceStackCursor.current
        ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
          workInProgress2.type,
          current.memoizedProps,
          workInProgress2.pendingProps,
          current.memoizedState
        ), null;
      case 27:
        return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
          workInProgress2.type,
          workInProgress2.pendingProps,
          rootInstanceStackCursor.current
        ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
      case 5:
        if (null === current && isHydrating) {
          if ($$typeof = props = nextHydratableInstance)
            props = canHydrateInstance(
              props,
              workInProgress2.type,
              workInProgress2.pendingProps,
              rootOrSingletonContext
            ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
          $$typeof || throwOnHydrationMismatch(workInProgress2);
        }
        pushHostContext(workInProgress2);
        $$typeof = workInProgress2.type;
        prevState = workInProgress2.pendingProps;
        nextState = null !== current ? current.memoizedProps : null;
        props = prevState.children;
        shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
        null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
          current,
          workInProgress2,
          TransitionAwareHostComponent,
          null,
          null,
          renderLanes2
        ), HostTransitionContext._currentValue = $$typeof);
        markRef(current, workInProgress2);
        reconcileChildren(current, workInProgress2, props, renderLanes2);
        return workInProgress2.child;
      case 6:
        if (null === current && isHydrating) {
          if (current = renderLanes2 = nextHydratableInstance)
            renderLanes2 = canHydrateTextInstance(
              renderLanes2,
              workInProgress2.pendingProps,
              rootOrSingletonContext
            ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
          current || throwOnHydrationMismatch(workInProgress2);
        }
        return null;
      case 13:
        return updateSuspenseComponent(current, workInProgress2, renderLanes2);
      case 4:
        return pushHostContainer(
          workInProgress2,
          workInProgress2.stateNode.containerInfo
        ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
          workInProgress2,
          null,
          props,
          renderLanes2
        ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 11:
        return updateForwardRef(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 7:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps,
          renderLanes2
        ), workInProgress2.child;
      case 8:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 12:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 10:
        return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
      case 9:
        return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 14:
        return updateMemoComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 15:
        return updateSimpleMemoComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 19:
        return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
      case 31:
        return updateActivityComponent(current, workInProgress2, renderLanes2);
      case 22:
        return updateOffscreenComponent(
          current,
          workInProgress2,
          renderLanes2,
          workInProgress2.pendingProps
        );
      case 24:
        return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
          workInProgress2,
          [CacheContext],
          renderLanes2,
          true
        ))), reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 29:
        throw workInProgress2.pendingProps;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function markUpdate(workInProgress2) {
    workInProgress2.flags |= 4;
  }
  function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
    if (type = 0 !== (workInProgress2.mode & 32)) type = false;
    if (type) {
      if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
        if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
        else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
        else
          throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    } else workInProgress2.flags &= -16777217;
  }
  function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
    if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
      workInProgress2.flags &= -16777217;
    else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
      if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
      else
        throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
  }
  function scheduleRetryEffect(workInProgress2, retryQueue) {
    null !== retryQueue && (workInProgress2.flags |= 4);
    workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
  }
  function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
    if (!isHydrating)
      switch (renderState.tailMode) {
        case "hidden":
          hasRenderedATailFallback = renderState.tail;
          for (var lastTailNode = null; null !== hasRenderedATailFallback; )
            null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
          null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
          break;
        case "collapsed":
          lastTailNode = renderState.tail;
          for (var lastTailNode$106 = null; null !== lastTailNode; )
            null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
          null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
      }
  }
  function bubbleProperties(completedWork) {
    var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
    if (didBailout)
      for (var child$107 = completedWork.child; null !== child$107; )
        newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
    else
      for (child$107 = completedWork.child; null !== child$107; )
        newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
    completedWork.subtreeFlags |= subtreeFlags;
    completedWork.childLanes = newChildLanes;
    return didBailout;
  }
  function completeWork(current, workInProgress2, renderLanes2) {
    var newProps = workInProgress2.pendingProps;
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return bubbleProperties(workInProgress2), null;
      case 1:
        return bubbleProperties(workInProgress2), null;
      case 3:
        renderLanes2 = workInProgress2.stateNode;
        newProps = null;
        null !== current && (newProps = current.memoizedState.cache);
        workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
        popProvider(CacheContext);
        popHostContainer();
        renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
        if (null === current || null === current.child)
          popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
        bubbleProperties(workInProgress2);
        return null;
      case 26:
        var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
        null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          type,
          null,
          newProps,
          renderLanes2
        ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          type,
          current,
          newProps,
          renderLanes2
        ));
        return null;
      case 27:
        popHostContext(workInProgress2);
        renderLanes2 = rootInstanceStackCursor.current;
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            return null;
          }
          current = contextStackCursor.current;
          popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
        }
        bubbleProperties(workInProgress2);
        return null;
      case 5:
        popHostContext(workInProgress2);
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            return null;
          }
          nextResource = contextStackCursor.current;
          if (popHydrationState(workInProgress2))
            prepareToHydrateHostInstance(workInProgress2);
          else {
            var ownerDocument = getOwnerDocumentFromRootContainer(
              rootInstanceStackCursor.current
            );
            switch (nextResource) {
              case 1:
                nextResource = ownerDocument.createElementNS(
                  "http://www.w3.org/2000/svg",
                  type
                );
                break;
              case 2:
                nextResource = ownerDocument.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  type
                );
                break;
              default:
                switch (type) {
                  case "svg":
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/2000/svg",
                      type
                    );
                    break;
                  case "math":
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      type
                    );
                    break;
                  case "script":
                    nextResource = ownerDocument.createElement("div");
                    nextResource.innerHTML = "<script><\/script>";
                    nextResource = nextResource.removeChild(
                      nextResource.firstChild
                    );
                    break;
                  case "select":
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                      is: newProps.is
                    }) : ownerDocument.createElement("select");
                    newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                    break;
                  default:
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                }
            }
            nextResource[internalInstanceKey] = workInProgress2;
            nextResource[internalPropsKey] = newProps;
            a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
              if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                nextResource.appendChild(ownerDocument.stateNode);
              else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                ownerDocument.child.return = ownerDocument;
                ownerDocument = ownerDocument.child;
                continue;
              }
              if (ownerDocument === workInProgress2) break a;
              for (; null === ownerDocument.sibling; ) {
                if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                  break a;
                ownerDocument = ownerDocument.return;
              }
              ownerDocument.sibling.return = ownerDocument.return;
              ownerDocument = ownerDocument.sibling;
            }
            workInProgress2.stateNode = nextResource;
            a: switch (setInitialProperties(nextResource, type, newProps), type) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                newProps = !!newProps.autoFocus;
                break a;
              case "img":
                newProps = true;
                break a;
              default:
                newProps = false;
            }
            newProps && markUpdate(workInProgress2);
          }
        }
        bubbleProperties(workInProgress2);
        preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          workInProgress2.type,
          null === current ? null : current.memoizedProps,
          workInProgress2.pendingProps,
          renderLanes2
        );
        return null;
      case 6:
        if (current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if ("string" !== typeof newProps && null === workInProgress2.stateNode)
            throw Error(formatProdErrorMessage(166));
          current = rootInstanceStackCursor.current;
          if (popHydrationState(workInProgress2)) {
            current = workInProgress2.stateNode;
            renderLanes2 = workInProgress2.memoizedProps;
            newProps = null;
            type = hydrationParentFiber;
            if (null !== type)
              switch (type.tag) {
                case 27:
                case 5:
                  newProps = type.memoizedProps;
              }
            current[internalInstanceKey] = workInProgress2;
            current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
            current || throwOnHydrationMismatch(workInProgress2, true);
          } else
            current = getOwnerDocumentFromRootContainer(current).createTextNode(
              newProps
            ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
        }
        bubbleProperties(workInProgress2);
        return null;
      case 31:
        renderLanes2 = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState) {
          newProps = popHydrationState(workInProgress2);
          if (null !== renderLanes2) {
            if (null === current) {
              if (!newProps) throw Error(formatProdErrorMessage(318));
              current = workInProgress2.memoizedState;
              current = null !== current ? current.dehydrated : null;
              if (!current) throw Error(formatProdErrorMessage(557));
              current[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            current = false;
          } else
            renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
          if (!current) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
          if (0 !== (workInProgress2.flags & 128))
            throw Error(formatProdErrorMessage(558));
        }
        bubbleProperties(workInProgress2);
        return null;
      case 13:
        newProps = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
          type = popHydrationState(workInProgress2);
          if (null !== newProps && null !== newProps.dehydrated) {
            if (null === current) {
              if (!type) throw Error(formatProdErrorMessage(318));
              type = workInProgress2.memoizedState;
              type = null !== type ? type.dehydrated : null;
              if (!type) throw Error(formatProdErrorMessage(317));
              type[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            type = false;
          } else
            type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
          if (!type) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
        }
        popSuspenseHandler(workInProgress2);
        if (0 !== (workInProgress2.flags & 128))
          return workInProgress2.lanes = renderLanes2, workInProgress2;
        renderLanes2 = null !== newProps;
        current = null !== current && null !== current.memoizedState;
        renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
        renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
        scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
        bubbleProperties(workInProgress2);
        return null;
      case 4:
        return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
      case 10:
        return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
      case 19:
        pop(suspenseStackCursor);
        newProps = workInProgress2.memoizedState;
        if (null === newProps) return bubbleProperties(workInProgress2), null;
        type = 0 !== (workInProgress2.flags & 128);
        nextResource = newProps.rendering;
        if (null === nextResource)
          if (type) cutOffTailIfNeeded(newProps, false);
          else {
            if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
              for (current = workInProgress2.child; null !== current; ) {
                nextResource = findFirstSuspended(current);
                if (null !== nextResource) {
                  workInProgress2.flags |= 128;
                  cutOffTailIfNeeded(newProps, false);
                  current = nextResource.updateQueue;
                  workInProgress2.updateQueue = current;
                  scheduleRetryEffect(workInProgress2, current);
                  workInProgress2.subtreeFlags = 0;
                  current = renderLanes2;
                  for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                    resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                  push(
                    suspenseStackCursor,
                    suspenseStackCursor.current & 1 | 2
                  );
                  isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                  return workInProgress2.child;
                }
                current = current.sibling;
              }
            null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          }
        else {
          if (!type)
            if (current = findFirstSuspended(nextResource), null !== current) {
              if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
                return bubbleProperties(workInProgress2), null;
            } else
              2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
        }
        if (null !== newProps.tail)
          return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
            suspenseStackCursor,
            type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
          ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
        bubbleProperties(workInProgress2);
        return null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
      case 24:
        return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function unwindWork(current, workInProgress2) {
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 1:
        return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 3:
        return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 26:
      case 27:
      case 5:
        return popHostContext(workInProgress2), null;
      case 31:
        if (null !== workInProgress2.memoizedState) {
          popSuspenseHandler(workInProgress2);
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 13:
        popSuspenseHandler(workInProgress2);
        current = workInProgress2.memoizedState;
        if (null !== current && null !== current.dehydrated) {
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 19:
        return pop(suspenseStackCursor), null;
      case 4:
        return popHostContainer(), null;
      case 10:
        return popProvider(workInProgress2.type), null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 24:
        return popProvider(CacheContext), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function unwindInterruptedWork(current, interruptedWork) {
    popTreeContext(interruptedWork);
    switch (interruptedWork.tag) {
      case 3:
        popProvider(CacheContext);
        popHostContainer();
        break;
      case 26:
      case 27:
      case 5:
        popHostContext(interruptedWork);
        break;
      case 4:
        popHostContainer();
        break;
      case 31:
        null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
        break;
      case 13:
        popSuspenseHandler(interruptedWork);
        break;
      case 19:
        pop(suspenseStackCursor);
        break;
      case 10:
        popProvider(interruptedWork.type);
        break;
      case 22:
      case 23:
        popSuspenseHandler(interruptedWork);
        popHiddenContext();
        null !== current && pop(resumedCache);
        break;
      case 24:
        popProvider(CacheContext);
    }
  }
  function commitHookEffectListMount(flags, finishedWork) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            lastEffect = void 0;
            var create = updateQueue.create, inst = updateQueue.inst;
            lastEffect = create();
            inst.destroy = lastEffect;
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            var inst = updateQueue.inst, destroy = inst.destroy;
            if (void 0 !== destroy) {
              inst.destroy = void 0;
              lastEffect = finishedWork;
              var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
              try {
                destroy_();
              } catch (error) {
                captureCommitPhaseError(
                  lastEffect,
                  nearestMountedAncestor,
                  error
                );
              }
            }
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitClassCallbacks(finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    if (null !== updateQueue) {
      var instance = finishedWork.stateNode;
      try {
        commitCallbacks(updateQueue, instance);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
    instance.props = resolveClassComponentProps(
      current.type,
      current.memoizedProps
    );
    instance.state = current.memoizedState;
    try {
      instance.componentWillUnmount();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyAttachRef(current, nearestMountedAncestor) {
    try {
      var ref = current.ref;
      if (null !== ref) {
        switch (current.tag) {
          case 26:
          case 27:
          case 5:
            var instanceToUse = current.stateNode;
            break;
          case 30:
            instanceToUse = current.stateNode;
            break;
          default:
            instanceToUse = current.stateNode;
        }
        "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
      }
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyDetachRef(current, nearestMountedAncestor) {
    var ref = current.ref, refCleanup = current.refCleanup;
    if (null !== ref)
      if ("function" === typeof refCleanup)
        try {
          refCleanup();
        } catch (error) {
          captureCommitPhaseError(current, nearestMountedAncestor, error);
        } finally {
          current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
        }
      else if ("function" === typeof ref)
        try {
          ref(null);
        } catch (error$140) {
          captureCommitPhaseError(current, nearestMountedAncestor, error$140);
        }
      else ref.current = null;
  }
  function commitHostMount(finishedWork) {
    var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
    try {
      a: switch (type) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          props.autoFocus && instance.focus();
          break a;
        case "img":
          props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHostUpdate(finishedWork, newProps, oldProps) {
    try {
      var domElement = finishedWork.stateNode;
      updateProperties(domElement, finishedWork.type, oldProps, newProps);
      domElement[internalPropsKey] = newProps;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function isHostParent(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
  }
  function getHostSibling(fiber) {
    a: for (; ; ) {
      for (; null === fiber.sibling; ) {
        if (null === fiber.return || isHostParent(fiber.return)) return null;
        fiber = fiber.return;
      }
      fiber.sibling.return = fiber.return;
      for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
        if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
        if (fiber.flags & 2) continue a;
        if (null === fiber.child || 4 === fiber.tag) continue a;
        else fiber.child.return = fiber, fiber = fiber.child;
      }
      if (!(fiber.flags & 2)) return fiber.stateNode;
    }
  }
  function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
    else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
      for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
        insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
  }
  function insertOrAppendPlacementNode(node, before, parent) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
    else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
      for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
        insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
  }
  function commitHostSingletonAcquisition(finishedWork) {
    var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
    try {
      for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
        singleton.removeAttributeNode(attributes[0]);
      setInitialProperties(singleton, type, props);
      singleton[internalInstanceKey] = finishedWork;
      singleton[internalPropsKey] = props;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, needsFormReset = false, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null;
  function commitBeforeMutationEffects(root2, firstChild) {
    root2 = root2.containerInfo;
    eventsEnabled = _enabled;
    root2 = getActiveElementDeep(root2);
    if (hasSelectionCapabilities(root2)) {
      if ("selectionStart" in root2)
        var JSCompiler_temp = {
          start: root2.selectionStart,
          end: root2.selectionEnd
        };
      else
        a: {
          JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
          var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
          if (selection && 0 !== selection.rangeCount) {
            JSCompiler_temp = selection.anchorNode;
            var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
            selection = selection.focusOffset;
            try {
              JSCompiler_temp.nodeType, focusNode.nodeType;
            } catch (e$20) {
              JSCompiler_temp = null;
              break a;
            }
            var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
            b: for (; ; ) {
              for (var next; ; ) {
                node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                3 === node.nodeType && (length += node.nodeValue.length);
                if (null === (next = node.firstChild)) break;
                parentNode = node;
                node = next;
              }
              for (; ; ) {
                if (node === root2) break b;
                parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                if (null !== (next = node.nextSibling)) break;
                node = parentNode;
                parentNode = node.parentNode;
              }
              node = next;
            }
            JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
          } else JSCompiler_temp = null;
        }
      JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
    } else JSCompiler_temp = null;
    selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
    _enabled = false;
    for (nextEffect = firstChild; null !== nextEffect; )
      if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
        root2.return = firstChild, nextEffect = root2;
      else
        for (; null !== nextEffect; ) {
          firstChild = nextEffect;
          focusNode = firstChild.alternate;
          root2 = firstChild.flags;
          switch (firstChild.tag) {
            case 0:
              if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
                for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                  anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (0 !== (root2 & 1024) && null !== focusNode) {
                root2 = void 0;
                JSCompiler_temp = firstChild;
                anchorOffset = focusNode.memoizedProps;
                focusNode = focusNode.memoizedState;
                selection = JSCompiler_temp.stateNode;
                try {
                  var resolvedPrevProps = resolveClassComponentProps(
                    JSCompiler_temp.type,
                    anchorOffset
                  );
                  root2 = selection.getSnapshotBeforeUpdate(
                    resolvedPrevProps,
                    focusNode
                  );
                  selection.__reactInternalSnapshotBeforeUpdate = root2;
                } catch (error) {
                  captureCommitPhaseError(
                    JSCompiler_temp,
                    JSCompiler_temp.return,
                    error
                  );
                }
              }
              break;
            case 3:
              if (0 !== (root2 & 1024)) {
                if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                  clearContainerSparingly(root2);
                else if (1 === JSCompiler_temp)
                  switch (root2.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      clearContainerSparingly(root2);
                      break;
                    default:
                      root2.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
          }
          root2 = firstChild.sibling;
          if (null !== root2) {
            root2.return = firstChild.return;
            nextEffect = root2;
            break;
          }
          nextEffect = firstChild.return;
        }
  }
  function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitHookEffectListMount(5, finishedWork);
        break;
      case 1:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 4)
          if (finishedRoot = finishedWork.stateNode, null === current)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          else {
            var prevProps = resolveClassComponentProps(
              finishedWork.type,
              current.memoizedProps
            );
            current = current.memoizedState;
            try {
              finishedRoot.componentDidUpdate(
                prevProps,
                current,
                finishedRoot.__reactInternalSnapshotBeforeUpdate
              );
            } catch (error$139) {
              captureCommitPhaseError(
                finishedWork,
                finishedWork.return,
                error$139
              );
            }
          }
        flags & 64 && commitClassCallbacks(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
          current = null;
          if (null !== finishedWork.child)
            switch (finishedWork.child.tag) {
              case 27:
              case 5:
                current = finishedWork.child.stateNode;
                break;
              case 1:
                current = finishedWork.child.stateNode;
            }
          try {
            commitCallbacks(finishedRoot, current);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 27:
        null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
      case 26:
      case 5:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        null === current && flags & 4 && commitHostMount(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 12:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        break;
      case 31:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
        break;
      case 13:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
          null,
          finishedWork
        ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
        break;
      case 22:
        flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
        if (!flags) {
          current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
          prevProps = offscreenSubtreeIsHidden;
          var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = flags;
          (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            0 !== (finishedWork.subtreeFlags & 8772)
          ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          offscreenSubtreeIsHidden = prevProps;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        }
        break;
      case 30:
        break;
      default:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
    }
  }
  function detachFiberAfterEffects(fiber) {
    var alternate = fiber.alternate;
    null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
    fiber.stateNode = null;
    fiber.return = null;
    fiber.dependencies = null;
    fiber.memoizedProps = null;
    fiber.memoizedState = null;
    fiber.pendingProps = null;
    fiber.stateNode = null;
    fiber.updateQueue = null;
  }
  var hostParent = null, hostParentIsContainer = false;
  function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
    for (parent = parent.child; null !== parent; )
      commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
  }
  function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
    if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
      try {
        injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
      } catch (err) {
      }
    switch (deletedFiber.tag) {
      case 26:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
        break;
      case 27:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
        isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        releaseSingletonInstance(deletedFiber.stateNode);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 5:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
      case 6:
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = null;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        if (null !== hostParent)
          if (hostParentIsContainer)
            try {
              (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
            } catch (error) {
              captureCommitPhaseError(
                deletedFiber,
                nearestMountedAncestor,
                error
              );
            }
          else
            try {
              hostParent.removeChild(deletedFiber.stateNode);
            } catch (error) {
              captureCommitPhaseError(
                deletedFiber,
                nearestMountedAncestor,
                error
              );
            }
        break;
      case 18:
        null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
          9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
          deletedFiber.stateNode
        ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
        break;
      case 4:
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = deletedFiber.stateNode.containerInfo;
        hostParentIsContainer = true;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
        offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 1:
        offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
          deletedFiber,
          nearestMountedAncestor,
          prevHostParent
        ));
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 21:
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 22:
        offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        offscreenSubtreeWasHidden = prevHostParent;
        break;
      default:
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
    }
  }
  function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
      finishedRoot = finishedRoot.dehydrated;
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
  }
  function getRetryCache(finishedWork) {
    switch (finishedWork.tag) {
      case 31:
      case 13:
      case 19:
        var retryCache = finishedWork.stateNode;
        null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
        return retryCache;
      case 22:
        return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
      default:
        throw Error(formatProdErrorMessage(435, finishedWork.tag));
    }
  }
  function attachSuspenseRetryListeners(finishedWork, wakeables) {
    var retryCache = getRetryCache(finishedWork);
    wakeables.forEach(function(wakeable) {
      if (!retryCache.has(wakeable)) {
        retryCache.add(wakeable);
        var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
        wakeable.then(retry, retry);
      }
    });
  }
  function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
    var deletions = parentFiber.deletions;
    if (null !== deletions)
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
        a: for (; null !== parent; ) {
          switch (parent.tag) {
            case 27:
              if (isSingletonScope(parent.type)) {
                hostParent = parent.stateNode;
                hostParentIsContainer = false;
                break a;
              }
              break;
            case 5:
              hostParent = parent.stateNode;
              hostParentIsContainer = false;
              break a;
            case 3:
            case 4:
              hostParent = parent.stateNode.containerInfo;
              hostParentIsContainer = true;
              break a;
          }
          parent = parent.return;
        }
        if (null === hostParent) throw Error(formatProdErrorMessage(160));
        commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
        hostParent = null;
        hostParentIsContainer = false;
        root2 = childToDelete.alternate;
        null !== root2 && (root2.return = null);
        childToDelete.return = null;
      }
    if (parentFiber.subtreeFlags & 13886)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
  }
  var currentHoistableRoot = null;
  function commitMutationEffectsOnFiber(finishedWork, root2) {
    var current = finishedWork.alternate, flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
        break;
      case 1:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
        break;
      case 26:
        var hoistableRoot = currentHoistableRoot;
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (flags & 4) {
          var currentResource = null !== current ? current.memoizedState : null;
          flags = finishedWork.memoizedState;
          if (null === current)
            if (null === flags)
              if (null === finishedWork.stateNode) {
                a: {
                  flags = finishedWork.type;
                  current = finishedWork.memoizedProps;
                  hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                  b: switch (flags) {
                    case "title":
                      currentResource = hoistableRoot.getElementsByTagName("title")[0];
                      if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                        currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                          currentResource,
                          hoistableRoot.querySelector("head > title")
                        );
                      setInitialProperties(currentResource, flags, current);
                      currentResource[internalInstanceKey] = finishedWork;
                      markNodeAsHoistable(currentResource);
                      flags = currentResource;
                      break a;
                    case "link":
                      var maybeNodes = getHydratableHoistableCache(
                        "link",
                        "href",
                        hoistableRoot
                      ).get(flags + (current.href || ""));
                      if (maybeNodes) {
                        for (var i = 0; i < maybeNodes.length; i++)
                          if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                            maybeNodes.splice(i, 1);
                            break b;
                          }
                      }
                      currentResource = hoistableRoot.createElement(flags);
                      setInitialProperties(currentResource, flags, current);
                      hoistableRoot.head.appendChild(currentResource);
                      break;
                    case "meta":
                      if (maybeNodes = getHydratableHoistableCache(
                        "meta",
                        "content",
                        hoistableRoot
                      ).get(flags + (current.content || ""))) {
                        for (i = 0; i < maybeNodes.length; i++)
                          if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                            maybeNodes.splice(i, 1);
                            break b;
                          }
                      }
                      currentResource = hoistableRoot.createElement(flags);
                      setInitialProperties(currentResource, flags, current);
                      hoistableRoot.head.appendChild(currentResource);
                      break;
                    default:
                      throw Error(formatProdErrorMessage(468, flags));
                  }
                  currentResource[internalInstanceKey] = finishedWork;
                  markNodeAsHoistable(currentResource);
                  flags = currentResource;
                }
                finishedWork.stateNode = flags;
              } else
                mountHoistable(
                  hoistableRoot,
                  finishedWork.type,
                  finishedWork.stateNode
                );
            else
              finishedWork.stateNode = acquireResource(
                hoistableRoot,
                flags,
                finishedWork.memoizedProps
              );
          else
            currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
              hoistableRoot,
              finishedWork.type,
              finishedWork.stateNode
            ) : acquireResource(
              hoistableRoot,
              flags,
              finishedWork.memoizedProps
            )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
              finishedWork,
              finishedWork.memoizedProps,
              current.memoizedProps
            );
        }
        break;
      case 27:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        null !== current && flags & 4 && commitHostUpdate(
          finishedWork,
          finishedWork.memoizedProps,
          current.memoizedProps
        );
        break;
      case 5:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (finishedWork.flags & 32) {
          hoistableRoot = finishedWork.stateNode;
          try {
            setTextContent(hoistableRoot, "");
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
          finishedWork,
          hoistableRoot,
          null !== current ? current.memoizedProps : hoistableRoot
        ));
        flags & 1024 && (needsFormReset = true);
        break;
      case 6:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        if (flags & 4) {
          if (null === finishedWork.stateNode)
            throw Error(formatProdErrorMessage(162));
          flags = finishedWork.memoizedProps;
          current = finishedWork.stateNode;
          try {
            current.nodeValue = flags;
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 3:
        tagCaches = null;
        hoistableRoot = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(root2.containerInfo);
        recursivelyTraverseMutationEffects(root2, finishedWork);
        currentHoistableRoot = hoistableRoot;
        commitReconciliationEffects(finishedWork);
        if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
          try {
            retryIfBlockedOn(root2.containerInfo);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
        break;
      case 4:
        flags = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(
          finishedWork.stateNode.containerInfo
        );
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        currentHoistableRoot = flags;
        break;
      case 12:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        break;
      case 31:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 13:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 22:
        hoistableRoot = null !== finishedWork.memoizedState;
        var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
        recursivelyTraverseMutationEffects(root2, finishedWork);
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
        commitReconciliationEffects(finishedWork);
        if (flags & 8192)
          a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
            if (5 === root2.tag || 26 === root2.tag) {
              if (null === current) {
                wasHidden = current = root2;
                try {
                  if (currentResource = wasHidden.stateNode, hoistableRoot)
                    maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                  else {
                    i = wasHidden.stateNode;
                    var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                    i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                  }
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if (6 === root2.tag) {
              if (null === current) {
                wasHidden = root2;
                try {
                  wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if (18 === root2.tag) {
              if (null === current) {
                wasHidden = root2;
                try {
                  var instance = wasHidden.stateNode;
                  hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
              root2.child.return = root2;
              root2 = root2.child;
              continue;
            }
            if (root2 === finishedWork) break a;
            for (; null === root2.sibling; ) {
              if (null === root2.return || root2.return === finishedWork) break a;
              current === root2 && (current = null);
              root2 = root2.return;
            }
            current === root2 && (current = null);
            root2.sibling.return = root2.return;
            root2 = root2.sibling;
          }
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
        break;
      case 19:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
    }
  }
  function commitReconciliationEffects(finishedWork) {
    var flags = finishedWork.flags;
    if (flags & 2) {
      try {
        for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
          if (isHostParent(parentFiber)) {
            hostParentFiber = parentFiber;
            break;
          }
          parentFiber = parentFiber.return;
        }
        if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
        switch (hostParentFiber.tag) {
          case 27:
            var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before, parent);
            break;
          case 5:
            var parent$141 = hostParentFiber.stateNode;
            hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
            var before$142 = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
            break;
          case 3:
          case 4:
            var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
            insertOrAppendPlacementNodeIntoContainer(
              finishedWork,
              before$144,
              parent$143
            );
            break;
          default:
            throw Error(formatProdErrorMessage(161));
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
      finishedWork.flags &= -3;
    }
    flags & 4096 && (finishedWork.flags &= -4097);
  }
  function recursivelyResetForms(parentFiber) {
    if (parentFiber.subtreeFlags & 1024)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var fiber = parentFiber;
        recursivelyResetForms(fiber);
        5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
        parentFiber = parentFiber.sibling;
      }
  }
  function recursivelyTraverseLayoutEffects(root2, parentFiber) {
    if (parentFiber.subtreeFlags & 8772)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
  }
  function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedWork = parentFiber;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 1:
          safelyDetachRef(finishedWork, finishedWork.return);
          var instance = finishedWork.stateNode;
          "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
            finishedWork,
            finishedWork.return,
            instance
          );
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 27:
          releaseSingletonInstance(finishedWork.stateNode);
        case 26:
        case 5:
          safelyDetachRef(finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 30:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        default:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          commitHookEffectListMount(4, finishedWork);
          break;
        case 1:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          current = finishedWork;
          finishedRoot = current.stateNode;
          if ("function" === typeof finishedRoot.componentDidMount)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          current = finishedWork;
          finishedRoot = current.updateQueue;
          if (null !== finishedRoot) {
            var instance = current.stateNode;
            try {
              var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
              if (null !== hiddenCallbacks)
                for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                  callCallback(hiddenCallbacks[finishedRoot], instance);
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          }
          includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 27:
          commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          break;
        case 31:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 30:
          break;
        default:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitOffscreenPassiveMountEffects(current, finishedWork) {
    var previousCache = null;
    null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
    current = null;
    null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
    current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
  }
  function commitCachePassiveMountEffect(current, finishedWork) {
    current = null;
    null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
    finishedWork = finishedWork.memoizedState.cache;
    finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
  }
  function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveMountOnFiber(
          root2,
          parentFiber,
          committedLanes,
          committedTransitions
        ), parentFiber = parentFiber.sibling;
  }
  function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && commitHookEffectListMount(9, finishedWork);
        break;
      case 1:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 3:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
        break;
      case 12:
        if (flags & 2048) {
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          finishedRoot = finishedWork.stateNode;
          try {
            var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
            "function" === typeof onPostCommit && onPostCommit(
              id,
              null === finishedWork.alternate ? "mount" : "update",
              finishedRoot.passiveEffectDuration,
              -0
            );
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        } else
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
        break;
      case 31:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 13:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 23:
        break;
      case 22:
        _finishedWork$memoize2 = finishedWork.stateNode;
        id = finishedWork.alternate;
        null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          0 !== (finishedWork.subtreeFlags & 10256) || false
        ));
        flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
        break;
      case 24:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
        break;
      default:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
    }
  }
  function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
          commitHookEffectListMount(8, finishedWork);
          break;
        case 23:
          break;
        case 22:
          var instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          ) : recursivelyTraverseAtomicPassiveEffects(
            finishedRoot,
            finishedWork
          ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          ));
          includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
            finishedWork.alternate,
            finishedWork
          );
          break;
        case 24:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 22:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitOffscreenPassiveMountEffects(
              finishedWork.alternate,
              finishedWork
            );
            break;
          case 24:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
        }
        parentFiber = parentFiber.sibling;
      }
  }
  var suspenseyCommitFlag = 8192;
  function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
    if (parentFiber.subtreeFlags & suspenseyCommitFlag)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        accumulateSuspenseyCommitOnFiber(
          parentFiber,
          committedLanes,
          suspendedState
        ), parentFiber = parentFiber.sibling;
  }
  function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
    switch (fiber.tag) {
      case 26:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
          suspendedState,
          currentHoistableRoot,
          fiber.memoizedState,
          fiber.memoizedProps
        );
        break;
      case 5:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        break;
      case 3:
      case 4:
        var previousHoistableRoot = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        currentHoistableRoot = previousHoistableRoot;
        break;
      case 22:
        null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        ));
        break;
      default:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
    }
  }
  function detachAlternateSiblings(parentFiber) {
    var previousFiber = parentFiber.alternate;
    if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
      previousFiber.child = null;
      do
        previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
      while (null !== parentFiber);
    }
  }
  function recursivelyTraversePassiveUnmountEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            childToDelete,
            parentFiber
          );
        }
      detachAlternateSiblings(parentFiber);
    }
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
  }
  function commitPassiveUnmountOnFiber(finishedWork) {
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 12:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 22:
        var instance = finishedWork.stateNode;
        null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      default:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
    }
  }
  function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            childToDelete,
            parentFiber
          );
        }
      detachAlternateSiblings(parentFiber);
    }
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      deletions = parentFiber;
      switch (deletions.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, deletions, deletions.return);
          recursivelyTraverseDisconnectPassiveEffects(deletions);
          break;
        case 22:
          i = deletions.stateNode;
          i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
          break;
        default:
          recursivelyTraverseDisconnectPassiveEffects(deletions);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
    for (; null !== nextEffect; ) {
      var fiber = nextEffect;
      switch (fiber.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
          break;
        case 23:
        case 22:
          if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
            var cache = fiber.memoizedState.cachePool.pool;
            null != cache && cache.refCount++;
          }
          break;
        case 24:
          releaseCache(fiber.memoizedState.cache);
      }
      cache = fiber.child;
      if (null !== cache) cache.return = fiber, nextEffect = cache;
      else
        a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
          cache = nextEffect;
          var sibling = cache.sibling, returnFiber = cache.return;
          detachFiberAfterEffects(cache);
          if (cache === fiber) {
            nextEffect = null;
            break a;
          }
          if (null !== sibling) {
            sibling.return = returnFiber;
            nextEffect = sibling;
            break a;
          }
          nextEffect = returnFiber;
        }
    }
  }
  var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
      var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
      void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
      return cacheForType;
    },
    cacheSignal: function() {
      return readContext(CacheContext).controller.signal;
    }
  }, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
  function requestUpdateLane() {
    return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
  }
  function requestDeferredLane() {
    if (0 === workInProgressDeferredLane)
      if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
        var lane = nextTransitionDeferredLane;
        nextTransitionDeferredLane <<= 1;
        0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
        workInProgressDeferredLane = lane;
      } else workInProgressDeferredLane = 536870912;
    lane = suspenseHandlerStackCursor.current;
    null !== lane && (lane.flags |= 32);
    return workInProgressDeferredLane;
  }
  function scheduleUpdateOnFiber(root2, fiber, lane) {
    if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      prepareFreshStack(root2, 0), markRootSuspended(
        root2,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      );
    markRootUpdated$1(root2, lane);
    if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
      root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
        root2,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      )), ensureRootIsScheduled(root2);
  }
  function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
    do {
      if (0 === exitStatus) {
        workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
        break;
      } else {
        forceSync = root$jscomp$0.current.alternate;
        if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
          exitStatus = renderRootSync(root$jscomp$0, lanes, false);
          renderWasConcurrent = false;
          continue;
        }
        if (2 === exitStatus) {
          renderWasConcurrent = lanes;
          if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
            var JSCompiler_inline_result = 0;
          else
            JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
          if (0 !== JSCompiler_inline_result) {
            lanes = JSCompiler_inline_result;
            a: {
              var root2 = root$jscomp$0;
              exitStatus = workInProgressRootConcurrentErrors;
              var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
              wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
              JSCompiler_inline_result = renderRootSync(
                root2,
                JSCompiler_inline_result,
                false
              );
              if (2 !== JSCompiler_inline_result) {
                if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                  root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                  workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                  exitStatus = 4;
                  break a;
                }
                renderWasConcurrent = workInProgressRootRecoverableErrors;
                workInProgressRootRecoverableErrors = exitStatus;
                null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                  workInProgressRootRecoverableErrors,
                  renderWasConcurrent
                ));
              }
              exitStatus = JSCompiler_inline_result;
            }
            renderWasConcurrent = false;
            if (2 !== exitStatus) continue;
          }
        }
        if (1 === exitStatus) {
          prepareFreshStack(root$jscomp$0, 0);
          markRootSuspended(root$jscomp$0, lanes, 0, true);
          break;
        }
        a: {
          shouldTimeSlice = root$jscomp$0;
          renderWasConcurrent = exitStatus;
          switch (renderWasConcurrent) {
            case 0:
            case 1:
              throw Error(formatProdErrorMessage(345));
            case 4:
              if ((lanes & 4194048) !== lanes) break;
            case 6:
              markRootSuspended(
                shouldTimeSlice,
                lanes,
                workInProgressDeferredLane,
                !workInProgressRootDidSkipSuspendedSiblings
              );
              break a;
            case 2:
              workInProgressRootRecoverableErrors = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(formatProdErrorMessage(329));
          }
          if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
            markRootSuspended(
              shouldTimeSlice,
              lanes,
              workInProgressDeferredLane,
              !workInProgressRootDidSkipSuspendedSiblings
            );
            if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
            pendingEffectsLanes = lanes;
            shouldTimeSlice.timeoutHandle = scheduleTimeout(
              commitRootWhenReady.bind(
                null,
                shouldTimeSlice,
                forceSync,
                workInProgressRootRecoverableErrors,
                workInProgressTransitions,
                workInProgressRootDidIncludeRecursiveRenderUpdate,
                lanes,
                workInProgressDeferredLane,
                workInProgressRootInterleavedUpdatedLanes,
                workInProgressSuspendedRetryLanes,
                workInProgressRootDidSkipSuspendedSiblings,
                renderWasConcurrent,
                "Throttled",
                -0,
                0
              ),
              exitStatus
            );
            break a;
          }
          commitRootWhenReady(
            shouldTimeSlice,
            forceSync,
            workInProgressRootRecoverableErrors,
            workInProgressTransitions,
            workInProgressRootDidIncludeRecursiveRenderUpdate,
            lanes,
            workInProgressDeferredLane,
            workInProgressRootInterleavedUpdatedLanes,
            workInProgressSuspendedRetryLanes,
            workInProgressRootDidSkipSuspendedSiblings,
            renderWasConcurrent,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (1);
    ensureRootIsScheduled(root$jscomp$0);
  }
  function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
    root2.timeoutHandle = -1;
    suspendedCommitReason = finishedWork.subtreeFlags;
    if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
      suspendedCommitReason = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: true,
        waitingForViewTransition: false,
        unsuspend: noop$1
      };
      accumulateSuspenseyCommitOnFiber(
        finishedWork,
        lanes,
        suspendedCommitReason
      );
      var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
      timeoutOffset = waitForCommitToBeReady(
        suspendedCommitReason,
        timeoutOffset
      );
      if (null !== timeoutOffset) {
        pendingEffectsLanes = lanes;
        root2.cancelPendingCommit = timeoutOffset(
          commitRoot.bind(
            null,
            root2,
            finishedWork,
            lanes,
            recoverableErrors,
            transitions,
            didIncludeRenderPhaseUpdate,
            spawnedLane,
            updatedLanes,
            suspendedRetryLanes,
            exitStatus,
            suspendedCommitReason,
            null,
            completedRenderStartTime,
            completedRenderEndTime
          )
        );
        markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
        return;
      }
    }
    commitRoot(
      root2,
      finishedWork,
      lanes,
      recoverableErrors,
      transitions,
      didIncludeRenderPhaseUpdate,
      spawnedLane,
      updatedLanes,
      suspendedRetryLanes
    );
  }
  function isRenderConsistentWithExternalStores(finishedWork) {
    for (var node = finishedWork; ; ) {
      var tag = node.tag;
      if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
        for (var i = 0; i < tag.length; i++) {
          var check = tag[i], getSnapshot = check.getSnapshot;
          check = check.value;
          try {
            if (!objectIs(getSnapshot(), check)) return false;
          } catch (error) {
            return false;
          }
        }
      tag = node.child;
      if (node.subtreeFlags & 16384 && null !== tag)
        tag.return = node, node = tag;
      else {
        if (node === finishedWork) break;
        for (; null === node.sibling; ) {
          if (null === node.return || node.return === finishedWork) return true;
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
    return true;
  }
  function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
    suspendedLanes &= ~workInProgressRootPingedLanes;
    suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
    root2.suspendedLanes |= suspendedLanes;
    root2.pingedLanes &= ~suspendedLanes;
    didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
    didAttemptEntireTree = root2.expirationTimes;
    for (var lanes = suspendedLanes; 0 < lanes; ) {
      var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
      didAttemptEntireTree[index$6] = -1;
      lanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
  }
  function flushSyncWork$1() {
    return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
  }
  function resetWorkInProgressStack() {
    if (null !== workInProgress) {
      if (0 === workInProgressSuspendedReason)
        var interruptedWork = workInProgress.return;
      else
        interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
      for (; null !== interruptedWork; )
        unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
      workInProgress = null;
    }
  }
  function prepareFreshStack(root2, lanes) {
    var timeoutHandle = root2.timeoutHandle;
    -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
    timeoutHandle = root2.cancelPendingCommit;
    null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
    pendingEffectsLanes = 0;
    resetWorkInProgressStack();
    workInProgressRoot = root2;
    workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
    workInProgressRootRenderLanes = lanes;
    workInProgressSuspendedReason = 0;
    workInProgressThrownValue = null;
    workInProgressRootDidSkipSuspendedSiblings = false;
    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
    workInProgressRootDidAttachPingListener = false;
    workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
    workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
    workInProgressRootDidIncludeRecursiveRenderUpdate = false;
    0 !== (lanes & 8) && (lanes |= lanes & 32);
    var allEntangledLanes = root2.entangledLanes;
    if (0 !== allEntangledLanes)
      for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
        var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
        lanes |= root2[index$4];
        allEntangledLanes &= ~lane;
      }
    entangledRenderLanes = lanes;
    finishQueueingConcurrentUpdates();
    return timeoutHandle;
  }
  function handleThrow(root2, thrownValue) {
    currentlyRenderingFiber = null;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
    workInProgressThrownValue = thrownValue;
    null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
      root2,
      createCapturedValueAtFiber(thrownValue, root2.current)
    ));
  }
  function shouldRemainOnPreviousScreen() {
    var handler = suspenseHandlerStackCursor.current;
    return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
  }
  function pushDispatcher() {
    var prevDispatcher = ReactSharedInternals.H;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
  }
  function pushAsyncDispatcher() {
    var prevAsyncDispatcher = ReactSharedInternals.A;
    ReactSharedInternals.A = DefaultAsyncDispatcher;
    return prevAsyncDispatcher;
  }
  function renderDidSuspendDelayIfPossible() {
    workInProgressRootExitStatus = 4;
    workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
    0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
      workInProgressRoot,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
      false
    );
  }
  function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
      workInProgressTransitions = null, prepareFreshStack(root2, lanes);
    lanes = false;
    var exitStatus = workInProgressRootExitStatus;
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
          switch (workInProgressSuspendedReason) {
            case 8:
              resetWorkInProgressStack();
              exitStatus = 6;
              break a;
            case 3:
            case 2:
            case 9:
            case 6:
              null === suspenseHandlerStackCursor.current && (lanes = true);
              var reason = workInProgressSuspendedReason;
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
              if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                exitStatus = 0;
                break a;
              }
              break;
            default:
              reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
          }
        }
        workLoopSync();
        exitStatus = workInProgressRootExitStatus;
        break;
      } catch (thrownValue$165) {
        handleThrow(root2, thrownValue$165);
      }
    while (1);
    lanes && root2.shellSuspendCounter++;
    lastContextDependency = currentlyRenderingFiber$1 = null;
    executionContext = prevExecutionContext;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
    return exitStatus;
  }
  function workLoopSync() {
    for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
  }
  function renderRootConcurrent(root2, lanes) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
      root2,
      lanes
    );
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          lanes = workInProgress;
          var thrownValue = workInProgressThrownValue;
          b: switch (workInProgressSuspendedReason) {
            case 1:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
              break;
            case 2:
            case 9:
              if (isThenableResolved(thrownValue)) {
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                replaySuspendedUnitOfWork(lanes);
                break;
              }
              lanes = function() {
                2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                ensureRootIsScheduled(root2);
              };
              thrownValue.then(lanes, lanes);
              break a;
            case 3:
              workInProgressSuspendedReason = 7;
              break a;
            case 4:
              workInProgressSuspendedReason = 5;
              break a;
            case 7:
              isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
              break;
            case 5:
              var resource = null;
              switch (workInProgress.tag) {
                case 26:
                  resource = workInProgress.memoizedState;
                case 5:
                case 27:
                  var hostFiber = workInProgress;
                  if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    var sibling = hostFiber.sibling;
                    if (null !== sibling) workInProgress = sibling;
                    else {
                      var returnFiber = hostFiber.return;
                      null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                    }
                    break b;
                  }
              }
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
              break;
            case 6:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
              break;
            case 8:
              resetWorkInProgressStack();
              workInProgressRootExitStatus = 6;
              break a;
            default:
              throw Error(formatProdErrorMessage(462));
          }
        }
        workLoopConcurrentByScheduler();
        break;
      } catch (thrownValue$167) {
        handleThrow(root2, thrownValue$167);
      }
    while (1);
    lastContextDependency = currentlyRenderingFiber$1 = null;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    executionContext = prevExecutionContext;
    if (null !== workInProgress) return 0;
    workInProgressRoot = null;
    workInProgressRootRenderLanes = 0;
    finishQueueingConcurrentUpdates();
    return workInProgressRootExitStatus;
  }
  function workLoopConcurrentByScheduler() {
    for (; null !== workInProgress && !shouldYield(); )
      performUnitOfWork(workInProgress);
  }
  function performUnitOfWork(unitOfWork) {
    var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function replaySuspendedUnitOfWork(unitOfWork) {
    var next = unitOfWork;
    var current = next.alternate;
    switch (next.tag) {
      case 15:
      case 0:
        next = replayFunctionComponent(
          current,
          next,
          next.pendingProps,
          next.type,
          void 0,
          workInProgressRootRenderLanes
        );
        break;
      case 11:
        next = replayFunctionComponent(
          current,
          next,
          next.pendingProps,
          next.type.render,
          next.ref,
          workInProgressRootRenderLanes
        );
        break;
      case 5:
        resetHooksOnUnwind(next);
      default:
        unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
    }
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
    lastContextDependency = currentlyRenderingFiber$1 = null;
    resetHooksOnUnwind(unitOfWork);
    thenableState$1 = null;
    thenableIndexCounter$1 = 0;
    var returnFiber = unitOfWork.return;
    try {
      if (throwException(
        root2,
        returnFiber,
        unitOfWork,
        thrownValue,
        workInProgressRootRenderLanes
      )) {
        workInProgressRootExitStatus = 1;
        logUncaughtError(
          root2,
          createCapturedValueAtFiber(thrownValue, root2.current)
        );
        workInProgress = null;
        return;
      }
    } catch (error) {
      if (null !== returnFiber) throw workInProgress = returnFiber, error;
      workInProgressRootExitStatus = 1;
      logUncaughtError(
        root2,
        createCapturedValueAtFiber(thrownValue, root2.current)
      );
      workInProgress = null;
      return;
    }
    if (unitOfWork.flags & 32768) {
      if (isHydrating || 1 === suspendedReason) root2 = true;
      else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
        root2 = false;
      else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
        suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
      unwindUnitOfWork(unitOfWork, root2);
    } else completeUnitOfWork(unitOfWork);
  }
  function completeUnitOfWork(unitOfWork) {
    var completedWork = unitOfWork;
    do {
      if (0 !== (completedWork.flags & 32768)) {
        unwindUnitOfWork(
          completedWork,
          workInProgressRootDidSkipSuspendedSiblings
        );
        return;
      }
      unitOfWork = completedWork.return;
      var next = completeWork(
        completedWork.alternate,
        completedWork,
        entangledRenderLanes
      );
      if (null !== next) {
        workInProgress = next;
        return;
      }
      completedWork = completedWork.sibling;
      if (null !== completedWork) {
        workInProgress = completedWork;
        return;
      }
      workInProgress = completedWork = unitOfWork;
    } while (null !== completedWork);
    0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
  }
  function unwindUnitOfWork(unitOfWork, skipSiblings) {
    do {
      var next = unwindWork(unitOfWork.alternate, unitOfWork);
      if (null !== next) {
        next.flags &= 32767;
        workInProgress = next;
        return;
      }
      next = unitOfWork.return;
      null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
      if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
        workInProgress = unitOfWork;
        return;
      }
      workInProgress = unitOfWork = next;
    } while (null !== unitOfWork);
    workInProgressRootExitStatus = 6;
    workInProgress = null;
  }
  function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
    root2.cancelPendingCommit = null;
    do
      flushPendingEffects();
    while (0 !== pendingEffectsStatus);
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    if (null !== finishedWork) {
      if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
      didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
      didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
      markRootFinished(
        root2,
        lanes,
        didIncludeRenderPhaseUpdate,
        spawnedLane,
        updatedLanes,
        suspendedRetryLanes
      );
      root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
      pendingFinishedWork = finishedWork;
      pendingEffectsRoot = root2;
      pendingEffectsLanes = lanes;
      pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
      pendingPassiveTransitions = transitions;
      pendingRecoverableErrors = recoverableErrors;
      0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
        flushPassiveEffects();
        return null;
      })) : (root2.callbackNode = null, root2.callbackPriority = 0);
      recoverableErrors = 0 !== (finishedWork.flags & 13878);
      if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
        recoverableErrors = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        transitions = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        spawnedLane = executionContext;
        executionContext |= 4;
        try {
          commitBeforeMutationEffects(root2, finishedWork, lanes);
        } finally {
          executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
        }
      }
      pendingEffectsStatus = 1;
      flushMutationEffects();
      flushLayoutEffects();
      flushSpawnedWork();
    }
  }
  function flushMutationEffects() {
    if (1 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
      if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
        rootMutationHasEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          commitMutationEffectsOnFiber(finishedWork, root2);
          var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
          if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
            priorFocusedElem.ownerDocument.documentElement,
            priorFocusedElem
          )) {
            if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
              var start = priorSelectionRange.start, end = priorSelectionRange.end;
              void 0 === end && (end = start);
              if ("selectionStart" in priorFocusedElem)
                priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                  end,
                  priorFocusedElem.value.length
                );
              else {
                var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                if (win.getSelection) {
                  var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                  !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                  var startMarker = getNodeForCharacterOffset(
                    priorFocusedElem,
                    start$jscomp$0
                  ), endMarker = getNodeForCharacterOffset(
                    priorFocusedElem,
                    end$jscomp$0
                  );
                  if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                    var range = doc.createRange();
                    range.setStart(startMarker.node, startMarker.offset);
                    selection.removeAllRanges();
                    start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                  }
                }
              }
            }
            doc = [];
            for (selection = priorFocusedElem; selection = selection.parentNode; )
              1 === selection.nodeType && doc.push({
                element: selection,
                left: selection.scrollLeft,
                top: selection.scrollTop
              });
            "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
            for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
              var info = doc[priorFocusedElem];
              info.element.scrollLeft = info.left;
              info.element.scrollTop = info.top;
            }
          }
          _enabled = !!eventsEnabled;
          selectionInformation = eventsEnabled = null;
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
        }
      }
      root2.current = finishedWork;
      pendingEffectsStatus = 2;
    }
  }
  function flushLayoutEffects() {
    if (2 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
      if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
        rootHasLayoutEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
        }
      }
      pendingEffectsStatus = 3;
    }
  }
  function flushSpawnedWork() {
    if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      requestPaint();
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
      0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
      var remainingLanes = root2.pendingLanes;
      0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
      lanesToEventPriority(lanes);
      finishedWork = finishedWork.stateNode;
      if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
        try {
          injectedHook.onCommitFiberRoot(
            rendererID,
            finishedWork,
            void 0,
            128 === (finishedWork.current.flags & 128)
          );
        } catch (err) {
        }
      if (null !== recoverableErrors) {
        finishedWork = ReactSharedInternals.T;
        remainingLanes = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        ReactSharedInternals.T = null;
        try {
          for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
            var recoverableError = recoverableErrors[i];
            onRecoverableError(recoverableError.value, {
              componentStack: recoverableError.stack
            });
          }
        } finally {
          ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
        }
      }
      0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
      ensureRootIsScheduled(root2);
      remainingLanes = root2.pendingLanes;
      0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
      flushSyncWorkAcrossRoots_impl(0);
    }
  }
  function releaseRootPooledCache(root2, remainingLanes) {
    0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
  }
  function flushPendingEffects() {
    flushMutationEffects();
    flushLayoutEffects();
    flushSpawnedWork();
    return flushPassiveEffects();
  }
  function flushPassiveEffects() {
    if (5 !== pendingEffectsStatus) return false;
    var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
    pendingEffectsRemainingLanes = 0;
    var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
      ReactSharedInternals.T = null;
      renderPriority = pendingPassiveTransitions;
      pendingPassiveTransitions = null;
      var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
      pendingEffectsStatus = 0;
      pendingFinishedWork = pendingEffectsRoot = null;
      pendingEffectsLanes = 0;
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
      var prevExecutionContext = executionContext;
      executionContext |= 4;
      commitPassiveUnmountOnFiber(root$jscomp$0.current);
      commitPassiveMountOnFiber(
        root$jscomp$0,
        root$jscomp$0.current,
        lanes,
        renderPriority
      );
      executionContext = prevExecutionContext;
      flushSyncWorkAcrossRoots_impl(0, false);
      if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
        try {
          injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
        } catch (err) {
        }
      return true;
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
    }
  }
  function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
    sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
    sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
    rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
    null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
  }
  function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
    if (3 === sourceFiber.tag)
      captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    else
      for (; null !== nearestMountedAncestor; ) {
        if (3 === nearestMountedAncestor.tag) {
          captureCommitPhaseErrorOnRoot(
            nearestMountedAncestor,
            sourceFiber,
            error
          );
          break;
        } else if (1 === nearestMountedAncestor.tag) {
          var instance = nearestMountedAncestor.stateNode;
          if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
            sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
            error = createClassErrorUpdate(2);
            instance = enqueueUpdate(nearestMountedAncestor, error, 2);
            null !== instance && (initializeClassErrorUpdate(
              error,
              instance,
              nearestMountedAncestor,
              sourceFiber
            ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
            break;
          }
        }
        nearestMountedAncestor = nearestMountedAncestor.return;
      }
  }
  function attachPingListener(root2, wakeable, lanes) {
    var pingCache = root2.pingCache;
    if (null === pingCache) {
      pingCache = root2.pingCache = new PossiblyWeakMap();
      var threadIDs = /* @__PURE__ */ new Set();
      pingCache.set(wakeable, threadIDs);
    } else
      threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
    threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
  }
  function pingSuspendedRoot(root2, wakeable, pingedLanes) {
    var pingCache = root2.pingCache;
    null !== pingCache && pingCache.delete(wakeable);
    root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
    root2.warmLanes &= ~pingedLanes;
    workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
    ensureRootIsScheduled(root2);
  }
  function retryTimedOutBoundary(boundaryFiber, retryLane) {
    0 === retryLane && (retryLane = claimNextRetryLane());
    boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
    null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
  }
  function retryDehydratedSuspenseBoundary(boundaryFiber) {
    var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
    null !== suspenseState && (retryLane = suspenseState.retryLane);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function resolveRetryWakeable(boundaryFiber, wakeable) {
    var retryLane = 0;
    switch (boundaryFiber.tag) {
      case 31:
      case 13:
        var retryCache = boundaryFiber.stateNode;
        var suspenseState = boundaryFiber.memoizedState;
        null !== suspenseState && (retryLane = suspenseState.retryLane);
        break;
      case 19:
        retryCache = boundaryFiber.stateNode;
        break;
      case 22:
        retryCache = boundaryFiber.stateNode._retryCache;
        break;
      default:
        throw Error(formatProdErrorMessage(314));
    }
    null !== retryCache && retryCache.delete(wakeable);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function scheduleCallback$1(priorityLevel, callback) {
    return scheduleCallback$3(priorityLevel, callback);
  }
  var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
  function ensureRootIsScheduled(root2) {
    root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
    mightHavePendingSyncWork = true;
    didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
  }
  function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
    if (!isFlushingWork && mightHavePendingSyncWork) {
      isFlushingWork = true;
      do {
        var didPerformSomeWork = false;
        for (var root$170 = firstScheduledRoot; null !== root$170; ) {
          if (0 !== syncTransitionLanes) {
            var pendingLanes = root$170.pendingLanes;
            if (0 === pendingLanes) var JSCompiler_inline_result = 0;
            else {
              var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
              JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
              JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
              JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
            }
            0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
          } else
            JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
              root$170,
              root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
              null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
            ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
          root$170 = root$170.next;
        }
      } while (didPerformSomeWork);
      isFlushingWork = false;
    }
  }
  function processRootScheduleInImmediateTask() {
    processRootScheduleInMicrotask();
  }
  function processRootScheduleInMicrotask() {
    mightHavePendingSyncWork = didScheduleMicrotask = false;
    var syncTransitionLanes = 0;
    0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
    for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
      var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
      if (0 === nextLanes)
        root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
      else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
        mightHavePendingSyncWork = true;
      root2 = next;
    }
    0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
    0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
  }
  function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
    for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
      var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
      if (-1 === expirationTime) {
        if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
          expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
      } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
      lanes &= ~lane;
    }
    currentTime = workInProgressRoot;
    suspendedLanes = workInProgressRootRenderLanes;
    suspendedLanes = getNextLanes(
      root2,
      root2 === currentTime ? suspendedLanes : 0,
      null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
    );
    pingedLanes = root2.callbackNode;
    if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
    if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
      currentTime = suspendedLanes & -suspendedLanes;
      if (currentTime === root2.callbackPriority) return currentTime;
      null !== pingedLanes && cancelCallback$1(pingedLanes);
      switch (lanesToEventPriority(suspendedLanes)) {
        case 2:
        case 8:
          suspendedLanes = UserBlockingPriority;
          break;
        case 32:
          suspendedLanes = NormalPriority$1;
          break;
        case 268435456:
          suspendedLanes = IdlePriority;
          break;
        default:
          suspendedLanes = NormalPriority$1;
      }
      pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
      suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
      root2.callbackPriority = currentTime;
      root2.callbackNode = suspendedLanes;
      return currentTime;
    }
    null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
    root2.callbackPriority = 2;
    root2.callbackNode = null;
    return 2;
  }
  function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
    if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
      return root2.callbackNode = null, root2.callbackPriority = 0, null;
    var originalCallbackNode = root2.callbackNode;
    if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
      return null;
    var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
    workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
      root2,
      root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
      null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
    );
    if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
    performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
    scheduleTaskForRootDuringMicrotask(root2, now());
    return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
  }
  function performSyncWorkOnRoot(root2, lanes) {
    if (flushPendingEffects()) return null;
    performWorkOnRoot(root2, lanes, true);
  }
  function scheduleImmediateRootScheduleTask() {
    scheduleMicrotask(function() {
      0 !== (executionContext & 6) ? scheduleCallback$3(
        ImmediatePriority,
        processRootScheduleInImmediateTask
      ) : processRootScheduleInMicrotask();
    });
  }
  function requestTransitionLane() {
    if (0 === currentEventTransitionLane) {
      var actionScopeLane = currentEntangledLane;
      0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
      currentEventTransitionLane = actionScopeLane;
    }
    return currentEventTransitionLane;
  }
  function coerceFormActionProp(actionProp) {
    return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
  }
  function createFormDataWithSubmitter(form, submitter) {
    var temp = submitter.ownerDocument.createElement("input");
    temp.name = submitter.name;
    temp.value = submitter.value;
    form.id && temp.setAttribute("form", form.id);
    submitter.parentNode.insertBefore(temp, submitter);
    form = new FormData(form);
    temp.parentNode.removeChild(temp);
    return form;
  }
  function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
    if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
      var action = coerceFormActionProp(
        (nativeEventTarget[internalPropsKey] || null).action
      ), submitter = nativeEvent.submitter;
      submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
      var event = new SyntheticEvent(
        "action",
        "action",
        null,
        nativeEvent,
        nativeEventTarget
      );
      dispatchQueue.push({
        event,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (nativeEvent.defaultPrevented) {
                if (0 !== currentEventTransitionLane) {
                  var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                  startHostTransition(
                    maybeTargetInst,
                    {
                      pending: true,
                      data: formData,
                      method: nativeEventTarget.method,
                      action
                    },
                    null,
                    formData
                  );
                }
              } else
                "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                  maybeTargetInst,
                  {
                    pending: true,
                    data: formData,
                    method: nativeEventTarget.method,
                    action
                  },
                  action,
                  formData
                ));
            },
            currentTarget: nativeEventTarget
          }
        ]
      });
    }
  }
  for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
    var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
    registerSimpleEvent(
      domEventName$jscomp$inline_1579,
      "on" + capitalizedEvent$jscomp$inline_1580
    );
  }
  registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
  registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
  registerSimpleEvent(ANIMATION_START, "onAnimationStart");
  registerSimpleEvent("dblclick", "onDoubleClick");
  registerSimpleEvent("focusin", "onFocus");
  registerSimpleEvent("focusout", "onBlur");
  registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
  registerSimpleEvent(TRANSITION_START, "onTransitionStart");
  registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
  registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
  registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
  registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
  registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
  registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
  registerTwoPhaseEvent(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  );
  registerTwoPhaseEvent(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  );
  registerTwoPhaseEvent("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]);
  registerTwoPhaseEvent(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  );
  registerTwoPhaseEvent(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  );
  registerTwoPhaseEvent(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), nonDelegatedEvents = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
  );
  function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    eventSystemFlags = 0 !== (eventSystemFlags & 4);
    for (var i = 0; i < dispatchQueue.length; i++) {
      var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
      _dispatchQueue$i = _dispatchQueue$i.listeners;
      a: {
        var previousInstance = void 0;
        if (eventSystemFlags)
          for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
            var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
        else
          for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
            _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
            instance = _dispatchListeners$i.instance;
            currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
      }
    }
  }
  function listenToNonDelegatedEvent(domEventName, targetElement) {
    var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
    void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
    var listenerSetKey = domEventName + "__bubble";
    JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
  }
  function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    var eventSystemFlags = 0;
    isCapturePhaseListener && (eventSystemFlags |= 4);
    addTrappedEventListener(
      target,
      domEventName,
      eventSystemFlags,
      isCapturePhaseListener
    );
  }
  var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
  function listenToAllSupportedEvents(rootContainerElement) {
    if (!rootContainerElement[listeningMarker]) {
      rootContainerElement[listeningMarker] = true;
      allNativeEvents.forEach(function(domEventName) {
        "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
      });
      var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
      null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
    }
  }
  function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
    switch (getEventPriority(domEventName)) {
      case 2:
        var listenerWrapper = dispatchDiscreteEvent;
        break;
      case 8:
        listenerWrapper = dispatchContinuousEvent;
        break;
      default:
        listenerWrapper = dispatchEvent;
    }
    eventSystemFlags = listenerWrapper.bind(
      null,
      domEventName,
      eventSystemFlags,
      targetContainer
    );
    listenerWrapper = void 0;
    !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
    isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      capture: true,
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
  }
  function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
    var ancestorInst = targetInst$jscomp$0;
    if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
      a: for (; ; ) {
        if (null === targetInst$jscomp$0) return;
        var nodeTag = targetInst$jscomp$0.tag;
        if (3 === nodeTag || 4 === nodeTag) {
          var container = targetInst$jscomp$0.stateNode.containerInfo;
          if (container === targetContainer) break;
          if (4 === nodeTag)
            for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
              var grandTag = nodeTag.tag;
              if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                return;
              nodeTag = nodeTag.return;
            }
          for (; null !== container; ) {
            nodeTag = getClosestInstanceFromNode(container);
            if (null === nodeTag) return;
            grandTag = nodeTag.tag;
            if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
              targetInst$jscomp$0 = ancestorInst = nodeTag;
              continue a;
            }
            container = container.parentNode;
          }
        }
        targetInst$jscomp$0 = targetInst$jscomp$0.return;
      }
    batchedUpdates$1(function() {
      var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
      a: {
        var reactName = topLevelEventsToReactNames.get(domEventName);
        if (void 0 !== reactName) {
          var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
          switch (domEventName) {
            case "keypress":
              if (0 === getEventCharCode(nativeEvent)) break a;
            case "keydown":
            case "keyup":
              SyntheticEventCtor = SyntheticKeyboardEvent;
              break;
            case "focusin":
              reactEventType = "focus";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "focusout":
              reactEventType = "blur";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "beforeblur":
            case "afterblur":
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "click":
              if (2 === nativeEvent.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              SyntheticEventCtor = SyntheticMouseEvent;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              SyntheticEventCtor = SyntheticDragEvent;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              SyntheticEventCtor = SyntheticTouchEvent;
              break;
            case ANIMATION_END:
            case ANIMATION_ITERATION:
            case ANIMATION_START:
              SyntheticEventCtor = SyntheticAnimationEvent;
              break;
            case TRANSITION_END:
              SyntheticEventCtor = SyntheticTransitionEvent;
              break;
            case "scroll":
            case "scrollend":
              SyntheticEventCtor = SyntheticUIEvent;
              break;
            case "wheel":
              SyntheticEventCtor = SyntheticWheelEvent;
              break;
            case "copy":
            case "cut":
            case "paste":
              SyntheticEventCtor = SyntheticClipboardEvent;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              SyntheticEventCtor = SyntheticPointerEvent;
              break;
            case "toggle":
            case "beforetoggle":
              SyntheticEventCtor = SyntheticToggleEvent;
          }
          var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
          inCapturePhase = [];
          for (var instance = targetInst, lastHostComponent; null !== instance; ) {
            var _instance = instance;
            lastHostComponent = _instance.stateNode;
            _instance = _instance.tag;
            5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
              createDispatchListener(instance, _instance, lastHostComponent)
            ));
            if (accumulateTargetOnly) break;
            instance = instance.return;
          }
          0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
            reactName,
            reactEventType,
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
        }
      }
      if (0 === (eventSystemFlags & 7)) {
        a: {
          reactName = "mouseover" === domEventName || "pointerover" === domEventName;
          SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
          if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
            break a;
          if (SyntheticEventCtor || reactName) {
            reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
            if (SyntheticEventCtor) {
              if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                reactEventType = null;
            } else SyntheticEventCtor = null, reactEventType = targetInst;
            if (SyntheticEventCtor !== reactEventType) {
              inCapturePhase = SyntheticMouseEvent;
              _instance = "onMouseLeave";
              reactEventName = "onMouseEnter";
              instance = "mouse";
              if ("pointerout" === domEventName || "pointerover" === domEventName)
                inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
              accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
              lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
              reactName = new inCapturePhase(
                _instance,
                instance + "leave",
                SyntheticEventCtor,
                nativeEvent,
                nativeEventTarget
              );
              reactName.target = accumulateTargetOnly;
              reactName.relatedTarget = lastHostComponent;
              _instance = null;
              getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
                reactEventName,
                instance + "enter",
                reactEventType,
                nativeEvent,
                nativeEventTarget
              ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
              accumulateTargetOnly = _instance;
              if (SyntheticEventCtor && reactEventType)
                b: {
                  inCapturePhase = getParent;
                  reactEventName = SyntheticEventCtor;
                  instance = reactEventType;
                  lastHostComponent = 0;
                  for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                    lastHostComponent++;
                  _instance = 0;
                  for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                    _instance++;
                  for (; 0 < lastHostComponent - _instance; )
                    reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                  for (; 0 < _instance - lastHostComponent; )
                    instance = inCapturePhase(instance), _instance--;
                  for (; lastHostComponent--; ) {
                    if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                      inCapturePhase = reactEventName;
                      break b;
                    }
                    reactEventName = inCapturePhase(reactEventName);
                    instance = inCapturePhase(instance);
                  }
                  inCapturePhase = null;
                }
              else inCapturePhase = null;
              null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
                dispatchQueue,
                reactName,
                SyntheticEventCtor,
                inCapturePhase,
                false
              );
              null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
                dispatchQueue,
                accumulateTargetOnly,
                reactEventType,
                inCapturePhase,
                true
              );
            }
          }
        }
        a: {
          reactName = targetInst ? getNodeFromInstance(targetInst) : window;
          SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
          if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
            var getTargetInstFunc = getTargetInstForChangeEvent;
          else if (isTextInputElement(reactName))
            if (isInputEventSupported)
              getTargetInstFunc = getTargetInstForInputOrChangeEvent;
            else {
              getTargetInstFunc = getTargetInstForInputEventPolyfill;
              var handleEventFunc = handleEventsForInputEventPolyfill;
            }
          else
            SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
          if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
            createAndAccumulateChangeEvent(
              dispatchQueue,
              getTargetInstFunc,
              nativeEvent,
              nativeEventTarget
            );
            break a;
          }
          handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
          "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
        }
        handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
        switch (domEventName) {
          case "focusin":
            if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
              activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
            break;
          case "focusout":
            lastSelection = activeElementInst = activeElement = null;
            break;
          case "mousedown":
            mouseDown = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mouseDown = false;
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
            break;
          case "selectionchange":
            if (skipSelectionChangeEvent) break;
          case "keydown":
          case "keyup":
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
        }
        var fallbackData;
        if (canUseCompositionEvent)
          b: {
            switch (domEventName) {
              case "compositionstart":
                var eventType = "onCompositionStart";
                break b;
              case "compositionend":
                eventType = "onCompositionEnd";
                break b;
              case "compositionupdate":
                eventType = "onCompositionUpdate";
                break b;
            }
            eventType = void 0;
          }
        else
          isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
        eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
          eventType,
          domEventName,
          null,
          nativeEvent,
          nativeEventTarget
        ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
        if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
          eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
            "onBeforeInput",
            "beforeinput",
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({
            event: handleEventFunc,
            listeners: eventType
          }), handleEventFunc.data = fallbackData);
        extractEvents$1(
          dispatchQueue,
          domEventName,
          targetInst,
          nativeEvent,
          nativeEventTarget
        );
      }
      processDispatchQueue(dispatchQueue, eventSystemFlags);
    });
  }
  function createDispatchListener(instance, listener, currentTarget) {
    return {
      instance,
      listener,
      currentTarget
    };
  }
  function accumulateTwoPhaseListeners(targetFiber, reactName) {
    for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
      var _instance2 = targetFiber, stateNode = _instance2.stateNode;
      _instance2 = _instance2.tag;
      5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
        createDispatchListener(targetFiber, _instance2, stateNode)
      ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
        createDispatchListener(targetFiber, _instance2, stateNode)
      ));
      if (3 === targetFiber.tag) return listeners;
      targetFiber = targetFiber.return;
    }
    return [];
  }
  function getParent(inst) {
    if (null === inst) return null;
    do
      inst = inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag);
    return inst ? inst : null;
  }
  function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
    for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
      var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
      _instance3 = _instance3.tag;
      if (null !== alternate && alternate === common) break;
      5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
        createDispatchListener(target, stateNode, alternate)
      )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
        createDispatchListener(target, stateNode, alternate)
      )));
      target = target.return;
    }
    0 !== listeners.length && dispatchQueue.push({ event, listeners });
  }
  var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
  function normalizeMarkupForTextOrAttribute(markup) {
    return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
  }
  function checkForUnmatchedText(serverText, clientText) {
    clientText = normalizeMarkupForTextOrAttribute(clientText);
    return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
  }
  function setProp(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "children":
        "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
        break;
      case "className":
        setValueForKnownAttribute(domElement, "class", value);
        break;
      case "tabIndex":
        setValueForKnownAttribute(domElement, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        setValueForKnownAttribute(domElement, key, value);
        break;
      case "style":
        setValueForStyles(domElement, value, prevValue);
        break;
      case "data":
        if ("object" !== tag) {
          setValueForKnownAttribute(domElement, "data", value);
          break;
        }
      case "src":
      case "href":
        if ("" === value && ("a" !== tag || "href" !== key)) {
          domElement.removeAttribute(key);
          break;
        }
        if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL("" + value);
        domElement.setAttribute(key, value);
        break;
      case "action":
      case "formAction":
        if ("function" === typeof value) {
          domElement.setAttribute(
            key,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
            domElement,
            tag,
            "formEncType",
            props.formEncType,
            props,
            null
          ), setProp(
            domElement,
            tag,
            "formMethod",
            props.formMethod,
            props,
            null
          ), setProp(
            domElement,
            tag,
            "formTarget",
            props.formTarget,
            props,
            null
          )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
        if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL("" + value);
        domElement.setAttribute(key, value);
        break;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        break;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        break;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        break;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children) throw Error(formatProdErrorMessage(60));
            domElement.innerHTML = key;
          }
        }
        break;
      case "multiple":
        domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "muted":
        domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
          domElement.removeAttribute("xlink:href");
          break;
        }
        key = sanitizeURL("" + value);
        domElement.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          key
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
        break;
      case "capture":
      case "download":
        true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "rowSpan":
      case "start":
        null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
        break;
      case "popover":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        setValueForAttribute(domElement, "popover", value);
        break;
      case "xlinkActuate":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          value
        );
        break;
      case "xlinkArcrole":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          value
        );
        break;
      case "xlinkRole":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          value
        );
        break;
      case "xlinkShow":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          value
        );
        break;
      case "xlinkTitle":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          value
        );
        break;
      case "xlinkType":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          value
        );
        break;
      case "xmlBase":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          value
        );
        break;
      case "xmlLang":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          value
        );
        break;
      case "xmlSpace":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          value
        );
        break;
      case "is":
        setValueForAttribute(domElement, "is", value);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
          key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
    }
  }
  function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "style":
        setValueForStyles(domElement, value, prevValue);
        break;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children) throw Error(formatProdErrorMessage(60));
            domElement.innerHTML = key;
          }
        }
        break;
      case "children":
        "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
        break;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        break;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        break;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!registrationNameDependencies.hasOwnProperty(key))
          a: {
            if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
              "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
              domElement.addEventListener(tag, value, props);
              break a;
            }
            key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
          }
    }
  }
  function setInitialProperties(domElement, tag, props) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        var hasSrc = false, hasSrcSet = false, propKey;
        for (propKey in props)
          if (props.hasOwnProperty(propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "src":
                  hasSrc = true;
                  break;
                case "srcSet":
                  hasSrcSet = true;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(137, tag));
                default:
                  setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
        hasSrc && setProp(domElement, tag, "src", props.src, props, null);
        return;
      case "input":
        listenToNonDelegatedEvent("invalid", domElement);
        var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
        for (hasSrc in props)
          if (props.hasOwnProperty(hasSrc)) {
            var propValue$184 = props[hasSrc];
            if (null != propValue$184)
              switch (hasSrc) {
                case "name":
                  hasSrcSet = propValue$184;
                  break;
                case "type":
                  propValue = propValue$184;
                  break;
                case "checked":
                  checked = propValue$184;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$184;
                  break;
                case "value":
                  propKey = propValue$184;
                  break;
                case "defaultValue":
                  defaultValue = propValue$184;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propValue$184)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  setProp(domElement, tag, hasSrc, propValue$184, props, null);
              }
          }
        initInput(
          domElement,
          propKey,
          defaultValue,
          checked,
          defaultChecked,
          propValue,
          hasSrcSet,
          false
        );
        return;
      case "select":
        listenToNonDelegatedEvent("invalid", domElement);
        hasSrc = propValue = propKey = null;
        for (hasSrcSet in props)
          if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
            switch (hasSrcSet) {
              case "value":
                propKey = defaultValue;
                break;
              case "defaultValue":
                propValue = defaultValue;
                break;
              case "multiple":
                hasSrc = defaultValue;
              default:
                setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
            }
        tag = propKey;
        props = propValue;
        domElement.multiple = !!hasSrc;
        null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
        return;
      case "textarea":
        listenToNonDelegatedEvent("invalid", domElement);
        propKey = hasSrcSet = hasSrc = null;
        for (propValue in props)
          if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
            switch (propValue) {
              case "value":
                hasSrc = defaultValue;
                break;
              case "defaultValue":
                hasSrcSet = defaultValue;
                break;
              case "children":
                propKey = defaultValue;
                break;
              case "dangerouslySetInnerHTML":
                if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                break;
              default:
                setProp(domElement, tag, propValue, defaultValue, props, null);
            }
        initTextarea(domElement, hasSrc, hasSrcSet, propKey);
        return;
      case "option":
        for (checked in props)
          if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
            switch (checked) {
              case "selected":
                domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                break;
              default:
                setProp(domElement, tag, checked, hasSrc, props, null);
            }
        return;
      case "dialog":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        listenToNonDelegatedEvent("cancel", domElement);
        listenToNonDelegatedEvent("close", domElement);
        break;
      case "iframe":
      case "object":
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "video":
      case "audio":
        for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
          listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
        break;
      case "image":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", domElement);
        break;
      case "embed":
      case "source":
      case "link":
        listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (defaultChecked in props)
          if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
            switch (defaultChecked) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(formatProdErrorMessage(137, tag));
              default:
                setProp(domElement, tag, defaultChecked, hasSrc, props, null);
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (propValue$184 in props)
            props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
              domElement,
              tag,
              propValue$184,
              hasSrc,
              props,
              void 0
            ));
          return;
        }
    }
    for (defaultValue in props)
      props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
  }
  function updateProperties(domElement, tag, lastProps, nextProps) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
        for (propKey in lastProps) {
          var lastProp = lastProps[propKey];
          if (lastProps.hasOwnProperty(propKey) && null != lastProp)
            switch (propKey) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                lastDefaultValue = lastProp;
              default:
                nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
            }
        }
        for (var propKey$201 in nextProps) {
          var propKey = nextProps[propKey$201];
          lastProp = lastProps[propKey$201];
          if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
            switch (propKey$201) {
              case "type":
                type = propKey;
                break;
              case "name":
                name = propKey;
                break;
              case "checked":
                checked = propKey;
                break;
              case "defaultChecked":
                defaultChecked = propKey;
                break;
              case "value":
                value = propKey;
                break;
              case "defaultValue":
                defaultValue = propKey;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                propKey !== lastProp && setProp(
                  domElement,
                  tag,
                  propKey$201,
                  propKey,
                  nextProps,
                  lastProp
                );
            }
        }
        updateInput(
          domElement,
          value,
          defaultValue,
          lastDefaultValue,
          checked,
          defaultChecked,
          type,
          name
        );
        return;
      case "select":
        propKey = value = defaultValue = propKey$201 = null;
        for (type in lastProps)
          if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
            switch (type) {
              case "value":
                break;
              case "multiple":
                propKey = lastDefaultValue;
              default:
                nextProps.hasOwnProperty(type) || setProp(
                  domElement,
                  tag,
                  type,
                  null,
                  nextProps,
                  lastDefaultValue
                );
            }
        for (name in nextProps)
          if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
            switch (name) {
              case "value":
                propKey$201 = type;
                break;
              case "defaultValue":
                defaultValue = type;
                break;
              case "multiple":
                value = type;
              default:
                type !== lastDefaultValue && setProp(
                  domElement,
                  tag,
                  name,
                  type,
                  nextProps,
                  lastDefaultValue
                );
            }
        tag = defaultValue;
        lastProps = value;
        nextProps = propKey;
        null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
        return;
      case "textarea":
        propKey = propKey$201 = null;
        for (defaultValue in lastProps)
          if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
            switch (defaultValue) {
              case "value":
                break;
              case "children":
                break;
              default:
                setProp(domElement, tag, defaultValue, null, nextProps, name);
            }
        for (value in nextProps)
          if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
            switch (value) {
              case "value":
                propKey$201 = name;
                break;
              case "defaultValue":
                propKey = name;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (null != name) throw Error(formatProdErrorMessage(91));
                break;
              default:
                name !== type && setProp(domElement, tag, value, name, nextProps, type);
            }
        updateTextarea(domElement, propKey$201, propKey);
        return;
      case "option":
        for (var propKey$217 in lastProps)
          if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
            switch (propKey$217) {
              case "selected":
                domElement.selected = false;
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  propKey$217,
                  null,
                  nextProps,
                  propKey$201
                );
            }
        for (lastDefaultValue in nextProps)
          if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
            switch (lastDefaultValue) {
              case "selected":
                domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  lastDefaultValue,
                  propKey$201,
                  nextProps,
                  propKey
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var propKey$222 in lastProps)
          propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
        for (checked in nextProps)
          if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
            switch (checked) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey$201)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  checked,
                  propKey$201,
                  nextProps,
                  propKey
                );
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (var propKey$227 in lastProps)
            propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
              domElement,
              tag,
              propKey$227,
              void 0,
              nextProps,
              propKey$201
            );
          for (defaultChecked in nextProps)
            propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
              domElement,
              tag,
              defaultChecked,
              propKey$201,
              nextProps,
              propKey
            );
          return;
        }
    }
    for (var propKey$232 in lastProps)
      propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
    for (lastProp in nextProps)
      propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
  }
  function isLikelyStaticResource(initiatorType) {
    switch (initiatorType) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return true;
      default:
        return false;
    }
  }
  function estimateBandwidth() {
    if ("function" === typeof performance.getEntriesByType) {
      for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
        var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
        if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
          initiatorType = 0;
          duration = entry.responseEnd;
          for (i += 1; i < resourceEntries.length; i++) {
            var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
            if (overlapStartTime > duration) break;
            var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
            overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
          }
          --i;
          bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
          count++;
          if (10 < count) break;
        }
      }
      if (0 < count) return bits / count / 1e6;
    }
    return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
  }
  var eventsEnabled = null, selectionInformation = null;
  function getOwnerDocumentFromRootContainer(rootContainerElement) {
    return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
  }
  function getOwnHostContext(namespaceURI) {
    switch (namespaceURI) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function getChildHostContextProd(parentNamespace, type) {
    if (0 === parentNamespace)
      switch (type) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
  }
  function shouldSetTextContent(type, props) {
    return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
  }
  var currentPopstateTransitionEvent = null;
  function shouldAttemptEagerTransition() {
    var event = window.event;
    if (event && "popstate" === event.type) {
      if (event === currentPopstateTransitionEvent) return false;
      currentPopstateTransitionEvent = event;
      return true;
    }
    currentPopstateTransitionEvent = null;
    return false;
  }
  var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
    return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  } : scheduleTimeout;
  function handleErrorInNextTick(error) {
    setTimeout(function() {
      throw error;
    });
  }
  function isSingletonScope(type) {
    return "head" === type;
  }
  function clearHydrationBoundary(parentInstance, hydrationInstance) {
    var node = hydrationInstance, depth = 0;
    do {
      var nextNode = node.nextSibling;
      parentInstance.removeChild(node);
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node || "/&" === node) {
          if (0 === depth) {
            parentInstance.removeChild(nextNode);
            retryIfBlockedOn(hydrationInstance);
            return;
          }
          depth--;
        } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
          depth++;
        else if ("html" === node)
          releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
        else if ("head" === node) {
          node = parentInstance.ownerDocument.head;
          releaseSingletonInstance(node);
          for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
            var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
            node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
            node$jscomp$0 = nextNode$jscomp$0;
          }
        } else
          "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
      node = nextNode;
    } while (node);
    retryIfBlockedOn(hydrationInstance);
  }
  function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
    var node = suspenseInstance;
    suspenseInstance = 0;
    do {
      var nextNode = node.nextSibling;
      1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node)
          if (0 === suspenseInstance) break;
          else suspenseInstance--;
        else
          "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
      node = nextNode;
    } while (node);
  }
  function clearContainerSparingly(container) {
    var nextNode = container.firstChild;
    nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
    for (; nextNode; ) {
      var node = nextNode;
      nextNode = nextNode.nextSibling;
      switch (node.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          clearContainerSparingly(node);
          detachDeletedInstance(node);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if ("stylesheet" === node.rel.toLowerCase()) continue;
      }
      container.removeChild(node);
    }
  }
  function canHydrateInstance(instance, type, props, inRootOrSingleton) {
    for (; 1 === instance.nodeType; ) {
      var anyProps = props;
      if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
        if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
          break;
      } else if (!inRootOrSingleton)
        if ("input" === type && "hidden" === instance.type) {
          var name = null == anyProps.name ? null : "" + anyProps.name;
          if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
            return instance;
        } else return instance;
      else if (!instance[internalHoistableMarker])
        switch (type) {
          case "meta":
            if (!instance.hasAttribute("itemprop")) break;
            return instance;
          case "link":
            name = instance.getAttribute("rel");
            if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
              break;
            else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
              break;
            return instance;
          case "style":
            if (instance.hasAttribute("data-precedence")) break;
            return instance;
          case "script":
            name = instance.getAttribute("src");
            if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
              break;
            return instance;
          default:
            return instance;
        }
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) break;
    }
    return null;
  }
  function canHydrateTextInstance(instance, text, inRootOrSingleton) {
    if ("" === text) return null;
    for (; 3 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) return null;
    }
    return instance;
  }
  function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
    for (; 8 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) return null;
    }
    return instance;
  }
  function isSuspenseInstancePending(instance) {
    return "$?" === instance.data || "$~" === instance.data;
  }
  function isSuspenseInstanceFallback(instance) {
    return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
  }
  function registerSuspenseInstanceRetry(instance, callback) {
    var ownerDocument = instance.ownerDocument;
    if ("$~" === instance.data) instance._reactRetry = callback;
    else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
      callback();
    else {
      var listener = function() {
        callback();
        ownerDocument.removeEventListener("DOMContentLoaded", listener);
      };
      ownerDocument.addEventListener("DOMContentLoaded", listener);
      instance._reactRetry = listener;
    }
  }
  function getNextHydratable(node) {
    for (; null != node; node = node.nextSibling) {
      var nodeType = node.nodeType;
      if (1 === nodeType || 3 === nodeType) break;
      if (8 === nodeType) {
        nodeType = node.data;
        if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
          break;
        if ("/$" === nodeType || "/&" === nodeType) return null;
      }
    }
    return node;
  }
  var previousHydratableOnEnteringScopedSingleton = null;
  function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
    hydrationInstance = hydrationInstance.nextSibling;
    for (var depth = 0; hydrationInstance; ) {
      if (8 === hydrationInstance.nodeType) {
        var data = hydrationInstance.data;
        if ("/$" === data || "/&" === data) {
          if (0 === depth)
            return getNextHydratable(hydrationInstance.nextSibling);
          depth--;
        } else
          "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
      }
      hydrationInstance = hydrationInstance.nextSibling;
    }
    return null;
  }
  function getParentHydrationBoundary(targetInstance) {
    targetInstance = targetInstance.previousSibling;
    for (var depth = 0; targetInstance; ) {
      if (8 === targetInstance.nodeType) {
        var data = targetInstance.data;
        if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
          if (0 === depth) return targetInstance;
          depth--;
        } else "/$" !== data && "/&" !== data || depth++;
      }
      targetInstance = targetInstance.previousSibling;
    }
    return null;
  }
  function resolveSingletonInstance(type, props, rootContainerInstance) {
    props = getOwnerDocumentFromRootContainer(rootContainerInstance);
    switch (type) {
      case "html":
        type = props.documentElement;
        if (!type) throw Error(formatProdErrorMessage(452));
        return type;
      case "head":
        type = props.head;
        if (!type) throw Error(formatProdErrorMessage(453));
        return type;
      case "body":
        type = props.body;
        if (!type) throw Error(formatProdErrorMessage(454));
        return type;
      default:
        throw Error(formatProdErrorMessage(451));
    }
  }
  function releaseSingletonInstance(instance) {
    for (var attributes = instance.attributes; attributes.length; )
      instance.removeAttributeNode(attributes[0]);
    detachDeletedInstance(instance);
  }
  var preloadPropsMap = /* @__PURE__ */ new Map(), preconnectsSet = /* @__PURE__ */ new Set();
  function getHoistableRoot(container) {
    return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
  }
  var previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: flushSyncWork,
    r: requestFormReset,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  function flushSyncWork() {
    var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
    return previousWasRendering || wasRendering;
  }
  function requestFormReset(form) {
    var formInst = getInstanceFromNode(form);
    null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
  }
  var globalDocument = "undefined" === typeof document ? null : document;
  function preconnectAs(rel, href, crossOrigin) {
    var ownerDocument = globalDocument;
    if (ownerDocument && "string" === typeof href && href) {
      var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
      limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
      "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
      preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
    }
  }
  function prefetchDNS(href) {
    previousDispatcher.D(href);
    preconnectAs("dns-prefetch", href, null);
  }
  function preconnect(href, crossOrigin) {
    previousDispatcher.C(href, crossOrigin);
    preconnectAs("preconnect", href, crossOrigin);
  }
  function preload(href, as, options2) {
    previousDispatcher.L(href, as, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href && as) {
      var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
      "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
        options2.imageSrcSet
      ) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
        options2.imageSizes
      ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
      var key = preloadSelector;
      switch (as) {
        case "style":
          key = getStyleKey(href);
          break;
        case "script":
          key = getScriptKey(href);
      }
      preloadPropsMap.has(key) || (href = assign(
        {
          rel: "preload",
          href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
          as
        },
        options2
      ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
    }
  }
  function preloadModule(href, options2) {
    previousDispatcher.m(href, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
      switch (as) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          key = getScriptKey(href);
      }
      if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
        switch (as) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
              return;
        }
        as = ownerDocument.createElement("link");
        setInitialProperties(as, "link", href);
        markNodeAsHoistable(as);
        ownerDocument.head.appendChild(as);
      }
    }
  }
  function preinitStyle(href, precedence, options2) {
    previousDispatcher.S(href, precedence, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
      precedence = precedence || "default";
      var resource = styles.get(key);
      if (!resource) {
        var state = { loading: 0, preload: null };
        if (resource = ownerDocument.querySelector(
          getStylesheetSelectorFromKey(key)
        ))
          state.loading = 5;
        else {
          href = assign(
            { rel: "stylesheet", href, "data-precedence": precedence },
            options2
          );
          (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
          var link = resource = ownerDocument.createElement("link");
          markNodeAsHoistable(link);
          setInitialProperties(link, "link", href);
          link._p = new Promise(function(resolve, reject) {
            link.onload = resolve;
            link.onerror = reject;
          });
          link.addEventListener("load", function() {
            state.loading |= 1;
          });
          link.addEventListener("error", function() {
            state.loading |= 2;
          });
          state.loading |= 4;
          insertStylesheet(resource, precedence, ownerDocument);
        }
        resource = {
          type: "stylesheet",
          instance: resource,
          count: 1,
          state
        };
        styles.set(key, resource);
      }
    }
  }
  function preinitScript(src, options2) {
    previousDispatcher.X(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function preinitModuleScript(src, options2) {
    previousDispatcher.M(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function getResource(type, currentProps, pendingProps, currentResource) {
    var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
    if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
    switch (type) {
      case "meta":
      case "title":
        return null;
      case "style":
        return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
          JSCompiler_inline_result
        ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
          type = getStyleKey(pendingProps.href);
          var styles$243 = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableStyles, resource$244 = styles$243.get(type);
          resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
            getStylesheetSelectorFromKey(type)
          )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
            rel: "preload",
            as: "style",
            href: pendingProps.href,
            crossOrigin: pendingProps.crossOrigin,
            integrity: pendingProps.integrity,
            media: pendingProps.media,
            hrefLang: pendingProps.hrefLang,
            referrerPolicy: pendingProps.referrerPolicy
          }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
            JSCompiler_inline_result,
            type,
            pendingProps,
            resource$244.state
          )));
          if (currentProps && null === currentResource)
            throw Error(formatProdErrorMessage(528, ""));
          return resource$244;
        }
        if (currentProps && null !== currentResource)
          throw Error(formatProdErrorMessage(529, ""));
        return null;
      case "script":
        return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
          JSCompiler_inline_result
        ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(formatProdErrorMessage(444, type));
    }
  }
  function getStyleKey(href) {
    return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
  }
  function getStylesheetSelectorFromKey(key) {
    return 'link[rel="stylesheet"][' + key + "]";
  }
  function stylesheetPropsFromRawProps(rawProps) {
    return assign({}, rawProps, {
      "data-precedence": rawProps.precedence,
      precedence: null
    });
  }
  function preloadStylesheet(ownerDocument, key, preloadProps, state) {
    ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
      return state.loading |= 1;
    }), key.addEventListener("error", function() {
      return state.loading |= 2;
    }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
  }
  function getScriptKey(src) {
    return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
  }
  function getScriptSelectorFromKey(key) {
    return "script[async]" + key;
  }
  function acquireResource(hoistableRoot, resource, props) {
    resource.count++;
    if (null === resource.instance)
      switch (resource.type) {
        case "style":
          var instance = hoistableRoot.querySelector(
            'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
          );
          if (instance)
            return resource.instance = instance, markNodeAsHoistable(instance), instance;
          var styleProps = assign({}, props, {
            "data-href": props.href,
            "data-precedence": props.precedence,
            href: null,
            precedence: null
          });
          instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
            "style"
          );
          markNodeAsHoistable(instance);
          setInitialProperties(instance, "style", styleProps);
          insertStylesheet(instance, props.precedence, hoistableRoot);
          return resource.instance = instance;
        case "stylesheet":
          styleProps = getStyleKey(props.href);
          var instance$249 = hoistableRoot.querySelector(
            getStylesheetSelectorFromKey(styleProps)
          );
          if (instance$249)
            return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
          instance = stylesheetPropsFromRawProps(props);
          (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
          instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
          markNodeAsHoistable(instance$249);
          var linkInstance = instance$249;
          linkInstance._p = new Promise(function(resolve, reject) {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance$249, "link", instance);
          resource.state.loading |= 4;
          insertStylesheet(instance$249, props.precedence, hoistableRoot);
          return resource.instance = instance$249;
        case "script":
          instance$249 = getScriptKey(props.src);
          if (styleProps = hoistableRoot.querySelector(
            getScriptSelectorFromKey(instance$249)
          ))
            return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
          instance = props;
          if (styleProps = preloadPropsMap.get(instance$249))
            instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
          hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
          styleProps = hoistableRoot.createElement("script");
          markNodeAsHoistable(styleProps);
          setInitialProperties(styleProps, "link", instance);
          hoistableRoot.head.appendChild(styleProps);
          return resource.instance = styleProps;
        case "void":
          return null;
        default:
          throw Error(formatProdErrorMessage(443, resource.type));
      }
    else
      "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
    return resource.instance;
  }
  function insertStylesheet(instance, precedence, root2) {
    for (var nodes = root2.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.dataset.precedence === precedence) prior = node;
      else if (prior !== last) break;
    }
    prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
  }
  function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
    null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
    null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
    null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
  }
  function adoptPreloadPropsForScript(scriptProps, preloadProps) {
    null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
    null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
    null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
  }
  var tagCaches = null;
  function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
    if (null === tagCaches) {
      var cache = /* @__PURE__ */ new Map();
      var caches = tagCaches = /* @__PURE__ */ new Map();
      caches.set(ownerDocument, cache);
    } else
      caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
    if (cache.has(type)) return cache;
    cache.set(type, null);
    ownerDocument = ownerDocument.getElementsByTagName(type);
    for (caches = 0; caches < ownerDocument.length; caches++) {
      var node = ownerDocument[caches];
      if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
        var nodeKey = node.getAttribute(keyAttribute) || "";
        nodeKey = type + nodeKey;
        var existing = cache.get(nodeKey);
        existing ? existing.push(node) : cache.set(nodeKey, [node]);
      }
    }
    return cache;
  }
  function mountHoistable(hoistableRoot, type, instance) {
    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
    hoistableRoot.head.insertBefore(
      instance,
      "title" === type ? hoistableRoot.querySelector("head > title") : null
    );
  }
  function isHostHoistableType(type, props, hostContext) {
    if (1 === hostContext || null != props.itemProp) return false;
    switch (type) {
      case "meta":
      case "title":
        return true;
      case "style":
        if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
          break;
        return true;
      case "link":
        if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
          break;
        switch (props.rel) {
          case "stylesheet":
            return type = props.disabled, "string" === typeof props.precedence && null == type;
          default:
            return true;
        }
      case "script":
        if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
          return true;
    }
    return false;
  }
  function preloadResource(resource) {
    return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
  }
  function suspendResource(state, hoistableRoot, resource, props) {
    if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
      if (null === resource.instance) {
        var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
          getStylesheetSelectorFromKey(key)
        );
        if (instance) {
          hoistableRoot = instance._p;
          null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
          resource.state.loading |= 4;
          resource.instance = instance;
          markNodeAsHoistable(instance);
          return;
        }
        instance = hoistableRoot.ownerDocument || hoistableRoot;
        props = stylesheetPropsFromRawProps(props);
        (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
        instance = instance.createElement("link");
        markNodeAsHoistable(instance);
        var linkInstance = instance;
        linkInstance._p = new Promise(function(resolve, reject) {
          linkInstance.onload = resolve;
          linkInstance.onerror = reject;
        });
        setInitialProperties(instance, "link", props);
        resource.instance = instance;
      }
      null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
      state.stylesheets.set(resource, hoistableRoot);
      (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
    }
  }
  var estimatedBytesWithinLimit = 0;
  function waitForCommitToBeReady(state, timeoutOffset) {
    state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
    return 0 < state.count || 0 < state.imgCount ? function(commit) {
      var stylesheetTimer = setTimeout(function() {
        state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
        if (state.unsuspend) {
          var unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      }, 6e4 + timeoutOffset);
      0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
      var imgTimer = setTimeout(
        function() {
          state.waitingForImages = false;
          if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
            var unsuspend = state.unsuspend;
            state.unsuspend = null;
            unsuspend();
          }
        },
        (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
      );
      state.unsuspend = commit;
      return function() {
        state.unsuspend = null;
        clearTimeout(stylesheetTimer);
        clearTimeout(imgTimer);
      };
    } : null;
  }
  function onUnsuspend() {
    this.count--;
    if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
      if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
      else if (this.unsuspend) {
        var unsuspend = this.unsuspend;
        this.unsuspend = null;
        unsuspend();
      }
    }
  }
  var precedencesByRoot = null;
  function insertSuspendedStylesheets(state, resources) {
    state.stylesheets = null;
    null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
  }
  function insertStylesheetIntoRoot(root2, resource) {
    if (!(resource.state.loading & 4)) {
      var precedences = precedencesByRoot.get(root2);
      if (precedences) var last = precedences.get(null);
      else {
        precedences = /* @__PURE__ */ new Map();
        precedencesByRoot.set(root2, precedences);
        for (var nodes = root2.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
            precedences.set(node.dataset.precedence, node), last = node;
        }
        last && precedences.set(null, last);
      }
      nodes = resource.instance;
      node = nodes.getAttribute("data-precedence");
      i = precedences.get(node) || last;
      i === last && precedences.set(null, nodes);
      precedences.set(node, nodes);
      this.count++;
      last = onUnsuspend.bind(this);
      nodes.addEventListener("load", last);
      nodes.addEventListener("error", last);
      i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
      resource.state.loading |= 4;
    }
  }
  var HostTransitionContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    Consumer: null,
    _currentValue: sharedNotPendingObject,
    _currentValue2: sharedNotPendingObject,
    _threadCount: 0
  };
  function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
    this.tag = 1;
    this.containerInfo = containerInfo;
    this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
    this.callbackPriority = 0;
    this.expirationTimes = createLaneMap(-1);
    this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = createLaneMap(0);
    this.hiddenUpdates = createLaneMap(null);
    this.identifierPrefix = identifierPrefix;
    this.onUncaughtError = onUncaughtError;
    this.onCaughtError = onCaughtError;
    this.onRecoverableError = onRecoverableError;
    this.pooledCache = null;
    this.pooledCacheLanes = 0;
    this.formState = formState;
    this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
    containerInfo = new FiberRootNode(
      containerInfo,
      tag,
      hydrate,
      identifierPrefix,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      onDefaultTransitionIndicator,
      formState
    );
    tag = 1;
    true === isStrictMode && (tag |= 24);
    isStrictMode = createFiberImplClass(3, null, null, tag);
    containerInfo.current = isStrictMode;
    isStrictMode.stateNode = containerInfo;
    tag = createCache();
    tag.refCount++;
    containerInfo.pooledCache = tag;
    tag.refCount++;
    isStrictMode.memoizedState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: tag
    };
    initializeUpdateQueue(isStrictMode);
    return containerInfo;
  }
  function getContextForSubtree(parentComponent) {
    if (!parentComponent) return emptyContextObject;
    parentComponent = emptyContextObject;
    return parentComponent;
  }
  function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    parentComponent = getContextForSubtree(parentComponent);
    null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
    container = createUpdate(lane);
    container.payload = { element };
    callback = void 0 === callback ? null : callback;
    null !== callback && (container.callback = callback);
    element = enqueueUpdate(rootFiber, container, lane);
    null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
  }
  function markRetryLaneImpl(fiber, retryLane) {
    fiber = fiber.memoizedState;
    if (null !== fiber && null !== fiber.dehydrated) {
      var a = fiber.retryLane;
      fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
    }
  }
  function markRetryLaneIfNotHydrated(fiber, retryLane) {
    markRetryLaneImpl(fiber, retryLane);
    (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
  }
  function attemptContinuousHydration(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
      markRetryLaneIfNotHydrated(fiber, 67108864);
    }
  }
  function attemptHydrationAtCurrentPriority(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var lane = requestUpdateLane();
      lane = getBumpedLaneForHydrationByLane(lane);
      var root2 = enqueueConcurrentRenderForLane(fiber, lane);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
  }
  var _enabled = true;
  function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (_enabled) {
      var blockedOn = findInstanceBlockingEvent(nativeEvent);
      if (null === blockedOn)
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          return_targetInst,
          targetContainer
        ), clearIfContinuousEvent(domEventName, nativeEvent);
      else if (queueIfContinuousEvent(
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      ))
        nativeEvent.stopPropagation();
      else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
        for (; null !== blockedOn; ) {
          var fiber = getInstanceFromNode(blockedOn);
          if (null !== fiber)
            switch (fiber.tag) {
              case 3:
                fiber = fiber.stateNode;
                if (fiber.current.memoizedState.isDehydrated) {
                  var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                  if (0 !== lanes) {
                    var root2 = fiber;
                    root2.pendingLanes |= 2;
                    for (root2.entangledLanes |= 2; lanes; ) {
                      var lane = 1 << 31 - clz32(lanes);
                      root2.entanglements[1] |= lane;
                      lanes &= ~lane;
                    }
                    ensureRootIsScheduled(fiber);
                    0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
                  }
                }
                break;
              case 31:
              case 13:
                root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
            }
          fiber = findInstanceBlockingEvent(nativeEvent);
          null === fiber && dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            return_targetInst,
            targetContainer
          );
          if (fiber === blockedOn) break;
          blockedOn = fiber;
        }
        null !== blockedOn && nativeEvent.stopPropagation();
      } else
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          null,
          targetContainer
        );
    }
  }
  function findInstanceBlockingEvent(nativeEvent) {
    nativeEvent = getEventTarget(nativeEvent);
    return findInstanceBlockingTarget(nativeEvent);
  }
  var return_targetInst = null;
  function findInstanceBlockingTarget(targetNode) {
    return_targetInst = null;
    targetNode = getClosestInstanceFromNode(targetNode);
    if (null !== targetNode) {
      var nearestMounted = getNearestMountedFiber(targetNode);
      if (null === nearestMounted) targetNode = null;
      else {
        var tag = nearestMounted.tag;
        if (13 === tag) {
          targetNode = getSuspenseInstanceFromFiber(nearestMounted);
          if (null !== targetNode) return targetNode;
          targetNode = null;
        } else if (31 === tag) {
          targetNode = getActivityInstanceFromFiber(nearestMounted);
          if (null !== targetNode) return targetNode;
          targetNode = null;
        } else if (3 === tag) {
          if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
            return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          targetNode = null;
        } else nearestMounted !== targetNode && (targetNode = null);
      }
    }
    return_targetInst = targetNode;
    return null;
  }
  function getEventPriority(domEventName) {
    switch (domEventName) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (getCurrentPriorityLevel()) {
          case ImmediatePriority:
            return 2;
          case UserBlockingPriority:
            return 8;
          case NormalPriority$1:
          case LowPriority:
            return 32;
          case IdlePriority:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = /* @__PURE__ */ new Map(), queuedPointerCaptures = /* @__PURE__ */ new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function clearIfContinuousEvent(domEventName, nativeEvent) {
    switch (domEventName) {
      case "focusin":
      case "focusout":
        queuedFocus = null;
        break;
      case "dragenter":
      case "dragleave":
        queuedDrag = null;
        break;
      case "mouseover":
      case "mouseout":
        queuedMouse = null;
        break;
      case "pointerover":
      case "pointerout":
        queuedPointers.delete(nativeEvent.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        queuedPointerCaptures.delete(nativeEvent.pointerId);
    }
  }
  function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
      return existingQueuedEvent = {
        blockedOn,
        domEventName,
        eventSystemFlags,
        nativeEvent,
        targetContainers: [targetContainer]
      }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
    existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
    blockedOn = existingQueuedEvent.targetContainers;
    null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
    return existingQueuedEvent;
  }
  function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    switch (domEventName) {
      case "focusin":
        return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedFocus,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "dragenter":
        return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedDrag,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "mouseover":
        return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedMouse,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "pointerover":
        var pointerId = nativeEvent.pointerId;
        queuedPointers.set(
          pointerId,
          accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedPointers.get(pointerId) || null,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          )
        );
        return true;
      case "gotpointercapture":
        return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
          pointerId,
          accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedPointerCaptures.get(pointerId) || null,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          )
        ), true;
    }
    return false;
  }
  function attemptExplicitHydrationTarget(queuedTarget) {
    var targetInst = getClosestInstanceFromNode(queuedTarget.target);
    if (null !== targetInst) {
      var nearestMounted = getNearestMountedFiber(targetInst);
      if (null !== nearestMounted) {
        if (targetInst = nearestMounted.tag, 13 === targetInst) {
          if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (31 === targetInst) {
          if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
          queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          return;
        }
      }
    }
    queuedTarget.blockedOn = null;
  }
  function attemptReplayContinuousQueuedEvent(queuedEvent) {
    if (null !== queuedEvent.blockedOn) return false;
    for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
      var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
      if (null === nextBlockedOn) {
        nextBlockedOn = queuedEvent.nativeEvent;
        var nativeEventClone = new nextBlockedOn.constructor(
          nextBlockedOn.type,
          nextBlockedOn
        );
        currentReplayingEvent = nativeEventClone;
        nextBlockedOn.target.dispatchEvent(nativeEventClone);
        currentReplayingEvent = null;
      } else
        return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
      targetContainers.shift();
    }
    return true;
  }
  function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
    attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
  }
  function replayUnblockedEvents() {
    hasScheduledReplayAttempt = false;
    null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
    null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
    null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
    queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
    queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
  }
  function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
    queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
      Scheduler.unstable_NormalPriority,
      replayUnblockedEvents
    )));
  }
  var lastScheduledReplayQueue = null;
  function scheduleReplayQueueIfNeeded(formReplayingQueue) {
    lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
      Scheduler.unstable_NormalPriority,
      function() {
        lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
        for (var i = 0; i < formReplayingQueue.length; i += 3) {
          var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
          if ("function" !== typeof submitterOrAction)
            if (null === findInstanceBlockingTarget(submitterOrAction || form))
              continue;
            else break;
          var formInst = getInstanceFromNode(form);
          null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
            formInst,
            {
              pending: true,
              data: formData,
              method: form.method,
              action: submitterOrAction
            },
            submitterOrAction,
            formData
          ));
        }
      }
    ));
  }
  function retryIfBlockedOn(unblocked) {
    function unblock(queuedEvent) {
      return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
    }
    null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
    null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
    null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
    queuedPointers.forEach(unblock);
    queuedPointerCaptures.forEach(unblock);
    for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
      var queuedTarget = queuedExplicitHydrationTargets[i];
      queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
    }
    for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
      attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
    i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
    if (null != i)
      for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
        var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
        if ("function" === typeof submitterOrAction)
          formProps || scheduleReplayQueueIfNeeded(i);
        else if (formProps) {
          var action = null;
          if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
            if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
              action = formProps.formAction;
            else {
              if (null !== findInstanceBlockingTarget(form)) continue;
            }
          else action = formProps.action;
          "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
          scheduleReplayQueueIfNeeded(i);
        }
      }
  }
  function defaultOnDefaultTransitionIndicator() {
    function handleNavigate(event) {
      event.canIntercept && "react-transition" === event.info && event.intercept({
        handler: function() {
          return new Promise(function(resolve) {
            return pendingResolve = resolve;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function handleNavigateComplete() {
      null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      isCancelled || setTimeout(startFakeNavigation, 20);
    }
    function startFakeNavigation() {
      if (!isCancelled && !navigation.transition) {
        var currentEntry = navigation.currentEntry;
        currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
          state: currentEntry.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if ("object" === typeof navigation) {
      var isCancelled = false, pendingResolve = null;
      navigation.addEventListener("navigate", handleNavigate);
      navigation.addEventListener("navigatesuccess", handleNavigateComplete);
      navigation.addEventListener("navigateerror", handleNavigateComplete);
      setTimeout(startFakeNavigation, 100);
      return function() {
        isCancelled = true;
        navigation.removeEventListener("navigate", handleNavigate);
        navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
        navigation.removeEventListener("navigateerror", handleNavigateComplete);
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      };
    }
  }
  function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
    var root2 = this._internalRoot;
    if (null === root2) throw Error(formatProdErrorMessage(409));
    var current = root2.current, lane = requestUpdateLane();
    updateContainerImpl(current, lane, children, root2, null, null);
  };
  ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
    var root2 = this._internalRoot;
    if (null !== root2) {
      this._internalRoot = null;
      var container = root2.containerInfo;
      updateContainerImpl(root2.current, 2, null, root2, null, null);
      flushSyncWork$1();
      container[internalContainerInstanceKey] = null;
    }
  };
  function ReactDOMHydrationRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
    if (target) {
      var updatePriority = resolveUpdatePriority();
      target = { blockedOn: null, target, priority: updatePriority };
      for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
      queuedExplicitHydrationTargets.splice(i, 0, target);
      0 === i && attemptExplicitHydrationTarget(target);
    }
  };
  var isomorphicReactPackageVersion$jscomp$inline_1840 = React2.version;
  if ("19.2.7" !== isomorphicReactPackageVersion$jscomp$inline_1840)
    throw Error(
      formatProdErrorMessage(
        527,
        isomorphicReactPackageVersion$jscomp$inline_1840,
        "19.2.7"
      )
    );
  ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
    var fiber = componentOrElement._reactInternals;
    if (void 0 === fiber) {
      if ("function" === typeof componentOrElement.render)
        throw Error(formatProdErrorMessage(188));
      componentOrElement = Object.keys(componentOrElement).join(",");
      throw Error(formatProdErrorMessage(268, componentOrElement));
    }
    componentOrElement = findCurrentFiberUsingSlowPath(fiber);
    componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
    componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
    return componentOrElement;
  };
  var internals$jscomp$inline_2347 = {
    bundleType: 0,
    version: "19.2.7",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ReactSharedInternals,
    reconcilerVersion: "19.2.7"
  };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
      try {
        rendererID = hook$jscomp$inline_2348.inject(
          internals$jscomp$inline_2347
        ), injectedHook = hook$jscomp$inline_2348;
      } catch (err) {
      }
  }
  reactDomClient_production.createRoot = function(container, options2) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
    options2 = createFiberRoot(
      container,
      1,
      false,
      null,
      null,
      isStrictMode,
      identifierPrefix,
      null,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      defaultOnDefaultTransitionIndicator
    );
    container[internalContainerInstanceKey] = options2.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMRoot(options2);
  };
  reactDomClient_production.hydrateRoot = function(container, initialChildren, options2) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
    initialChildren = createFiberRoot(
      container,
      1,
      true,
      initialChildren,
      null != options2 ? options2 : null,
      isStrictMode,
      identifierPrefix,
      formState,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      defaultOnDefaultTransitionIndicator
    );
    initialChildren.context = getContextForSubtree(null);
    options2 = initialChildren.current;
    isStrictMode = requestUpdateLane();
    isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
    identifierPrefix = createUpdate(isStrictMode);
    identifierPrefix.callback = null;
    enqueueUpdate(options2, identifierPrefix, isStrictMode);
    options2 = isStrictMode;
    initialChildren.current.lanes = options2;
    markRootUpdated$1(initialChildren, options2);
    ensureRootIsScheduled(initialChildren);
    container[internalContainerInstanceKey] = initialChildren.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMHydrationRoot(initialChildren);
  };
  reactDomClient_production.version = "19.2.7";
  return reactDomClient_production;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client.exports;
  hasRequiredClient = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    client.exports = requireReactDomClient_production();
  }
  return client.exports;
}
var clientExports = requireClient();
const HTML_LANGS = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  th: "th-TH",
  id: "id-ID",
  ru: "ru-RU",
  ar: "ar-SA",
  pt: "pt-BR",
  it: "it-IT",
  pl: "pl-PL",
  nl: "nl-NL",
  ms: "ms-MY",
  he: "he-IL",
  hi: "hi-IN",
  "zh-TW": "zh-TW"
};
function htmlLang(lang) {
  return HTML_LANGS[lang];
}
const MAC_KEY_NAMES = {
  "⌫": "Backspace",
  "⌦": "Delete",
  "⏎": "Enter",
  "↩": "Enter",
  "␣": "Space"
};
const HAS_MAC_SYMBOL = /[⌘⌃⌥⇧⌫⌦⏎↩␣]/;
const CHORD = /([⌘⌃⌥⇧]+)(F\d{1,2}|[A-Za-z0-9±=`'\\,./;[\]\-←↑→↓⌫⌦⏎↩␣]|\+)?/g;
function chordToWin(mods, key) {
  const parts = [];
  if (mods.includes("⌘") || mods.includes("⌃")) parts.push("Ctrl");
  if (mods.includes("⌥")) parts.push("Alt");
  if (mods.includes("⇧")) parts.push("Shift");
  if (key) parts.push(MAC_KEY_NAMES[key] ?? key);
  return parts.join("+");
}
function macShortcutsToWin(text) {
  if (!HAS_MAC_SYMBOL.test(text)) return text;
  return text.replace(new RegExp("⌘\\/(?=\\p{L}{2})", "gu"), "").replace(
    CHORD,
    (_m, mods, key) => key === "+" ? `${chordToWin(mods, void 0)}+` : chordToWin(mods, key)
  ).replace(/[⌫⌦⏎↩␣]/g, (glyph) => MAC_KEY_NAMES[glyph] ?? glyph);
}
const IS_MAC$1 = (() => {
  const g = globalThis;
  if (g.navigator?.platform) return /mac/i.test(g.navigator.platform);
  return g.process?.platform === "darwin";
})();
const platformShortcuts = IS_MAC$1 ? (text) => text : macShortcutsToWin;
function format(template, params) {
  if (!params) return template;
  return template.replace(
    /\{(\w+)\}/g,
    (match, name) => name in params ? String(params[name]) : match
  );
}
function createI18n(dicts) {
  return (lang, key, params) => platformShortcuts(format(dicts[lang][key], params));
}
const companyName = "Bati AI";
const productName = "BatiOffice";
const assistantName = "Bati AI";
const appId = "ai.bati.office";
const apps = { "docs": { "productName": "BatiOffice Docs", "appId": "ai.bati.office.docs" }, "sheets": { "productName": "BatiOffice Sheets", "appId": "ai.bati.office.sheets" }, "slides": { "productName": "BatiOffice Slides", "appId": "ai.bati.office.slides" }, "pdf": { "productName": "BatiOffice PDF", "appId": "ai.bati.office.pdf" }, "markdown": { "productName": "BatiOffice Markdown", "appId": "ai.bati.office.markdown" }, "hwp": { "productName": "BatiOffice HWP", "appId": "ai.bati.office.hwp", "icon": { "background": "#E2F1F6", "foreground": "#0F83A8" } } };
const manifest = {
  companyName,
  productName,
  assistantName,
  appId,
  apps
};
const brand = Object.freeze(manifest);
function appBrand(app) {
  return brand.apps[app];
}
const batiMark = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFkklEQVR4nN2bQVLbSBSGXxspWeAUvkHsRUh2cdZAYU4QzwkCJwBOgHKCYU4QcYI4J8BUyDpmF8gCc4KIGrIYbNTzPwWlPIWkfrJakpmvqqtfg2h1//36dbvbKFoweq3L1t3dP5thqPpK6TaR6mpNLaUoINIjlAOtaOAuPfk0DDoBFWRhBOCOT6e3uzD3uMPIJfiu+2S/iBALIcB683uPKPyYo+O/Yc9QSu1//nvVpzmoXYCNZxfbYag/wCyK/+Xnyx3kuVBItWGx8zG5RVBItcBur3V4DNMyev/Lz1eHMETUIsB9wLucZ85LQGDsIDCOSUAtAqw3zz10/gBmWRxhKmyTgMoFkI4+ovu11tpz3acDHk3+u7u7ST8MQw+/fU4GXFe9GQarI5iZWBdgo/l9E9l/+Hzz4gRZxMazc3SCPsLM4gxu3EPHA9gPWFs+94noHVIGsligkArBIzOdTN6R0j2Mah8/SgQjOuAdHIW0hWJG4/UVRr2b1vkYiDBC9hopjRGmwRvkmSikuVlfvthFxz10vIWiJWQjJ/EkCGDsn/GBJHjUJ5PbY5hdJKvA9cURHF6gkaVSigC91kV3MtGsfJtKQNLoGAgwQvYaKRGlGlunNy+GlIH4ZUyZIx+TUwCNLBVJXcYHZllvfjvWWvWoRCSNZu498SvMVCR1GR+IKWHfnoik0Qw2U/zpsQ8zBX2FYNomA6KXMXC3S2RtEoCDjBNkEfCYTWRiJAKg8wfovEcZ4CPyX6c3q3swMzG+jJEsOQzW+veO8+QQUTxAMSKKG9NbnzS9RdFIlgDs9tOp5s73UczE6k4Qo+9T5uaFqNFQO1mHEmvL3/bwuj9hZgLvGVIC8KQeCUEdJ6c3r3okQCQAXO4HVG/BTETqbgiiQ3RkE2apSJa/GJEA8ACNLBXp5kU6lQpyhGm0TUKMAkRzeHL7A2YimPfXpzcvWzCNmOoqSh7XjxEIYFxvx1C8g1yEyZvmhTvvOE/78MQARTEKyYip0RBAVA9jqmtOcrn9LKKGmxrdaGSvALOY6soDjzrRkicNeEkoJCNrzfOBYR0fIxBi3TW7X3EB9BWi/MBxyJes8yZkAsjW8BFE2DKJYBIAndtC9gDHcUamuudBIRlB9G4jel/CzAQrQqBJ+Q1SAxQTCXU4pAwwl0VtsoX4ZevNi0Ot9S7MUllYAeAFLZzmjrEjXEGxNBZWAKaKndxCC8AIA+LcLLwATJmHI49CAObXFjkcoIrnKFrj0QgQ88sbZNdVEh6dADH3HtFDlV1sUduUguk8oKEaPUpgyXHOatsI2cS0ExQwxo5r4Dp0VNlW2CYWBPgNPG0I33hf+ochm9gUYAYfsWMHeW4UUqWUJEDkDTgQ+SNvnPjfCMCwCDgS24IpRiFVSpkC3JNrOiikSqlAAHiC5WNxm5gEgBufIHuAaf8wC+oQTwWFVCkmAeC+qW2KNltT7RmO5yKsXo3ZpIgAMbip8nAucQAzFSW8rTK+zDY2BGAkB7Woq4M8E4VUKbYEiKZD9oWNqC7jA7axJQBjoy7jA7ax0egY1MUe0EVKRLIcil9mCwSwAAFsBWYiuFvoYDs7JgEQoLCYxgdsY/6OwCP4omQRMGo+ZXzbhC9XHCfyggDFVFDPV2RdpDTOIEDW7yMqF0AyciDzmg2d/4BsmzKReVLlAjCmOMCwJ5BWnuO6nyDEmC9mJne3bykkj4jaZAACdvjvyIBCqhwI4EGAA5hlIf6+QC0C8GiWec0mHX2mFgEYYSzITaMh/7IGU5sATAnXbGLXj6lVAMaiCLk7z9QuAMPTAfHAR1pBMRdYLa7x0Xcvj9vPshACMPeBEd4Q/fO0VIgjBLy9Ycp+QcLCCDALewQCZB9HW200scuC8EhjczPSpIIGboaWltxBkY7H/AvwwspfraFlOwAAAABJRU5ErkJggg==";
const INITIAL_DELAY_MS = 500;
const RESHOW_DELAY_MS = 100;
const WARM_WINDOW_MS = 500;
const AUTO_HIDE_MS = 5e3;
const OFFSET_PX = 6;
const EDGE_PAD_PX = 4;
let tip = null;
let showTimer = null;
let autoHideTimer = null;
let anchor = null;
let suppressed = null;
let warmUntil = 0;
function ensureTip(doc) {
  if (tip && tip.el.isConnected) return tip;
  const el = doc.createElement("div");
  el.className = "ui-screentip";
  el.setAttribute("role", "tooltip");
  const name = doc.createElement("span");
  name.className = "ui-screentip-name";
  const kbd = doc.createElement("span");
  kbd.className = "ui-screentip-kbd";
  const detail = doc.createElement("div");
  detail.className = "ui-screentip-detail";
  el.append(name, kbd, detail);
  doc.body.appendChild(el);
  tip = { el, name, kbd, detail };
  return tip;
}
function cancelShow() {
  if (showTimer !== null) {
    window.clearTimeout(showTimer);
    showTimer = null;
  }
}
function hide() {
  cancelShow();
  if (autoHideTimer !== null) {
    window.clearTimeout(autoHideTimer);
    autoHideTimer = null;
  }
  if (tip && tip.el.style.visibility === "visible") {
    tip.el.style.visibility = "hidden";
    warmUntil = Date.now() + WARM_WINDOW_MS;
  }
  anchor = null;
}
function show(el, doc) {
  const text = el.getAttribute("data-tip");
  if (!text) return;
  const t = ensureTip(doc);
  t.name.textContent = text;
  const kbd = el.getAttribute("data-tip-kbd");
  t.kbd.textContent = kbd ?? "";
  t.kbd.style.display = kbd ? "" : "none";
  const detail = el.getAttribute("data-tip-detail");
  t.detail.textContent = detail ?? "";
  t.detail.style.display = detail ? "" : "none";
  t.el.style.visibility = "hidden";
  t.el.style.left = "0px";
  t.el.style.top = "0px";
  const anchorSel = el.getAttribute("data-tip-anchor");
  const rect = (anchorSel && el.querySelector(anchorSel) || el).getBoundingClientRect();
  const tipRect = t.el.getBoundingClientRect();
  const maxLeft = window.innerWidth - tipRect.width - EDGE_PAD_PX;
  let left;
  let top;
  if (el.getAttribute("data-tip-place") === "right") {
    left = rect.right + OFFSET_PX;
    if (left > maxLeft) left = Math.max(EDGE_PAD_PX, rect.left - tipRect.width - OFFSET_PX);
    top = Math.max(
      EDGE_PAD_PX,
      Math.min(
        rect.top + rect.height / 2 - tipRect.height / 2,
        window.innerHeight - tipRect.height - EDGE_PAD_PX
      )
    );
  } else {
    left = Math.max(EDGE_PAD_PX, Math.min(rect.left + rect.width / 2 - tipRect.width / 2, maxLeft));
    top = rect.bottom + OFFSET_PX;
    if (top + tipRect.height > window.innerHeight - EDGE_PAD_PX)
      top = rect.top - tipRect.height - OFFSET_PX;
  }
  t.el.style.left = `${Math.round(left)}px`;
  t.el.style.top = `${Math.round(top)}px`;
  t.el.style.visibility = "visible";
  if (autoHideTimer !== null) window.clearTimeout(autoHideTimer);
  autoHideTimer = window.setTimeout(hide, AUTO_HIDE_MS);
}
function installScreenTips(doc = document) {
  const onPointerOver = (e) => {
    const target = e.target instanceof Element ? e.target : null;
    const el = target?.closest("[data-tip]") ?? null;
    if (el === anchor) return;
    if (suppressed && suppressed !== el) suppressed = null;
    hide();
    if (!el || el === suppressed) return;
    anchor = el;
    const delay = Date.now() < warmUntil ? RESHOW_DELAY_MS : INITIAL_DELAY_MS;
    showTimer = window.setTimeout(() => {
      showTimer = null;
      if (anchor === el && el.isConnected) show(el, doc);
    }, delay);
  };
  const onPointerOut = (e) => {
    if (!e.relatedTarget) {
      suppressed = null;
      hide();
    }
  };
  const onPointerDown = () => {
    suppressed = anchor;
    hide();
    warmUntil = 0;
  };
  const onHide = () => hide();
  doc.addEventListener("pointerover", onPointerOver, true);
  doc.addEventListener("pointerout", onPointerOut, true);
  doc.addEventListener("pointerdown", onPointerDown, true);
  doc.addEventListener("scroll", onHide, true);
  window.addEventListener("blur", onHide);
  window.addEventListener("resize", onHide);
  return () => {
    doc.removeEventListener("pointerover", onPointerOver, true);
    doc.removeEventListener("pointerout", onPointerOut, true);
    doc.removeEventListener("pointerdown", onPointerDown, true);
    doc.removeEventListener("scroll", onHide, true);
    window.removeEventListener("blur", onHide);
    window.removeEventListener("resize", onHide);
    hide();
    tip?.el.remove();
    tip = null;
  };
}
function subscribeChromePressed(handler) {
  const w = window;
  for (const name of [
    "slidesApi",
    "desktopApi",
    "desktop",
    "pdfApi",
    "markdownApi",
    "aiOfficeTabs"
  ]) {
    const sub = w[name]?.onChromePressed;
    if (typeof sub === "function") return sub.call(w[name], handler);
  }
  return void 0;
}
let openPopovers = 0;
function bumpOpenPopovers(delta) {
  openPopovers = Math.max(0, openPopovers + delta);
  document.documentElement.classList.toggle("genoffice-popover-open", openPopovers > 0);
}
function installPopoverDismiss(close, options) {
  const inside = options?.inside;
  const onPress = (e) => {
    if (inside) {
      const target = e.target;
      if (target) {
        for (const root of inside()) if (root && root.contains(target)) return;
      }
    }
    close();
  };
  const onBlur = () => close();
  if (inside) window.addEventListener("pointerdown", onPress, true);
  else window.addEventListener("mousedown", onPress);
  window.addEventListener("blur", onBlur);
  const offChrome = subscribeChromePressed(close);
  bumpOpenPopovers(1);
  return () => {
    if (inside) window.removeEventListener("pointerdown", onPress, true);
    else window.removeEventListener("mousedown", onPress);
    window.removeEventListener("blur", onBlur);
    offChrome?.();
    bumpOpenPopovers(-1);
  };
}
function useDismissablePopover(open, close, options) {
  const closeRef = reactExports.useRef(close);
  closeRef.current = close;
  const insideRef = reactExports.useRef(options?.inside);
  insideRef.current = options?.inside;
  const guarded = options?.inside != null;
  reactExports.useEffect(() => {
    if (!open) return;
    return installPopoverDismiss(
      () => closeRef.current(),
      guarded ? { inside: () => insideRef.current?.() ?? [] } : void 0
    );
  }, [open, guarded]);
}
function Dropdown({
  value,
  options,
  onPick,
  className,
  ariaLabel,
  disabled,
  tip: tip2,
  ariaRequired,
  ariaInvalid
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [active, setActive] = reactExports.useState(0);
  const popRef = reactExports.useRef(null);
  const wrapRef = reactExports.useRef(null);
  useDismissablePopover(open, () => setOpen(false), { inside: () => [wrapRef.current] });
  reactExports.useEffect(() => {
    if (!open) return;
    popRef.current?.querySelectorAll(".gs-dd-item")[active]?.scrollIntoView?.({ block: "nearest" });
  }, [open, active]);
  const current = options.find((o) => o.value === value);
  const openList = () => {
    const i = options.findIndex((o) => o.value === value);
    setActive(i < 0 ? 0 : i);
    setOpen(true);
  };
  const pick = (o) => {
    if (o.disabled) return;
    setOpen(false);
    onPick(o.value);
  };
  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") {
      const o = options[active];
      if (o) pick(o);
    } else return;
    e.preventDefault();
    e.stopPropagation();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { ref: wrapRef, className: `gs-dd${className ? ` ${className}` : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "gs-dd-btn",
        disabled,
        "data-value": value,
        "data-tip": tip2,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-label": ariaLabel ?? current?.label ?? value,
        "aria-required": ariaRequired,
        "aria-invalid": ariaInvalid,
        onClick: () => open ? setOpen(false) : openList(),
        onKeyDown,
        onBlur: (e) => {
          if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gs-dd-value", children: current ? current.render ?? current.label : value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gs-dd-caret", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M5.5 9.25 12 15.75l6.5-6.5",
              stroke: "currentColor",
              strokeWidth: "2.6",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) }) })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: popRef, className: "gs-dd-pop", role: "listbox", children: options.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        role: "option",
        tabIndex: -1,
        disabled: o.disabled,
        "aria-selected": o.value === value,
        "aria-label": o.label,
        "data-value": o.value,
        title: o.label,
        className: `gs-dd-item${o.value === value ? " selected" : ""}${i === active && !o.disabled ? " active" : ""}`,
        onMouseEnter: () => setActive(i),
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => pick(o),
        children: o.render ?? o.label
      },
      o.value
    )) })
  ] });
}
requireReactDom();
const providers = { "anthropic": { "catalogType": "direct", "sources": ["https://platform.claude.com/docs/en/about-claude/models/overview", "https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions"], "models": [{ "id": "claude-fable-5", "lifecycle": "stable", "tier": "quality" }, { "id": "claude-opus-5", "lifecycle": "stable", "tier": "quality" }, { "id": "claude-sonnet-5", "lifecycle": "stable", "tier": "balanced" }, { "id": "claude-opus-4-8", "lifecycle": "legacy", "tier": "quality" }, { "id": "claude-sonnet-4-6", "lifecycle": "legacy", "tier": "balanced" }, { "id": "claude-haiku-4-5", "lifecycle": "stable", "tier": "fast" }] }, "gemini": { "catalogType": "direct", "sources": ["https://ai.google.dev/gemini-api/docs/latest-model", "https://ai.google.dev/gemini-api/docs/models", "https://ai.google.dev/gemini-api/docs/deprecations"], "models": [{ "id": "gemini-3.6-flash", "lifecycle": "stable", "tier": "balanced" }, { "id": "gemini-3.5-flash", "lifecycle": "stable", "tier": "balanced" }, { "id": "gemini-3.5-flash-lite", "lifecycle": "stable", "tier": "fast" }, { "id": "gemini-3.1-flash-lite", "lifecycle": "legacy", "tier": "fast" }, { "id": "gemini-2.5-pro", "lifecycle": "legacy", "tier": "quality" }, { "id": "gemini-2.5-flash", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gemini-2.5-flash-lite", "lifecycle": "legacy", "tier": "fast" }] }, "deepseek": { "catalogType": "direct", "sources": ["https://api-docs.deepseek.com/api/list-models", "https://api-docs.deepseek.com/quick_start/pricing", "https://api-docs.deepseek.com/updates"], "models": [{ "id": "deepseek-v4-pro", "lifecycle": "stable", "tier": "quality" }, { "id": "deepseek-v4-flash", "lifecycle": "stable", "tier": "fast" }] }, "openai": { "catalogType": "direct", "sources": ["https://developers.openai.com/api/docs/models", "https://developers.openai.com/api/docs/guides/latest-model"], "models": [{ "id": "gpt-5.6-sol", "lifecycle": "stable", "tier": "quality" }, { "id": "gpt-5.6-terra", "lifecycle": "stable", "tier": "balanced" }, { "id": "gpt-5.6-luna", "lifecycle": "stable", "tier": "fast" }, { "id": "gpt-5.5", "lifecycle": "legacy", "tier": "quality" }, { "id": "gpt-5.4", "lifecycle": "legacy", "tier": "quality" }, { "id": "gpt-5.4-mini", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gpt-5.4-nano", "lifecycle": "legacy", "tier": "fast" }, { "id": "gpt-4.1", "lifecycle": "legacy", "tier": "balanced" }, { "id": "gpt-4.1-mini", "lifecycle": "legacy", "tier": "fast" }] } };
const modelCatalogJson = {
  providers
};
const AI_MODEL_CATALOG = modelCatalogJson;
function catalogModelIds(provider) {
  return AI_MODEL_CATALOG.providers[provider]?.models.map(({ id }) => id) ?? [];
}
const BATI_CLOUD_PROVIDER = {
  id: "baticloud",
  label: "Bati AI",
  // Stable product roles. The authenticated server catalog remains the
  // authority for entitlement, capabilities and the backing vendor model.
  models: ["bati-fast", "bati-balanced", "bati-quality"],
  defaultModel: "bati-balanced",
  keyPlaceholder: "Bati 계정 로그인을 사용합니다"
};
const AI_PROVIDERS = [
  BATI_CLOUD_PROVIDER,
  {
    id: "anthropic",
    label: "Claude",
    models: catalogModelIds("anthropic"),
    defaultModel: "claude-sonnet-5",
    keyPlaceholder: "sk-ant-api03-..."
  },
  {
    id: "gemini",
    label: "Gemini",
    models: catalogModelIds("gemini"),
    defaultModel: "gemini-3.5-flash-lite",
    keyPlaceholder: "AIza..."
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    models: catalogModelIds("deepseek"),
    defaultModel: "deepseek-v4-flash",
    keyPlaceholder: "sk-..."
  },
  {
    id: "openai",
    label: "OpenAI",
    models: catalogModelIds("openai"),
    defaultModel: "gpt-5.6-terra",
    keyPlaceholder: "sk-..."
  },
  {
    id: "ollama",
    label: "Ollama (Local)",
    models: [],
    defaultModel: "llama3.2",
    keyPlaceholder: "Not required",
    needsBaseUrl: true,
    defaultBaseUrl: "http://127.0.0.1:11434/v1"
  },
  {
    id: "kimi",
    label: "Kimi",
    models: ["kimi-k3"],
    defaultModel: "kimi-k3",
    keyPlaceholder: "sk-..."
  },
  {
    id: "glm",
    label: "GLM",
    // bigmodel.cn text-model lineup (2026-08); 5.3 and 5.2 share a base model,
    // 5-Turbo is the cheap tier
    models: ["glm-5.3", "glm-5.2", "glm-5-turbo"],
    defaultModel: "glm-5.3",
    keyPlaceholder: "xxxxxxxx.xxxxxxxx"
  },
  {
    id: "qwen",
    label: "Qwen",
    // Versioned DashScope ids: the bare qwen-max alias still points at a
    // Qwen2.5-era snapshot, so name the 3.x tiers explicitly (2026-08)
    models: ["qwen3.8-max", "qwen3.7-plus", "qwen3.7-flash"],
    defaultModel: "qwen3.8-max",
    keyPlaceholder: "sk-..."
  },
  {
    id: "doubao",
    label: "Doubao",
    // Ark ids are dashed and date-pinned; it also accepts ep-... inference
    // endpoint ids in the model field
    models: ["doubao-seed-2-1-pro-260628", "doubao-seed-2-1-turbo-260628"],
    defaultModel: "doubao-seed-2-1-pro-260628",
    keyPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  },
  {
    id: "minimax",
    label: "MiniMax",
    // M3 is the current agentic/tool-use model; M2.5 moved to the legacy tier
    models: ["MiniMax-M3", "MiniMax-M2.7"],
    defaultModel: "MiniMax-M3",
    keyPlaceholder: "eyJ..."
  },
  {
    id: "xai",
    label: "Grok",
    models: ["grok-4.6", "grok-4.5"],
    defaultModel: "grok-4.6",
    keyPlaceholder: "xai-..."
  },
  {
    id: "mistral",
    label: "Mistral",
    // `-latest` aliases track the newest GA snapshot. Medium 3.5 is Mistral's
    // agentic tier; codestral is a code-completion/FIM model, not an agent driver.
    models: ["mistral-medium-latest", "mistral-large-latest", "mistral-small-latest"],
    defaultModel: "mistral-medium-latest",
    keyPlaceholder: "API Key"
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    // vendor-prefixed slugs exactly as openrouter.ai/api/v1/models lists them —
    // there is no `openai/gpt-5.6` alias there, only the per-tier ids
    models: [
      "openrouter/auto",
      "anthropic/claude-sonnet-5",
      "openai/gpt-5.6-sol",
      "moonshotai/kimi-k3"
    ],
    defaultModel: "openrouter/auto",
    keyPlaceholder: "sk-or-..."
  },
  {
    id: "custom",
    label: "Custom",
    models: [],
    defaultModel: "",
    keyPlaceholder: "API Key",
    needsBaseUrl: true
  }
];
function metaOf(id) {
  return AI_PROVIDERS.find((m) => m.id === id);
}
({
  // Bati AI — the managed provider. Requests are proxied by our server, which
  // resolves the backing vendor from the model role, so the desktop always
  // speaks one protocol and never learns which vendor answered.
  baticloud: {
    meta: metaOf("baticloud")
  },
  // Local models. Native Ollama protocol; see protocols/ollama.ts for why.
  ollama: {
    meta: metaOf("ollama")
  },
  anthropic: {
    meta: metaOf("anthropic")
  },
  gemini: {
    meta: metaOf("gemini")
  },
  deepseek: {
    meta: metaOf("deepseek")
  },
  openai: {
    meta: metaOf("openai")
  },
  kimi: {
    meta: metaOf("kimi")
  },
  glm: {
    meta: metaOf("glm")
  },
  qwen: {
    meta: metaOf("qwen")
  },
  doubao: {
    meta: metaOf("doubao")
  },
  minimax: {
    meta: metaOf("minimax")
  },
  xai: {
    meta: metaOf("xai")
  },
  mistral: {
    meta: metaOf("mistral")
  },
  openrouter: {
    meta: metaOf("openrouter")
  },
  custom: {
    meta: metaOf("custom")
  }
});
function visiblePageCount(page) {
  return page.total;
}
function fileCountKey(count) {
  return count === 1 ? "fileCountOne" : "fileCount";
}
const FILE_BADGE_STYLES = {
  docx: { hue: "#2563eb", label: "W" },
  xlsx: { hue: "#188a4c", label: "X" },
  xlsm: { hue: "#188a4c", label: "X" },
  xls: { hue: "#188a4c", label: "X" },
  csv: { hue: "#188a4c", label: "C" },
  pptx: { hue: "#d1552f", label: "P" },
  md: { hue: "#8b5cf6", label: "M" },
  markdown: { hue: "#8b5cf6", label: "M" },
  pdf: { hue: "#dc2626", label: "PDF" }
};
const HWP_ICON = appBrand("hwp").icon;
function badgeTint(hex) {
  const value = parseInt(hex.slice(1), 16);
  const r = value >> 16 & 255;
  const g = value >> 8 & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, 0.14)`;
}
function FileBadge({ ext, size }) {
  if (ext === "hwp" || ext === "hwpx" || ext === "hml") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 32 32", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "32", height: "32", rx: "8", fill: HWP_ICON.background }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.5 9.5h3.4v4.9h6.2V9.5h3.4v13h-3.4v-5h-6.2v5H9.5v-13Z", fill: HWP_ICON.foreground })
    ] });
  }
  const style = FILE_BADGE_STYLES[ext] ?? {
    hue: "#6b7280",
    label: ext ? ext[0].toUpperCase() : "?"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, viewBox: "0 0 32 32", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "32", height: "32", rx: "8", fill: badgeTint(style.hue) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: "16",
        y: "16.8",
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: style.hue,
        fontSize: style.label.length > 1 ? 10.5 : 15.5,
        fontWeight: "650",
        letterSpacing: style.label.length > 1 ? "0.02em" : "0",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        children: style.label
      }
    )
  ] });
}
const TAB_KIND_EXT = {
  docs: "docx",
  sheets: "xlsx",
  slides: "pptx",
  pdf: "pdf",
  markdown: "md",
  hwp: "hwp"
};
const strings = {
  zh: {
    // Sidebar navigation
    navRecent: "最近",
    navStarred: "收藏",
    cloudSearchPlaceholder: "搜索 {n} 个项目…",
    cloudNoResults: "没有匹配的项目。",
    cloudGroupThisWeek: "本周",
    cloudGroupThisMonth: "本月",
    cloudSortLabel: "排序：{v}",
    cloudSortRecent: "最近",
    cloudSortOldest: "最早",
    cloudRefresh: "刷新",
    cloudEmpty: "还没有网页端项目。",
    cloudError: "加载失败，请稍后重试。",
    cloudRetry: "重试",
    cloudLoadMore: "加载更多",
    cloudOpenInBrowser: "在浏览器中打开",
    navTrash: "回收站",
    navTrashTip: "删除的文件在系统废纸篓中，可从那里还原",
    secQuickStart: "快速开始",
    secRecent: "最近使用",
    secStarred: "收藏",
    secProjectFiles: "项目文件",
    secActivity: "项目动态",
    colName: "名称",
    colLocation: "位置",
    colModified: "修改时间",
    colSize: "大小",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "打开本地文件",
    openLocalSub: "支持所有文档格式",
    greetMorning: "早上好",
    greetAfternoon: "下午好",
    greetEvening: "晚上好",
    greetAsk1: "今天想创建点什么？",
    greetAsk2: "准备好开始了吗？",
    greetAsk3: "有什么想做的吗？",
    greetAsk4: "今天从哪里开始？",
    greetAsk5: "想做点什么新的？",
    greetAsk6: "灵感来了吗？",
    // Filters
    filterAll: "全部",
    filterDocs: "文档",
    filterSheets: "表格",
    filterSlides: "演示",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "按类型筛选",
    // List / bulk actions
    fileCount: "{n} 个文件",
    fileCountOne: "{n} 个文件",
    selectedCount: "已选 {n} 项",
    selectAll: "全选",
    selectFile: "选择 {name}",
    removeFromList: "从列表中移除",
    deleteFiles: "删除文件",
    cancel: "取消",
    star: "收藏",
    unstar: "取消收藏",
    moreActions: "更多操作",
    open: "打开",
    revealInFolder: "打开所在文件夹",
    copyPath: "复制路径",
    moveToProject: "移动到项目",
    rename: "重命名",
    duplicate: "创建副本",
    renameFailed: "重命名失败",
    emptyStarred: "还没有收藏 — 悬浮文件行并点击星标即可收藏。",
    emptyRecent: "暂无最近文件 — 新建或打开一个文件开始使用。",
    emptyFiltered: "该类型下暂无文件。",
    // Delete confirmation dialog
    deleteModalTitle: "删除文件",
    deleteConfirmOne: '确定将"{name}"移到废纸篓？',
    deleteConfirmMany: "确定将以下 {n} 个文件移到废纸篓？",
    deleteMoreCount: "… 等共 {n} 个",
    delete: "删除",
    // Project sidebar
    projects: "项目",
    newProject: "新建项目",
    projectName: "项目名称",
    deleteProject: "删除项目…",
    deleteProjectConfirm: '删除该项目？\n项目下的文件将回归"默认项目"，不会丢失。',
    projMoreActions: "{name} 更多操作",
    defaultProject: "默认项目",
    projEmpty: "把相关文档放进同一个项目，AI 对话历史会按项目沉淀。",
    projEmptyHint: '新建文件或从"最近文件"右键选择"移动到项目"。',
    timelineCount: "{n} 条",
    timelineCountOne: "{n} 条",
    timelineEmpty: "该项目还没有 AI 对话记录。",
    timelineYou: "你",
    timelineUserAria: "用户",
    untitled: "未命名",
    noContent: "（无内容）",
    // Account
    account: "账号",
    login: "登录",
    loggedIn: "已登录",
    waitingLogin: "等待浏览器登录…点击可重新拉起登录页",
    waitingShort: "等待登录…",
    loginTimeout: "登录超时,点击重试",
    loginLaunchFailed: "无法启动登录,点击重试",
    loginNetworkError: "无法连接 Bati,请检查网络或代理设置",
    loginExpired: "登录已过期,点击重试",
    loginFailed: "登录失败,点击重试",
    loggingOut: "正在退出…",
    logout: "退出登录",
    credits: "积分",
    creditsTip: "查看积分用量详情",
    appVersion: "版本 {v}",
    versionLabel: "版本",
    versionRowHint: "查看更新历史",
    updateReadyRestart: "重新启动以更新",
    updateChannel: "更新通道",
    telemetryLabel: "匿名使用统计",
    telemetryOn: "发送",
    telemetryOff: "不发送",
    setSecPrivacy: "使用统计",
    setSecShortcuts: "快捷键",
    setSearchPlaceholder: "搜索设置",
    scPalette: "命令面板",
    scSettings: "打开设置",
    scNewDoc: "新建文档",
    scOpen: "打开文件",
    scSave: "保存",
    scPrint: "打印",
    scCloseTab: "关闭标签页",
    scNextTab: "下一个标签页",
    scPrevTab: "上一个标签页",
    scGoToTab: "跳转到第 N 个标签页",
    scGlobalSummon: "全局唤起 BatiOffice",
    globalSummonDesc: "在其他应用中也可用 Ctrl+Shift+B 唤起 BatiOffice 并直接输入命令。",
    heroLauncherHint: "搜索或新建…",
    heroAskWorkspace: "向 Bati AI 提问",
    showMoreFiles: "查看其余 {count} 个",
    createMore: "更多",
    paletteHint: "搜索操作、标签页和最近文件",
    paletteEmpty: "没有匹配结果",
    paletteTabs: "标签页",
    paletteRecents: "最近文件",
    paletteActions: "操作",
    telemetryDesc: "仅发送匿名计数（例如编辑器打开次数）。绝不收集文档内容、文件名或提示词，且可随时关闭。",
    channelStable: "稳定版",
    channelBeta: "Beta 版",
    theme: "主题",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "跟随系统",
    saveLocation: "默认保存位置",
    setAnalytics: "发送匿名使用统计",
    setAnalyticsDesc: "该功能默认开启，可随时在“设置 → 常规”中关闭。使用 Google Analytics 4；Google 会接收您的公网 IP 地址和传输元数据，但绝不收集文档内容或文件名。",
    settings: "设置",
    setSecAccount: "账户",
    setSecGeneral: "通用",
    setSecAbout: "关于",
    setLearnMore: "了解更多",
    seeMoreAutomation: "查看更多自动化功能",
    starPromptTitle: "喜欢 BatiOffice 吗？",
    starPromptTitleN: "你已经用 BatiOffice 打开了 {n} 个文档",
    starPromptBody: "Bati 还能自动化更多工作——文档、表格与流程的联动。到 bati.ai 看看。",
    starPromptGo: "查看更多功能",
    starPromptDone: "已经看过了",
    starPromptLater: "以后再说",
    onbAutomationHint: "Bati 还能自动化更多工作，欢迎到 bati.ai 了解。",
    setEmail: "邮箱",
    setNotLoggedIn: "未登录",
    setViewUsage: "查看用量",
    setChange: "更改",
    // Dates
    today: "今天",
    yesterday: "昨天",
    daysAgo: "{n}天前",
    // Language / tab strip
    language: "语言",
    closeTab: "关闭标签",
    tabList: "全部标签",
    tabAppMenu: "菜单",
    newTab: "新建标签页",
    // First-run onboarding
    onbTitle1: "欢迎使用 BatiOffice",
    onbSubtitle1: "AI 原生的 Office 套件",
    onbBody1: "创建文档、制作表格、生成演示、审阅 PDF。AI 深度融入每个环节。",
    onbTitle2: "这只是一个开始",
    onbBody2: "BatiOffice 目前处于 alpha 阶段。欢迎加入 GenTeam 群聊，分享反馈，一起塑造它的未来。",
    onbJoinGenTeam: "加入 GenTeam",
    onbSkip: "跳过",
    onbNext: "下一步",
    onbStart: "开始使用",
    onbStepAria: "第 {n} 页，共 {total} 页",
    onbTitle3: "人人免费",
    onbBody3: "无授权费用，无广告，无水印。",
    onbBack: "上一步"
  },
  en: {
    navRecent: "Recent",
    navStarred: "Starred",
    cloudSearchPlaceholder: "Search {n} projects…",
    cloudNoResults: "No matching projects.",
    cloudGroupThisWeek: "This week",
    cloudGroupThisMonth: "Earlier this month",
    cloudSortLabel: "Sort: {v}",
    cloudSortRecent: "Recent",
    cloudSortOldest: "Oldest",
    cloudRefresh: "Refresh",
    cloudEmpty: "No web projects yet.",
    cloudError: "Failed to load. Try again later.",
    cloudRetry: "Retry",
    cloudLoadMore: "Load more",
    cloudOpenInBrowser: "Open in browser",
    navTrash: "Trash",
    navTrashTip: "Deleted files go to the system Trash and can be restored there",
    secQuickStart: "Quick start",
    secRecent: "Recent",
    secStarred: "Starred",
    secProjectFiles: "Project files",
    secActivity: "Activity",
    colName: "Name",
    colLocation: "Location",
    colModified: "Modified",
    colSize: "Size",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Open Local File",
    openLocalSub: "All document formats",
    greetMorning: "Good morning",
    greetAfternoon: "Good afternoon",
    greetEvening: "Good evening",
    greetAsk1: "What would you like to create today?",
    greetAsk2: "Ready to get started?",
    greetAsk3: "What are you working on?",
    greetAsk4: "Where shall we begin today?",
    greetAsk5: "Feeling creative?",
    greetAsk6: "What's next on your mind?",
    filterAll: "All",
    filterDocs: "Docs",
    filterSheets: "Sheets",
    filterSlides: "Slides",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filter by type",
    fileCount: "{n} files",
    fileCountOne: "{n} file",
    selectedCount: "{n} selected",
    selectAll: "Select all",
    selectFile: "Select {name}",
    removeFromList: "Remove from list",
    deleteFiles: "Delete files",
    cancel: "Cancel",
    star: "Star",
    unstar: "Unstar",
    moreActions: "More actions",
    open: "Open",
    revealInFolder: "Reveal in folder",
    copyPath: "Copy path",
    moveToProject: "Move to project",
    rename: "Rename",
    duplicate: "Duplicate",
    renameFailed: "Rename failed",
    emptyStarred: "No starred files — hover a row and click the star.",
    emptyRecent: "No recent files — create or open a file to get started.",
    emptyFiltered: "No files of this type.",
    deleteModalTitle: "Delete Files",
    deleteConfirmOne: 'Move "{name}" to the Trash?',
    deleteConfirmMany: "Move these {n} files to the Trash?",
    deleteMoreCount: "… {n} in total",
    delete: "Delete",
    projects: "Projects",
    newProject: "New project",
    projectName: "Project name",
    deleteProject: "Delete project…",
    deleteProjectConfirm: "Delete this project?\nIts files will return to the Default project and won't be lost.",
    projMoreActions: "More actions for {name}",
    defaultProject: "Default project",
    projEmpty: "Keep related documents in one project — AI chat history accumulates per project.",
    projEmptyHint: 'Create a file, or right-click a recent file and choose "Move to project".',
    timelineCount: "{n} items",
    timelineCountOne: "{n} item",
    timelineEmpty: "No AI conversations in this project yet.",
    timelineYou: "You",
    timelineUserAria: "User",
    untitled: "Untitled",
    noContent: "(empty)",
    account: "Account",
    login: "Sign in",
    loggedIn: "Signed in",
    waitingLogin: "Waiting for browser sign-in… Click to relaunch the sign-in page",
    loginTimeout: "Sign-in timed out — click to retry",
    loginLaunchFailed: "Could not start sign-in — click to retry",
    loginNetworkError: "Cannot reach Bati — check your network or proxy settings",
    loginExpired: "Sign-in expired — click to retry",
    loginFailed: "Sign-in failed — click to retry",
    waitingShort: "Waiting…",
    loggingOut: "Signing out…",
    logout: "Sign out",
    credits: "Credits",
    creditsTip: "View credit usage details",
    appVersion: "Version {v}",
    versionLabel: "Version",
    versionRowHint: "See what changed",
    updateReadyRestart: "Restart to update",
    updateChannel: "Update Channel",
    telemetryLabel: "Anonymous usage stats",
    telemetryOn: "Sharing",
    telemetryOff: "Not sharing",
    setSecPrivacy: "Usage statistics",
    setSecShortcuts: "Shortcuts",
    setSearchPlaceholder: "Search settings",
    scPalette: "Command palette",
    scSettings: "Open settings",
    scNewDoc: "New document",
    scOpen: "Open file",
    scSave: "Save",
    scPrint: "Print",
    scCloseTab: "Close tab",
    scNextTab: "Next tab",
    scPrevTab: "Previous tab",
    scGoToTab: "Jump to tab N",
    scGlobalSummon: "Summon BatiOffice (global)",
    globalSummonDesc: "Open BatiOffice and start typing a command from anywhere with ⌘(Ctrl)+Shift+B.",
    heroLauncherHint: "Search or create…",
    heroAskWorkspace: "Ask Bati AI",
    showMoreFiles: "Show {count} more",
    createMore: "More",
    paletteHint: "Search actions, tabs and recent files",
    paletteEmpty: "No matches",
    paletteTabs: "Tabs",
    paletteRecents: "Recent files",
    paletteActions: "Actions",
    telemetryDesc: "Only anonymous counters (such as how often an editor is opened) are sent. Document contents, file names and prompts are never collected, and you can turn this off at any time.",
    channelStable: "Stable",
    channelBeta: "Beta",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "Follow System",
    saveLocation: "Save Location",
    setAnalytics: "Send anonymous usage statistics",
    setAnalyticsDesc: "Enabled by default and can be turned off anytime in Settings → General. Uses Google Analytics 4; Google receives your public IP address and transport metadata, but document contents and file names are never collected.",
    settings: "Settings",
    setSecAccount: "Account",
    setSecGeneral: "General",
    setSecAbout: "About",
    setLearnMore: "Learn more",
    seeMoreAutomation: "See more automation",
    starPromptTitle: "Enjoying BatiOffice?",
    starPromptTitleN: "You've opened {n} documents with BatiOffice",
    starPromptBody: "Bati automates more than documents — workflows that connect your files, sheets and tools. See what else it does.",
    starPromptGo: "See what else Bati does",
    starPromptDone: "Already seen it",
    starPromptLater: "Maybe later",
    onbAutomationHint: "Bati automates more than documents. See what else it does at bati.ai.",
    setEmail: "Email",
    setNotLoggedIn: "Not signed in",
    setViewUsage: "View usage",
    setChange: "Change",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "{n}d ago",
    language: "Language",
    closeTab: "Close tab",
    tabList: "All tabs",
    tabAppMenu: "Menu",
    newTab: "New tab",
    // First-run onboarding
    onbTitle1: "Welcome to BatiOffice",
    onbSubtitle1: "The AI-native office suite",
    onbBody1: "Create docs, build sheets, make slides, and review PDFs. AI is built into every step.",
    onbTitle2: "This is just the beginning",
    onbBody2: "BatiOffice is still in alpha. Join the group chat on GenTeam to share feedback and help shape what comes next.",
    onbJoinGenTeam: "Join GenTeam",
    onbSkip: "Skip",
    onbNext: "Next",
    onbStart: "Get started",
    onbStepAria: "Page {n} of {total}",
    onbTitle3: "Free for everyone",
    onbBody3: "No license fees. No ads. No watermarks.",
    onbBack: "Back"
  },
  ja: {
    // Sidebar navigation
    navRecent: "最近使用",
    navStarred: "お気に入り",
    cloudSearchPlaceholder: "{n} 件のプロジェクトを検索…",
    cloudNoResults: "一致するプロジェクトはありません。",
    cloudGroupThisWeek: "今週",
    cloudGroupThisMonth: "今月",
    cloudSortLabel: "並び替え: {v}",
    cloudSortRecent: "新しい順",
    cloudSortOldest: "古い順",
    cloudRefresh: "更新",
    cloudEmpty: "Web のプロジェクトはまだありません。",
    cloudError: "読み込みに失敗しました。後でもう一度お試しください。",
    cloudRetry: "再試行",
    cloudLoadMore: "もっと見る",
    cloudOpenInBrowser: "ブラウザで開く",
    navTrash: "ゴミ箱",
    navTrashTip: "削除したファイルはシステムのゴミ箱に移動され、そこから復元できます",
    // Section headings
    secQuickStart: "クイックスタート",
    secRecent: "最近使用",
    secStarred: "お気に入り",
    secProjectFiles: "プロジェクトファイル",
    secActivity: "アクティビティ",
    colName: "名前",
    colLocation: "場所",
    colModified: "更新日時",
    colSize: "サイズ",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "ローカルファイルを開く",
    openLocalSub: "すべての文書形式",
    greetMorning: "おはようございます",
    greetAfternoon: "こんにちは",
    greetEvening: "こんばんは",
    greetAsk1: "今日は何を作りますか？",
    greetAsk2: "準備はできましたか？",
    greetAsk3: "何か作りたいものはありますか？",
    greetAsk4: "今日はどこから始めますか？",
    greetAsk5: "新しいことに挑戦しますか？",
    greetAsk6: "インスピレーションは湧きましたか？",
    // Filters
    filterAll: "すべて",
    filterDocs: "文書",
    filterSheets: "スプレッドシート",
    filterSlides: "プレゼンテーション",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "種類で絞り込み",
    // List / bulk actions
    fileCount: "{n} 個のファイル",
    fileCountOne: "{n} 個のファイル",
    selectedCount: "{n} 件選択中",
    selectAll: "すべて選択",
    selectFile: "{name} を選択",
    removeFromList: "リストから削除",
    deleteFiles: "ファイルを削除",
    cancel: "キャンセル",
    star: "お気に入りに追加",
    unstar: "お気に入りから削除",
    moreActions: "その他の操作",
    open: "開く",
    revealInFolder: "フォルダーで表示",
    copyPath: "パスをコピー",
    moveToProject: "プロジェクトに移動",
    rename: "名前の変更",
    duplicate: "複製を作成",
    renameFailed: "名前の変更に失敗しました",
    emptyStarred: "お気に入りはまだありません — ファイルの行にカーソルを合わせて星マークをクリックしてください。",
    emptyRecent: "最近使ったファイルはありません — 新規作成するかファイルを開いて始めましょう。",
    emptyFiltered: "この種類のファイルはありません。",
    // Delete confirmation dialog
    deleteModalTitle: "ファイルの削除",
    deleteConfirmOne: "「{name}」をゴミ箱に移動しますか？",
    deleteConfirmMany: "次の {n} 個のファイルをゴミ箱に移動しますか？",
    deleteMoreCount: "… ほか、計 {n} 個",
    delete: "削除",
    // Project sidebar
    projects: "プロジェクト",
    newProject: "新規プロジェクト",
    projectName: "プロジェクト名",
    deleteProject: "プロジェクトを削除…",
    deleteProjectConfirm: "このプロジェクトを削除しますか？\nプロジェクト内のファイルは「既定のプロジェクト」に戻り、失われることはありません。",
    projMoreActions: "{name} のその他の操作",
    defaultProject: "既定のプロジェクト",
    projEmpty: "関連するドキュメントを同じプロジェクトにまとめると、AI との会話履歴がプロジェクトごとに蓄積されます。",
    projEmptyHint: "新規ファイルを作成するか、「最近使用」のファイルを右クリックして「プロジェクトに移動」を選択してください。",
    timelineCount: "{n} 件",
    timelineCountOne: "{n} 件",
    timelineEmpty: "このプロジェクトにはまだ AI との会話履歴がありません。",
    timelineYou: "あなた",
    timelineUserAria: "ユーザー",
    untitled: "無題",
    noContent: "（内容なし）",
    // Account
    account: "アカウント",
    login: "サインイン",
    loggedIn: "サインイン済み",
    waitingLogin: "ブラウザーでのサインインを待っています… クリックするとサインインページを再表示します",
    waitingShort: "サインイン待ち…",
    loginTimeout: "サインインがタイムアウトしました。クリックして再試行",
    loginLaunchFailed: "サインインを開始できませんでした。クリックして再試行",
    loginNetworkError: "Bati に接続できません。ネットワークまたはプロキシ設定を確認してください",
    loginExpired: "サインインの有効期限が切れました。クリックして再試行",
    loginFailed: "サインインに失敗しました。クリックして再試行",
    loggingOut: "サインアウトしています…",
    logout: "サインアウト",
    credits: "クレジット",
    creditsTip: "クレジット使用状況を確認",
    appVersion: "バージョン {v}",
    versionLabel: "バージョン",
    versionRowHint: "更新履歴を見る",
    updateReadyRestart: "再起動して更新",
    updateChannel: "更新チャネル",
    telemetryLabel: "匿名の使用統計",
    telemetryOn: "送信する",
    telemetryOff: "送信しない",
    setSecPrivacy: "利用統計",
    setSecShortcuts: "ショートカット",
    setSearchPlaceholder: "設定を検索",
    scPalette: "コマンドパレット",
    scSettings: "設定を開く",
    scNewDoc: "新規文書",
    scOpen: "ファイルを開く",
    scSave: "保存",
    scPrint: "印刷",
    scCloseTab: "タブを閉じる",
    scNextTab: "次のタブ",
    scPrevTab: "前のタブ",
    scGoToTab: "N 番目のタブへ移動",
    scGlobalSummon: "BatiOffice を呼び出す（グローバル）",
    globalSummonDesc: "他のアプリ使用中でも ⌘(Ctrl)+Shift+B で BatiOffice を呼び出してコマンドを入力できます。",
    heroLauncherHint: "検索または新規作成…",
    heroAskWorkspace: "Bati AI に質問",
    showMoreFiles: "残り {count} 件を表示",
    createMore: "その他",
    paletteHint: "操作・タブ・最近のファイルを検索",
    paletteEmpty: "一致なし",
    paletteTabs: "タブ",
    paletteRecents: "最近のファイル",
    paletteActions: "操作",
    telemetryDesc: "匿名カウンター（エディタの起動回数など）のみ送信します。文書の内容・ファイル名・プロンプトは一切収集せず、いつでもオフにできます。",
    channelStable: "安定版",
    channelBeta: "ベータ版",
    theme: "テーマ",
    themeLight: "ライト",
    themeDark: "ダーク",
    themeSystem: "システムに従う",
    saveLocation: "保存先",
    setAnalytics: "匿名の使用状況統計を送信",
    setAnalyticsDesc: "既定で有効です。設定 → 一般でいつでも無効にできます。Google Analytics 4 を使用し、Google は公開 IP アドレスと通信メタデータを受け取りますが、文書の内容やファイル名は収集されません。",
    settings: "設定",
    setSecAccount: "アカウント",
    setSecGeneral: "一般",
    setSecAbout: "情報",
    setLearnMore: "詳しく見る",
    seeMoreAutomation: "自動化機能をもっと見る",
    starPromptTitle: "BatiOffice はいかがですか？",
    starPromptTitleN: "BatiOffice で {n} 件のドキュメントを開きました",
    starPromptBody: "Bati は文書だけでなく業務も自動化します。ファイル・シート・ツールをつなぐ仕組みをご覧ください。",
    starPromptGo: "ほかの機能を見る",
    starPromptDone: "確認済み",
    starPromptLater: "あとで",
    onbAutomationHint: "Bati は文書だけでなく業務も自動化します。bati.ai をご覧ください。",
    setEmail: "メール",
    setNotLoggedIn: "未ログイン",
    setViewUsage: "使用状況を見る",
    setChange: "変更",
    // Dates
    today: "今日",
    yesterday: "昨日",
    daysAgo: "{n}日前",
    // Language / tab strip
    language: "言語",
    closeTab: "タブを閉じる",
    tabList: "すべてのタブ",
    tabAppMenu: "メニュー",
    newTab: "新しいタブ",
    // First-run onboarding
    onbTitle1: "BatiOffice へようこそ",
    onbSubtitle1: "AI ネイティブ Office スイート",
    onbBody1: "文書の作成、表計算、プレゼン作成、PDF のレビュー。あらゆるステップに AI が組み込まれています。",
    onbTitle2: "これはまだ始まりにすぎません",
    onbBody2: "BatiOffice はまだアルファ版です。GenTeam のグループチャットに参加して、フィードバックを共有し、今後の開発を一緒に形作りましょう。",
    onbJoinGenTeam: "GenTeam に参加",
    onbSkip: "スキップ",
    onbNext: "次へ",
    onbStart: "はじめる",
    onbStepAria: "{total} ページ中 {n} ページ目",
    onbTitle3: "すべての人に無料",
    onbBody3: "ライセンス料なし、広告なし、透かしなし。",
    onbBack: "戻る"
  },
  ko: {
    // Sidebar navigation
    navRecent: "최근 사용",
    navStarred: "즐겨찾기",
    cloudSearchPlaceholder: "프로젝트 {n}개 검색…",
    cloudNoResults: "일치하는 프로젝트가 없습니다.",
    cloudGroupThisWeek: "이번 주",
    cloudGroupThisMonth: "이번 달",
    cloudSortLabel: "정렬: {v}",
    cloudSortRecent: "최신순",
    cloudSortOldest: "오래된순",
    cloudRefresh: "새로고침",
    cloudEmpty: "아직 웹 프로젝트가 없습니다.",
    cloudError: "불러오지 못했습니다. 나중에 다시 시도해 주세요.",
    cloudRetry: "다시 시도",
    cloudLoadMore: "더 보기",
    cloudOpenInBrowser: "브라우저에서 열기",
    navTrash: "휴지통",
    navTrashTip: "삭제된 파일은 시스템 휴지통으로 이동되며 그곳에서 복원할 수 있습니다",
    // Section headings
    secQuickStart: "빠른 시작",
    secRecent: "최근 사용",
    secStarred: "즐겨찾기",
    secProjectFiles: "프로젝트 파일",
    secActivity: "활동",
    colName: "이름",
    colLocation: "위치",
    colModified: "수정한 날짜",
    colSize: "크기",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "로컬 파일 열기",
    openLocalSub: "모든 문서 형식 지원",
    greetMorning: "좋은 아침이에요",
    greetAfternoon: "안녕하세요",
    greetEvening: "좋은 저녁이에요",
    greetAsk1: "오늘, 무엇을 끝낼까요?",
    greetAsk2: "무엇을 만들어 볼까요?",
    greetAsk3: "어디서부터 시작할까요?",
    greetAsk4: "오늘의 첫 문서는 무엇인가요?",
    greetAsk5: "바로 시작해 볼까요?",
    greetAsk6: "좋은 아이디어가 있나요?",
    // Filters
    filterAll: "전체",
    filterDocs: "문서",
    filterSheets: "스프레드시트",
    filterSlides: "프레젠테이션",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "유형별 필터",
    // List / bulk actions
    fileCount: "파일 {n}개",
    fileCountOne: "파일 {n}개",
    selectedCount: "{n}개 선택됨",
    selectAll: "모두 선택",
    selectFile: "{name} 선택",
    removeFromList: "목록에서 제거",
    deleteFiles: "파일 삭제",
    cancel: "취소",
    star: "즐겨찾기에 추가",
    unstar: "즐겨찾기에서 제거",
    moreActions: "기타 작업",
    open: "열기",
    revealInFolder: "폴더에서 보기",
    copyPath: "경로 복사",
    moveToProject: "프로젝트로 이동",
    rename: "이름 바꾸기",
    duplicate: "복사본 만들기",
    renameFailed: "이름 바꾸기에 실패했습니다",
    emptyStarred: "즐겨찾기가 없습니다 — 파일 행에 마우스를 올리고 별표를 클릭하세요.",
    emptyRecent: "최근 파일이 없습니다 — 새로 만들거나 파일을 열어 시작하세요.",
    emptyFiltered: "이 유형의 파일이 없습니다.",
    // Delete confirmation dialog
    deleteModalTitle: "파일 삭제",
    deleteConfirmOne: '"{name}"을(를) 휴지통으로 이동하시겠습니까?',
    deleteConfirmMany: "다음 {n}개 파일을 휴지통으로 이동하시겠습니까?",
    deleteMoreCount: "… 외 총 {n}개",
    delete: "삭제",
    // Project sidebar
    projects: "프로젝트",
    newProject: "새 프로젝트",
    projectName: "프로젝트 이름",
    deleteProject: "프로젝트 삭제…",
    deleteProjectConfirm: '이 프로젝트를 삭제하시겠습니까?\n프로젝트의 파일은 "기본 프로젝트"로 돌아가며 사라지지 않습니다.',
    projMoreActions: "{name}의 기타 작업",
    defaultProject: "기본 프로젝트",
    projEmpty: "관련 문서를 하나의 프로젝트에 모아 두면 AI 대화 기록이 프로젝트별로 쌓입니다.",
    projEmptyHint: '새 파일을 만들거나 "최근 사용"에서 파일을 마우스 오른쪽 버튼으로 클릭해 "프로젝트로 이동"을 선택하세요.',
    timelineCount: "{n}건",
    timelineCountOne: "{n}건",
    timelineEmpty: "이 프로젝트에는 아직 AI 대화 기록이 없습니다.",
    timelineYou: "나",
    timelineUserAria: "사용자",
    untitled: "제목 없음",
    noContent: "(내용 없음)",
    // Account
    account: "계정",
    login: "로그인",
    loggedIn: "로그인됨",
    waitingLogin: "브라우저 로그인을 기다리는 중… 클릭하면 로그인 페이지를 다시 엽니다",
    waitingShort: "로그인 대기 중…",
    loginTimeout: "로그인 시간이 초과되었습니다. 클릭하여 다시 시도",
    loginLaunchFailed: "로그인을 시작할 수 없습니다. 클릭하여 다시 시도",
    loginNetworkError: "Bati에 연결할 수 없습니다. 네트워크 또는 프록시 설정을 확인하세요",
    loginExpired: "로그인이 만료되었습니다. 클릭하여 다시 시도",
    loginFailed: "로그인에 실패했습니다. 클릭하여 다시 시도",
    loggingOut: "로그아웃 중…",
    logout: "로그아웃",
    credits: "크레딧",
    creditsTip: "크레딧 사용 내역 보기",
    appVersion: "버전 {v}",
    versionLabel: "버전",
    versionRowHint: "업데이트 내역 보기",
    updateReadyRestart: "재시작하여 업데이트",
    updateChannel: "업데이트 채널",
    telemetryLabel: "익명 사용 통계",
    telemetryOn: "보냄",
    telemetryOff: "보내지 않음",
    setSecPrivacy: "사용 통계",
    setSecShortcuts: "단축키",
    setSearchPlaceholder: "설정 검색",
    scPalette: "명령 팔레트",
    scSettings: "설정 열기",
    scNewDoc: "새 문서",
    scOpen: "파일 열기",
    scSave: "저장",
    scPrint: "인쇄",
    scCloseTab: "탭 닫기",
    scNextTab: "다음 탭",
    scPrevTab: "이전 탭",
    scGoToTab: "N번째 탭으로 이동",
    scGlobalSummon: "BatiOffice 호출 (전역)",
    globalSummonDesc: "다른 앱을 쓰는 중에도 ⌘(Ctrl)+Shift+B로 BatiOffice를 열고 바로 명령을 입력합니다.",
    heroLauncherHint: "검색하거나 새로 만들기…",
    heroAskWorkspace: "Bati AI에게 물어보기",
    showMoreFiles: "나머지 {count}개 보기",
    createMore: "더보기",
    paletteHint: "동작·탭·최근 파일 검색",
    paletteEmpty: "일치하는 항목 없음",
    paletteTabs: "탭",
    paletteRecents: "최근 파일",
    paletteActions: "동작",
    telemetryDesc: "문서를 연 횟수 같은 익명 카운터만 전송합니다. 문서 내용·파일명·프롬프트는 절대 수집하지 않으며, 언제든 끌 수 있습니다.",
    channelStable: "안정 버전",
    channelBeta: "베타 버전",
    theme: "테마",
    themeLight: "라이트",
    themeDark: "다크",
    themeSystem: "시스템 설정 따르기",
    saveLocation: "저장 위치",
    setAnalytics: "익명 사용 통계 보내기",
    setAnalyticsDesc: "기본적으로 켜져 있으며 설정 → 일반에서 언제든 끌 수 있습니다. Google Analytics 4를 사용하며 Google은 공인 IP 주소와 전송 메타데이터를 수신하지만 문서 내용이나 파일 이름은 수집하지 않습니다.",
    settings: "설정",
    setSecAccount: "계정",
    setSecGeneral: "일반",
    setSecAbout: "정보",
    setLearnMore: "더 알아보기",
    seeMoreAutomation: "자동화 기능 더 보기",
    starPromptTitle: "BatiOffice가 마음에 드시나요?",
    starPromptTitleN: "BatiOffice로 문서를 {n}개 열어보셨네요",
    starPromptBody: "Bati는 문서뿐 아니라 업무도 자동화합니다. 파일·시트·도구를 잇는 흐름을 확인해 보세요.",
    starPromptGo: "다른 기능 보기",
    starPromptDone: "이미 봤어요",
    starPromptLater: "나중에",
    onbAutomationHint: "Bati는 문서뿐 아니라 업무도 자동화합니다. bati.ai에서 확인해 보세요.",
    setEmail: "이메일",
    setNotLoggedIn: "로그인되지 않음",
    setViewUsage: "사용량 보기",
    setChange: "변경",
    // Dates
    today: "오늘",
    yesterday: "어제",
    daysAgo: "{n}일 전",
    // Language / tab strip
    language: "언어",
    closeTab: "탭 닫기",
    tabList: "모든 탭",
    tabAppMenu: "메뉴",
    newTab: "새 탭",
    // First-run onboarding
    onbTitle1: "BatiOffice에 오신 것을 환영합니다",
    onbSubtitle1: "AI 네이티브 오피스 제품군",
    onbBody1: "문서 작성, 스프레드시트 제작, 프레젠테이션 생성, PDF 검토. 모든 단계에 AI가 녹아 있습니다.",
    onbTitle2: "이제 시작일 뿐입니다",
    onbBody2: "BatiOffice는 아직 알파 단계입니다. GenTeam 그룹 채팅에 참여해 피드백을 공유하고 앞으로의 방향을 함께 만들어 가세요.",
    onbJoinGenTeam: "GenTeam 참여하기",
    onbSkip: "건너뛰기",
    onbNext: "다음",
    onbStart: "시작하기",
    onbStepAria: "총 {total}페이지 중 {n}페이지",
    onbTitle3: "모두에게 무료",
    onbBody3: "라이선스 비용 없음, 광고 없음, 워터마크 없음.",
    onbBack: "이전"
  },
  fr: {
    // Sidebar navigation
    navRecent: "Récents",
    navStarred: "Favoris",
    cloudSearchPlaceholder: "Rechercher parmi {n} projets…",
    cloudNoResults: "Aucun projet correspondant.",
    cloudGroupThisWeek: "Cette semaine",
    cloudGroupThisMonth: "Plus tôt ce mois-ci",
    cloudSortLabel: "Tri : {v}",
    cloudSortRecent: "Récents",
    cloudSortOldest: "Plus anciens",
    cloudRefresh: "Actualiser",
    cloudEmpty: "Aucun projet web pour le moment.",
    cloudError: "Échec du chargement. Réessayez plus tard.",
    cloudRetry: "Réessayer",
    cloudLoadMore: "Charger plus",
    cloudOpenInBrowser: "Ouvrir dans le navigateur",
    navTrash: "Corbeille",
    navTrashTip: "Les fichiers supprimés sont placés dans la corbeille du système et peuvent y être restaurés",
    // Section headings
    secQuickStart: "Démarrage rapide",
    secRecent: "Récents",
    secStarred: "Favoris",
    secProjectFiles: "Fichiers du projet",
    secActivity: "Activité",
    colName: "Nom",
    colLocation: "Emplacement",
    colModified: "Modifié le",
    colSize: "Taille",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Ouvrir un fichier local",
    openLocalSub: "Tous les formats de documents",
    greetMorning: "Bonjour",
    greetAfternoon: "Bonjour",
    greetEvening: "Bonsoir",
    greetAsk1: "Que souhaitez-vous créer aujourd’hui ?",
    greetAsk2: "Prêt à commencer ?",
    greetAsk3: "Sur quoi travaillez-vous ?",
    greetAsk4: "Par où commencer aujourd’hui ?",
    greetAsk5: "Envie de créer quelque chose de nouveau ?",
    greetAsk6: "Une idée en tête ?",
    // Filters
    filterAll: "Tous",
    filterDocs: "Documents",
    filterSheets: "Feuilles de calcul",
    filterSlides: "Présentations",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filtrer par type",
    // List / bulk actions
    fileCount: "{n} fichiers",
    fileCountOne: "{n} fichier",
    selectedCount: "{n} sélectionné(s)",
    selectAll: "Tout sélectionner",
    selectFile: "Sélectionner {name}",
    removeFromList: "Retirer de la liste",
    deleteFiles: "Supprimer les fichiers",
    cancel: "Annuler",
    star: "Ajouter aux favoris",
    unstar: "Retirer des favoris",
    moreActions: "Autres actions",
    open: "Ouvrir",
    revealInFolder: "Afficher dans le dossier",
    copyPath: "Copier le chemin",
    moveToProject: "Déplacer vers un projet",
    rename: "Renommer",
    duplicate: "Dupliquer",
    renameFailed: "Échec du renommage",
    emptyStarred: "Aucun favori — survolez une ligne et cliquez sur l'étoile.",
    emptyRecent: "Aucun fichier récent — créez ou ouvrez un fichier pour commencer.",
    emptyFiltered: "Aucun fichier de ce type.",
    // Delete confirmation dialog
    deleteModalTitle: "Supprimer les fichiers",
    deleteConfirmOne: "Déplacer « {name} » vers la corbeille ?",
    deleteConfirmMany: "Déplacer ces {n} fichiers vers la corbeille ?",
    deleteMoreCount: "… {n} au total",
    delete: "Supprimer",
    // Project sidebar
    projects: "Projets",
    newProject: "Nouveau projet",
    projectName: "Nom du projet",
    deleteProject: "Supprimer le projet…",
    deleteProjectConfirm: "Supprimer ce projet ?\nSes fichiers retourneront dans le projet par défaut et ne seront pas perdus.",
    projMoreActions: "Autres actions pour {name}",
    defaultProject: "Projet par défaut",
    projEmpty: "Regroupez les documents associés dans un même projet — l'historique des conversations IA s'accumule par projet.",
    projEmptyHint: "Créez un fichier, ou cliquez avec le bouton droit sur un fichier récent et choisissez « Déplacer vers un projet ».",
    timelineCount: "{n} éléments",
    timelineCountOne: "{n} élément",
    timelineEmpty: "Aucune conversation IA dans ce projet pour le moment.",
    timelineYou: "Vous",
    timelineUserAria: "Utilisateur",
    untitled: "Sans titre",
    noContent: "(vide)",
    // Account
    account: "Compte",
    login: "Se connecter",
    loggedIn: "Connecté",
    waitingLogin: "En attente de la connexion dans le navigateur… Cliquez pour rouvrir la page de connexion",
    waitingShort: "En attente…",
    loginTimeout: "La connexion a expiré — cliquez pour réessayer",
    loginLaunchFailed: "Impossible de lancer la connexion — cliquez pour réessayer",
    loginNetworkError: "Impossible de joindre Bati — vérifiez votre réseau ou vos paramètres de proxy",
    loginExpired: "L’autorisation a expiré — cliquez pour réessayer",
    loginFailed: "Échec de la connexion — cliquez pour réessayer",
    loggingOut: "Déconnexion…",
    logout: "Se déconnecter",
    credits: "Crédits",
    creditsTip: "Voir le détail de la consommation de crédits",
    appVersion: "Version {v}",
    versionLabel: "Version",
    versionRowHint: "See what changed",
    updateReadyRestart: "Redémarrer pour mettre à jour",
    updateChannel: "Canal de mise à jour",
    telemetryLabel: "Statistiques d'usage anonymes",
    telemetryOn: "Activé",
    telemetryOff: "Désactivé",
    setSecPrivacy: "Statistiques d’utilisation",
    setSecShortcuts: "Raccourcis",
    setSearchPlaceholder: "Rechercher un réglage",
    scPalette: "Palette de commandes",
    scSettings: "Ouvrir les réglages",
    scNewDoc: "Nouveau document",
    scOpen: "Ouvrir un fichier",
    scSave: "Enregistrer",
    scPrint: "Imprimer",
    scCloseTab: "Fermer l'onglet",
    scNextTab: "Onglet suivant",
    scPrevTab: "Onglet précédent",
    scGoToTab: "Aller à l'onglet N",
    scGlobalSummon: "Ouvrir BatiOffice (global)",
    globalSummonDesc: "Ouvrez BatiOffice et saisissez une commande depuis n’importe où avec ⌘(Ctrl)+Shift+B.",
    heroLauncherHint: "Rechercher ou créer…",
    heroAskWorkspace: "Demander à Bati AI",
    showMoreFiles: "Afficher {count} de plus",
    createMore: "Plus",
    paletteHint: "Rechercher actions, onglets et fichiers récents",
    paletteEmpty: "Aucun résultat",
    paletteTabs: "Onglets",
    paletteRecents: "Fichiers récents",
    paletteActions: "Actions",
    telemetryDesc: "Seuls des compteurs anonymes (comme le nombre d'ouvertures d'un éditeur) sont envoyés. Le contenu des documents, les noms de fichiers et les invites ne sont jamais collectés, et vous pouvez désactiver cela à tout moment.",
    channelStable: "Stable",
    channelBeta: "Bêta",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Suivre le système",
    saveLocation: "Emplacement d'enregistrement",
    setAnalytics: "Envoyer des statistiques d'utilisation anonymes",
    setAnalyticsDesc: "Activé par défaut et désactivable dans Paramètres → Général. Utilise Google Analytics 4 ; Google reçoit votre adresse IP publique et les métadonnées de transport, mais jamais le contenu des documents ni les noms de fichiers.",
    settings: "Paramètres",
    setSecAccount: "Compte",
    setSecGeneral: "Général",
    setSecAbout: "À propos",
    setLearnMore: "En savoir plus",
    seeMoreAutomation: "Voir plus d’automatisations",
    starPromptTitle: "BatiOffice vous plaît ?",
    starPromptTitleN: "Vous avez ouvert {n} documents avec BatiOffice",
    starPromptBody: "Bati automatise bien plus que des documents : des flux qui relient vos fichiers, feuilles et outils.",
    starPromptGo: "Découvrir les autres fonctions",
    starPromptDone: "Déjà vu",
    starPromptLater: "Plus tard",
    onbAutomationHint: "Bati automatise bien plus que des documents. À découvrir sur bati.ai.",
    setEmail: "E-mail",
    setNotLoggedIn: "Non connecté",
    setViewUsage: "Voir l'utilisation",
    setChange: "Modifier",
    // Dates
    today: "Aujourd'hui",
    yesterday: "Hier",
    daysAgo: "il y a {n} j",
    // Language / tab strip
    language: "Langue",
    closeTab: "Fermer l'onglet",
    tabList: "Tous les onglets",
    tabAppMenu: "Menu",
    newTab: "Nouvel onglet",
    // First-run onboarding
    onbTitle1: "Bienvenue dans BatiOffice",
    onbSubtitle1: "La suite bureautique native IA",
    onbBody1: "Créez des documents, des feuilles de calcul et des présentations, et relisez des PDF. L’IA est intégrée à chaque étape.",
    onbTitle2: "Ce n’est qu’un début",
    onbBody2: "BatiOffice est encore en alpha. Rejoignez la discussion de groupe sur GenTeam pour partager vos retours et façonner la suite.",
    onbJoinGenTeam: "Rejoindre GenTeam",
    onbSkip: "Passer",
    onbNext: "Suivant",
    onbStart: "Commencer",
    onbStepAria: "Page {n} sur {total}",
    onbTitle3: "Gratuit pour tous",
    onbBody3: "Pas de licence. Pas de publicité. Pas de filigrane.",
    onbBack: "Retour"
  },
  de: {
    // Sidebar navigation
    navRecent: "Zuletzt verwendet",
    navStarred: "Favoriten",
    cloudSearchPlaceholder: "{n} Projekte durchsuchen…",
    cloudNoResults: "Keine passenden Projekte.",
    cloudGroupThisWeek: "Diese Woche",
    cloudGroupThisMonth: "Früher in diesem Monat",
    cloudSortLabel: "Sortierung: {v}",
    cloudSortRecent: "Neueste",
    cloudSortOldest: "Älteste",
    cloudRefresh: "Aktualisieren",
    cloudEmpty: "Noch keine Web-Projekte.",
    cloudError: "Laden fehlgeschlagen. Bitte später erneut versuchen.",
    cloudRetry: "Erneut versuchen",
    cloudLoadMore: "Mehr laden",
    cloudOpenInBrowser: "Im Browser öffnen",
    navTrash: "Papierkorb",
    navTrashTip: "Gelöschte Dateien werden in den System-Papierkorb verschoben und können dort wiederhergestellt werden",
    // Section headings
    secQuickStart: "Schnellstart",
    secRecent: "Zuletzt verwendet",
    secStarred: "Favoriten",
    secProjectFiles: "Projektdateien",
    secActivity: "Aktivität",
    colName: "Name",
    colLocation: "Speicherort",
    colModified: "Geändert",
    colSize: "Größe",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Lokale Datei öffnen",
    openLocalSub: "Alle Dokumentformate",
    greetMorning: "Guten Morgen",
    greetAfternoon: "Guten Tag",
    greetEvening: "Guten Abend",
    greetAsk1: "Was möchten Sie heute erstellen?",
    greetAsk2: "Bereit loszulegen?",
    greetAsk3: "Woran arbeiten Sie?",
    greetAsk4: "Womit sollen wir heute beginnen?",
    greetAsk5: "Lust auf etwas Neues?",
    greetAsk6: "Schon eine Idee?",
    // Filters
    filterAll: "Alle",
    filterDocs: "Dokumente",
    filterSheets: "Tabellen",
    filterSlides: "Präsentationen",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Nach Typ filtern",
    // List / bulk actions
    fileCount: "{n} Dateien",
    fileCountOne: "{n} Datei",
    selectedCount: "{n} ausgewählt",
    selectAll: "Alle auswählen",
    selectFile: "{name} auswählen",
    removeFromList: "Aus Liste entfernen",
    deleteFiles: "Dateien löschen",
    cancel: "Abbrechen",
    star: "Zu Favoriten hinzufügen",
    unstar: "Aus Favoriten entfernen",
    moreActions: "Weitere Aktionen",
    open: "Öffnen",
    revealInFolder: "Im Ordner anzeigen",
    copyPath: "Pfad kopieren",
    moveToProject: "In Projekt verschieben",
    rename: "Umbenennen",
    duplicate: "Duplizieren",
    renameFailed: "Umbenennen fehlgeschlagen",
    emptyStarred: "Keine Favoriten — bewegen Sie den Mauszeiger über eine Zeile und klicken Sie auf den Stern.",
    emptyRecent: "Keine zuletzt verwendeten Dateien — erstellen oder öffnen Sie eine Datei, um zu beginnen.",
    emptyFiltered: "Keine Dateien dieses Typs.",
    // Delete confirmation dialog
    deleteModalTitle: "Dateien löschen",
    deleteConfirmOne: "„{name}“ in den Papierkorb verschieben?",
    deleteConfirmMany: "Diese {n} Dateien in den Papierkorb verschieben?",
    deleteMoreCount: "… insgesamt {n}",
    delete: "Löschen",
    // Project sidebar
    projects: "Projekte",
    newProject: "Neues Projekt",
    projectName: "Projektname",
    deleteProject: "Projekt löschen…",
    deleteProjectConfirm: "Dieses Projekt löschen?\nSeine Dateien kehren in das Standardprojekt zurück und gehen nicht verloren.",
    projMoreActions: "Weitere Aktionen für {name}",
    defaultProject: "Standardprojekt",
    projEmpty: "Bewahren Sie zusammengehörige Dokumente in einem Projekt auf — der KI-Chatverlauf sammelt sich pro Projekt an.",
    projEmptyHint: "Erstellen Sie eine Datei oder klicken Sie mit der rechten Maustaste auf eine zuletzt verwendete Datei und wählen Sie „In Projekt verschieben“.",
    timelineCount: "{n} Einträge",
    timelineCountOne: "{n} Eintrag",
    timelineEmpty: "Noch keine KI-Unterhaltungen in diesem Projekt.",
    timelineYou: "Sie",
    timelineUserAria: "Benutzer",
    untitled: "Unbenannt",
    noContent: "(leer)",
    // Account
    account: "Konto",
    login: "Anmelden",
    loggedIn: "Angemeldet",
    waitingLogin: "Warten auf Anmeldung im Browser… Klicken Sie, um die Anmeldeseite erneut zu öffnen",
    waitingShort: "Warten…",
    loginTimeout: "Zeitüberschreitung bei der Anmeldung — klicken Sie zum Wiederholen",
    loginLaunchFailed: "Anmeldung konnte nicht gestartet werden — klicken Sie zum Wiederholen",
    loginNetworkError: "Bati ist nicht erreichbar — prüfen Sie Netzwerk- oder Proxy-Einstellungen",
    loginExpired: "Die Autorisierung ist abgelaufen — klicken Sie zum Wiederholen",
    loginFailed: "Anmeldung fehlgeschlagen — klicken Sie zum Wiederholen",
    loggingOut: "Abmelden…",
    logout: "Abmelden",
    credits: "Credits",
    creditsTip: "Credit-Verbrauch ansehen",
    appVersion: "Version {v}",
    versionLabel: "Version",
    versionRowHint: "See what changed",
    updateReadyRestart: "Neu starten und aktualisieren",
    updateChannel: "Update-Kanal",
    telemetryLabel: "Anonyme Nutzungsstatistik",
    telemetryOn: "Aktiv",
    telemetryOff: "Aus",
    setSecPrivacy: "Nutzungsstatistik",
    setSecShortcuts: "Kurzbefehle",
    setSearchPlaceholder: "Einstellungen durchsuchen",
    scPalette: "Befehlspalette",
    scSettings: "Einstellungen öffnen",
    scNewDoc: "Neues Dokument",
    scOpen: "Datei öffnen",
    scSave: "Speichern",
    scPrint: "Drucken",
    scCloseTab: "Tab schließen",
    scNextTab: "Nächster Tab",
    scPrevTab: "Vorheriger Tab",
    scGoToTab: "Zu Tab N springen",
    scGlobalSummon: "BatiOffice aufrufen (global)",
    globalSummonDesc: "Öffnen Sie BatiOffice von überall mit ⌘(Strg)+Umschalt+B und geben Sie direkt einen Befehl ein.",
    heroLauncherHint: "Suchen oder erstellen…",
    heroAskWorkspace: "Bati AI fragen",
    showMoreFiles: "{count} weitere anzeigen",
    createMore: "Mehr",
    paletteHint: "Aktionen, Tabs und zuletzt verwendete Dateien durchsuchen",
    paletteEmpty: "Keine Treffer",
    paletteTabs: "Tabs",
    paletteRecents: "Zuletzt verwendet",
    paletteActions: "Aktionen",
    telemetryDesc: "Es werden nur anonyme Zähler gesendet (z. B. wie oft ein Editor geöffnet wird). Dokumentinhalte, Dateinamen und Prompts werden niemals erfasst; Sie können dies jederzeit deaktivieren.",
    channelStable: "Stabil",
    channelBeta: "Beta",
    theme: "Thema",
    themeLight: "Hell",
    themeDark: "Dunkel",
    themeSystem: "System folgen",
    saveLocation: "Speicherort",
    setAnalytics: "Anonyme Nutzungsstatistiken senden",
    setAnalyticsDesc: "Standardmäßig aktiviert und unter Einstellungen → Allgemein deaktivierbar. Verwendet Google Analytics 4; Google erhält Ihre öffentliche IP-Adresse und Transportmetadaten, aber keine Dokumentinhalte oder Dateinamen.",
    settings: "Einstellungen",
    setSecAccount: "Konto",
    setSecGeneral: "Allgemein",
    setSecAbout: "Über",
    setLearnMore: "Mehr erfahren",
    seeMoreAutomation: "Mehr Automatisierung ansehen",
    starPromptTitle: "Gefällt Ihnen BatiOffice?",
    starPromptTitleN: "Sie haben {n} Dokumente mit BatiOffice geöffnet",
    starPromptBody: "Bati automatisiert mehr als Dokumente — Abläufe, die Dateien, Tabellen und Werkzeuge verbinden.",
    starPromptGo: "Weitere Funktionen ansehen",
    starPromptDone: "Schon gesehen",
    starPromptLater: "Später",
    onbAutomationHint: "Bati automatisiert mehr als Dokumente. Mehr dazu auf bati.ai.",
    setEmail: "E-Mail",
    setNotLoggedIn: "Nicht angemeldet",
    setViewUsage: "Verbrauch anzeigen",
    setChange: "Ändern",
    // Dates
    today: "Heute",
    yesterday: "Gestern",
    daysAgo: "vor {n} Tagen",
    // Language / tab strip
    language: "Sprache",
    closeTab: "Tab schließen",
    tabList: "Alle Tabs",
    tabAppMenu: "Menü",
    newTab: "Neuer Tab",
    // First-run onboarding
    onbTitle1: "Willkommen bei BatiOffice",
    onbSubtitle1: "Die KI-native Office-Suite",
    onbBody1: "Dokumente erstellen, Tabellen bauen, Präsentationen gestalten und PDFs prüfen. KI ist in jedem Schritt integriert.",
    onbTitle2: "Das ist erst der Anfang",
    onbBody2: "BatiOffice ist noch in der Alpha-Phase. Treten Sie dem Gruppenchat auf GenTeam bei, um Feedback zu teilen und die Zukunft mitzugestalten.",
    onbJoinGenTeam: "GenTeam beitreten",
    onbSkip: "Überspringen",
    onbNext: "Weiter",
    onbStart: "Loslegen",
    onbStepAria: "Seite {n} von {total}",
    onbTitle3: "Kostenlos für alle",
    onbBody3: "Keine Lizenzgebühren. Keine Werbung. Keine Wasserzeichen.",
    onbBack: "Zurück"
  },
  es: {
    // Sidebar navigation
    navRecent: "Recientes",
    navStarred: "Destacados",
    cloudSearchPlaceholder: "Buscar entre {n} proyectos…",
    cloudNoResults: "No hay proyectos coincidentes.",
    cloudGroupThisWeek: "Esta semana",
    cloudGroupThisMonth: "Este mes",
    cloudSortLabel: "Orden: {v}",
    cloudSortRecent: "Recientes",
    cloudSortOldest: "Más antiguos",
    cloudRefresh: "Actualizar",
    cloudEmpty: "Aún no hay proyectos en la web.",
    cloudError: "Error al cargar. Inténtalo más tarde.",
    cloudRetry: "Reintentar",
    cloudLoadMore: "Cargar más",
    cloudOpenInBrowser: "Abrir en el navegador",
    navTrash: "Papelera",
    navTrashTip: "Los archivos eliminados van a la papelera del sistema y pueden restaurarse desde allí",
    // Section headings
    secQuickStart: "Inicio rápido",
    secRecent: "Recientes",
    secStarred: "Destacados",
    secProjectFiles: "Archivos del proyecto",
    secActivity: "Actividad",
    colName: "Nombre",
    colLocation: "Ubicación",
    colModified: "Modificado",
    colSize: "Tamaño",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Abrir archivo local",
    openLocalSub: "Todos los formatos de documento",
    greetMorning: "Buenos días",
    greetAfternoon: "Buenas tardes",
    greetEvening: "Buenas noches",
    greetAsk1: "¿Qué quieres crear hoy?",
    greetAsk2: "¿Listo para empezar?",
    greetAsk3: "¿En qué estás trabajando?",
    greetAsk4: "¿Por dónde empezamos hoy?",
    greetAsk5: "¿Te apetece crear algo nuevo?",
    greetAsk6: "¿Alguna idea?",
    // Filters
    filterAll: "Todos",
    filterDocs: "Documentos",
    filterSheets: "Hojas de cálculo",
    filterSlides: "Presentaciones",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filtrar por tipo",
    // List / bulk actions
    fileCount: "{n} archivos",
    fileCountOne: "{n} archivo",
    selectedCount: "{n} seleccionados",
    selectAll: "Seleccionar todo",
    selectFile: "Seleccionar {name}",
    removeFromList: "Quitar de la lista",
    deleteFiles: "Eliminar archivos",
    cancel: "Cancelar",
    star: "Destacar",
    unstar: "Quitar de destacados",
    moreActions: "Más acciones",
    open: "Abrir",
    revealInFolder: "Mostrar en la carpeta",
    copyPath: "Copiar ruta",
    moveToProject: "Mover a un proyecto",
    rename: "Cambiar nombre",
    duplicate: "Duplicar",
    renameFailed: "No se pudo cambiar el nombre",
    emptyStarred: "No hay archivos destacados — pase el cursor sobre una fila y haga clic en la estrella.",
    emptyRecent: "No hay archivos recientes — cree o abra un archivo para empezar.",
    emptyFiltered: "No hay archivos de este tipo.",
    // Delete confirmation dialog
    deleteModalTitle: "Eliminar archivos",
    deleteConfirmOne: '¿Mover "{name}" a la papelera?',
    deleteConfirmMany: "¿Mover estos {n} archivos a la papelera?",
    deleteMoreCount: "… {n} en total",
    delete: "Eliminar",
    // Project sidebar
    projects: "Proyectos",
    newProject: "Nuevo proyecto",
    projectName: "Nombre del proyecto",
    deleteProject: "Eliminar proyecto…",
    deleteProjectConfirm: "¿Eliminar este proyecto?\nSus archivos volverán al proyecto predeterminado y no se perderán.",
    projMoreActions: "Más acciones para {name}",
    defaultProject: "Proyecto predeterminado",
    projEmpty: "Guarde los documentos relacionados en un mismo proyecto — el historial de chat de IA se acumula por proyecto.",
    projEmptyHint: 'Cree un archivo o haga clic derecho en un archivo reciente y elija "Mover a un proyecto".',
    timelineCount: "{n} elementos",
    timelineCountOne: "{n} elemento",
    timelineEmpty: "Aún no hay conversaciones de IA en este proyecto.",
    timelineYou: "Tú",
    timelineUserAria: "Usuario",
    untitled: "Sin título",
    noContent: "(vacío)",
    // Account
    account: "Cuenta",
    login: "Iniciar sesión",
    loggedIn: "Sesión iniciada",
    waitingLogin: "Esperando el inicio de sesión en el navegador… Haga clic para volver a abrir la página de inicio de sesión",
    waitingShort: "Esperando…",
    loginTimeout: "El inicio de sesión ha caducado — haga clic para reintentar",
    loginLaunchFailed: "No se pudo iniciar el inicio de sesión — haga clic para reintentar",
    loginNetworkError: "No se puede conectar con Bati — compruebe su red o la configuración del proxy",
    loginExpired: "La autorización ha caducado — haga clic para reintentar",
    loginFailed: "Error al iniciar sesión — haga clic para reintentar",
    loggingOut: "Cerrando sesión…",
    logout: "Cerrar sesión",
    credits: "Créditos",
    creditsTip: "Ver el detalle del uso de créditos",
    appVersion: "Versión {v}",
    versionLabel: "Versión",
    versionRowHint: "Ver los cambios",
    updateReadyRestart: "Reiniciar para actualizar",
    updateChannel: "Canal de actualización",
    telemetryLabel: "Estadísticas de uso anónimas",
    telemetryOn: "Activado",
    telemetryOff: "Desactivado",
    setSecPrivacy: "Estadísticas de uso",
    setSecShortcuts: "Atajos",
    setSearchPlaceholder: "Buscar ajustes",
    scPalette: "Paleta de comandos",
    scSettings: "Abrir ajustes",
    scNewDoc: "Nuevo documento",
    scOpen: "Abrir archivo",
    scSave: "Guardar",
    scPrint: "Imprimir",
    scCloseTab: "Cerrar pestaña",
    scNextTab: "Pestaña siguiente",
    scPrevTab: "Pestaña anterior",
    scGoToTab: "Ir a la pestaña N",
    scGlobalSummon: "Invocar BatiOffice (global)",
    globalSummonDesc: "Abra BatiOffice desde cualquier lugar con ⌘(Ctrl)+Shift+B y escriba un comando al instante.",
    heroLauncherHint: "Buscar o crear…",
    heroAskWorkspace: "Preguntar a Bati AI",
    showMoreFiles: "Mostrar {count} más",
    createMore: "Más",
    paletteHint: "Buscar acciones, pestañas y archivos recientes",
    paletteEmpty: "Sin coincidencias",
    paletteTabs: "Pestañas",
    paletteRecents: "Archivos recientes",
    paletteActions: "Acciones",
    telemetryDesc: "Solo se envían contadores anónimos (por ejemplo, cuántas veces se abre un editor). Nunca se recopilan contenidos de documentos, nombres de archivo ni indicaciones, y puede desactivarlo en cualquier momento.",
    channelStable: "Estable",
    channelBeta: "Beta",
    theme: "Tema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    themeSystem: "Seguir el sistema",
    saveLocation: "Ubicación de guardado",
    setAnalytics: "Enviar estadísticas de uso anónimas",
    setAnalyticsDesc: "Activado de forma predeterminada y desactivable en Configuración → General. Usa Google Analytics 4; Google recibe tu IP pública y metadatos de transporte, pero nunca el contenido de documentos ni los nombres de archivo.",
    settings: "Configuración",
    setSecAccount: "Cuenta",
    setSecGeneral: "General",
    setSecAbout: "Acerca de",
    setLearnMore: "Más información",
    seeMoreAutomation: "Ver más automatizaciones",
    starPromptTitle: "¿Te gusta BatiOffice?",
    starPromptTitleN: "Has abierto {n} documentos con BatiOffice",
    starPromptBody: "Bati automatiza mucho más que documentos: flujos que conectan tus archivos, hojas y herramientas.",
    starPromptGo: "Ver otras funciones",
    starPromptDone: "Ya lo vi",
    starPromptLater: "Más tarde",
    onbAutomationHint: "Bati automatiza mucho más que documentos. Descúbrelo en bati.ai.",
    setEmail: "Correo electrónico",
    setNotLoggedIn: "Sesión no iniciada",
    setViewUsage: "Ver uso",
    setChange: "Cambiar",
    // Dates
    today: "Hoy",
    yesterday: "Ayer",
    daysAgo: "hace {n} días",
    // Language / tab strip
    language: "Idioma",
    closeTab: "Cerrar pestaña",
    tabList: "Todas las pestañas",
    tabAppMenu: "Menú",
    newTab: "Nueva pestaña",
    // First-run onboarding
    onbTitle1: "Bienvenido a BatiOffice",
    onbSubtitle1: "La suite ofimática nativa de IA",
    onbBody1: "Crea documentos, hojas de cálculo y presentaciones, y revisa PDF. La IA está integrada en cada paso.",
    onbTitle2: "Esto es solo el comienzo",
    onbBody2: "BatiOffice aún está en alfa. Únete al chat grupal en GenTeam para compartir comentarios y ayudar a dar forma a lo que viene.",
    onbJoinGenTeam: "Unirse a GenTeam",
    onbSkip: "Omitir",
    onbNext: "Siguiente",
    onbStart: "Empezar",
    onbStepAria: "Página {n} de {total}",
    onbTitle3: "Gratis para todos",
    onbBody3: "Sin licencias. Sin anuncios. Sin marcas de agua.",
    onbBack: "Atrás"
  },
  th: {
    // Sidebar navigation
    navRecent: "ล่าสุด",
    navStarred: "รายการโปรด",
    cloudSearchPlaceholder: "ค้นหา {n} โปรเจกต์…",
    cloudNoResults: "ไม่มีโปรเจกต์ที่ตรงกัน",
    cloudGroupThisWeek: "สัปดาห์นี้",
    cloudGroupThisMonth: "เดือนนี้",
    cloudSortLabel: "เรียง: {v}",
    cloudSortRecent: "ล่าสุด",
    cloudSortOldest: "เก่าสุด",
    cloudRefresh: "รีเฟรช",
    cloudEmpty: "ยังไม่มีโปรเจกต์บนเว็บ",
    cloudError: "โหลดไม่สำเร็จ โปรดลองอีกครั้งภายหลัง",
    cloudRetry: "ลองอีกครั้ง",
    cloudLoadMore: "โหลดเพิ่มเติม",
    cloudOpenInBrowser: "เปิดในเบราว์เซอร์",
    navTrash: "ถังขยะ",
    navTrashTip: "ไฟล์ที่ถูกลบจะถูกย้ายไปยังถังขยะของระบบ และสามารถกู้คืนได้จากที่นั่น",
    // Section headings
    secQuickStart: "เริ่มต้นอย่างรวดเร็ว",
    secRecent: "ใช้งานล่าสุด",
    secStarred: "รายการโปรด",
    secProjectFiles: "ไฟล์โปรเจ็กต์",
    secActivity: "กิจกรรม",
    colName: "ชื่อ",
    colLocation: "ตำแหน่งที่ตั้ง",
    colModified: "แก้ไขเมื่อ",
    colSize: "ขนาด",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "เปิดไฟล์ในเครื่อง",
    openLocalSub: "รองรับทุกรูปแบบเอกสาร",
    greetMorning: "สวัสดีตอนเช้า",
    greetAfternoon: "สวัสดีตอนบ่าย",
    greetEvening: "สวัสดีตอนเย็น",
    greetAsk1: "วันนี้อยากสร้างอะไร",
    greetAsk2: "พร้อมเริ่มต้นหรือยัง",
    greetAsk3: "อยากทำอะไรดี",
    greetAsk4: "วันนี้เริ่มจากตรงไหนดี",
    greetAsk5: "อยากลองทำอะไรใหม่ไหม",
    greetAsk6: "มีไอเดียอะไรบ้าง",
    // Filters
    filterAll: "ทั้งหมด",
    filterDocs: "เอกสาร",
    filterSheets: "สเปรดชีต",
    filterSlides: "งานนำเสนอ",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "กรองตามชนิด",
    // List / bulk actions
    fileCount: "{n} ไฟล์",
    fileCountOne: "{n} ไฟล์",
    selectedCount: "เลือกแล้ว {n} รายการ",
    selectAll: "เลือกทั้งหมด",
    selectFile: "เลือก {name}",
    removeFromList: "นำออกจากรายการ",
    deleteFiles: "ลบไฟล์",
    cancel: "ยกเลิก",
    star: "เพิ่มในรายการโปรด",
    unstar: "นำออกจากรายการโปรด",
    moreActions: "การดำเนินการเพิ่มเติม",
    open: "เปิด",
    revealInFolder: "แสดงในโฟลเดอร์",
    copyPath: "คัดลอกเส้นทาง",
    moveToProject: "ย้ายไปยังโปรเจ็กต์",
    rename: "เปลี่ยนชื่อ",
    duplicate: "สร้างสำเนา",
    renameFailed: "เปลี่ยนชื่อไม่สำเร็จ",
    emptyStarred: "ยังไม่มีรายการโปรด — วางเมาส์เหนือแถวไฟล์แล้วคลิกดาว",
    emptyRecent: "ยังไม่มีไฟล์ล่าสุด — สร้างหรือเปิดไฟล์เพื่อเริ่มต้น",
    emptyFiltered: "ไม่มีไฟล์ชนิดนี้",
    // Delete confirmation dialog
    deleteModalTitle: "ลบไฟล์",
    deleteConfirmOne: 'ย้าย "{name}" ไปยังถังขยะหรือไม่',
    deleteConfirmMany: "ย้ายไฟล์ {n} ไฟล์นี้ไปยังถังขยะหรือไม่",
    deleteMoreCount: "… รวมทั้งหมด {n} ไฟล์",
    delete: "ลบ",
    // Project sidebar
    projects: "โปรเจ็กต์",
    newProject: "โปรเจ็กต์ใหม่",
    projectName: "ชื่อโปรเจ็กต์",
    deleteProject: "ลบโปรเจ็กต์…",
    deleteProjectConfirm: 'ลบโปรเจ็กต์นี้หรือไม่\nไฟล์ในโปรเจ็กต์จะกลับไปยัง "โปรเจ็กต์เริ่มต้น" และจะไม่สูญหาย',
    projMoreActions: "การดำเนินการเพิ่มเติมสำหรับ {name}",
    defaultProject: "โปรเจ็กต์เริ่มต้น",
    projEmpty: "เก็บเอกสารที่เกี่ยวข้องไว้ในโปรเจ็กต์เดียวกัน — ประวัติการสนทนา AI จะสะสมตามโปรเจ็กต์",
    projEmptyHint: 'สร้างไฟล์ใหม่ หรือคลิกขวาที่ไฟล์ล่าสุดแล้วเลือก "ย้ายไปยังโปรเจ็กต์"',
    timelineCount: "{n} รายการ",
    timelineCountOne: "{n} รายการ",
    timelineEmpty: "โปรเจ็กต์นี้ยังไม่มีประวัติการสนทนา AI",
    timelineYou: "คุณ",
    timelineUserAria: "ผู้ใช้",
    untitled: "ไม่มีชื่อ",
    noContent: "(ไม่มีเนื้อหา)",
    // Account
    account: "บัญชี",
    login: "ลงชื่อเข้าใช้",
    loggedIn: "ลงชื่อเข้าใช้แล้ว",
    waitingLogin: "กำลังรอการลงชื่อเข้าใช้ในเบราว์เซอร์… คลิกเพื่อเปิดหน้าลงชื่อเข้าใช้อีกครั้ง",
    waitingShort: "กำลังรอ…",
    loginTimeout: "การลงชื่อเข้าใช้หมดเวลา — คลิกเพื่อลองอีกครั้ง",
    loginLaunchFailed: "ไม่สามารถเริ่มการลงชื่อเข้าใช้ได้ — คลิกเพื่อลองอีกครั้ง",
    loginNetworkError: "ไม่สามารถเชื่อมต่อ Bati ได้ โปรดตรวจสอบเครือข่ายหรือการตั้งค่าพร็อกซี",
    loginExpired: "การอนุญาตหมดอายุ — คลิกเพื่อลองอีกครั้ง",
    loginFailed: "การลงชื่อเข้าใช้ล้มเหลว — คลิกเพื่อลองอีกครั้ง",
    loggingOut: "กำลังออกจากระบบ…",
    logout: "ออกจากระบบ",
    credits: "เครดิต",
    creditsTip: "ดูรายละเอียดการใช้เครดิต",
    appVersion: "เวอร์ชัน {v}",
    versionLabel: "เวอร์ชัน",
    versionRowHint: "ดูประวัติการอัปเดต",
    updateReadyRestart: "รีสตาร์ทเพื่ออัปเดต",
    updateChannel: "ช่องทางอัปเดต",
    telemetryLabel: "สถิติการใช้งานแบบไม่ระบุตัวตน",
    telemetryOn: "เปิด",
    telemetryOff: "ปิด",
    setSecPrivacy: "สถิติการใช้งาน",
    setSecShortcuts: "ปุ่มลัด",
    setSearchPlaceholder: "ค้นหาการตั้งค่า",
    scPalette: "พาเลตคำสั่ง",
    scSettings: "เปิดการตั้งค่า",
    scNewDoc: "เอกสารใหม่",
    scOpen: "เปิดไฟล์",
    scSave: "บันทึก",
    scPrint: "พิมพ์",
    scCloseTab: "ปิดแท็บ",
    scNextTab: "แท็บถัดไป",
    scPrevTab: "แท็บก่อนหน้า",
    scGoToTab: "ไปที่แท็บ N",
    scGlobalSummon: "เรียก BatiOffice (ทั่วระบบ)",
    globalSummonDesc: "เปิด BatiOffice จากทุกที่ด้วย ⌘(Ctrl)+Shift+B แล้วพิมพ์คำสั่งได้ทันที",
    heroLauncherHint: "ค้นหาหรือสร้างใหม่…",
    heroAskWorkspace: "ถาม Bati AI",
    showMoreFiles: "แสดงอีก {count} รายการ",
    createMore: "เพิ่มเติม",
    paletteHint: "ค้นหาการทำงาน แท็บ และไฟล์ล่าสุด",
    paletteEmpty: "ไม่พบรายการ",
    paletteTabs: "แท็บ",
    paletteRecents: "ไฟล์ล่าสุด",
    paletteActions: "การทำงาน",
    telemetryDesc: "ส่งเฉพาะตัวนับแบบไม่ระบุตัวตน (เช่น จำนวนครั้งที่เปิดตัวแก้ไข) เท่านั้น จะไม่เก็บเนื้อหาเอกสาร ชื่อไฟล์ หรือพรอมต์ และปิดได้ทุกเมื่อ",
    channelStable: "เสถียร",
    channelBeta: "เบต้า",
    theme: "ธีม",
    themeLight: "สว่าง",
    themeDark: "มืด",
    themeSystem: "ตามระบบ",
    saveLocation: "ตำแหน่งบันทึก",
    setAnalytics: "ส่งสถิติการใช้งานแบบไม่ระบุตัวตน",
    setAnalyticsDesc: "เปิดใช้งานเป็นค่าเริ่มต้นและปิดได้ทุกเมื่อใน การตั้งค่า → ทั่วไป ใช้ Google Analytics 4 โดย Google จะได้รับ IP สาธารณะและข้อมูลเมตาการรับส่งข้อมูล แต่จะไม่เก็บเนื้อหาเอกสารหรือชื่อไฟล์",
    settings: "การตั้งค่า",
    setSecAccount: "บัญชี",
    setSecGeneral: "ทั่วไป",
    setSecAbout: "เกี่ยวกับ",
    setLearnMore: "ดูเพิ่มเติม",
    seeMoreAutomation: "ดูฟีเจอร์อัตโนมัติเพิ่มเติม",
    starPromptTitle: "ชอบ BatiOffice ไหม?",
    starPromptTitleN: "คุณเปิดเอกสารด้วย BatiOffice ไปแล้ว {n} ไฟล์",
    starPromptBody: "Bati ทำงานอัตโนมัติได้มากกว่าเอกสาร — เชื่อมไฟล์ ชีต และเครื่องมือเข้าด้วยกัน",
    starPromptGo: "ดูฟีเจอร์อื่น",
    starPromptDone: "ดูแล้ว",
    starPromptLater: "ไว้ทีหลัง",
    onbAutomationHint: "Bati ทำงานอัตโนมัติได้มากกว่าเอกสาร ดูเพิ่มเติมที่ bati.ai",
    setEmail: "อีเมล",
    setNotLoggedIn: "ยังไม่ได้เข้าสู่ระบบ",
    setViewUsage: "ดูการใช้งาน",
    setChange: "เปลี่ยน",
    // Dates
    today: "วันนี้",
    yesterday: "เมื่อวาน",
    daysAgo: "{n} วันที่แล้ว",
    // Language / tab strip
    language: "ภาษา",
    closeTab: "ปิดแท็บ",
    tabList: "แท็บทั้งหมด",
    tabAppMenu: "เมนู",
    newTab: "แท็บใหม่",
    // First-run onboarding
    onbTitle1: "ยินดีต้อนรับสู่ BatiOffice",
    onbSubtitle1: "ชุดโปรแกรมออฟฟิศ AI-native",
    onbBody1: "สร้างเอกสาร ทำสเปรดชีต สร้างงานนำเสนอ และตรวจทาน PDF ทุกขั้นตอนมี AI ในตัว",
    onbTitle2: "นี่เป็นเพียงจุดเริ่มต้น",
    onbBody2: "BatiOffice ยังอยู่ในช่วงอัลฟ่า เข้าร่วมแชทกลุ่มบน GenTeam เพื่อแบ่งปันความคิดเห็นและร่วมกำหนดทิศทางต่อไป",
    onbJoinGenTeam: "เข้าร่วม GenTeam",
    onbSkip: "ข้าม",
    onbNext: "ถัดไป",
    onbStart: "เริ่มใช้งาน",
    onbStepAria: "หน้า {n} จาก {total}",
    onbTitle3: "ฟรีสำหรับทุกคน",
    onbBody3: "ไม่มีค่าลิขสิทธิ์ ไม่มีโฆษณา ไม่มีลายน้ำ",
    onbBack: "ย้อนกลับ"
  },
  id: {
    // Sidebar navigation
    navRecent: "Terbaru",
    navStarred: "Berbintang",
    cloudSearchPlaceholder: "Cari {n} proyek…",
    cloudNoResults: "Tidak ada proyek yang cocok.",
    cloudGroupThisWeek: "Minggu ini",
    cloudGroupThisMonth: "Bulan ini",
    cloudSortLabel: "Urutkan: {v}",
    cloudSortRecent: "Terbaru",
    cloudSortOldest: "Terlama",
    cloudRefresh: "Segarkan",
    cloudEmpty: "Belum ada proyek web.",
    cloudError: "Gagal memuat. Coba lagi nanti.",
    cloudRetry: "Coba lagi",
    cloudLoadMore: "Muat lebih banyak",
    cloudOpenInBrowser: "Buka di browser",
    navTrash: "Sampah",
    navTrashTip: "File yang dihapus akan dipindahkan ke tempat sampah sistem dan dapat dipulihkan dari sana",
    // Section headings
    secQuickStart: "Mulai cepat",
    secRecent: "Terbaru",
    secStarred: "Berbintang",
    secProjectFiles: "File proyek",
    secActivity: "Aktivitas",
    colName: "Nama",
    colLocation: "Lokasi",
    colModified: "Diubah",
    colSize: "Ukuran",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Buka File Lokal",
    openLocalSub: "Semua format dokumen",
    greetMorning: "Selamat pagi",
    greetAfternoon: "Selamat siang",
    greetEvening: "Selamat malam",
    greetAsk1: "Mau membuat apa hari ini?",
    greetAsk2: "Siap mulai?",
    greetAsk3: "Ada yang ingin dikerjakan?",
    greetAsk4: "Mulai dari mana hari ini?",
    greetAsk5: "Mau buat sesuatu yang baru?",
    greetAsk6: "Ada ide bagus?",
    // Filters
    filterAll: "Semua",
    filterDocs: "Dokumen",
    filterSheets: "Spreadsheet",
    filterSlides: "Presentasi",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filter menurut jenis",
    // List / bulk actions
    fileCount: "{n} file",
    fileCountOne: "{n} file",
    selectedCount: "{n} dipilih",
    selectAll: "Pilih semua",
    selectFile: "Pilih {name}",
    removeFromList: "Hapus dari daftar",
    deleteFiles: "Hapus file",
    cancel: "Batal",
    star: "Beri bintang",
    unstar: "Hapus bintang",
    moreActions: "Tindakan lainnya",
    open: "Buka",
    revealInFolder: "Tampilkan di folder",
    copyPath: "Salin jalur",
    moveToProject: "Pindahkan ke proyek",
    rename: "Ganti nama",
    duplicate: "Duplikat",
    renameFailed: "Gagal mengganti nama",
    emptyStarred: "Belum ada file berbintang — arahkan kursor ke baris file lalu klik bintang.",
    emptyRecent: "Belum ada file terbaru — buat atau buka file untuk memulai.",
    emptyFiltered: "Tidak ada file jenis ini.",
    // Delete confirmation dialog
    deleteModalTitle: "Hapus File",
    deleteConfirmOne: 'Pindahkan "{name}" ke tempat sampah?',
    deleteConfirmMany: "Pindahkan {n} file ini ke tempat sampah?",
    deleteMoreCount: "… total {n} file",
    delete: "Hapus",
    // Project sidebar
    projects: "Proyek",
    newProject: "Proyek baru",
    projectName: "Nama proyek",
    deleteProject: "Hapus proyek…",
    deleteProjectConfirm: "Hapus proyek ini?\nFile di dalamnya akan kembali ke Proyek Default dan tidak akan hilang.",
    projMoreActions: "Tindakan lainnya untuk {name}",
    defaultProject: "Proyek default",
    projEmpty: "Simpan dokumen terkait dalam satu proyek — riwayat percakapan AI terkumpul per proyek.",
    projEmptyHint: 'Buat file, atau klik kanan file terbaru dan pilih "Pindahkan ke proyek".',
    timelineCount: "{n} item",
    timelineCountOne: "{n} item",
    timelineEmpty: "Belum ada percakapan AI di proyek ini.",
    timelineYou: "Anda",
    timelineUserAria: "Pengguna",
    untitled: "Tanpa judul",
    noContent: "(kosong)",
    // Account
    account: "Akun",
    login: "Masuk",
    loggedIn: "Sudah masuk",
    waitingLogin: "Menunggu login di browser… Klik untuk membuka kembali halaman login",
    waitingShort: "Menunggu…",
    loginTimeout: "Waktu login habis — klik untuk mencoba lagi",
    loginLaunchFailed: "Tidak dapat memulai login — klik untuk mencoba lagi",
    loginNetworkError: "Tidak dapat terhubung ke Bati — periksa jaringan atau pengaturan proxy Anda",
    loginExpired: "Otorisasi kedaluwarsa — klik untuk mencoba lagi",
    loginFailed: "Login gagal — klik untuk mencoba lagi",
    loggingOut: "Keluar…",
    logout: "Keluar",
    credits: "Kredit",
    creditsTip: "Lihat detail penggunaan kredit",
    appVersion: "Versi {v}",
    versionLabel: "Versi",
    versionRowHint: "Lihat riwayat pembaruan",
    updateReadyRestart: "Mulai ulang untuk memperbarui",
    updateChannel: "Saluran Pembaruan",
    telemetryLabel: "Statistik penggunaan anonim",
    telemetryOn: "Aktif",
    telemetryOff: "Nonaktif",
    setSecPrivacy: "Statistik penggunaan",
    setSecShortcuts: "Pintasan",
    setSearchPlaceholder: "Cari pengaturan",
    scPalette: "Palet perintah",
    scSettings: "Buka pengaturan",
    scNewDoc: "Dokumen baru",
    scOpen: "Buka file",
    scSave: "Simpan",
    scPrint: "Cetak",
    scCloseTab: "Tutup tab",
    scNextTab: "Tab berikutnya",
    scPrevTab: "Tab sebelumnya",
    scGoToTab: "Lompat ke tab N",
    scGlobalSummon: "Panggil BatiOffice (global)",
    globalSummonDesc: "Buka BatiOffice dari mana saja dengan ⌘(Ctrl)+Shift+B lalu langsung ketik perintah.",
    heroLauncherHint: "Cari atau buat…",
    heroAskWorkspace: "Tanya Bati AI",
    showMoreFiles: "Tampilkan {count} lagi",
    createMore: "Lainnya",
    paletteHint: "Cari tindakan, tab, dan file terbaru",
    paletteEmpty: "Tidak ada hasil",
    paletteTabs: "Tab",
    paletteRecents: "File terbaru",
    paletteActions: "Tindakan",
    telemetryDesc: "Hanya penghitung anonim (misalnya berapa kali editor dibuka) yang dikirim. Isi dokumen, nama file, dan prompt tidak pernah dikumpulkan, dan Anda dapat menonaktifkannya kapan saja.",
    channelStable: "Stabil",
    channelBeta: "Beta",
    theme: "Tema",
    themeLight: "Terang",
    themeDark: "Gelap",
    themeSystem: "Ikuti Sistem",
    saveLocation: "Lokasi penyimpanan",
    setAnalytics: "Kirim statistik penggunaan anonim",
    setAnalyticsDesc: "Aktif secara default dan dapat dimatikan di Pengaturan → Umum. Menggunakan Google Analytics 4; Google menerima IP publik dan metadata transport Anda, tetapi tidak pernah mengumpulkan isi dokumen atau nama file.",
    settings: "Pengaturan",
    setSecAccount: "Akun",
    setSecGeneral: "Umum",
    setSecAbout: "Tentang",
    setLearnMore: "Pelajari lebih lanjut",
    seeMoreAutomation: "Lihat otomatisasi lainnya",
    starPromptTitle: "Suka BatiOffice?",
    starPromptTitleN: "Anda telah membuka {n} dokumen dengan BatiOffice",
    starPromptBody: "Bati mengotomatiskan lebih dari dokumen — alur yang menghubungkan berkas, lembar, dan alat Anda.",
    starPromptGo: "Lihat fitur lainnya",
    starPromptDone: "Sudah lihat",
    starPromptLater: "Nanti saja",
    onbAutomationHint: "Bati mengotomatiskan lebih dari dokumen. Lihat di bati.ai.",
    setEmail: "Email",
    setNotLoggedIn: "Belum masuk",
    setViewUsage: "Lihat penggunaan",
    setChange: "Ubah",
    // Dates
    today: "Hari ini",
    yesterday: "Kemarin",
    daysAgo: "{n} hari lalu",
    // Language / tab strip
    language: "Bahasa",
    closeTab: "Tutup tab",
    tabList: "Semua tab",
    tabAppMenu: "Menu",
    newTab: "Tab baru",
    // First-run onboarding
    onbTitle1: "Selamat datang di BatiOffice",
    onbSubtitle1: "Suite office AI-native",
    onbBody1: "Buat dokumen, susun spreadsheet, rancang presentasi, dan tinjau PDF. AI hadir di setiap langkah.",
    onbTitle2: "Ini baru permulaan",
    onbBody2: "BatiOffice masih dalam tahap alpha. Gabung obrolan grup di GenTeam untuk berbagi masukan dan ikut menentukan arah ke depan.",
    onbJoinGenTeam: "Gabung GenTeam",
    onbSkip: "Lewati",
    onbNext: "Berikutnya",
    onbStart: "Mulai",
    onbStepAria: "Halaman {n} dari {total}",
    onbTitle3: "Gratis untuk semua",
    onbBody3: "Tanpa biaya lisensi. Tanpa iklan. Tanpa watermark.",
    onbBack: "Kembali"
  },
  ru: {
    // Sidebar navigation
    navRecent: "Недавние",
    navStarred: "Избранное",
    cloudSearchPlaceholder: "Поиск среди {n} проектов…",
    cloudNoResults: "Нет подходящих проектов.",
    cloudGroupThisWeek: "На этой неделе",
    cloudGroupThisMonth: "Ранее в этом месяце",
    cloudSortLabel: "Сортировка: {v}",
    cloudSortRecent: "Сначала новые",
    cloudSortOldest: "Сначала старые",
    cloudRefresh: "Обновить",
    cloudEmpty: "Пока нет веб-проектов.",
    cloudError: "Не удалось загрузить. Повторите попытку позже.",
    cloudRetry: "Повторить",
    cloudLoadMore: "Загрузить ещё",
    cloudOpenInBrowser: "Открыть в браузере",
    navTrash: "Корзина",
    navTrashTip: "Удалённые файлы перемещаются в системную корзину, откуда их можно восстановить",
    // Section headings
    secQuickStart: "Быстрый старт",
    secRecent: "Недавние",
    secStarred: "Избранное",
    secProjectFiles: "Файлы проекта",
    secActivity: "Активность",
    colName: "Имя",
    colLocation: "Расположение",
    colModified: "Изменён",
    colSize: "Размер",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Открыть локальный файл",
    openLocalSub: "Все форматы документов",
    greetMorning: "Доброе утро",
    greetAfternoon: "Добрый день",
    greetEvening: "Добрый вечер",
    greetAsk1: "Что создадим сегодня?",
    greetAsk2: "Готовы начать?",
    greetAsk3: "Над чем работаем?",
    greetAsk4: "С чего начнём сегодня?",
    greetAsk5: "Хотите создать что-то новое?",
    greetAsk6: "Есть идея?",
    // Filters
    filterAll: "Все",
    filterDocs: "Документы",
    filterSheets: "Таблицы",
    filterSlides: "Презентации",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Фильтр по типу",
    // List / bulk actions
    fileCount: "Файлов: {n}",
    fileCountOne: "{n} файл",
    selectedCount: "Выбрано: {n}",
    selectAll: "Выбрать все",
    selectFile: "Выбрать {name}",
    removeFromList: "Убрать из списка",
    deleteFiles: "Удалить файлы",
    cancel: "Отмена",
    star: "В избранное",
    unstar: "Убрать из избранного",
    moreActions: "Другие действия",
    open: "Открыть",
    revealInFolder: "Показать в папке",
    copyPath: "Скопировать путь",
    moveToProject: "Переместить в проект",
    rename: "Переименовать",
    duplicate: "Создать копию",
    renameFailed: "Не удалось переименовать",
    emptyStarred: "В избранном пока пусто — наведите курсор на строку файла и нажмите на звёздочку.",
    emptyRecent: "Нет недавних файлов — создайте или откройте файл, чтобы начать.",
    emptyFiltered: "Файлов этого типа нет.",
    // Delete confirmation dialog
    deleteModalTitle: "Удаление файлов",
    deleteConfirmOne: "Переместить «{name}» в корзину?",
    deleteConfirmMany: "Переместить эти файлы ({n}) в корзину?",
    deleteMoreCount: "… всего {n}",
    delete: "Удалить",
    // Project sidebar
    projects: "Проекты",
    newProject: "Создать проект",
    projectName: "Название проекта",
    deleteProject: "Удалить проект…",
    deleteProjectConfirm: "Удалить этот проект?\nЕго файлы вернутся в проект по умолчанию и не будут потеряны.",
    projMoreActions: "Другие действия для {name}",
    defaultProject: "Проект по умолчанию",
    projEmpty: "Храните связанные документы в одном проекте — история диалогов с ИИ накапливается по проектам.",
    projEmptyHint: "Создайте файл или щёлкните недавний файл правой кнопкой мыши и выберите «Переместить в проект».",
    timelineCount: "Записей: {n}",
    timelineCountOne: "{n} запись",
    timelineEmpty: "В этом проекте пока нет диалогов с ИИ.",
    timelineYou: "Вы",
    timelineUserAria: "Пользователь",
    untitled: "Без названия",
    noContent: "(пусто)",
    // Account
    account: "Учётная запись",
    login: "Войти",
    loggedIn: "Вход выполнен",
    waitingLogin: "Ожидание входа в браузере… Нажмите, чтобы снова открыть страницу входа",
    waitingShort: "Ожидание…",
    loginTimeout: "Время входа истекло — нажмите, чтобы повторить",
    loginLaunchFailed: "Не удалось запустить вход — нажмите, чтобы повторить",
    loginNetworkError: "Не удаётся подключиться к Bati — проверьте сеть или настройки прокси",
    loginExpired: "Срок авторизации истёк — нажмите, чтобы повторить",
    loginFailed: "Не удалось войти — нажмите, чтобы повторить",
    loggingOut: "Выход…",
    logout: "Выйти",
    credits: "Кредиты",
    creditsTip: "Посмотреть расход кредитов",
    appVersion: "Версия {v}",
    versionLabel: "Версия",
    versionRowHint: "История обновлений",
    updateReadyRestart: "Перезапустить для обновления",
    updateChannel: "Канал обновлений",
    telemetryLabel: "Анонимная статистика использования",
    telemetryOn: "Включено",
    telemetryOff: "Выключено",
    setSecPrivacy: "Статистика использования",
    setSecShortcuts: "Горячие клавиши",
    setSearchPlaceholder: "Поиск настроек",
    scPalette: "Палитра команд",
    scSettings: "Открыть настройки",
    scNewDoc: "Новый документ",
    scOpen: "Открыть файл",
    scSave: "Сохранить",
    scPrint: "Печать",
    scCloseTab: "Закрыть вкладку",
    scNextTab: "Следующая вкладка",
    scPrevTab: "Предыдущая вкладка",
    scGoToTab: "Перейти к вкладке N",
    scGlobalSummon: "Вызвать BatiOffice (глобально)",
    globalSummonDesc: "Открывайте BatiOffice из любого приложения по ⌘(Ctrl)+Shift+B и сразу вводите команду.",
    heroLauncherHint: "Найти или создать…",
    heroAskWorkspace: "Спросить Bati AI",
    showMoreFiles: "Показать ещё {count}",
    createMore: "Ещё",
    paletteHint: "Поиск действий, вкладок и недавних файлов",
    paletteEmpty: "Нет совпадений",
    paletteTabs: "Вкладки",
    paletteRecents: "Недавние файлы",
    paletteActions: "Действия",
    telemetryDesc: "Отправляются только анонимные счётчики (например, сколько раз открывался редактор). Содержимое документов, имена файлов и запросы никогда не собираются; это можно отключить в любой момент.",
    channelStable: "Стабильный",
    channelBeta: "Бета",
    theme: "Тема",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    themeSystem: "Как в системе",
    saveLocation: "Папка сохранения",
    setAnalytics: "Отправлять анонимную статистику использования",
    setAnalyticsDesc: "Включено по умолчанию и отключается в Настройки → Общие. Используется Google Analytics 4; Google получает публичный IP и транспортные метаданные, но не содержимое документов и не имена файлов.",
    settings: "Настройки",
    setSecAccount: "Аккаунт",
    setSecGeneral: "Общие",
    setSecAbout: "О программе",
    setLearnMore: "Подробнее",
    seeMoreAutomation: "Больше автоматизации",
    starPromptTitle: "Нравится BatiOffice?",
    starPromptTitleN: "Вы уже открыли {n} документов в BatiOffice",
    starPromptBody: "Bati автоматизирует не только документы — процессы, связывающие файлы, таблицы и инструменты.",
    starPromptGo: "Посмотреть другие возможности",
    starPromptDone: "Уже смотрел",
    starPromptLater: "Позже",
    onbAutomationHint: "Bati автоматизирует не только документы. Подробнее на bati.ai.",
    setEmail: "Эл. почта",
    setNotLoggedIn: "Вы не вошли",
    setViewUsage: "Посмотреть расход",
    setChange: "Изменить",
    // Dates
    today: "Сегодня",
    yesterday: "Вчера",
    daysAgo: "{n} дн. назад",
    // Language / tab strip
    language: "Язык",
    closeTab: "Закрыть вкладку",
    tabList: "Все вкладки",
    tabAppMenu: "Меню",
    newTab: "Новая вкладка",
    // First-run onboarding
    onbTitle1: "Добро пожаловать в BatiOffice",
    onbSubtitle1: "AI-нативный офисный пакет",
    onbBody1: "Создавайте документы, таблицы и презентации, работайте с PDF. ИИ встроен в каждый шаг.",
    onbTitle2: "Это только начало",
    onbBody2: "BatiOffice пока в альфа-версии. Присоединяйтесь к групповому чату в GenTeam, чтобы делиться отзывами и влиять на дальнейшее развитие.",
    onbJoinGenTeam: "Присоединиться к GenTeam",
    onbSkip: "Пропустить",
    onbNext: "Далее",
    onbStart: "Начать",
    onbStepAria: "Страница {n} из {total}",
    onbTitle3: "Бесплатно для всех",
    onbBody3: "Без лицензий. Без рекламы. Без водяных знаков.",
    onbBack: "Назад"
  },
  ar: {
    // Sidebar navigation
    navRecent: "الأخيرة",
    navStarred: "المفضلة",
    cloudSearchPlaceholder: "ابحث في {n} مشروعًا…",
    cloudNoResults: "لا توجد مشاريع مطابقة.",
    cloudGroupThisWeek: "هذا الأسبوع",
    cloudGroupThisMonth: "في وقت سابق من هذا الشهر",
    cloudSortLabel: "الترتيب: {v}",
    cloudSortRecent: "الأحدث",
    cloudSortOldest: "الأقدم",
    cloudRefresh: "تحديث",
    cloudEmpty: "لا توجد مشاريع على الويب بعد.",
    cloudError: "فشل التحميل. حاول مرة أخرى لاحقًا.",
    cloudRetry: "إعادة المحاولة",
    cloudLoadMore: "تحميل المزيد",
    cloudOpenInBrowser: "فتح في المتصفح",
    navTrash: "سلة المهملات",
    navTrashTip: "تُنقل الملفات المحذوفة إلى سلة مهملات النظام ويمكن استعادتها من هناك",
    // Section headings
    secQuickStart: "بدء سريع",
    secRecent: "المستخدمة مؤخرًا",
    secStarred: "المفضلة",
    secProjectFiles: "ملفات المشروع",
    secActivity: "النشاط",
    colName: "الاسم",
    colLocation: "الموقع",
    colModified: "تاريخ التعديل",
    colSize: "الحجم",
    // Quick start
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "فتح ملف محلي",
    openLocalSub: "جميع تنسيقات المستندات",
    greetMorning: "صباح الخير",
    greetAfternoon: "مساء الخير",
    greetEvening: "مساء الخير",
    greetAsk1: "ماذا تريد أن تنشئ اليوم؟",
    greetAsk2: "هل أنت مستعد للبدء؟",
    greetAsk3: "على ماذا تعمل؟",
    greetAsk4: "من أين نبدأ اليوم؟",
    greetAsk5: "هل ترغب في إنشاء شيء جديد؟",
    greetAsk6: "هل لديك فكرة؟",
    // Filters
    filterAll: "الكل",
    filterDocs: "مستندات",
    filterSheets: "جداول بيانات",
    filterSlides: "عروض تقديمية",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "تصفية حسب النوع",
    // List / bulk actions
    fileCount: "{n} ملفات",
    fileCountOne: "ملف واحد",
    selectedCount: "تم تحديد {n}",
    selectAll: "تحديد الكل",
    selectFile: "تحديد {name}",
    removeFromList: "إزالة من القائمة",
    deleteFiles: "حذف الملفات",
    cancel: "إلغاء",
    star: "إضافة إلى المفضلة",
    unstar: "إزالة من المفضلة",
    moreActions: "إجراءات أخرى",
    open: "فتح",
    revealInFolder: "إظهار في المجلد",
    copyPath: "نسخ المسار",
    moveToProject: "نقل إلى مشروع",
    rename: "إعادة تسمية",
    duplicate: "إنشاء نسخة",
    renameFailed: "فشلت إعادة التسمية",
    emptyStarred: "لا توجد ملفات مفضلة — مرِّر المؤشر فوق صف الملف وانقر على النجمة.",
    emptyRecent: "لا توجد ملفات حديثة — أنشئ ملفًا أو افتحه للبدء.",
    emptyFiltered: "لا توجد ملفات من هذا النوع.",
    // Delete confirmation dialog
    deleteModalTitle: "حذف الملفات",
    deleteConfirmOne: 'هل تريد نقل "{name}" إلى سلة المهملات؟',
    deleteConfirmMany: "هل تريد نقل هذه الملفات ({n}) إلى سلة المهملات؟",
    deleteMoreCount: "… الإجمالي {n}",
    delete: "حذف",
    // Project sidebar
    projects: "المشاريع",
    newProject: "مشروع جديد",
    projectName: "اسم المشروع",
    deleteProject: "حذف المشروع…",
    deleteProjectConfirm: 'هل تريد حذف هذا المشروع؟\nستعود ملفاته إلى "المشروع الافتراضي" ولن تُفقد.',
    projMoreActions: "إجراءات أخرى لـ {name}",
    defaultProject: "المشروع الافتراضي",
    projEmpty: "احتفظ بالمستندات المرتبطة في مشروع واحد — يتراكم سجل محادثات الذكاء الاصطناعي لكل مشروع.",
    projEmptyHint: 'أنشئ ملفًا، أو انقر بزر الماوس الأيمن على ملف حديث واختر "نقل إلى مشروع".',
    timelineCount: "{n} عناصر",
    timelineCountOne: "عنصر واحد",
    timelineEmpty: "لا توجد محادثات ذكاء اصطناعي في هذا المشروع بعد.",
    timelineYou: "أنت",
    timelineUserAria: "المستخدم",
    untitled: "بدون عنوان",
    noContent: "(فارغ)",
    // Account
    account: "الحساب",
    login: "تسجيل الدخول",
    loggedIn: "تم تسجيل الدخول",
    waitingLogin: "في انتظار تسجيل الدخول في المتصفح… انقر لإعادة فتح صفحة تسجيل الدخول",
    waitingShort: "في الانتظار…",
    loginTimeout: "انتهت مهلة تسجيل الدخول — انقر لإعادة المحاولة",
    loginLaunchFailed: "تعذّر بدء تسجيل الدخول — انقر لإعادة المحاولة",
    loginNetworkError: "تعذّر الاتصال بـ Bati — تحقق من الشبكة أو إعدادات الوكيل",
    loginExpired: "انتهت صلاحية التفويض — انقر لإعادة المحاولة",
    loginFailed: "فشل تسجيل الدخول — انقر لإعادة المحاولة",
    loggingOut: "جارٍ تسجيل الخروج…",
    logout: "تسجيل الخروج",
    credits: "الأرصدة",
    creditsTip: "عرض تفاصيل استخدام الأرصدة",
    appVersion: "الإصدار {v}",
    versionLabel: "الإصدار",
    versionRowHint: "عرض سجل التحديثات",
    updateReadyRestart: "إعادة التشغيل للتحديث",
    updateChannel: "قناة التحديث",
    telemetryLabel: "إحصاءات استخدام مجهولة",
    telemetryOn: "مفعّل",
    telemetryOff: "معطّل",
    setSecPrivacy: "إحصاءات الاستخدام",
    setSecShortcuts: "الاختصارات",
    setSearchPlaceholder: "البحث في الإعدادات",
    scPalette: "لوحة الأوامر",
    scSettings: "فتح الإعدادات",
    scNewDoc: "مستند جديد",
    scOpen: "فتح ملف",
    scSave: "حفظ",
    scPrint: "طباعة",
    scCloseTab: "إغلاق علامة التبويب",
    scNextTab: "علامة التبويب التالية",
    scPrevTab: "علامة التبويب السابقة",
    scGoToTab: "الانتقال إلى علامة التبويب N",
    scGlobalSummon: "استدعاء BatiOffice (عام)",
    globalSummonDesc: "افتح BatiOffice من أي مكان بالضغط على ⌘(Ctrl)+Shift+B وابدأ بكتابة الأمر مباشرة.",
    heroLauncherHint: "ابحث أو أنشئ…",
    heroAskWorkspace: "اسأل Bati AI",
    showMoreFiles: "عرض {count} أخرى",
    createMore: "المزيد",
    paletteHint: "ابحث في الإجراءات وعلامات التبويب والملفات الأخيرة",
    paletteEmpty: "لا نتائج",
    paletteTabs: "علامات التبويب",
    paletteRecents: "الملفات الأخيرة",
    paletteActions: "إجراءات",
    telemetryDesc: "تُرسل عدادات مجهولة فقط (مثل عدد مرات فتح المحرر). لا يتم أبداً جمع محتوى المستندات أو أسماء الملفات أو الأوامر، ويمكنك إيقاف ذلك في أي وقت.",
    channelStable: "مستقر",
    channelBeta: "تجريبي",
    theme: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "اتباع النظام",
    saveLocation: "موقع الحفظ",
    setAnalytics: "إرسال إحصاءات استخدام مجهولة الهوية",
    setAnalyticsDesc: "مفعّل افتراضيًا ويمكن إيقافه في الإعدادات ← عام. يستخدم Google Analytics 4؛ تتلقى Google عنوان IP العام وبيانات النقل، ولكن لا يتم جمع محتوى المستندات أو أسماء الملفات.",
    settings: "الإعدادات",
    setSecAccount: "الحساب",
    setSecGeneral: "عام",
    setSecAbout: "حول",
    setLearnMore: "اعرف المزيد",
    seeMoreAutomation: "مزيد من الأتمتة",
    starPromptTitle: "هل أعجبك BatiOffice؟",
    starPromptTitleN: "لقد فتحت {n} من المستندات في BatiOffice",
    starPromptBody: "يؤتمت Bati أكثر من المستندات — تدفقات تربط ملفاتك وجداولك وأدواتك.",
    starPromptGo: "شاهد المزيد",
    starPromptDone: "شاهدته بالفعل",
    starPromptLater: "لاحقًا",
    onbAutomationHint: "يؤتمت Bati أكثر من المستندات. اطلع على bati.ai.",
    setEmail: "البريد الإلكتروني",
    setNotLoggedIn: "لم يتم تسجيل الدخول",
    setViewUsage: "عرض الاستخدام",
    setChange: "تغيير",
    // Dates
    today: "اليوم",
    yesterday: "أمس",
    daysAgo: "قبل {n} أيام",
    // Language / tab strip
    language: "اللغة",
    closeTab: "إغلاق علامة التبويب",
    tabList: "كل علامات التبويب",
    tabAppMenu: "القائمة",
    newTab: "علامة تبويب جديدة",
    // First-run onboarding
    onbTitle1: "مرحبًا بك في BatiOffice",
    onbSubtitle1: "حزمة مكتبية أصلية بالذكاء الاصطناعي",
    onbBody1: "أنشئ المستندات وجداول البيانات والعروض التقديمية وراجع ملفات PDF. الذكاء الاصطناعي مدمج في كل خطوة.",
    onbTitle2: "هذه مجرد البداية",
    onbBody2: "لا يزال BatiOffice في مرحلة ألفا. انضم إلى الدردشة الجماعية على GenTeam لمشاركة ملاحظاتك والمساهمة في تشكيل المستقبل.",
    onbJoinGenTeam: "الانضمام إلى GenTeam",
    onbSkip: "تخطي",
    onbNext: "التالي",
    onbStart: "ابدأ الآن",
    onbStepAria: "الصفحة {n} من {total}",
    onbTitle3: "مجاني للجميع",
    onbBody3: "بلا رسوم ترخيص، بلا إعلانات، بلا علامات مائية.",
    onbBack: "رجوع"
  },
  pt: {
    navRecent: "Recentes",
    navStarred: "Favoritos",
    cloudSearchPlaceholder: "Pesquisar {n} projetos…",
    cloudNoResults: "Nenhum projeto correspondente.",
    cloudGroupThisWeek: "Esta semana",
    cloudGroupThisMonth: "Este mês",
    cloudSortLabel: "Ordenar: {v}",
    cloudSortRecent: "Recentes",
    cloudSortOldest: "Mais antigos",
    cloudRefresh: "Atualizar",
    cloudEmpty: "Ainda não há projetos na web.",
    cloudError: "Falha ao carregar. Tente novamente mais tarde.",
    cloudRetry: "Tentar novamente",
    cloudLoadMore: "Carregar mais",
    cloudOpenInBrowser: "Abrir no navegador",
    navTrash: "Lixeira",
    navTrashTip: "Os arquivos excluídos vão para a lixeira do sistema e podem ser restaurados de lá",
    secQuickStart: "Início rápido",
    secRecent: "Recentes",
    secStarred: "Favoritos",
    secProjectFiles: "Arquivos do projeto",
    secActivity: "Atividade",
    colName: "Nome",
    colLocation: "Local",
    colModified: "Modificado",
    colSize: "Tamanho",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Abrir arquivo local",
    openLocalSub: "Todos os formatos de documento",
    greetMorning: "Bom dia",
    greetAfternoon: "Boa tarde",
    greetEvening: "Boa noite",
    greetAsk1: "O que você quer criar hoje?",
    greetAsk2: "Pronto para começar?",
    greetAsk3: "No que você está trabalhando?",
    greetAsk4: "Por onde começamos hoje?",
    greetAsk5: "Que tal criar algo novo?",
    greetAsk6: "Alguma ideia?",
    filterAll: "Todos",
    filterDocs: "Documentos",
    filterSheets: "Planilhas",
    filterSlides: "Apresentações",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filtrar por tipo",
    fileCount: "{n} arquivos",
    fileCountOne: "{n} arquivo",
    selectedCount: "{n} selecionados",
    selectAll: "Selecionar tudo",
    selectFile: "Selecionar {name}",
    removeFromList: "Remover da lista",
    deleteFiles: "Excluir arquivos",
    cancel: "Cancelar",
    star: "Adicionar aos favoritos",
    unstar: "Remover dos favoritos",
    moreActions: "Mais ações",
    open: "Abrir",
    revealInFolder: "Mostrar na pasta",
    copyPath: "Copiar caminho",
    moveToProject: "Mover para um projeto",
    rename: "Renomear",
    duplicate: "Duplicar",
    renameFailed: "Falha ao renomear",
    emptyStarred: "Nenhum favorito — passe o cursor sobre uma linha e clique na estrela.",
    emptyRecent: "Nenhum arquivo recente — crie ou abra um arquivo para começar.",
    emptyFiltered: "Nenhum arquivo deste tipo.",
    deleteModalTitle: "Excluir arquivos",
    deleteConfirmOne: 'Mover "{name}" para a lixeira?',
    deleteConfirmMany: "Mover estes {n} arquivos para a lixeira?",
    deleteMoreCount: "… {n} no total",
    delete: "Excluir",
    projects: "Projetos",
    newProject: "Novo projeto",
    projectName: "Nome do projeto",
    deleteProject: "Excluir projeto…",
    deleteProjectConfirm: "Excluir este projeto?\nSeus arquivos voltarão ao projeto padrão e não serão perdidos.",
    projMoreActions: "Mais ações para {name}",
    defaultProject: "Projeto padrão",
    projEmpty: "Mantenha documentos relacionados em um mesmo projeto — o histórico de conversas com a IA se acumula por projeto.",
    projEmptyHint: 'Crie um arquivo ou clique com o botão direito em um arquivo recente e escolha "Mover para um projeto".',
    timelineCount: "{n} itens",
    timelineCountOne: "{n} item",
    timelineEmpty: "Ainda não há conversas com a IA neste projeto.",
    timelineYou: "Você",
    timelineUserAria: "Usuário",
    untitled: "Sem título",
    noContent: "(vazio)",
    account: "Conta",
    login: "Entrar",
    loggedIn: "Conectado",
    waitingLogin: "Aguardando o login no navegador… Clique para reabrir a página de login",
    waitingShort: "Aguardando…",
    loginTimeout: "O login expirou — clique para tentar novamente",
    loginLaunchFailed: "Não foi possível iniciar o login — clique para tentar novamente",
    loginNetworkError: "Não foi possível conectar ao Bati — verifique sua rede ou as configurações de proxy",
    loginExpired: "A autorização expirou — clique para tentar novamente",
    loginFailed: "Falha no login — clique para tentar novamente",
    loggingOut: "Saindo…",
    logout: "Sair",
    credits: "Créditos",
    creditsTip: "Ver detalhes do uso de créditos",
    appVersion: "Versão {v}",
    versionLabel: "Versão",
    versionRowHint: "Ver o histórico",
    updateReadyRestart: "Reiniciar para atualizar",
    updateChannel: "Canal de atualização",
    telemetryLabel: "Estatísticas de uso anônimas",
    telemetryOn: "Ativado",
    telemetryOff: "Desativado",
    setSecPrivacy: "Estatísticas de uso",
    setSecShortcuts: "Atalhos",
    setSearchPlaceholder: "Pesquisar configurações",
    scPalette: "Paleta de comandos",
    scSettings: "Abrir configurações",
    scNewDoc: "Novo documento",
    scOpen: "Abrir arquivo",
    scSave: "Salvar",
    scPrint: "Imprimir",
    scCloseTab: "Fechar guia",
    scNextTab: "Próxima guia",
    scPrevTab: "Guia anterior",
    scGoToTab: "Ir para a guia N",
    scGlobalSummon: "Invocar BatiOffice (global)",
    globalSummonDesc: "Abra o BatiOffice de qualquer lugar com ⌘(Ctrl)+Shift+B e digite um comando na hora.",
    heroLauncherHint: "Pesquisar ou criar…",
    heroAskWorkspace: "Perguntar ao Bati AI",
    showMoreFiles: "Mostrar mais {count}",
    createMore: "Mais",
    paletteHint: "Pesquisar ações, guias e arquivos recentes",
    paletteEmpty: "Sem resultados",
    paletteTabs: "Guias",
    paletteRecents: "Arquivos recentes",
    paletteActions: "Ações",
    telemetryDesc: "Apenas contadores anônimos (como quantas vezes um editor é aberto) são enviados. Conteúdo de documentos, nomes de arquivos e prompts nunca são coletados, e você pode desativar isso a qualquer momento.",
    channelStable: "Estável",
    channelBeta: "Beta",
    theme: "Tema",
    themeLight: "Claro",
    themeDark: "Escuro",
    themeSystem: "Seguir o Sistema",
    saveLocation: "Local de salvamento",
    setAnalytics: "Enviar estatísticas de uso anônimas",
    setAnalyticsDesc: "Ativado por padrão e pode ser desativado em Configurações → Geral. Usa o Google Analytics 4; o Google recebe seu IP público e metadados de transporte, mas nunca o conteúdo dos documentos ou nomes de arquivos.",
    settings: "Configurações",
    setSecAccount: "Conta",
    setSecGeneral: "Geral",
    setSecAbout: "Sobre",
    setLearnMore: "Saiba mais",
    seeMoreAutomation: "Ver mais automações",
    starPromptTitle: "Gostando do BatiOffice?",
    starPromptTitleN: "Você já abriu {n} documentos com o BatiOffice",
    starPromptBody: "O Bati automatiza muito além de documentos — fluxos que conectam seus arquivos, planilhas e ferramentas.",
    starPromptGo: "Ver outros recursos",
    starPromptDone: "Já vi",
    starPromptLater: "Mais tarde",
    onbAutomationHint: "O Bati automatiza muito além de documentos. Veja em bati.ai.",
    setEmail: "E-mail",
    setNotLoggedIn: "Não conectado",
    setViewUsage: "Ver uso",
    setChange: "Alterar",
    today: "Hoje",
    yesterday: "Ontem",
    daysAgo: "há {n} dias",
    language: "Idioma",
    closeTab: "Fechar guia",
    tabList: "Todas as guias",
    tabAppMenu: "Menu",
    newTab: "Nova guia",
    // First-run onboarding
    onbTitle1: "Bem-vindo ao BatiOffice",
    onbSubtitle1: "A suíte de escritório nativa de IA",
    onbBody1: "Crie documentos, planilhas e apresentações e revise PDFs. A IA está integrada em cada etapa.",
    onbTitle2: "Isto é só o começo",
    onbBody2: "O BatiOffice ainda está em alfa. Entre no chat em grupo no GenTeam para compartilhar feedback e ajudar a moldar o que vem a seguir.",
    onbJoinGenTeam: "Entrar no GenTeam",
    onbSkip: "Pular",
    onbNext: "Avançar",
    onbStart: "Começar",
    onbStepAria: "Página {n} de {total}",
    onbTitle3: "Gratuito para todos",
    onbBody3: "Sem licenças. Sem anúncios. Sem marcas d'água.",
    onbBack: "Voltar"
  },
  it: {
    navRecent: "Recenti",
    navStarred: "Preferiti",
    cloudSearchPlaceholder: "Cerca tra {n} progetti…",
    cloudNoResults: "Nessun progetto corrispondente.",
    cloudGroupThisWeek: "Questa settimana",
    cloudGroupThisMonth: "Questo mese",
    cloudSortLabel: "Ordina: {v}",
    cloudSortRecent: "Recenti",
    cloudSortOldest: "Meno recenti",
    cloudRefresh: "Aggiorna",
    cloudEmpty: "Ancora nessun progetto web.",
    cloudError: "Caricamento non riuscito. Riprova più tardi.",
    cloudRetry: "Riprova",
    cloudLoadMore: "Carica altri",
    cloudOpenInBrowser: "Apri nel browser",
    navTrash: "Cestino",
    navTrashTip: "I file eliminati vengono spostati nel cestino di sistema e possono essere ripristinati da lì",
    secQuickStart: "Avvio rapido",
    secRecent: "Recenti",
    secStarred: "Preferiti",
    secProjectFiles: "File del progetto",
    secActivity: "Attività",
    colName: "Nome",
    colLocation: "Posizione",
    colModified: "Modificato",
    colSize: "Dimensione",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Apri file locale",
    openLocalSub: "Tutti i formati di documento",
    greetMorning: "Buongiorno",
    greetAfternoon: "Buon pomeriggio",
    greetEvening: "Buonasera",
    greetAsk1: "Cosa vuoi creare oggi?",
    greetAsk2: "Pronto per iniziare?",
    greetAsk3: "Su cosa stai lavorando?",
    greetAsk4: "Da dove iniziamo oggi?",
    greetAsk5: "Vuoi creare qualcosa di nuovo?",
    greetAsk6: "Hai un'idea?",
    filterAll: "Tutti",
    filterDocs: "Documenti",
    filterSheets: "Fogli di calcolo",
    filterSlides: "Presentazioni",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filtra per tipo",
    fileCount: "{n} file",
    fileCountOne: "{n} file",
    selectedCount: "{n} selezionati",
    selectAll: "Seleziona tutto",
    selectFile: "Seleziona {name}",
    removeFromList: "Rimuovi dall'elenco",
    deleteFiles: "Elimina file",
    cancel: "Annulla",
    star: "Aggiungi ai preferiti",
    unstar: "Rimuovi dai preferiti",
    moreActions: "Altre azioni",
    open: "Apri",
    revealInFolder: "Mostra nella cartella",
    copyPath: "Copia percorso",
    moveToProject: "Sposta in un progetto",
    rename: "Rinomina",
    duplicate: "Duplica",
    renameFailed: "Impossibile rinominare",
    emptyStarred: "Nessun preferito — passa il cursore su una riga e fai clic sulla stella.",
    emptyRecent: "Nessun file recente — crea o apri un file per iniziare.",
    emptyFiltered: "Nessun file di questo tipo.",
    deleteModalTitle: "Elimina file",
    deleteConfirmOne: 'Spostare "{name}" nel cestino?',
    deleteConfirmMany: "Spostare questi {n} file nel cestino?",
    deleteMoreCount: "… {n} in totale",
    delete: "Elimina",
    projects: "Progetti",
    newProject: "Nuovo progetto",
    projectName: "Nome del progetto",
    deleteProject: "Elimina progetto…",
    deleteProjectConfirm: "Eliminare questo progetto?\nI suoi file torneranno nel progetto predefinito e non andranno persi.",
    projMoreActions: "Altre azioni per {name}",
    defaultProject: "Progetto predefinito",
    projEmpty: "Tieni i documenti correlati in uno stesso progetto — la cronologia delle chat IA si accumula per progetto.",
    projEmptyHint: 'Crea un file oppure fai clic con il pulsante destro su un file recente e scegli "Sposta in un progetto".',
    timelineCount: "{n} elementi",
    timelineCountOne: "{n} elemento",
    timelineEmpty: "Non ci sono ancora conversazioni IA in questo progetto.",
    timelineYou: "Tu",
    timelineUserAria: "Utente",
    untitled: "Senza titolo",
    noContent: "(vuoto)",
    account: "Account",
    login: "Accedi",
    loggedIn: "Accesso effettuato",
    waitingLogin: "In attesa dell'accesso nel browser… Fai clic per riaprire la pagina di accesso",
    waitingShort: "In attesa…",
    loginTimeout: "Accesso scaduto — fai clic per riprovare",
    loginLaunchFailed: "Impossibile avviare l'accesso — fai clic per riprovare",
    loginNetworkError: "Impossibile raggiungere Bati — controlla la rete o le impostazioni del proxy",
    loginExpired: "Autorizzazione scaduta — fai clic per riprovare",
    loginFailed: "Accesso non riuscito — fai clic per riprovare",
    loggingOut: "Disconnessione…",
    logout: "Esci",
    credits: "Crediti",
    creditsTip: "Vedi i dettagli sull’uso dei crediti",
    appVersion: "Versione {v}",
    versionLabel: "Versione",
    versionRowHint: "Vedi le novità",
    updateReadyRestart: "Riavvia per aggiornare",
    updateChannel: "Canale di aggiornamento",
    telemetryLabel: "Statistiche di utilizzo anonime",
    telemetryOn: "Attivo",
    telemetryOff: "Disattivato",
    setSecPrivacy: "Statistiche di utilizzo",
    setSecShortcuts: "Scorciatoie",
    setSearchPlaceholder: "Cerca impostazioni",
    scPalette: "Palette dei comandi",
    scSettings: "Apri impostazioni",
    scNewDoc: "Nuovo documento",
    scOpen: "Apri file",
    scSave: "Salva",
    scPrint: "Stampa",
    scCloseTab: "Chiudi scheda",
    scNextTab: "Scheda successiva",
    scPrevTab: "Scheda precedente",
    scGoToTab: "Vai alla scheda N",
    scGlobalSummon: "Richiama BatiOffice (globale)",
    globalSummonDesc: "Apri BatiOffice da qualsiasi punto con ⌘(Ctrl)+Shift+B e digita subito un comando.",
    heroLauncherHint: "Cerca o crea…",
    heroAskWorkspace: "Chiedi a Bati AI",
    showMoreFiles: "Mostra altri {count}",
    createMore: "Altro",
    paletteHint: "Cerca azioni, schede e file recenti",
    paletteEmpty: "Nessun risultato",
    paletteTabs: "Schede",
    paletteRecents: "File recenti",
    paletteActions: "Azioni",
    telemetryDesc: "Vengono inviati solo contatori anonimi (ad esempio quante volte viene aperto un editor). Contenuti dei documenti, nomi dei file e prompt non vengono mai raccolti e puoi disattivarlo in qualsiasi momento.",
    channelStable: "Stabile",
    channelBeta: "Beta",
    theme: "Tema",
    themeLight: "Chiaro",
    themeDark: "Scuro",
    themeSystem: "Segui il sistema",
    saveLocation: "Posizione di salvataggio",
    setAnalytics: "Invia statistiche di utilizzo anonime",
    setAnalyticsDesc: "Attivo per impostazione predefinita e disattivabile in Impostazioni → Generali. Utilizza Google Analytics 4; Google riceve l'IP pubblico e i metadati di trasporto, ma mai contenuti o nomi dei file.",
    settings: "Impostazioni",
    setSecAccount: "Account",
    setSecGeneral: "Generale",
    setSecAbout: "Informazioni",
    setLearnMore: "Scopri di più",
    seeMoreAutomation: "Altre automazioni",
    starPromptTitle: "Ti piace BatiOffice?",
    starPromptTitleN: "Hai aperto {n} documenti con BatiOffice",
    starPromptBody: "Bati automatizza molto più dei documenti: flussi che collegano file, fogli e strumenti.",
    starPromptGo: "Vedi altre funzioni",
    starPromptDone: "Già visto",
    starPromptLater: "Più tardi",
    onbAutomationHint: "Bati automatizza molto più dei documenti. Scoprilo su bati.ai.",
    setEmail: "Email",
    setNotLoggedIn: "Non connesso",
    setViewUsage: "Vedi utilizzo",
    setChange: "Cambia",
    today: "Oggi",
    yesterday: "Ieri",
    daysAgo: "{n} giorni fa",
    language: "Lingua",
    closeTab: "Chiudi scheda",
    tabList: "Tutte le schede",
    tabAppMenu: "Menu",
    newTab: "Nuova scheda",
    // First-run onboarding
    onbTitle1: "Benvenuto in BatiOffice",
    onbSubtitle1: "La suite office nativa IA",
    onbBody1: "Crea documenti, fogli di calcolo e presentazioni e rivedi i PDF. L’IA è integrata in ogni passaggio.",
    onbTitle2: "Questo è solo l’inizio",
    onbBody2: "BatiOffice è ancora in alpha. Unisciti alla chat di gruppo su GenTeam per condividere feedback e contribuire a plasmare il futuro.",
    onbJoinGenTeam: "Unisciti a GenTeam",
    onbSkip: "Salta",
    onbNext: "Avanti",
    onbStart: "Inizia",
    onbStepAria: "Pagina {n} di {total}",
    onbTitle3: "Gratuito per tutti",
    onbBody3: "Nessuna licenza. Nessuna pubblicità. Nessuna filigrana.",
    onbBack: "Indietro"
  },
  pl: {
    navRecent: "Ostatnie",
    navStarred: "Ulubione",
    cloudSearchPlaceholder: "Szukaj wśród {n} projektów…",
    cloudNoResults: "Brak pasujących projektów.",
    cloudGroupThisWeek: "W tym tygodniu",
    cloudGroupThisMonth: "Wcześniej w tym miesiącu",
    cloudSortLabel: "Sortuj: {v}",
    cloudSortRecent: "Najnowsze",
    cloudSortOldest: "Najstarsze",
    cloudRefresh: "Odśwież",
    cloudEmpty: "Brak projektów w sieci.",
    cloudError: "Nie udało się wczytać. Spróbuj ponownie później.",
    cloudRetry: "Spróbuj ponownie",
    cloudLoadMore: "Wczytaj więcej",
    cloudOpenInBrowser: "Otwórz w przeglądarce",
    navTrash: "Kosz",
    navTrashTip: "Usunięte pliki trafiają do systemowego kosza i można je stamtąd przywrócić",
    secQuickStart: "Szybki start",
    secRecent: "Ostatnie",
    secStarred: "Ulubione",
    secProjectFiles: "Pliki projektu",
    secActivity: "Aktywność",
    colName: "Nazwa",
    colLocation: "Lokalizacja",
    colModified: "Zmodyfikowano",
    colSize: "Rozmiar",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Otwórz plik lokalny",
    openLocalSub: "Wszystkie formaty dokumentów",
    greetMorning: "Dzień dobry",
    greetAfternoon: "Dzień dobry",
    greetEvening: "Dobry wieczór",
    greetAsk1: "Co chcesz dziś stworzyć?",
    greetAsk2: "Gotowy, aby zacząć?",
    greetAsk3: "Nad czym pracujesz?",
    greetAsk4: "Od czego dziś zaczniemy?",
    greetAsk5: "Masz ochotę stworzyć coś nowego?",
    greetAsk6: "Masz jakiś pomysł?",
    filterAll: "Wszystkie",
    filterDocs: "Dokumenty",
    filterSheets: "Arkusze",
    filterSlides: "Prezentacje",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filtruj według typu",
    fileCount: "Pliki: {n}",
    fileCountOne: "{n} plik",
    selectedCount: "Wybrano: {n}",
    selectAll: "Zaznacz wszystko",
    selectFile: "Zaznacz {name}",
    removeFromList: "Usuń z listy",
    deleteFiles: "Usuń pliki",
    cancel: "Anuluj",
    star: "Dodaj do ulubionych",
    unstar: "Usuń z ulubionych",
    moreActions: "Więcej działań",
    open: "Otwórz",
    revealInFolder: "Pokaż w folderze",
    copyPath: "Kopiuj ścieżkę",
    moveToProject: "Przenieś do projektu",
    rename: "Zmień nazwę",
    duplicate: "Utwórz kopię",
    renameFailed: "Nie udało się zmienić nazwy",
    emptyStarred: "Brak ulubionych — najedź kursorem na wiersz pliku i kliknij gwiazdkę.",
    emptyRecent: "Brak ostatnich plików — utwórz lub otwórz plik, aby rozpocząć.",
    emptyFiltered: "Brak plików tego typu.",
    deleteModalTitle: "Usuwanie plików",
    deleteConfirmOne: "Przenieść „{name}” do kosza?",
    deleteConfirmMany: "Przenieść te pliki ({n}) do kosza?",
    deleteMoreCount: "… łącznie {n}",
    delete: "Usuń",
    projects: "Projekty",
    newProject: "Nowy projekt",
    projectName: "Nazwa projektu",
    deleteProject: "Usuń projekt…",
    deleteProjectConfirm: "Usunąć ten projekt?\nJego pliki wrócą do projektu domyślnego i nie zostaną utracone.",
    projMoreActions: "Więcej działań dla {name}",
    defaultProject: "Projekt domyślny",
    projEmpty: "Trzymaj powiązane dokumenty w jednym projekcie — historia rozmów z AI gromadzi się dla każdego projektu.",
    projEmptyHint: "Utwórz plik lub kliknij ostatni plik prawym przyciskiem myszy i wybierz „Przenieś do projektu”.",
    timelineCount: "Wpisy: {n}",
    timelineCountOne: "{n} wpis",
    timelineEmpty: "W tym projekcie nie ma jeszcze rozmów z AI.",
    timelineYou: "Ty",
    timelineUserAria: "Użytkownik",
    untitled: "Bez tytułu",
    noContent: "(pusto)",
    account: "Konto",
    login: "Zaloguj się",
    loggedIn: "Zalogowano",
    waitingLogin: "Oczekiwanie na logowanie w przeglądarce… Kliknij, aby ponownie otworzyć stronę logowania",
    waitingShort: "Oczekiwanie…",
    loginTimeout: "Upłynął limit czasu logowania — kliknij, aby spróbować ponownie",
    loginLaunchFailed: "Nie udało się uruchomić logowania — kliknij, aby spróbować ponownie",
    loginNetworkError: "Nie można połączyć się z Bati — sprawdź sieć lub ustawienia proxy",
    loginExpired: "Autoryzacja wygasła — kliknij, aby spróbować ponownie",
    loginFailed: "Logowanie nie powiodło się — kliknij, aby spróbować ponownie",
    loggingOut: "Wylogowywanie…",
    logout: "Wyloguj się",
    credits: "Kredyty",
    creditsTip: "Zobacz szczegóły zużycia kredytów",
    appVersion: "Wersja {v}",
    versionLabel: "Wersja",
    versionRowHint: "Zobacz historię zmian",
    updateReadyRestart: "Uruchom ponownie, aby zaktualizować",
    updateChannel: "Kanał aktualizacji",
    telemetryLabel: "Anonimowe statystyki użycia",
    telemetryOn: "Włączone",
    telemetryOff: "Wyłączone",
    setSecPrivacy: "Statystyki użycia",
    setSecShortcuts: "Skróty",
    setSearchPlaceholder: "Szukaj w ustawieniach",
    scPalette: "Paleta poleceń",
    scSettings: "Otwórz ustawienia",
    scNewDoc: "Nowy dokument",
    scOpen: "Otwórz plik",
    scSave: "Zapisz",
    scPrint: "Drukuj",
    scCloseTab: "Zamknij kartę",
    scNextTab: "Następna karta",
    scPrevTab: "Poprzednia karta",
    scGoToTab: "Przejdź do karty N",
    scGlobalSummon: "Przywołaj BatiOffice (globalny)",
    globalSummonDesc: "Otwórz BatiOffice z dowolnego miejsca skrótem ⌘(Ctrl)+Shift+B i od razu wpisz polecenie.",
    heroLauncherHint: "Szukaj lub utwórz…",
    heroAskWorkspace: "Zapytaj Bati AI",
    showMoreFiles: "Pokaż jeszcze {count}",
    createMore: "Więcej",
    paletteHint: "Szukaj działań, kart i ostatnich plików",
    paletteEmpty: "Brak wyników",
    paletteTabs: "Karty",
    paletteRecents: "Ostatnie pliki",
    paletteActions: "Działania",
    telemetryDesc: "Wysyłane są wyłącznie anonimowe liczniki (np. liczba otwarć edytora). Treść dokumentów, nazwy plików i prompty nigdy nie są zbierane; można to wyłączyć w dowolnym momencie.",
    channelStable: "Stabilny",
    channelBeta: "Beta",
    theme: "Motyw",
    themeLight: "Jasny",
    themeDark: "Ciemny",
    themeSystem: "Zgodnie z systemem",
    saveLocation: "Lokalizacja zapisu",
    setAnalytics: "Wysyłaj anonimowe statystyki użytkowania",
    setAnalyticsDesc: "Domyślnie włączone; można wyłączyć w Ustawienia → Ogólne. Korzysta z Google Analytics 4; Google otrzymuje publiczny adres IP i metadane transportowe, ale nigdy treść dokumentów ani nazwy plików.",
    settings: "Ustawienia",
    setSecAccount: "Konto",
    setSecGeneral: "Ogólne",
    setSecAbout: "O aplikacji",
    setLearnMore: "Dowiedz się więcej",
    seeMoreAutomation: "Więcej automatyzacji",
    starPromptTitle: "Podoba Ci się BatiOffice?",
    starPromptTitleN: "Otwarto już {n} dokumentów w BatiOffice",
    starPromptBody: "Bati automatyzuje więcej niż dokumenty — przepływy łączące pliki, arkusze i narzędzia.",
    starPromptGo: "Zobacz inne funkcje",
    starPromptDone: "Już widziałem",
    starPromptLater: "Później",
    onbAutomationHint: "Bati automatyzuje więcej niż dokumenty. Zobacz na bati.ai.",
    setEmail: "E-mail",
    setNotLoggedIn: "Nie zalogowano",
    setViewUsage: "Zobacz zużycie",
    setChange: "Zmień",
    today: "Dzisiaj",
    yesterday: "Wczoraj",
    daysAgo: "{n} dni temu",
    language: "Język",
    closeTab: "Zamknij kartę",
    tabList: "Wszystkie karty",
    tabAppMenu: "Menu",
    newTab: "Nowa karta",
    // First-run onboarding
    onbTitle1: "Witamy w BatiOffice",
    onbSubtitle1: "Pakiet biurowy natywny dla AI",
    onbBody1: "Twórz dokumenty, arkusze i prezentacje oraz przeglądaj pliki PDF. AI jest wbudowana w każdy etap.",
    onbTitle2: "To dopiero początek",
    onbBody2: "BatiOffice jest wciąż w fazie alfa. Dołącz do czatu grupowego na GenTeam, aby dzielić się opiniami i współtworzyć jego przyszłość.",
    onbJoinGenTeam: "Dołącz do GenTeam",
    onbSkip: "Pomiń",
    onbNext: "Dalej",
    onbStart: "Rozpocznij",
    onbStepAria: "Strona {n} z {total}",
    onbTitle3: "Za darmo dla każdego",
    onbBody3: "Bez opłat licencyjnych. Bez reklam. Bez znaków wodnych.",
    onbBack: "Wstecz"
  },
  nl: {
    navRecent: "Recent",
    navStarred: "Favorieten",
    cloudSearchPlaceholder: "Zoek in {n} projecten…",
    cloudNoResults: "Geen overeenkomende projecten.",
    cloudGroupThisWeek: "Deze week",
    cloudGroupThisMonth: "Eerder deze maand",
    cloudSortLabel: "Sorteren: {v}",
    cloudSortRecent: "Recent",
    cloudSortOldest: "Oudste",
    cloudRefresh: "Vernieuwen",
    cloudEmpty: "Nog geen webprojecten.",
    cloudError: "Laden mislukt. Probeer het later opnieuw.",
    cloudRetry: "Opnieuw proberen",
    cloudLoadMore: "Meer laden",
    cloudOpenInBrowser: "Openen in browser",
    navTrash: "Prullenbak",
    navTrashTip: "Verwijderde bestanden gaan naar de systeemprullenbak en kunnen daar worden hersteld",
    secQuickStart: "Snel starten",
    secRecent: "Recent",
    secStarred: "Favorieten",
    secProjectFiles: "Projectbestanden",
    secActivity: "Activiteit",
    colName: "Naam",
    colLocation: "Locatie",
    colModified: "Gewijzigd",
    colSize: "Grootte",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Lokaal bestand openen",
    openLocalSub: "Alle documentformaten",
    greetMorning: "Goedemorgen",
    greetAfternoon: "Goedemiddag",
    greetEvening: "Goedenavond",
    greetAsk1: "Wat wil je vandaag maken?",
    greetAsk2: "Klaar om te beginnen?",
    greetAsk3: "Waar werk je aan?",
    greetAsk4: "Waar beginnen we vandaag?",
    greetAsk5: "Zin om iets nieuws te maken?",
    greetAsk6: "Al een idee?",
    filterAll: "Alle",
    filterDocs: "Documenten",
    filterSheets: "Spreadsheets",
    filterSlides: "Presentaties",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Filteren op type",
    fileCount: "{n} bestanden",
    fileCountOne: "{n} bestand",
    selectedCount: "{n} geselecteerd",
    selectAll: "Alles selecteren",
    selectFile: "{name} selecteren",
    removeFromList: "Uit lijst verwijderen",
    deleteFiles: "Bestanden verwijderen",
    cancel: "Annuleren",
    star: "Aan favorieten toevoegen",
    unstar: "Uit favorieten verwijderen",
    moreActions: "Meer acties",
    open: "Openen",
    revealInFolder: "Tonen in map",
    copyPath: "Pad kopiëren",
    moveToProject: "Naar project verplaatsen",
    rename: "Naam wijzigen",
    duplicate: "Dupliceren",
    renameFailed: "Naam wijzigen mislukt",
    emptyStarred: "Geen favorieten — beweeg de muis over een rij en klik op de ster.",
    emptyRecent: "Geen recente bestanden — maak of open een bestand om te beginnen.",
    emptyFiltered: "Geen bestanden van dit type.",
    deleteModalTitle: "Bestanden verwijderen",
    deleteConfirmOne: '"{name}" naar de prullenbak verplaatsen?',
    deleteConfirmMany: "Deze {n} bestanden naar de prullenbak verplaatsen?",
    deleteMoreCount: "… {n} in totaal",
    delete: "Verwijderen",
    projects: "Projecten",
    newProject: "Nieuw project",
    projectName: "Projectnaam",
    deleteProject: "Project verwijderen…",
    deleteProjectConfirm: "Dit project verwijderen?\nDe bestanden gaan terug naar het standaardproject en gaan niet verloren.",
    projMoreActions: "Meer acties voor {name}",
    defaultProject: "Standaardproject",
    projEmpty: "Bewaar gerelateerde documenten in één project — de AI-chatgeschiedenis wordt per project opgebouwd.",
    projEmptyHint: 'Maak een bestand, of klik met de rechtermuisknop op een recent bestand en kies "Naar project verplaatsen".',
    timelineCount: "{n} items",
    timelineCountOne: "{n} item",
    timelineEmpty: "Nog geen AI-gesprekken in dit project.",
    timelineYou: "Jij",
    timelineUserAria: "Gebruiker",
    untitled: "Naamloos",
    noContent: "(leeg)",
    account: "Account",
    login: "Inloggen",
    loggedIn: "Ingelogd",
    waitingLogin: "Wachten op inloggen in de browser… Klik om de inlogpagina opnieuw te openen",
    waitingShort: "Wachten…",
    loginTimeout: "Inloggen verlopen — klik om het opnieuw te proberen",
    loginLaunchFailed: "Kan het inloggen niet starten — klik om het opnieuw te proberen",
    loginNetworkError: "Kan Bati niet bereiken — controleer uw netwerk of proxyinstellingen",
    loginExpired: "Autorisatie verlopen — klik om het opnieuw te proberen",
    loginFailed: "Inloggen mislukt — klik om het opnieuw te proberen",
    loggingOut: "Uitloggen…",
    logout: "Uitloggen",
    credits: "Credits",
    creditsTip: "Bekijk het creditverbruik",
    appVersion: "Versie {v}",
    versionLabel: "Versie",
    versionRowHint: "Bekijk de wijzigingen",
    updateReadyRestart: "Herstart om bij te werken",
    updateChannel: "Updatekanaal",
    telemetryLabel: "Anonieme gebruiksstatistieken",
    telemetryOn: "Aan",
    telemetryOff: "Uit",
    setSecPrivacy: "Gebruiksstatistieken",
    setSecShortcuts: "Sneltoetsen",
    setSearchPlaceholder: "Instellingen zoeken",
    scPalette: "Opdrachtpalet",
    scSettings: "Instellingen openen",
    scNewDoc: "Nieuw document",
    scOpen: "Bestand openen",
    scSave: "Opslaan",
    scPrint: "Afdrukken",
    scCloseTab: "Tabblad sluiten",
    scNextTab: "Volgend tabblad",
    scPrevTab: "Vorig tabblad",
    scGoToTab: "Ga naar tabblad N",
    scGlobalSummon: "BatiOffice oproepen (globaal)",
    globalSummonDesc: "Open BatiOffice overal met ⌘(Ctrl)+Shift+B en typ direct een opdracht.",
    heroLauncherHint: "Zoeken of maken…",
    heroAskWorkspace: "Vraag Bati AI",
    showMoreFiles: "Nog {count} tonen",
    createMore: "Meer",
    paletteHint: "Zoek acties, tabbladen en recente bestanden",
    paletteEmpty: "Geen resultaten",
    paletteTabs: "Tabbladen",
    paletteRecents: "Recente bestanden",
    paletteActions: "Acties",
    telemetryDesc: "Alleen anonieme tellers (zoals hoe vaak een editor wordt geopend) worden verzonden. Documentinhoud, bestandsnamen en prompts worden nooit verzameld en u kunt dit op elk moment uitschakelen.",
    channelStable: "Stabiel",
    channelBeta: "Bèta",
    theme: "Thema",
    themeLight: "Licht",
    themeDark: "Donker",
    themeSystem: "Systeem volgen",
    saveLocation: "Opslaglocatie",
    setAnalytics: "Anonieme gebruiksstatistieken verzenden",
    setAnalyticsDesc: "Standaard ingeschakeld en uit te schakelen via Instellingen → Algemeen. Gebruikt Google Analytics 4; Google ontvangt uw openbare IP en transportmetadata, maar nooit documentinhoud of bestandsnamen.",
    settings: "Instellingen",
    setSecAccount: "Account",
    setSecGeneral: "Algemeen",
    setSecAbout: "Over",
    setLearnMore: "Meer informatie",
    seeMoreAutomation: "Meer automatisering bekijken",
    starPromptTitle: "Bevalt BatiOffice?",
    starPromptTitleN: "Je hebt al {n} documenten geopend met BatiOffice",
    starPromptBody: "Bati automatiseert meer dan documenten — workflows die je bestanden, sheets en tools verbinden.",
    starPromptGo: "Bekijk wat Bati nog meer doet",
    starPromptDone: "Al bekeken",
    starPromptLater: "Later",
    onbAutomationHint: "Bati automatiseert meer dan documenten. Kijk op bati.ai.",
    setEmail: "E-mail",
    setNotLoggedIn: "Niet ingelogd",
    setViewUsage: "Verbruik bekijken",
    setChange: "Wijzigen",
    today: "Vandaag",
    yesterday: "Gisteren",
    daysAgo: "{n} dagen geleden",
    language: "Taal",
    closeTab: "Tabblad sluiten",
    tabList: "Alle tabbladen",
    tabAppMenu: "Menu",
    newTab: "Nieuw tabblad",
    // First-run onboarding
    onbTitle1: "Welkom bij BatiOffice",
    onbSubtitle1: "De AI-native officesuite",
    onbBody1: "Maak documenten, bouw spreadsheets, maak presentaties en beoordeel PDF-bestanden. AI zit in elke stap ingebouwd.",
    onbTitle2: "Dit is nog maar het begin",
    onbBody2: "BatiOffice is nog in alfa. Doe mee aan de groepschat op GenTeam om feedback te delen en mee te bepalen wat er komt.",
    onbJoinGenTeam: "Word lid van GenTeam",
    onbSkip: "Overslaan",
    onbNext: "Volgende",
    onbStart: "Aan de slag",
    onbStepAria: "Pagina {n} van {total}",
    onbTitle3: "Gratis voor iedereen",
    onbBody3: "Geen licentiekosten. Geen advertenties. Geen watermerken.",
    onbBack: "Terug"
  },
  ms: {
    navRecent: "Terkini",
    navStarred: "Berbintang",
    cloudSearchPlaceholder: "Cari {n} projek…",
    cloudNoResults: "Tiada projek sepadan.",
    cloudGroupThisWeek: "Minggu ini",
    cloudGroupThisMonth: "Bulan ini",
    cloudSortLabel: "Isih: {v}",
    cloudSortRecent: "Terbaru",
    cloudSortOldest: "Terlama",
    cloudRefresh: "Muat semula",
    cloudEmpty: "Belum ada projek web.",
    cloudError: "Gagal memuatkan. Cuba lagi kemudian.",
    cloudRetry: "Cuba lagi",
    cloudLoadMore: "Muat lagi",
    cloudOpenInBrowser: "Buka dalam pelayar",
    navTrash: "Tong sampah",
    navTrashTip: "Fail yang dipadamkan akan dipindahkan ke tong sampah sistem dan boleh dipulihkan dari sana",
    secQuickStart: "Mula pantas",
    secRecent: "Terkini",
    secStarred: "Berbintang",
    secProjectFiles: "Fail projek",
    secActivity: "Aktiviti",
    colName: "Nama",
    colLocation: "Lokasi",
    colModified: "Diubah suai",
    colSize: "Saiz",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "Buka Fail Setempat",
    openLocalSub: "Semua format dokumen",
    greetMorning: "Selamat pagi",
    greetAfternoon: "Selamat tengah hari",
    greetEvening: "Selamat petang",
    greetAsk1: "Apa yang anda mahu cipta hari ini?",
    greetAsk2: "Sedia untuk bermula?",
    greetAsk3: "Apa yang anda sedang usahakan?",
    greetAsk4: "Dari mana kita mula hari ini?",
    greetAsk5: "Mahu cipta sesuatu yang baharu?",
    greetAsk6: "Ada idea?",
    filterAll: "Semua",
    filterDocs: "Dokumen",
    filterSheets: "Hamparan",
    filterSlides: "Persembahan",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "Tapis mengikut jenis",
    fileCount: "{n} fail",
    fileCountOne: "{n} fail",
    selectedCount: "{n} dipilih",
    selectAll: "Pilih semua",
    selectFile: "Pilih {name}",
    removeFromList: "Alih keluar daripada senarai",
    deleteFiles: "Padam fail",
    cancel: "Batal",
    star: "Tambah bintang",
    unstar: "Buang bintang",
    moreActions: "Tindakan lain",
    open: "Buka",
    revealInFolder: "Tunjukkan dalam folder",
    copyPath: "Salin laluan",
    moveToProject: "Pindahkan ke projek",
    rename: "Namakan semula",
    duplicate: "Buat salinan",
    renameFailed: "Gagal menamakan semula",
    emptyStarred: "Belum ada fail berbintang — halakan kursor ke baris fail dan klik bintang.",
    emptyRecent: "Belum ada fail terkini — cipta atau buka fail untuk bermula.",
    emptyFiltered: "Tiada fail jenis ini.",
    deleteModalTitle: "Padam Fail",
    deleteConfirmOne: 'Pindahkan "{name}" ke tong sampah?',
    deleteConfirmMany: "Pindahkan {n} fail ini ke tong sampah?",
    deleteMoreCount: "… {n} kesemuanya",
    delete: "Padam",
    projects: "Projek",
    newProject: "Projek baharu",
    projectName: "Nama projek",
    deleteProject: "Padam projek…",
    deleteProjectConfirm: "Padam projek ini?\nFail di dalamnya akan kembali ke Projek Lalai dan tidak akan hilang.",
    projMoreActions: "Tindakan lain untuk {name}",
    defaultProject: "Projek lalai",
    projEmpty: "Simpan dokumen berkaitan dalam satu projek — sejarah perbualan AI terkumpul mengikut projek.",
    projEmptyHint: 'Cipta fail, atau klik kanan fail terkini dan pilih "Pindahkan ke projek".',
    timelineCount: "{n} item",
    timelineCountOne: "{n} item",
    timelineEmpty: "Belum ada perbualan AI dalam projek ini.",
    timelineYou: "Anda",
    timelineUserAria: "Pengguna",
    untitled: "Tanpa tajuk",
    noContent: "(kosong)",
    account: "Akaun",
    login: "Log masuk",
    loggedIn: "Telah log masuk",
    waitingLogin: "Menunggu log masuk dalam pelayar… Klik untuk membuka semula halaman log masuk",
    waitingShort: "Menunggu…",
    loginTimeout: "Log masuk tamat masa — klik untuk cuba lagi",
    loginLaunchFailed: "Tidak dapat memulakan log masuk — klik untuk cuba lagi",
    loginNetworkError: "Tidak dapat menyambung ke Bati — semak rangkaian atau tetapan proksi anda",
    loginExpired: "Kebenaran telah tamat tempoh — klik untuk cuba lagi",
    loginFailed: "Log masuk gagal — klik untuk cuba lagi",
    loggingOut: "Sedang log keluar…",
    logout: "Log keluar",
    credits: "Kredit",
    creditsTip: "Lihat butiran penggunaan kredit",
    appVersion: "Versi {v}",
    versionLabel: "Versi",
    versionRowHint: "Lihat riwayat pembaruan",
    updateReadyRestart: "Mulakan semula untuk kemas kini",
    updateChannel: "Saluran Kemas Kini",
    telemetryLabel: "Statistik penggunaan tanpa nama",
    telemetryOn: "Hidup",
    telemetryOff: "Mati",
    setSecPrivacy: "Statistik penggunaan",
    setSecShortcuts: "Pintasan",
    setSearchPlaceholder: "Cari tetapan",
    scPalette: "Palet perintah",
    scSettings: "Buka tetapan",
    scNewDoc: "Dokumen baharu",
    scOpen: "Buka fail",
    scSave: "Simpan",
    scPrint: "Cetak",
    scCloseTab: "Tutup tab",
    scNextTab: "Tab seterusnya",
    scPrevTab: "Tab sebelumnya",
    scGoToTab: "Lompat ke tab N",
    scGlobalSummon: "Panggil BatiOffice (global)",
    globalSummonDesc: "Buka BatiOffice dari mana-mana dengan ⌘(Ctrl)+Shift+B dan terus taip arahan.",
    heroLauncherHint: "Cari atau cipta…",
    heroAskWorkspace: "Tanya Bati AI",
    showMoreFiles: "Tunjukkan {count} lagi",
    createMore: "Lagi",
    paletteHint: "Cari tindakan, tab dan fail terkini",
    paletteEmpty: "Tiada padanan",
    paletteTabs: "Tab",
    paletteRecents: "Fail terkini",
    paletteActions: "Tindakan",
    telemetryDesc: "Hanya kiraan tanpa nama (contohnya berapa kali editor dibuka) dihantar. Kandungan dokumen, nama fail dan prompt tidak sekali-kali dikumpul, dan anda boleh mematikannya pada bila-bila masa.",
    channelStable: "Stabil",
    channelBeta: "Beta",
    theme: "Tema",
    themeLight: "Cerah",
    themeDark: "Gelap",
    themeSystem: "Ikut Sistem",
    saveLocation: "Lokasi simpanan",
    setAnalytics: "Hantar statistik penggunaan tanpa nama",
    setAnalyticsDesc: "Diaktifkan secara lalai dan boleh dimatikan di Tetapan → Umum. Menggunakan Google Analytics 4; Google menerima IP awam dan metadata pengangkutan, tetapi tidak pernah kandungan dokumen atau nama fail.",
    settings: "Tetapan",
    setSecAccount: "Akaun",
    setSecGeneral: "Umum",
    setSecAbout: "Perihal",
    setLearnMore: "Ketahui lebih lanjut",
    seeMoreAutomation: "Lihat lagi automasi",
    starPromptTitle: "Suka BatiOffice?",
    starPromptTitleN: "Anda telah membuka {n} dokumen dengan BatiOffice",
    starPromptBody: "Bati mengautomasikan lebih daripada dokumen — aliran kerja yang menghubungkan fail, helaian dan alat anda.",
    starPromptGo: "Lihat apa lagi yang Bati boleh buat",
    starPromptDone: "Sudah lihat",
    starPromptLater: "Kemudian",
    onbAutomationHint: "Bati mengautomasikan lebih daripada dokumen. Lihat di bati.ai.",
    setEmail: "E-mel",
    setNotLoggedIn: "Belum log masuk",
    setViewUsage: "Lihat penggunaan",
    setChange: "Tukar",
    today: "Hari ini",
    yesterday: "Semalam",
    daysAgo: "{n} hari lalu",
    language: "Bahasa",
    closeTab: "Tutup tab",
    tabList: "Semua tab",
    tabAppMenu: "Menu",
    newTab: "Tab baharu",
    // First-run onboarding
    onbTitle1: "Selamat datang ke BatiOffice",
    onbSubtitle1: "Suite pejabat AI-native",
    onbBody1: "Cipta dokumen, bina hamparan, hasilkan persembahan dan semak PDF. AI tersedia pada setiap langkah.",
    onbTitle2: "Ini baru permulaan",
    onbBody2: "BatiOffice masih dalam peringkat alfa. Sertai sembang kumpulan di GenTeam untuk berkongsi maklum balas dan membentuk masa depannya.",
    onbJoinGenTeam: "Sertai GenTeam",
    onbSkip: "Langkau",
    onbNext: "Seterusnya",
    onbStart: "Mula",
    onbStepAria: "Halaman {n} daripada {total}",
    onbTitle3: "Percuma untuk semua",
    onbBody3: "Tiada yuran lesen. Tiada iklan. Tiada tera air.",
    onbBack: "Kembali"
  },
  he: {
    navRecent: "אחרונים",
    navStarred: "מועדפים",
    cloudSearchPlaceholder: "חיפוש בין {n} פרויקטים…",
    cloudNoResults: "אין פרויקטים תואמים.",
    cloudGroupThisWeek: "השבוע",
    cloudGroupThisMonth: "מוקדם יותר החודש",
    cloudSortLabel: "מיון: {v}",
    cloudSortRecent: "החדשים ביותר",
    cloudSortOldest: "הישנים ביותר",
    cloudRefresh: "רענון",
    cloudEmpty: "אין עדיין פרויקטים מהאתר.",
    cloudError: "הטעינה נכשלה. נסו שוב מאוחר יותר.",
    cloudRetry: "נסו שוב",
    cloudLoadMore: "טענו עוד",
    cloudOpenInBrowser: "פתיחה בדפדפן",
    navTrash: "אשפה",
    navTrashTip: "קבצים שנמחקו עוברים לאשפה של המערכת וניתן לשחזר אותם משם",
    secQuickStart: "התחלה מהירה",
    secRecent: "אחרונים",
    secStarred: "מועדפים",
    secProjectFiles: "קובצי הפרויקט",
    secActivity: "פעילות",
    colName: "שם",
    colLocation: "מיקום",
    colModified: "שונה",
    colSize: "גודל",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "פתיחת קובץ מקומי",
    openLocalSub: "כל תבניות המסמכים",
    greetMorning: "בוקר טוב",
    greetAfternoon: "צהריים טובים",
    greetEvening: "ערב טוב",
    greetAsk1: "מה תרצו ליצור היום?",
    greetAsk2: "מוכנים להתחיל?",
    greetAsk3: "על מה אתם עובדים?",
    greetAsk4: "מאיפה נתחיל היום?",
    greetAsk5: "רוצים ליצור משהו חדש?",
    greetAsk6: "יש לכם רעיון?",
    filterAll: "הכול",
    filterDocs: "מסמכים",
    filterSheets: "גיליונות",
    filterSlides: "מצגות",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "סינון לפי סוג",
    fileCount: "{n} קבצים",
    fileCountOne: "קובץ אחד",
    selectedCount: "נבחרו {n}",
    selectAll: "בחירת הכול",
    selectFile: "בחירת {name}",
    removeFromList: "הסרה מהרשימה",
    deleteFiles: "מחיקת קבצים",
    cancel: "ביטול",
    star: "הוספה למועדפים",
    unstar: "הסרה מהמועדפים",
    moreActions: "פעולות נוספות",
    open: "פתיחה",
    revealInFolder: "הצגה בתיקייה",
    copyPath: "העתקת נתיב",
    moveToProject: "העברה לפרויקט",
    rename: "שינוי שם",
    duplicate: "יצירת עותק",
    renameFailed: "שינוי השם נכשל",
    emptyStarred: "אין מועדפים עדיין — רחפו מעל שורת קובץ ולחצו על הכוכב.",
    emptyRecent: "אין קבצים אחרונים — צרו או פתחו קובץ כדי להתחיל.",
    emptyFiltered: "אין קבצים מסוג זה.",
    deleteModalTitle: "מחיקת קבצים",
    deleteConfirmOne: 'להעביר את "{name}" לאשפה?',
    deleteConfirmMany: "להעביר את {n} הקבצים האלה לאשפה?",
    deleteMoreCount: "… {n} בסך הכול",
    delete: "מחיקה",
    projects: "פרויקטים",
    newProject: "פרויקט חדש",
    projectName: "שם הפרויקט",
    deleteProject: "מחיקת פרויקט…",
    deleteProjectConfirm: 'למחוק את הפרויקט הזה?\nהקבצים שבו יחזרו ל"פרויקט ברירת המחדל" ולא יאבדו.',
    projMoreActions: "פעולות נוספות עבור {name}",
    defaultProject: "פרויקט ברירת מחדל",
    projEmpty: "שמרו מסמכים קשורים באותו פרויקט — היסטוריית שיחות ה-AI נצברת לפי פרויקט.",
    projEmptyHint: 'צרו קובץ, או לחצו לחיצה ימנית על קובץ אחרון ובחרו "העברה לפרויקט".',
    timelineCount: "{n} פריטים",
    timelineCountOne: "פריט אחד",
    timelineEmpty: "אין עדיין שיחות AI בפרויקט הזה.",
    timelineYou: "את/ה",
    timelineUserAria: "משתמש",
    untitled: "ללא שם",
    noContent: "(ריק)",
    account: "חשבון",
    login: "התחברות",
    loggedIn: "מחובר",
    waitingLogin: "ממתין להתחברות בדפדפן… לחצו כדי לפתוח שוב את דף ההתחברות",
    waitingShort: "ממתין…",
    loginTimeout: "פג תוקף ההתחברות — לחצו כדי לנסות שוב",
    loginLaunchFailed: "לא ניתן להתחיל את ההתחברות — לחצו כדי לנסות שוב",
    loginNetworkError: "לא ניתן להתחבר ל-Bati — בדקו את הרשת או את הגדרות ה-proxy",
    loginExpired: "תוקף ההרשאה פג — לחצו כדי לנסות שוב",
    loginFailed: "ההתחברות נכשלה — לחצו כדי לנסות שוב",
    loggingOut: "מתנתק…",
    logout: "התנתקות",
    credits: "קרדיטים",
    creditsTip: "הצגת פרטי השימוש בקרדיטים",
    appVersion: "גרסה {v}",
    versionLabel: "גרסה",
    versionRowHint: "הצג היסטוריית עדכונים",
    updateReadyRestart: "הפעל מחדש כדי לעדכן",
    updateChannel: "ערוץ עדכונים",
    telemetryLabel: "סטטיסטיקת שימוש אנונימית",
    telemetryOn: "פעיל",
    telemetryOff: "כבוי",
    setSecPrivacy: "סטטיסטיקת שימוש",
    setSecShortcuts: "קיצורי דרך",
    setSearchPlaceholder: "חיפוש בהגדרות",
    scPalette: "לוח פקודות",
    scSettings: "פתיחת הגדרות",
    scNewDoc: "מסמך חדש",
    scOpen: "פתיחת קובץ",
    scSave: "שמירה",
    scPrint: "הדפסה",
    scCloseTab: "סגירת כרטיסייה",
    scNextTab: "הכרטיסייה הבאה",
    scPrevTab: "הכרטיסייה הקודמת",
    scGoToTab: "מעבר לכרטיסייה N",
    scGlobalSummon: "זימון BatiOffice (גלובלי)",
    globalSummonDesc: "פתחו את BatiOffice מכל מקום עם ⌘(Ctrl)+Shift+B והקלידו פקודה מיד.",
    heroLauncherHint: "חיפוש או יצירה…",
    heroAskWorkspace: "לשאול את Bati AI",
    showMoreFiles: "הצגת {count} נוספים",
    createMore: "עוד",
    paletteHint: "חיפוש פעולות, כרטיסיות וקבצים אחרונים",
    paletteEmpty: "אין התאמות",
    paletteTabs: "כרטיסיות",
    paletteRecents: "קבצים אחרונים",
    paletteActions: "פעולות",
    telemetryDesc: "נשלחים רק מונים אנונימיים (למשל כמה פעמים נפתח עורך). תוכן מסמכים, שמות קבצים והנחיות לעולם אינם נאספים, וניתן לכבות זאת בכל עת.",
    channelStable: "יציב",
    channelBeta: "בטא",
    theme: "ערכת נושא",
    themeLight: "בהיר",
    themeDark: "כהה",
    themeSystem: "עקוב אחר המערכת",
    saveLocation: "מיקום שמירה",
    setAnalytics: "שליחת נתוני שימוש אנונימיים",
    setAnalyticsDesc: "מופעל כברירת מחדל וניתן לכיבוי בהגדרות ← כללי. משתמש ב-Google Analytics 4; Google מקבלת IP ציבורי ומטא-נתוני תעבורה, אך לא תוכן מסמכים או שמות קבצים.",
    settings: "הגדרות",
    setSecAccount: "חשבון",
    setSecGeneral: "כללי",
    setSecAbout: "אודות",
    setLearnMore: "מידע נוסף",
    seeMoreAutomation: "עוד אוטומציות",
    starPromptTitle: "נהנים מ-BatiOffice?",
    starPromptTitleN: "פתחת {n} מסמכים עם BatiOffice",
    starPromptBody: "‏Bati מבצע אוטומציה להרבה מעבר למסמכים — תהליכים שמחברים קבצים, גיליונות וכלים.",
    starPromptGo: "לראות מה עוד Bati עושה",
    starPromptDone: "כבר ראיתי",
    starPromptLater: "אחר כך",
    onbAutomationHint: "‏Bati מבצע אוטומציה להרבה מעבר למסמכים. אפשר לראות ב-bati.ai.",
    setEmail: "אימייל",
    setNotLoggedIn: "לא מחובר",
    setViewUsage: "הצגת שימוש",
    setChange: "שינוי",
    today: "היום",
    yesterday: "אתמול",
    daysAgo: "לפני {n} ימים",
    language: "שפה",
    closeTab: "סגירת כרטיסייה",
    tabList: "כל הכרטיסיות",
    tabAppMenu: "תפריט",
    newTab: "כרטיסייה חדשה",
    // First-run onboarding
    onbTitle1: "ברוכים הבאים ל-BatiOffice",
    onbSubtitle1: "חבילת האופיס מבוססת ה-AI",
    onbBody1: "צרו מסמכים, בנו גיליונות, הכינו מצגות ובדקו קובצי PDF. ה-AI מובנה בכל שלב.",
    onbTitle2: "זו רק ההתחלה",
    onbBody2: "BatiOffice עדיין בגרסת אלפא. הצטרפו לצ׳אט הקבוצתי ב-GenTeam כדי לשתף משוב ולעזור לעצב את ההמשך.",
    onbJoinGenTeam: "הצטרפו ל-GenTeam",
    onbSkip: "דילוג",
    onbNext: "הבא",
    onbStart: "להתחיל",
    onbStepAria: "עמוד {n} מתוך {total}",
    onbTitle3: "חינם לכולם",
    onbBody3: "ללא דמי רישיון, ללא פרסומות, ללא סימני מים.",
    onbBack: "חזרה"
  },
  hi: {
    navRecent: "हाल के",
    navStarred: "तारांकित",
    cloudSearchPlaceholder: "{n} प्रोजेक्ट खोजें…",
    cloudNoResults: "कोई मिलान वाला प्रोजेक्ट नहीं।",
    cloudGroupThisWeek: "इस सप्ताह",
    cloudGroupThisMonth: "इस महीने",
    cloudSortLabel: "क्रम: {v}",
    cloudSortRecent: "हाल के",
    cloudSortOldest: "सबसे पुराने",
    cloudRefresh: "रीफ़्रेश",
    cloudEmpty: "अभी तक कोई वेब प्रोजेक्ट नहीं है।",
    cloudError: "लोड नहीं हो सका। बाद में फिर से कोशिश करें।",
    cloudRetry: "फिर से कोशिश करें",
    cloudLoadMore: "और लोड करें",
    cloudOpenInBrowser: "ब्राउज़र में खोलें",
    navTrash: "ट्रैश",
    navTrashTip: "हटाई गई फ़ाइलें सिस्टम ट्रैश में जाती हैं और वहाँ से पुनर्स्थापित की जा सकती हैं",
    secQuickStart: "त्वरित प्रारंभ",
    secRecent: "हाल के",
    secStarred: "तारांकित",
    secProjectFiles: "प्रोजेक्ट फ़ाइलें",
    secActivity: "गतिविधि",
    colName: "नाम",
    colLocation: "स्थान",
    colModified: "संशोधित",
    colSize: "आकार",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "स्थानीय फ़ाइल खोलें",
    openLocalSub: "सभी दस्तावेज़ प्रारूप",
    greetMorning: "सुप्रभात",
    greetAfternoon: "नमस्ते",
    greetEvening: "शुभ संध्या",
    greetAsk1: "आज आप क्या बनाना चाहेंगे?",
    greetAsk2: "शुरू करने के लिए तैयार?",
    greetAsk3: "आप किस पर काम कर रहे हैं?",
    greetAsk4: "आज कहाँ से शुरू करें?",
    greetAsk5: "कुछ नया बनाना चाहेंगे?",
    greetAsk6: "कोई आइडिया है?",
    filterAll: "सभी",
    filterDocs: "दस्तावेज़",
    filterSheets: "स्प्रेडशीट",
    filterSlides: "प्रस्तुतियाँ",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "प्रकार के अनुसार फ़िल्टर करें",
    fileCount: "{n} फ़ाइलें",
    fileCountOne: "{n} फ़ाइल",
    selectedCount: "{n} चयनित",
    selectAll: "सभी चुनें",
    selectFile: "{name} चुनें",
    removeFromList: "सूची से हटाएँ",
    deleteFiles: "फ़ाइलें हटाएँ",
    cancel: "रद्द करें",
    star: "तारांकित करें",
    unstar: "तारांकन हटाएँ",
    moreActions: "अधिक कार्रवाइयाँ",
    open: "खोलें",
    revealInFolder: "फ़ोल्डर में दिखाएँ",
    copyPath: "पथ कॉपी करें",
    moveToProject: "प्रोजेक्ट में ले जाएँ",
    rename: "नाम बदलें",
    duplicate: "प्रतिलिपि बनाएँ",
    renameFailed: "नाम बदलने में विफल",
    emptyStarred: "कोई तारांकित फ़ाइल नहीं — फ़ाइल की पंक्ति पर कर्सर ले जाएँ और तारे पर क्लिक करें।",
    emptyRecent: "कोई हालिया फ़ाइल नहीं — शुरू करने के लिए कोई फ़ाइल बनाएँ या खोलें।",
    emptyFiltered: "इस प्रकार की कोई फ़ाइल नहीं है।",
    deleteModalTitle: "फ़ाइलें हटाएँ",
    deleteConfirmOne: '"{name}" को ट्रैश में ले जाएँ?',
    deleteConfirmMany: "इन {n} फ़ाइलों को ट्रैश में ले जाएँ?",
    deleteMoreCount: "… कुल {n}",
    delete: "हटाएँ",
    projects: "प्रोजेक्ट",
    newProject: "नया प्रोजेक्ट",
    projectName: "प्रोजेक्ट का नाम",
    deleteProject: "प्रोजेक्ट हटाएँ…",
    deleteProjectConfirm: 'यह प्रोजेक्ट हटाएँ?\nइसकी फ़ाइलें "डिफ़ॉल्ट प्रोजेक्ट" में वापस चली जाएँगी और खोएँगी नहीं।',
    projMoreActions: "{name} के लिए अधिक कार्रवाइयाँ",
    defaultProject: "डिफ़ॉल्ट प्रोजेक्ट",
    projEmpty: "संबंधित दस्तावेज़ों को एक ही प्रोजेक्ट में रखें — AI चैट इतिहास प्रोजेक्ट के अनुसार जमा होता है।",
    projEmptyHint: 'कोई फ़ाइल बनाएँ, या किसी हालिया फ़ाइल पर राइट-क्लिक करके "प्रोजेक्ट में ले जाएँ" चुनें।',
    timelineCount: "{n} आइटम",
    timelineCountOne: "{n} आइटम",
    timelineEmpty: "इस प्रोजेक्ट में अभी तक कोई AI बातचीत नहीं है।",
    timelineYou: "आप",
    timelineUserAria: "उपयोगकर्ता",
    untitled: "बिना शीर्षक",
    noContent: "(खाली)",
    account: "खाता",
    login: "साइन इन करें",
    loggedIn: "साइन इन हो गया",
    waitingLogin: "ब्राउज़र में साइन इन की प्रतीक्षा है… साइन इन पेज दोबारा खोलने के लिए क्लिक करें",
    waitingShort: "प्रतीक्षा में…",
    loginTimeout: "साइन इन का समय समाप्त — पुनः प्रयास के लिए क्लिक करें",
    loginLaunchFailed: "साइन इन शुरू नहीं हो सका — पुनः प्रयास के लिए क्लिक करें",
    loginNetworkError: "Bati से कनेक्ट नहीं हो सका — नेटवर्क या प्रॉक्सी सेटिंग जांचें",
    loginExpired: "प्राधिकरण की समय सीमा समाप्त — पुनः प्रयास के लिए क्लिक करें",
    loginFailed: "साइन इन विफल — पुनः प्रयास के लिए क्लिक करें",
    loggingOut: "साइन आउट हो रहा है…",
    logout: "साइन आउट करें",
    credits: "क्रेडिट",
    creditsTip: "क्रेडिट उपयोग का विवरण देखें",
    appVersion: "संस्करण {v}",
    versionLabel: "संस्करण",
    versionRowHint: "अपडेट इतिहास देखें",
    updateReadyRestart: "अपडेट के लिए पुनः प्रारंभ करें",
    updateChannel: "अपडेट चैनल",
    telemetryLabel: "गुमनाम उपयोग आँकड़े",
    telemetryOn: "चालू",
    telemetryOff: "बंद",
    setSecPrivacy: "उपयोग आँकड़े",
    setSecShortcuts: "शॉर्टकट",
    setSearchPlaceholder: "सेटिंग्स खोजें",
    scPalette: "कमांड पैलेट",
    scSettings: "सेटिंग्स खोलें",
    scNewDoc: "नया दस्तावेज़",
    scOpen: "फ़ाइल खोलें",
    scSave: "सहेजें",
    scPrint: "प्रिंट",
    scCloseTab: "टैब बंद करें",
    scNextTab: "अगला टैब",
    scPrevTab: "पिछला टैब",
    scGoToTab: "टैब N पर जाएँ",
    scGlobalSummon: "BatiOffice खोलें (ग्लोबल)",
    globalSummonDesc: "⌘(Ctrl)+Shift+B से कहीं से भी BatiOffice खोलें और तुरंत कमांड लिखें।",
    heroLauncherHint: "खोजें या नया बनाएँ…",
    heroAskWorkspace: "Bati AI से पूछें",
    showMoreFiles: "{count} और दिखाएँ",
    createMore: "और",
    paletteHint: "क्रियाएँ, टैब और हाल की फ़ाइलें खोजें",
    paletteEmpty: "कोई मिलान नहीं",
    paletteTabs: "टैब",
    paletteRecents: "हाल की फ़ाइलें",
    paletteActions: "क्रियाएँ",
    telemetryDesc: "केवल अनाम काउंटर (जैसे संपादक कितनी बार खोला गया) भेजे जाते हैं। दस्तावेज़ की सामग्री, फ़ाइल नाम और प्रॉम्प्ट कभी एकत्र नहीं किए जाते, और आप इसे कभी भी बंद कर सकते हैं।",
    channelStable: "स्थिर",
    channelBeta: "बीटा",
    theme: "थीम",
    themeLight: "लाइट",
    themeDark: "डार्क",
    themeSystem: "सिस्टम का अनुसरण करें",
    saveLocation: "सहेजने का स्थान",
    setAnalytics: "गुमनाम उपयोग आँकड़े भेजें",
    setAnalyticsDesc: "डिफ़ॉल्ट रूप से चालू; सेटिंग्स → सामान्य में बंद किया जा सकता है। Google Analytics 4 का उपयोग होता है; Google को सार्वजनिक IP और ट्रांसपोर्ट मेटाडेटा मिलता है, लेकिन दस्तावेज़ सामग्री या फ़ाइल नाम नहीं।",
    settings: "सेटिंग्स",
    setSecAccount: "खाता",
    setSecGeneral: "सामान्य",
    setSecAbout: "जानकारी",
    setLearnMore: "और जानें",
    seeMoreAutomation: "और ऑटोमेशन देखें",
    starPromptTitle: "BatiOffice पसंद आ रहा है?",
    starPromptTitleN: "आपने BatiOffice में {n} दस्तावेज़ खोले हैं",
    starPromptBody: "Bati दस्तावेज़ों से कहीं आगे ऑटोमेट करता है — ऐसे वर्कफ़्लो जो आपकी फ़ाइलें, शीट और टूल जोड़ते हैं।",
    starPromptGo: "देखें Bati और क्या करता है",
    starPromptDone: "पहले ही देख लिया",
    starPromptLater: "बाद में",
    onbAutomationHint: "Bati दस्तावेज़ों से कहीं आगे ऑटोमेट करता है। bati.ai पर देखें।",
    setEmail: "ईमेल",
    setNotLoggedIn: "साइन इन नहीं किया गया",
    setViewUsage: "उपयोग देखें",
    setChange: "बदलें",
    today: "आज",
    yesterday: "कल",
    daysAgo: "{n} दिन पहले",
    language: "भाषा",
    closeTab: "टैब बंद करें",
    tabList: "सभी टैब",
    tabAppMenu: "मेनू",
    newTab: "नया टैब",
    // First-run onboarding
    onbTitle1: "BatiOffice में आपका स्वागत है",
    onbSubtitle1: "AI-नेटिव ऑफिस सुइट",
    onbBody1: "दस्तावेज़ बनाएँ, स्प्रेडशीट तैयार करें, प्रस्तुतियाँ बनाएँ और PDF की समीक्षा करें। AI हर चरण में शामिल है।",
    onbTitle2: "यह तो बस शुरुआत है",
    onbBody2: "BatiOffice अभी अल्फ़ा में है। GenTeam पर ग्रुप चैट से जुड़ें, फ़ीडबैक साझा करें और आगे की दिशा तय करने में मदद करें।",
    onbJoinGenTeam: "GenTeam से जुड़ें",
    onbSkip: "छोड़ें",
    onbNext: "आगे",
    onbStart: "शुरू करें",
    onbStepAria: "कुल {total} में से पृष्ठ {n}",
    onbTitle3: "सभी के लिए मुफ़्त",
    onbBody3: "कोई लाइसेंस शुल्क नहीं। कोई विज्ञापन नहीं। कोई वॉटरमार्क नहीं।",
    onbBack: "वापस"
  },
  "zh-TW": {
    navRecent: "最近",
    navStarred: "收藏",
    cloudSearchPlaceholder: "搜尋 {n} 個專案…",
    cloudNoResults: "沒有符合的專案。",
    cloudGroupThisWeek: "本週",
    cloudGroupThisMonth: "本月",
    cloudSortLabel: "排序：{v}",
    cloudSortRecent: "最近",
    cloudSortOldest: "最早",
    cloudRefresh: "重新整理",
    cloudEmpty: "還沒有網頁端專案。",
    cloudError: "載入失敗，請稍後再試。",
    cloudRetry: "重試",
    cloudLoadMore: "載入更多",
    cloudOpenInBrowser: "在瀏覽器中開啟",
    navTrash: "垃圾桶",
    navTrashTip: "刪除的檔案會移至系統垃圾桶，可從那裡還原",
    secQuickStart: "快速開始",
    secRecent: "最近使用",
    secStarred: "收藏",
    secProjectFiles: "專案檔案",
    secActivity: "專案動態",
    colName: "名稱",
    colLocation: "位置",
    colModified: "修改時間",
    colSize: "大小",
    newDoc: "AI Docs",
    newSheet: "AI Sheets",
    newSlide: "AI Slides",
    newMarkdown: "AI Markdown",
    newPdf: "AI PDF",
    openLocal: "開啟本機檔案",
    openLocalSub: "支援所有文件格式",
    greetMorning: "早安",
    greetAfternoon: "午安",
    greetEvening: "晚安",
    greetAsk1: "今天想建立點什麼？",
    greetAsk2: "準備好開始了嗎？",
    greetAsk3: "有什麼想做的嗎？",
    greetAsk4: "今天從哪裡開始？",
    greetAsk5: "想做點什麼新的？",
    greetAsk6: "靈感來了嗎？",
    filterAll: "全部",
    filterDocs: "文件",
    filterSheets: "試算表",
    filterSlides: "簡報",
    filterPdf: "PDF",
    filterMd: "Markdown",
    filterAria: "依類型篩選",
    fileCount: "{n} 個檔案",
    fileCountOne: "{n} 個檔案",
    selectedCount: "已選 {n} 項",
    selectAll: "全選",
    selectFile: "選取 {name}",
    removeFromList: "從清單中移除",
    deleteFiles: "刪除檔案",
    cancel: "取消",
    star: "收藏",
    unstar: "取消收藏",
    moreActions: "更多動作",
    open: "開啟",
    revealInFolder: "開啟所在資料夾",
    copyPath: "複製路徑",
    moveToProject: "移至專案",
    rename: "重新命名",
    duplicate: "建立副本",
    renameFailed: "重新命名失敗",
    emptyStarred: "還沒有收藏 — 將游標移到檔案列並點按星號即可收藏。",
    emptyRecent: "暫無最近檔案 — 新增或開啟檔案即可開始使用。",
    emptyFiltered: "此類型下暫無檔案。",
    deleteModalTitle: "刪除檔案",
    deleteConfirmOne: "確定將「{name}」移至垃圾桶？",
    deleteConfirmMany: "確定將以下 {n} 個檔案移至垃圾桶？",
    deleteMoreCount: "… 等共 {n} 個",
    delete: "刪除",
    projects: "專案",
    newProject: "新增專案",
    projectName: "專案名稱",
    deleteProject: "刪除專案…",
    deleteProjectConfirm: "刪除此專案？\n專案內的檔案會回到「預設專案」，不會遺失。",
    projMoreActions: "{name} 更多動作",
    defaultProject: "預設專案",
    projEmpty: "把相關文件放進同一個專案，AI 對話紀錄會依專案累積。",
    projEmptyHint: "新增檔案，或在「最近」檔案上按右鍵選擇「移至專案」。",
    timelineCount: "{n} 筆",
    timelineCountOne: "{n} 筆",
    timelineEmpty: "此專案還沒有 AI 對話紀錄。",
    timelineYou: "你",
    timelineUserAria: "使用者",
    untitled: "未命名",
    noContent: "（無內容）",
    account: "帳號",
    login: "登入",
    loggedIn: "已登入",
    waitingLogin: "正在等待瀏覽器登入…點按可重新開啟登入頁面",
    waitingShort: "等待登入…",
    loginTimeout: "登入逾時，點按重試",
    loginLaunchFailed: "無法啟動登入，點按重試",
    loginNetworkError: "無法連線至 Bati，請檢查網路或代理設定",
    loginExpired: "登入已過期，點按重試",
    loginFailed: "登入失敗，點按重試",
    loggingOut: "正在登出…",
    logout: "登出",
    credits: "點數",
    creditsTip: "查看點數用量詳情",
    appVersion: "版本 {v}",
    versionLabel: "版本",
    versionRowHint: "查看更新历史",
    updateReadyRestart: "重新啟動以更新",
    updateChannel: "更新通道",
    telemetryLabel: "匿名使用統計",
    telemetryOn: "傳送",
    telemetryOff: "不傳送",
    setSecPrivacy: "使用統計",
    setSecShortcuts: "快速鍵",
    setSearchPlaceholder: "搜尋設定",
    scPalette: "命令面板",
    scSettings: "開啟設定",
    scNewDoc: "新增文件",
    scOpen: "開啟檔案",
    scSave: "儲存",
    scPrint: "列印",
    scCloseTab: "關閉分頁",
    scNextTab: "下一個分頁",
    scPrevTab: "上一個分頁",
    scGoToTab: "跳至第 N 個分頁",
    scGlobalSummon: "全域喚起 BatiOffice",
    globalSummonDesc: "在其他應用中也可用 Ctrl+Shift+B 喚起 BatiOffice 並直接輸入命令。",
    heroLauncherHint: "搜尋或新增…",
    heroAskWorkspace: "詢問 Bati AI",
    showMoreFiles: "顯示其餘 {count} 個",
    createMore: "更多",
    paletteHint: "搜尋操作、分頁與最近檔案",
    paletteEmpty: "沒有相符項目",
    paletteTabs: "分頁",
    paletteRecents: "最近檔案",
    paletteActions: "操作",
    telemetryDesc: "僅傳送匿名計數（例如編輯器開啟次數）。絕不收集文件內容、檔案名稱或提示詞，且可隨時關閉。",
    channelStable: "穩定版",
    channelBeta: "Beta 版",
    theme: "主題",
    themeLight: "淺色",
    themeDark: "深色",
    themeSystem: "跟隨系統",
    saveLocation: "預設儲存位置",
    setAnalytics: "傳送匿名使用統計",
    setAnalyticsDesc: "此功能預設開啟，可隨時在「設定 → 一般」中關閉。使用 Google Analytics 4；Google 會接收您的公開 IP 位址和傳輸中繼資料，但絕不收集文件內容或檔案名稱。",
    settings: "設定",
    setSecAccount: "帳戶",
    setSecGeneral: "一般",
    setSecAbout: "關於",
    setLearnMore: "了解更多",
    seeMoreAutomation: "查看更多自動化功能",
    starPromptTitle: "喜歡 BatiOffice 嗎？",
    starPromptTitleN: "你已經用 BatiOffice 開啟了 {n} 個文件",
    starPromptBody: "Bati 還能自動化更多工作——文件、表格與流程的串接。到 bati.ai 看看。",
    starPromptGo: "查看更多功能",
    starPromptDone: "已經看過了",
    starPromptLater: "以後再說",
    onbAutomationHint: "Bati 還能自動化更多工作，歡迎到 bati.ai 了解。",
    setEmail: "電子郵件",
    setNotLoggedIn: "未登入",
    setViewUsage: "查看用量",
    setChange: "變更",
    today: "今天",
    yesterday: "昨天",
    daysAgo: "{n} 天前",
    language: "語言",
    closeTab: "關閉分頁",
    tabList: "全部分頁",
    tabAppMenu: "選單",
    newTab: "新分頁",
    // First-run onboarding
    onbTitle1: "歡迎使用 BatiOffice",
    onbSubtitle1: "AI 原生的 Office 套件",
    onbBody1: "建立文件、製作試算表、產生簡報、審閱 PDF。AI 深度融入每個環節。",
    onbTitle2: "這只是一個開始",
    onbBody2: "BatiOffice 目前仍在 alpha 階段。歡迎加入 GenTeam 群聊，分享回饋，一起打造它的未來。",
    onbJoinGenTeam: "加入 GenTeam",
    onbSkip: "略過",
    onbNext: "下一步",
    onbStart: "開始使用",
    onbStepAria: "第 {n} 頁，共 {total} 頁",
    onbTitle3: "人人免費",
    onbBody3: "無授權費用，無廣告，無浮水印。",
    onbBack: "上一步"
  }
};
const translate = createI18n(strings);
const LocaleContext = reactExports.createContext({ lang: "zh", setLang: () => {
} });
function LocaleProvider({ initial, children }) {
  const [lang, setLangState] = reactExports.useState(initial);
  const value = reactExports.useMemo(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        document.documentElement.lang = htmlLang(next);
        void window.aiOffice.setLanguage(next);
      }
    }),
    [lang]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleContext.Provider, { value, children });
}
const DATE_LOCALES = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  th: "th-TH",
  id: "id-ID",
  ru: "ru-RU",
  ar: "ar-SA",
  pt: "pt-BR",
  it: "it-IT",
  pl: "pl-PL",
  nl: "nl-NL",
  ms: "ms-MY",
  he: "he-IL",
  hi: "hi-IN",
  "zh-TW": "zh-TW"
};
function useI18n() {
  const { lang, setLang } = reactExports.useContext(LocaleContext);
  return {
    lang,
    setLang,
    t: (key, params) => translate(lang, key, params),
    dateLocale: DATE_LOCALES[lang]
  };
}
const LANG_OPTIONS = [
  { value: "ar", label: "العربية" },
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "he", label: "עברית" },
  { value: "hi", label: "हिन्दी" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "nl", label: "Nederlands" },
  { value: "pl", label: "Polski" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "th", label: "ไทย" },
  { value: "zh", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" }
];
const THEME_OPTIONS = [
  { value: "system", labelKey: "themeSystem" },
  { value: "light", labelKey: "themeLight" },
  { value: "dark", labelKey: "themeDark" }
];
const CHANNEL_OPTIONS = [
  { value: "stable", labelKey: "channelStable" },
  { value: "beta", labelKey: "channelBeta" }
];
const IS_MAC = navigator.platform.startsWith("Mac");
const MOD = IS_MAC ? "⌘" : "Ctrl";
const SUMMON_KEY_OPTIONS = [
  { value: "CommandOrControl+Shift+B", label: `${MOD} Shift B` },
  { value: "CommandOrControl+Shift+Space", label: `${MOD} Shift Space` },
  { value: "CommandOrControl+Alt+K", label: IS_MAC ? "⌘ ⌥ K" : "Ctrl Alt K" },
  { value: "Alt+Space", label: IS_MAC ? "⌥ Space" : "Alt Space" }
];
function summonKeyLabel(accelerator) {
  return SUMMON_KEY_OPTIONS.find((option) => option.value === accelerator)?.label ?? `${MOD} Shift B`;
}
const SHORTCUTS = [
  { labelKey: "scPalette", keys: `${MOD} K` },
  { labelKey: "scSettings", keys: `${MOD} ,` },
  { labelKey: "scNewDoc", keys: `${MOD} N` },
  { labelKey: "scOpen", keys: `${MOD} O` },
  { labelKey: "scSave", keys: `${MOD} S` },
  { labelKey: "scPrint", keys: `${MOD} P` },
  { labelKey: "scCloseTab", keys: `${MOD} W` },
  { labelKey: "scNextTab", keys: "Ctrl Tab" },
  { labelKey: "scPrevTab", keys: "Ctrl Shift Tab" },
  { labelKey: "scGoToTab", keys: `${MOD} 1–9` }
];
const SECTIONS = [
  { id: "general", labelKey: "setSecGeneral" },
  { id: "shortcuts", labelKey: "setSecShortcuts" },
  { id: "privacy", labelKey: "setSecPrivacy" }
];
function SectionIcon({ id }) {
  if (id === "general") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M2 5h8M13 5h1M2 11h1M6 11h8",
          stroke: "currentColor",
          strokeWidth: "1.3",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11.5", cy: "5", r: "1.7", stroke: "currentColor", strokeWidth: "1.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "4.5", cy: "11", r: "1.7", stroke: "currentColor", strokeWidth: "1.3" })
    ] });
  }
  if (id === "shortcuts") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1.8", y: "4", width: "12.4", height: "8", rx: "1.6", stroke: "currentColor", strokeWidth: "1.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M4.4 6.7h.01M7 6.7h.01M9.6 6.7h.01M12.2 6.7h.01M4.4 9.3h.01M12.2 9.3h.01M6.4 9.3h3.8",
          stroke: "currentColor",
          strokeWidth: "1.4",
          strokeLinecap: "round"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M4 12.6V9.8M8 12.6V6.2M12 12.6V3.4",
        stroke: "currentColor",
        strokeWidth: "1.6",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 12.6h12", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
  ] });
}
function KeyCombo({ keys }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "set-keys", children: keys.split(" ").map((key, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: key }, index)) });
}
function SettingsModal({
  lang,
  onLang,
  theme,
  onTheme,
  channel,
  onChannel,
  telemetry,
  onTelemetry,
  globalSummon,
  onGlobalSummon,
  globalSummonAccelerator,
  onGlobalSummonAccelerator,
  onClose
}) {
  const { t } = useI18n();
  const [section, setSection] = reactExports.useState("general");
  const [query, setQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  const fields = reactExports.useMemo(
    () => [
      {
        section: "general",
        label: t("language"),
        keywords: LANG_OPTIONS.map((opt) => opt.label).join(" "),
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "set-field-label", children: t("language") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dropdown,
            {
              className: "set-dd",
              value: lang,
              ariaLabel: t("language"),
              options: LANG_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
              onPick: onLang
            }
          )
        ] }, "language")
      },
      {
        section: "general",
        label: t("theme"),
        keywords: THEME_OPTIONS.map((opt) => t(opt.labelKey)).join(" "),
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "set-field-label", children: t("theme") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dropdown,
            {
              className: "set-dd",
              value: theme,
              ariaLabel: t("theme"),
              options: THEME_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
              onPick: onTheme
            }
          )
        ] }, "theme")
      },
      {
        section: "general",
        label: t("updateChannel"),
        keywords: CHANNEL_OPTIONS.map((opt) => t(opt.labelKey)).join(" "),
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "set-field-label", children: t("updateChannel") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dropdown,
            {
              className: "set-dd",
              value: channel,
              ariaLabel: t("updateChannel"),
              options: CHANNEL_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
              onPick: (value) => onChannel(value)
            }
          )
        ] }, "channel")
      },
      {
        section: "general",
        label: t("scGlobalSummon"),
        keywords: `${t("globalSummonDesc")} ${SUMMON_KEY_OPTIONS.map((o) => o.label).join(" ")}`,
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field-text", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "set-field-label", children: t("scGlobalSummon") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-desc", children: t("globalSummonDesc") })
          ] }),
          globalSummon && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dropdown,
            {
              className: "set-dd",
              value: globalSummonAccelerator,
              ariaLabel: t("scGlobalSummon"),
              options: SUMMON_KEY_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label
              })),
              onPick: onGlobalSummonAccelerator
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "set-switch",
              role: "switch",
              "aria-checked": globalSummon,
              "aria-label": t("scGlobalSummon"),
              onClick: () => onGlobalSummon(!globalSummon)
            }
          )
        ] }, "global-summon")
      },
      {
        section: "shortcuts",
        label: t("scGlobalSummon"),
        keywords: summonKeyLabel(globalSummonAccelerator),
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field set-shortcut-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "set-field-label", children: t("scGlobalSummon") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyCombo, { keys: summonKeyLabel(globalSummonAccelerator) })
        ] }, "sc-global-summon")
      },
      ...SHORTCUTS.map((shortcut) => ({
        section: "shortcuts",
        label: t(shortcut.labelKey),
        keywords: shortcut.keys,
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field set-shortcut-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "set-field-label", children: t(shortcut.labelKey) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyCombo, { keys: shortcut.keys })
        ] }, shortcut.labelKey)
      })),
      {
        section: "privacy",
        label: t("telemetryLabel"),
        keywords: t("telemetryDesc"),
        render: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-field-text", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "set-field-label", children: t("telemetryLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-desc", children: t("telemetryDesc") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "set-switch",
              role: "switch",
              "aria-checked": telemetry,
              "aria-label": t("telemetryLabel"),
              onClick: () => onTelemetry(!telemetry)
            }
          )
        ] }, "telemetry")
      }
    ],
    [t, lang, theme, channel, telemetry, globalSummon, globalSummonAccelerator, onLang, onTheme, onChannel, onTelemetry, onGlobalSummon, onGlobalSummonAccelerator]
  );
  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length > 0;
  const visible = searching ? {
    title: t("setSearchPlaceholder"),
    rows: fields.filter(
      (field) => `${field.label} ${"keywords" in field ? field.keywords : ""}`.toLowerCase().includes(trimmed)
    ).map((field) => field.render)
  } : {
    title: t(SECTIONS.find((entry) => entry.id === section).labelKey),
    rows: fields.filter((field) => field.section === section).map((field) => field.render)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "set-overlay",
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-dialog", role: "dialog", "aria-modal": "true", "aria-label": t("settings"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "set-title", children: t("settings") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "set-close", onClick: onClose, "aria-label": t("cancel"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M2 2l10 10M12 2L2 12",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round"
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "set-nav", "aria-label": t("settings"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-search", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "7", r: "4.6", stroke: "currentColor", strokeWidth: "1.4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m10.6 10.6 3 3", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "search",
                  value: query,
                  placeholder: t("setSearchPlaceholder"),
                  "aria-label": t("setSearchPlaceholder"),
                  onChange: (event) => setQuery(event.target.value)
                }
              )
            ] }),
            SECTIONS.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `set-nav-item${!searching && section === entry.id ? " active" : ""}`,
                "aria-current": !searching && section === entry.id,
                onClick: () => {
                  setQuery("");
                  setSection(entry.id);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionIcon, { id: entry.id }),
                  t(entry.labelKey)
                ]
              },
              entry.id
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "set-pane", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "set-pane-title", children: visible.title }),
            visible.rows.length > 0 ? visible.rows : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "set-field-desc", children: t("paletteEmpty") })
          ] })
        ] })
      ] })
    }
  );
}
const DISPLAY_LOCATION_ALIASES = {
  GenOffice: "BatiOffice"
};
function recentLocationLabel(path) {
  const parts = path.split(/[\\/]/).filter(Boolean);
  const parent = parts[parts.length - 2] ?? "";
  return DISPLAY_LOCATION_ALIASES[parent] ?? parent;
}
const PAGE_SIZE = 50;
const GREET_ASK_KEYS = [
  "greetAsk1",
  "greetAsk2",
  "greetAsk3",
  "greetAsk4",
  "greetAsk5",
  "greetAsk6"
];
const OPEN_LOCAL_EXTENSIONS = ".docx / .xlsx / .xlsm / .xls / .csv / .pptx / .pdf / .md / .hwp / .hwpx";
function formatModified(mtimeMs, i18n) {
  const date = new Date(mtimeMs);
  const now = /* @__PURE__ */ new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 864e5);
  if (days <= 0) {
    return `${i18n.t("today")} · ${date.toLocaleTimeString(i18n.dateLocale, { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (days === 1) return i18n.t("yesterday");
  return date.toLocaleDateString(i18n.dateLocale, { month: "short", day: "numeric" });
}
function formatSize(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
function fileName(path) {
  return path.split(/[\\/]/).pop() ?? path;
}
function baseName(entry) {
  return entry.ext ? entry.name.slice(0, -(entry.ext.length + 1)) : entry.name;
}
function hasProjectApi() {
  return typeof window.aiOfficeProject !== "undefined";
}
const FILTERS = [
  { key: "all", label: "filterAll" },
  { key: "hwp", text: "HWP" },
  { key: "docx", text: "Docs" },
  { key: "xlsx", text: "Sheets" },
  { key: "pptx", text: "Slides" },
  { key: "pdf", text: "PDF" },
  { key: "md", text: "Markdown" }
];
function ProjectPanel({ projects, selectedId, onSelect, onRefresh }) {
  const { t } = useI18n();
  const [creating, setCreating] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [projMenu, setProjMenu] = reactExports.useState(null);
  const [renaming, setRenaming] = reactExports.useState(null);
  const newInputRef = reactExports.useRef(null);
  const projMenuWrapRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (creating && newInputRef.current) newInputRef.current.focus();
  }, [creating]);
  useDismissablePopover(projMenu !== null, () => setProjMenu(null), {
    inside: () => [projMenuWrapRef.current]
  });
  reactExports.useEffect(() => {
    if (!projMenu) return;
    const close = () => setProjMenu(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [projMenu]);
  const commitCreate = async () => {
    const name = newName.trim();
    setCreating(false);
    setNewName("");
    if (!name) return;
    try {
      await window.aiOfficeProject?.createProject(name);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
      return;
    }
    onRefresh();
  };
  const commitRename = async () => {
    if (!renaming) return;
    const name = renaming.value.trim();
    const id = renaming.id;
    setRenaming(null);
    if (!name) return;
    try {
      await window.aiOfficeProject?.renameProject(id, name);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
      return;
    }
    onRefresh();
  };
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const doDelete = (id) => {
    setProjMenu(null);
    setConfirmDeleteId(id);
  };
  const confirmDeleteNow = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    if (!id) return;
    try {
      await window.aiOfficeProject?.deleteProject(id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
      return;
    }
    if (selectedId === id) onSelect(null);
    onRefresh();
  };
  reactExports.useEffect(() => {
    if (!confirmDeleteId) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setConfirmDeleteId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmDeleteId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proj-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proj-panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proj-panel-title", children: t("projects") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "proj-add-btn",
          title: t("newProject"),
          onClick: () => setCreating(true),
          "aria-label": t("newProject"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M7 1v12M1 7h12",
              stroke: "currentColor",
              strokeWidth: "1.7",
              strokeLinecap: "round"
            }
          ) })
        }
      )
    ] }),
    creating && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "proj-new-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: newInputRef,
        className: "proj-rename-input",
        placeholder: t("projectName"),
        value: newName,
        onChange: (e) => setNewName(e.target.value),
        onBlur: () => void commitCreate(),
        onKeyDown: (e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Enter") void commitCreate();
          if (e.key === "Escape") {
            setCreating(false);
            setNewName("");
          }
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "proj-list", children: projects.map((proj) => {
      const isActive = selectedId === proj.id;
      const isRenaming = renaming?.id === proj.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `proj-item${isActive ? " active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "proj-item-main",
            role: "button",
            tabIndex: 0,
            onClick: () => onSelect(isActive ? null : proj.id),
            onKeyDown: (e) => {
              if (e.key === "Enter") onSelect(isActive ? null : proj.id);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proj-item-icon", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M1.5 4A1.5 1.5 0 0 1 3 2.5h3.1c.44 0 .85.19 1.13.52L8.4 4.4H13A1.5 1.5 0 0 1 14.5 5.9v5.6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5V4z",
                  stroke: "currentColor",
                  strokeWidth: "1.2",
                  strokeLinejoin: "round"
                }
              ) }) }),
              isRenaming ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "proj-rename-input inline",
                  value: renaming.value,
                  autoFocus: true,
                  onFocus: (e) => e.target.select(),
                  onClick: (e) => e.stopPropagation(),
                  onChange: (e) => setRenaming({ id: proj.id, value: e.target.value }),
                  onBlur: () => void commitRename(),
                  onKeyDown: (e) => {
                    e.stopPropagation();
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") void commitRename();
                    if (e.key === "Escape") setRenaming(null);
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proj-item-name", children: proj.isDefault ? t("defaultProject") : proj.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proj-item-meta", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proj-item-count", children: proj.fileCount }) })
            ]
          }
        ),
        !proj.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "proj-menu-wrap",
            ref: projMenu?.id === proj.id ? projMenuWrapRef : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "proj-more-btn",
                  "aria-label": t("projMoreActions", { name: proj.name }),
                  "aria-expanded": projMenu?.id === proj.id,
                  onClick: (e) => {
                    e.stopPropagation();
                    if (projMenu?.id === proj.id) {
                      setProjMenu(null);
                      return;
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProjMenu({
                      id: proj.id,
                      top: rect.bottom + 4,
                      right: window.innerWidth - rect.right
                    });
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "3.2", cy: "8", r: "1.35", fill: "currentColor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "1.35", fill: "currentColor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12.8", cy: "8", r: "1.35", fill: "currentColor" })
                  ] })
                }
              ),
              projMenu?.id === proj.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "proj-menu",
                  role: "menu",
                  style: { top: projMenu.top, right: projMenu.right },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        role: "menuitem",
                        onClick: (e) => {
                          e.stopPropagation();
                          setProjMenu(null);
                          setRenaming({ id: proj.id, value: proj.name });
                        },
                        children: t("rename")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row-menu-divider" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        role: "menuitem",
                        className: "danger",
                        onClick: (e) => {
                          e.stopPropagation();
                          doDelete(proj.id);
                        },
                        children: t("deleteProject")
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ] }, proj.id);
    }) }),
    confirmDeleteId && (() => {
      const [confirmTitle, ...confirmBody] = t("deleteProjectConfirm").split("\n");
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: () => setConfirmDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": confirmTitle,
          onClick: (event) => event.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: confirmTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: confirmBody.join("\n") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-buttons", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn btn-secondary",
                  autoFocus: true,
                  onClick: () => setConfirmDeleteId(null),
                  children: t("cancel")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: () => void confirmDeleteNow(), children: t("delete") })
            ] })
          ]
        }
      ) });
    })()
  ] });
}
const LOGIN_POLL_MS = 2500;
async function batiAccountStatus(account, authenticated) {
  if (!authenticated) return { loggedIn: false };
  try {
    const profile = await account.profile();
    return {
      loggedIn: true,
      ...profile?.email ? { email: profile.email } : {},
      ...profile?.displayName ? { displayName: profile.displayName } : {}
    };
  } catch {
    return { loggedIn: true };
  }
}
function AccountEntry({
  onStatusChange
}) {
  const { lang, setLang, t } = useI18n();
  const [status, setStatus] = reactExports.useState(null);
  const [accountSource, setAccountSource] = reactExports.useState("detecting");
  reactExports.useEffect(() => {
    onStatusChange?.(status, accountSource);
  }, [status, accountSource, onStatusChange]);
  const [waiting, setWaiting] = reactExports.useState(false);
  const [loginNonce, setLoginNonce] = reactExports.useState(0);
  const [loginError, setLoginError] = reactExports.useState(null);
  const loginDeadline = reactExports.useRef(0);
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [langFly, setLangFly] = reactExports.useState(null);
  const langRowRef = reactExports.useRef(null);
  const langCloseTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    return window.aiOffice.onOpenSettings?.(() => {
      setMenuOpen(false);
      setSettingsOpen(true);
    });
  }, []);
  const [channel, setChannel] = reactExports.useState("stable");
  const [telemetry, setTelemetry] = reactExports.useState(true);
  reactExports.useEffect(() => {
    void window.aiOffice.getTelemetryEnabled().then(setTelemetry);
  }, []);
  const [globalSummon, setGlobalSummon] = reactExports.useState(true);
  const [globalSummonAccel, setGlobalSummonAccel] = reactExports.useState("CommandOrControl+Shift+B");
  reactExports.useEffect(() => {
    void window.aiOffice.getGlobalSummonEnabled().then(setGlobalSummon);
    void window.aiOffice.getGlobalSummonAccelerator().then(setGlobalSummonAccel);
  }, []);
  const [theme, setThemeState] = reactExports.useState("system");
  const [loggingOut, setLoggingOut] = reactExports.useState(false);
  const [appVersion, setAppVersion] = reactExports.useState("");
  const [updateReady, setUpdateReady] = reactExports.useState(null);
  const [creditBalance, setCreditBalance] = reactExports.useState(null);
  const [creditStatus, setCreditStatus] = reactExports.useState(
    "idle"
  );
  reactExports.useEffect(() => {
    let alive = true;
    const markBatiUnavailable = () => {
      if (!alive) return;
      setAccountSource("bati");
      setStatus({ loggedIn: false });
    };
    const batiAccount = window.batiofficeAccount;
    if (!batiAccount) {
      markBatiUnavailable();
    } else {
      void batiAccount.summary().then(async (summary) => {
        if (!alive) return;
        if (!summary.configured) {
          markBatiUnavailable();
          return;
        }
        setAccountSource("bati");
        const initialStatus = await batiAccountStatus(batiAccount, summary.authenticated);
        if (!alive) return;
        setStatus(initialStatus);
      }).catch(markBatiUnavailable);
    }
    void window.aiOffice.getAppVersion?.().then((v) => {
      if (alive && v) setAppVersion(v);
    });
    void window.aiOffice.getStagedUpdate?.().then((v) => {
      if (alive && v) setUpdateReady(v);
    });
    const offUpdateReady = window.aiOffice.onUpdateReady?.((v) => setUpdateReady(v));
    void window.aiOffice.getTheme?.().then((th) => {
      if (alive) setThemeState(th);
    });
    return () => {
      alive = false;
      offUpdateReady?.();
    };
  }, []);
  reactExports.useEffect(() => {
    if (accountSource !== "bati" || !window.batiofficeAccount) return;
    return window.batiofficeAccount.onChanged((summary) => {
      void batiAccountStatus(window.batiofficeAccount, summary.authenticated).then((next) => {
        setStatus(next);
        if (next.loggedIn) {
          setWaiting(false);
          setLoginError(null);
        } else {
          setCreditBalance(null);
          setCreditStatus("idle");
        }
      });
    });
  }, [accountSource]);
  const loadCreditBalance = reactExports.useCallback(async () => {
    if (!status?.loggedIn || accountSource !== "bati" || !window.batiofficeAccount) return;
    setCreditStatus("loading");
    try {
      const credits = await window.batiofficeAccount.credits();
      setCreditBalance(credits);
      setCreditStatus(credits ? "ready" : "unavailable");
    } catch {
      setCreditBalance(null);
      setCreditStatus("unavailable");
    }
  }, [accountSource, status?.loggedIn]);
  reactExports.useEffect(() => {
    if (menuOpen) void loadCreditBalance();
  }, [loadCreditBalance, menuOpen]);
  reactExports.useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => {
      const accountStatus = window.batiofficeAccount ? window.batiofficeAccount.summary().then((summary) => batiAccountStatus(window.batiofficeAccount, summary.authenticated)) : Promise.resolve({ loggedIn: false });
      void accountStatus.then((s) => {
        if (s.loggedIn) {
          setStatus(s);
          setWaiting(false);
        } else if (Date.now() > loginDeadline.current) {
          setWaiting(false);
          setLoginError("timeout");
        }
      }).catch(() => {
        if (Date.now() > loginDeadline.current) {
          setWaiting(false);
          setLoginError("network");
        }
      });
    }, LOGIN_POLL_MS);
    return () => clearInterval(timer);
  }, [waiting, loginNonce, accountSource]);
  reactExports.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const target = e.target;
      if (!target?.closest?.(".account-entry")) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [menuOpen]);
  const loggedIn = status?.loggedIn ?? false;
  const email = status?.email ?? "";
  const displayName = status?.displayName ?? "";
  const accountLabel = brand.companyName;
  const loginLabel = `${brand.companyName} ${t("login")}`;
  const initial = email ? email[0].toUpperCase() : displayName ? displayName[0].toUpperCase() : loggedIn ? "B" : "?";
  const errorText = loginError ? {
    timeout: t("loginTimeout"),
    launch: t("loginLaunchFailed"),
    network: t("loginNetworkError"),
    expired: t("loginExpired"),
    failed: t("loginFailed")
  }[loginError] : null;
  const closeMenu = () => {
    setMenuOpen(false);
    setLangFly(null);
  };
  const cancelLangFlyClose = () => {
    if (langCloseTimer.current !== null) {
      window.clearTimeout(langCloseTimer.current);
      langCloseTimer.current = null;
    }
  };
  const openLangFly = () => {
    cancelLangFlyClose();
    const rect = langRowRef.current?.getBoundingClientRect();
    if (rect) setLangFly({ left: rect.right - 2, bottom: window.innerHeight - rect.bottom });
  };
  const scheduleLangFlyClose = () => {
    cancelLangFlyClose();
    langCloseTimer.current = window.setTimeout(() => setLangFly(null), 200);
  };
  reactExports.useEffect(() => {
    if (!langFly) return;
    const close = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".lang-flyout")) return;
      setLangFly(null);
    };
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("scroll", close, true);
      cancelLangFlyClose();
    };
  }, [langFly]);
  const startLogin = () => {
    setLoginError(null);
    setWaiting(true);
    loginDeadline.current = Date.now() + 9e4;
    setLoginNonce((n) => n + 1);
    closeMenu();
    if (window.batiofficeAccount) {
      void window.batiofficeAccount.login().then(async (summary) => {
        setStatus(await batiAccountStatus(window.batiofficeAccount, summary.authenticated));
        if (summary.authenticated) setWaiting(false);
      }).catch(() => {
        setWaiting(false);
        setLoginError("launch");
      });
      return;
    }
    setWaiting(false);
    setLoginError("launch");
  };
  const handleClick = () => {
    const opening = !menuOpen;
    setMenuOpen(opening);
    if (opening) {
      void window.aiOffice.getUpdateChannel().then(setChannel);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "account-entry", children: [
    menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "account-menu", role: "menu", children: [
      loggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "account-menu-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "account-menu-email", title: email || displayName, children: email || displayName || t("loggedIn") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "account-menu-credit",
            "aria-label": lang === "ko" ? "크레딧" : "Credits",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "ko" ? "사용 가능 크레딧" : "Available credits" }),
              creditBalance && creditStatus !== "unavailable" ? /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: creditBalance.available.toLocaleString(lang === "ko" ? "ko-KR" : "en-US") }) : creditStatus === "unavailable" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "account-menu-credit-retry",
                  onClick: (event) => {
                    event.stopPropagation();
                    void loadCreditBalance();
                  },
                  children: lang === "ko" ? "다시 시도" : "Retry"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: lang === "ko" ? "불러오는 중…" : "Loading…" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "account-menu-item",
          role: "menuitem",
          onClick: startLogin,
          title: waiting ? t("waitingLogin") : void 0,
          children: waiting ? t("waitingShort") : loginLabel
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "account-menu-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "account-menu-item",
          role: "menuitem",
          onClick: () => {
            closeMenu();
            setSettingsOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "2.4", stroke: "currentColor", strokeWidth: "1.2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M8 1.6v1.9M8 12.5v1.9M1.6 8h1.9M12.5 8h1.9M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M3.5 12.5l1.3-1.3M11.2 4.8l1.3-1.3",
                  stroke: "currentColor",
                  strokeWidth: "1.2",
                  strokeLinecap: "round"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-label", children: t("settings") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "menu-row-keys", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "," })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "lang-row-wrap",
          ref: langRowRef,
          onMouseEnter: openLangFly,
          onMouseLeave: scheduleLangFlyClose,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "account-menu-item lang-row",
                role: "menuitem",
                "aria-haspopup": "menu",
                "aria-expanded": !!langFly,
                onClick: openLangFly,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "6.3", stroke: "currentColor", strokeWidth: "1.2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "8", cy: "8", rx: "2.8", ry: "6.3", stroke: "currentColor", strokeWidth: "1.1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 5.9h12M2 10.1h12", stroke: "currentColor", strokeWidth: "1.1" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-label", children: t("language") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-current", children: LANG_OPTIONS.find((opt) => opt.value === lang)?.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "lang-row-chevron",
                      width: "11",
                      height: "11",
                      viewBox: "0 0 12 12",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M4.5 2.5l4 3.5-4 3.5",
                          stroke: "currentColor",
                          strokeWidth: "1.3",
                          strokeLinecap: "round",
                          fill: "none"
                        }
                      )
                    }
                  )
                ]
              }
            ),
            langFly && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "lang-flyout",
                role: "menu",
                style: { left: langFly.left, bottom: langFly.bottom },
                children: LANG_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    role: "menuitemradio",
                    "aria-checked": lang === opt.value,
                    className: `lang-menu-item${lang === opt.value ? " active" : ""}`,
                    onClick: () => {
                      closeMenu();
                      if (lang !== opt.value) setLang(opt.value);
                    },
                    children: [
                      opt.label,
                      lang === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M2.5 6.2l2.4 2.4 4.6-5",
                          stroke: "currentColor",
                          strokeWidth: "1.5",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          fill: "none"
                        }
                      ) })
                    ]
                  },
                  opt.value
                ))
              }
            )
          ]
        }
      ),
      updateReady && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "account-menu-item update-ready-row",
          role: "menuitem",
          onClick: () => {
            void window.aiOffice.applyStagedUpdate?.();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M8 2.5v7M8 9.5l-3-3M8 9.5l3-3",
                  stroke: "currentColor",
                  strokeWidth: "1.4",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M3 11.5v1.2A1.3 1.3 0 0 0 4.3 14h7.4a1.3 1.3 0 0 0 1.3-1.3v-1.2",
                  stroke: "currentColor",
                  strokeWidth: "1.4",
                  strokeLinecap: "round"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-label", children: t("updateReadyRestart") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-current", children: updateReady })
          ]
        }
      ),
      appVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "account-menu-item",
          role: "menuitem",
          title: t("versionRowHint"),
          onClick: () => {
            closeMenu();
            void window.aiOffice.showChangelog();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "6.3", stroke: "currentColor", strokeWidth: "1.2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M8 7.4v3.4",
                  stroke: "currentColor",
                  strokeWidth: "1.2",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "5.1", r: "0.8", fill: "currentColor" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-label", children: t("versionLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lang-row-current", children: appVersion }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "lang-row-chevron",
                width: "11",
                height: "11",
                viewBox: "0 0 12 12",
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M4.5 2.5l4 3.5-4 3.5",
                    stroke: "currentColor",
                    strokeWidth: "1.4",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    fill: "none"
                  }
                )
              }
            )
          ]
        }
      ),
      loggedIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "account-menu-item danger",
          role: "menuitem",
          disabled: loggingOut,
          onClick: () => {
            setLoggingOut(true);
            const logout = window.batiofficeAccount ? window.batiofficeAccount.logout().then(() => void 0) : Promise.reject(new Error("Bati 계정 브리지를 사용할 수 없습니다."));
            void logout.then(() => {
              closeMenu();
              setStatus({ loggedIn: false });
            }).catch(() => setLoginError("network")).finally(() => setLoggingOut(false));
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M6.2 2H3.7A1.7 1.7 0 0 0 2 3.7v8.6A1.7 1.7 0 0 0 3.7 14h2.5",
                  stroke: "currentColor",
                  strokeWidth: "1.2",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M10.7 4.9 13.8 8l-3.1 3.1M13.4 8H6.4",
                  stroke: "currentColor",
                  strokeWidth: "1.2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: loggingOut ? t("loggingOut") : t("logout") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "account-btn",
        onClick: handleClick,
        "aria-expanded": menuOpen,
        title: loggedIn ? email || `${accountLabel} · ${t("loggedIn")}` : waiting ? t("waitingLogin") : errorText ?? loginLabel,
        "aria-label": loggedIn ? t("account") : t("login"),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `account-avatar${loggedIn ? " logged-in" : ""}${waiting ? " waiting" : ""}`,
              children: [
                updateReady && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "update-ready-dot", "aria-hidden": "true" }),
                waiting ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "svg",
                  {
                    className: "account-spinner",
                    width: "14",
                    height: "14",
                    viewBox: "0 0 16 16",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "8",
                        cy: "8",
                        r: "6",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        fill: "none",
                        strokeDasharray: "26",
                        strokeDashoffset: "18",
                        strokeLinecap: "round"
                      }
                    )
                  }
                ) : initial
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "account-text", children: loggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "account-name", children: email ? email.split("@")[0] : t("loggedIn") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "account-sub", title: email, children: email || accountLabel })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "account-name", children: waiting ? t("waitingShort") : t("login") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `account-sub${!waiting && errorText ? " error" : ""}`, children: !waiting && errorText ? errorText : brand.companyName })
          ] }) })
        ]
      }
    ),
    settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsModal,
      {
        lang,
        onLang: (next) => {
          if (lang !== next) setLang(next);
        },
        theme,
        onTheme: (next) => {
          if (theme === next) return;
          setThemeState(next);
          void window.aiOffice.setTheme(next);
          if (next === "light" || next === "dark") {
            document.documentElement.setAttribute("data-theme", next);
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        },
        channel,
        onChannel: (next) => {
          if (channel === next) return;
          setChannel(next);
          void window.aiOffice.setUpdateChannel(next);
        },
        telemetry,
        onTelemetry: (next) => {
          setTelemetry(next);
          void window.aiOffice.setTelemetryEnabled(next);
        },
        globalSummon,
        onGlobalSummon: (next) => {
          setGlobalSummon(next);
          void window.aiOffice.setGlobalSummonEnabled(next);
        },
        globalSummonAccelerator: globalSummonAccel,
        onGlobalSummonAccelerator: (next) => {
          setGlobalSummonAccel(next);
          void window.aiOffice.setGlobalSummonAccelerator(next);
        },
        onClose: () => setSettingsOpen(false)
      }
    )
  ] });
}
function Home() {
  const i18n = useI18n();
  const { t, lang } = i18n;
  const [entries, setEntries] = reactExports.useState([]);
  const [listTotal, setListTotal] = reactExports.useState(0);
  const [navCounts, setNavCounts] = reactExports.useState({ recent: 0, starred: 0 });
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [view, setView] = reactExports.useState("recent");
  const [batiWorkspaceAvailable, setBatiWorkspaceAvailable] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("all");
  const [rowMenu, setRowMenu] = reactExports.useState(null);
  const rowMenuWrapRef = reactExports.useRef(null);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [renaming, setRenaming] = reactExports.useState(null);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(null);
  const [accountName, setAccountName] = reactExports.useState("");
  const handleAccountStatus = reactExports.useCallback(
    (s, source) => {
      const authenticated = s?.loggedIn ?? false;
      setBatiWorkspaceAvailable(source === "bati");
      const name = authenticated ? (s?.email ?? "").split("@")[0] : "";
      setAccountName(name ? name[0].toUpperCase() + name.slice(1) : "");
    },
    []
  );
  const [greetAskKey] = reactExports.useState(
    () => GREET_ASK_KEYS[Math.floor(Math.random() * GREET_ASK_KEYS.length)]
  );
  const [projects, setProjects] = reactExports.useState([]);
  const [selectedProjectId, setSelectedProjectId] = reactExports.useState(null);
  const projectMode = hasProjectApi();
  const requestSeq = reactExports.useRef(0);
  const entriesLen = reactExports.useRef(0);
  entriesLen.current = entries.length;
  const reload = (keepCount) => {
    const seq = ++requestSeq.current;
    const ext = filter === "all" ? void 0 : filter;
    const limit = keepCount ? Math.max(entriesLen.current, PAGE_SIZE) : PAGE_SIZE;
    const primary = view === "recent" ? window.aiOffice.recents : window.aiOffice.starred;
    const secondary = view === "recent" ? window.aiOffice.starred : window.aiOffice.recents;
    void primary({ offset: 0, limit, ext }).then((page) => {
      if (seq !== requestSeq.current) return;
      setEntries(page.entries);
      setListTotal(page.total);
      setNavCounts(
        (prev) => view === "recent" ? { ...prev, recent: visiblePageCount(page) } : { ...prev, starred: visiblePageCount(page) }
      );
    });
    void secondary({ offset: 0, limit: 0, ext }).then((page) => {
      if (seq !== requestSeq.current) return;
      setNavCounts(
        (prev) => view === "recent" ? { ...prev, starred: visiblePageCount(page) } : { ...prev, recent: visiblePageCount(page) }
      );
    });
    if (projectMode) {
      void window.aiOfficeProject.listProjects().then(setProjects);
    }
  };
  const reloadRef = reactExports.useRef(reload);
  reloadRef.current = reload;
  const [projectTick, setProjectTick] = reactExports.useState(0);
  const refresh = () => {
    reloadRef.current(true);
    setProjectTick((n) => n + 1);
  };
  reactExports.useEffect(() => {
    reloadRef.current(false);
  }, [view, filter]);
  reactExports.useEffect(() => {
    const onFocus = () => {
      reloadRef.current(true);
      setProjectTick((n) => n + 1);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  const hasMore = entries.length < listTotal;
  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const seq = requestSeq.current;
    const ext = filter === "all" ? void 0 : filter;
    const api = view === "recent" ? window.aiOffice.recents : window.aiOffice.starred;
    void api({ offset: entriesLen.current, limit: PAGE_SIZE, ext }).then((page) => {
      setLoadingMore(false);
      if (seq !== requestSeq.current) return;
      setEntries((prev) => [...prev, ...page.entries]);
      setListTotal(page.total);
    });
  };
  const loadMoreRef = reactExports.useRef(loadMore);
  loadMoreRef.current = loadMore;
  const sentinelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) loadMoreRef.current();
      },
      { rootMargin: "240px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, entries.length]);
  useDismissablePopover(rowMenu !== null, () => setRowMenu(null), {
    inside: () => [rowMenuWrapRef.current]
  });
  reactExports.useEffect(() => {
    if (rowMenu === null && confirmDelete === null) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setRowMenu(null);
        setConfirmDelete(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rowMenu, confirmDelete]);
  const [projectFileEntries, setProjectFileEntries] = reactExports.useState([]);
  const [moveFileMenu, setMoveFileMenu] = reactExports.useState(null);
  const [moveMenuFlip, setMoveMenuFlip] = reactExports.useState(false);
  const moveMenuTimers = reactExports.useRef({
    open: null,
    close: null
  });
  const moveMenuWrapRef = reactExports.useRef(null);
  const openMoveMenu = (path) => {
    setMoveMenuFlip(false);
    setMoveFileMenu(path);
  };
  const measureSubmenu = (el) => {
    if (el && el.getBoundingClientRect().right > document.documentElement.clientWidth - 8) {
      setMoveMenuFlip(true);
    }
  };
  const clearMoveMenuTimer = (kind) => {
    const timers = moveMenuTimers.current;
    if (timers[kind] !== null) {
      window.clearTimeout(timers[kind]);
      timers[kind] = null;
    }
  };
  const [bulkMoveMenu, setBulkMoveMenu] = reactExports.useState(false);
  const bulkMoveWrapRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!projectMode || !selectedProjectId) {
      setProjectFileEntries([]);
      return;
    }
    let active = true;
    const api = window.aiOfficeProject;
    void api.listFiles(selectedProjectId).then(async (paths) => {
      const stats = await window.aiOffice.statPaths(paths);
      if (!active) return;
      setProjectFileEntries(stats.sort((a, b) => b.mtimeMs - a.mtimeMs));
    });
    return () => {
      active = false;
    };
  }, [projectMode, selectedProjectId, projectTick]);
  reactExports.useEffect(() => {
    if (rowMenu === null) {
      clearMoveMenuTimer("open");
      clearMoveMenuTimer("close");
      setMoveFileMenu(null);
    }
  }, [rowMenu]);
  useDismissablePopover(moveFileMenu !== null, () => setMoveFileMenu(null), {
    inside: () => [moveMenuWrapRef.current]
  });
  useDismissablePopover(bulkMoveMenu, () => setBulkMoveMenu(false), {
    inside: () => [bulkMoveWrapRef.current]
  });
  reactExports.useEffect(() => {
    if (!bulkMoveMenu) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setBulkMoveMenu(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bulkMoveMenu]);
  const selectedPaths = entries.filter((e) => selected.has(e.path)).map((e) => e.path);
  const allSelected = entries.length > 0 && selectedPaths.length === entries.length;
  const projSelectedPaths = projectFileEntries.filter((e) => selected.has(e.path)).map((e) => e.path);
  const projAllSelected = projectFileEntries.length > 0 && projSelectedPaths.length === projectFileEntries.length;
  const changeView = (next) => {
    setView(next);
    setSelected(/* @__PURE__ */ new Set());
    setRowMenu(null);
  };
  const changeFilter = (key) => {
    setFilter(key);
    setSelected(/* @__PURE__ */ new Set());
    setRowMenu(null);
  };
  const toggleSelect = (path, on) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(path);
      else next.delete(path);
      return next;
    });
  };
  const toggleSelectAll = () => {
    setSelected(allSelected ? /* @__PURE__ */ new Set() : new Set(entries.map((e) => e.path)));
  };
  const toggleSelectAllProject = () => {
    setSelected(projAllSelected ? /* @__PURE__ */ new Set() : new Set(projectFileEntries.map((e) => e.path)));
  };
  const toggleStar = (path) => {
    void window.aiOffice.toggleStar(path).then(refresh);
  };
  const removeRecent = (paths) => {
    setRowMenu(null);
    setSelected(/* @__PURE__ */ new Set());
    void window.aiOffice.removeRecent(paths).then(refresh);
  };
  const deleteFiles = (paths) => {
    setRowMenu(null);
    setConfirmDelete(paths);
  };
  const confirmDeleteNow = () => {
    const paths = confirmDelete ?? [];
    setConfirmDelete(null);
    setSelected(/* @__PURE__ */ new Set());
    void window.aiOffice.deleteFiles(paths).then(refresh);
  };
  const duplicateFile = (path) => {
    setRowMenu(null);
    void window.aiOffice.duplicateFile(path).then(refresh);
  };
  const startRename = (entry) => {
    setRowMenu(null);
    setRenaming({ path: entry.path, value: baseName(entry) });
  };
  const commitRename = (entry) => {
    const value = renaming?.value.trim() ?? "";
    setRenaming(null);
    if (!value || value === baseName(entry)) return;
    const newName = entry.ext ? `${value}.${entry.ext}` : value;
    void window.aiOffice.renameFile(entry.path, newName).then((result) => {
      if (!result.ok) window.alert(result.error ?? t("renameFailed"));
      refresh();
    });
  };
  const moveFileTo = async (filePath, targetProjectId) => {
    setMoveFileMenu(null);
    setRowMenu(null);
    try {
      await window.aiOfficeProject?.moveFile(filePath, targetProjectId);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
      return;
    }
    refresh();
    if (selectedProjectId) {
      setProjectFileEntries((prev) => prev.filter((e) => e.path !== filePath));
    }
  };
  const moveFilesTo = async (paths, targetProjectId) => {
    setBulkMoveMenu(false);
    setSelected(/* @__PURE__ */ new Set());
    const moved = new Set(paths);
    setProjectFileEntries((prev) => prev.filter((e) => !moved.has(e.path)));
    try {
      for (const path of paths) {
        await window.aiOfficeProject?.moveFile(path, targetProjectId);
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
    } finally {
      refresh();
    }
  };
  const handleNewDoc = () => {
    void window.aiOffice.newDoc(selectedProjectId ? { projectId: selectedProjectId } : void 0);
  };
  const handleNewSheet = () => {
    void window.aiOffice.newSheet(selectedProjectId ? { projectId: selectedProjectId } : void 0);
  };
  const handleNewSlide = () => {
    void window.aiOffice.newSlide(selectedProjectId ? { projectId: selectedProjectId } : void 0);
  };
  const handleNewMarkdown = () => {
    void window.aiOffice.newMarkdown(
      selectedProjectId ? { projectId: selectedProjectId } : void 0
    );
  };
  const handleNewHwp = () => {
    void window.aiOffice.newHwp(selectedProjectId ? { projectId: selectedProjectId } : void 0);
  };
  const handleNewPdf = () => {
    void window.aiOffice.newPdf(selectedProjectId ? { projectId: selectedProjectId } : void 0);
  };
  const NEW_ITEMS = [
    { ext: "hwp", title: "AI HWP", sub: ".hwp", action: handleNewHwp },
    { ext: "docx", title: t("newDoc"), sub: ".docx", action: handleNewDoc },
    { ext: "xlsx", title: t("newSheet"), sub: ".xlsx", action: handleNewSheet },
    { ext: "pptx", title: t("newSlide"), sub: ".pptx", action: handleNewSlide },
    { ext: "md", title: t("newMarkdown"), sub: ".md", action: handleNewMarkdown },
    { ext: "pdf", title: t("newPdf"), sub: ".pdf", action: handleNewPdf }
  ];
  const [showAllRecents, setShowAllRecents] = reactExports.useState(false);
  const [launcherQ, setLauncherQ] = reactExports.useState("");
  const [launcherSel, setLauncherSel] = reactExports.useState(0);
  const launcherRows = reactExports.useMemo(() => {
    const q = launcherQ.trim().toLowerCase();
    if (!q) return [];
    const rows = [];
    for (const item of NEW_ITEMS) {
      if (`${item.title} ${item.sub}`.toLowerCase().includes(q)) {
        rows.push({
          key: `new-${item.ext}`,
          ext: item.ext,
          label: item.title,
          detail: item.sub,
          run: () => void item.action()
        });
      }
    }
    for (const entry of entries) {
      if (rows.length >= 8) break;
      if (entry.name.toLowerCase().includes(q)) {
        rows.push({
          key: `open-${entry.path}`,
          ext: entry.ext,
          label: entry.name,
          detail: `.${entry.ext}`,
          run: () => void window.aiOffice.openPath(entry.path)
        });
      }
    }
    if (q.length >= 6 || q.includes(" ")) {
      const byIntent = /시트|표|엑셀|정산|데이터|계산|sheet|xlsx|excel/.test(q) ? ["xlsx", "docx", "pptx"] : /슬라이드|발표|피피티|프레젠|제안서|ppt|slide|deck/.test(q) ? ["pptx", "docx", "xlsx"] : ["docx", "xlsx", "pptx"];
      const aiLabels = { docx: "AI Docs", xlsx: "AI Sheets", pptx: "AI Slides" };
      for (const format2 of byIntent) {
        rows.push({
          key: `ai-${format2}`,
          ext: format2,
          label: `${aiLabels[format2]} — “${launcherQ.trim()}”`,
          run: () => void window.aiOffice.newWithAi(format2, launcherQ.trim())
        });
      }
    }
    if (batiWorkspaceAvailable) {
      rows.push({
        key: "ask-workspace",
        label: `${t("heroAskWorkspace")} — “${launcherQ.trim()}”`,
        run: () => void window.aiOfficeTabs.openWorkspace()
      });
    }
    return rows;
  }, [launcherQ, entries, batiWorkspaceAvailable, lang]);
  const runLauncherRow = (row) => {
    setLauncherQ("");
    setLauncherSel(0);
    row.run();
  };
  function renderQuickCards() {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quick-cards", children: [
      NEW_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "quick-card", onClick: () => void item.action(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: item.ext, size: 30 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "quick-text", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-title-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-title", children: item.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-sub", children: item.sub })
        ] })
      ] }, item.ext)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "quick-card",
          onClick: () => void window.aiOffice.browse(),
          "data-tip": OPEN_LOCAL_EXTENSIONS,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-folder", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M1.5 4A1.5 1.5 0 0 1 3 2.5h3.1c.44 0 .85.19 1.13.52L8.4 4.4H13A1.5 1.5 0 0 1 14.5 5.9v5.6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5V4z",
                stroke: "currentColor",
                strokeWidth: "1.3",
                strokeLinejoin: "round"
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "quick-text", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-title-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quick-title", children: t("openLocal") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "quick-sub",
                  title: ".docx · .xlsx · .xlsm · .xls · .csv · .pptx · .pdf · .md · .hwp · .hwpx",
                  children: t("openLocalSub")
                }
              )
            ] })
          ]
        }
      )
    ] });
  }
  function renderFileRow(entry, context) {
    const isRenaming = renaming?.path === entry.path;
    const otherProjects = projects.filter(
      (p) => p.id !== (context === "project" ? selectedProjectId : void 0)
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "recent-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "recent-item",
        role: "button",
        tabIndex: 0,
        onClick: () => {
          if (!isRenaming) void window.aiOffice.openPath(entry.path);
        },
        onKeyDown: (event) => {
          if (event.key === "Enter" && event.target === event.currentTarget) {
            void window.aiOffice.openPath(entry.path);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-check", onClick: (event) => event.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              className: "row-check",
              checked: selected.has(entry.path),
              onChange: (event) => toggleSelect(entry.path, event.target.checked),
              "aria-label": t("selectFile", { name: entry.name })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: entry.ext, size: 24 }) }),
          isRenaming ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "rename-input",
              value: renaming.value,
              autoFocus: true,
              onFocus: (event) => event.target.select(),
              onClick: (event) => event.stopPropagation(),
              onChange: (event) => setRenaming({ path: entry.path, value: event.target.value }),
              onBlur: () => commitRename(entry),
              onKeyDown: (event) => {
                event.stopPropagation();
                if (event.nativeEvent.isComposing) return;
                if (event.key === "Enter") commitRename(entry);
                if (event.key === "Escape") setRenaming(null);
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-name", children: entry.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-path", children: recentLocationLabel(entry.path) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-time", children: formatModified(entry.mtimeMs, i18n) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "recent-size", children: formatSize(entry.sizeBytes) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `star-btn${entry.starred ? " starred" : ""}`,
              "aria-label": entry.starred ? t("unstar") : t("star"),
              onClick: (event) => {
                event.stopPropagation();
                toggleStar(entry.path);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "15", height: "15", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M8 1.9l1.9 3.85 4.25.62-3.07 3 .72 4.23L8 11.6l-3.8 2 .72-4.23-3.07-3 4.25-.62z",
                  fill: entry.starred ? "#f5a623" : "none",
                  stroke: entry.starred ? "#f5a623" : "currentColor",
                  strokeWidth: "1.2",
                  strokeLinejoin: "round"
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "recent-actions",
              ref: rowMenu === entry.path ? rowMenuWrapRef : void 0,
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "more-btn",
                    "aria-label": t("moreActions"),
                    "aria-expanded": rowMenu === entry.path,
                    onClick: () => setRowMenu(rowMenu === entry.path ? null : entry.path),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "3.2", cy: "8", r: "1.4", fill: "currentColor" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "1.4", fill: "currentColor" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12.8", cy: "8", r: "1.4", fill: "currentColor" })
                    ] })
                  }
                ),
                rowMenu === entry.path && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row-menu", role: "menu", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      role: "menuitem",
                      onClick: () => {
                        setRowMenu(null);
                        void window.aiOffice.openPath(entry.path);
                      },
                      children: t("open")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      role: "menuitem",
                      onClick: () => {
                        setRowMenu(null);
                        void window.aiOffice.revealPath(entry.path);
                      },
                      children: t("revealInFolder")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      role: "menuitem",
                      onClick: () => {
                        setRowMenu(null);
                        void navigator.clipboard.writeText(entry.path);
                      },
                      children: t("copyPath")
                    }
                  ),
                  projectMode && otherProjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row-menu-divider" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "move-menu-wrap",
                        ref: moveFileMenu === entry.path ? moveMenuWrapRef : void 0,
                        onMouseEnter: () => {
                          clearMoveMenuTimer("close");
                          if (moveFileMenu === entry.path) return;
                          clearMoveMenuTimer("open");
                          moveMenuTimers.current.open = window.setTimeout(
                            () => openMoveMenu(entry.path),
                            160
                          );
                        },
                        onMouseLeave: () => {
                          clearMoveMenuTimer("open");
                          clearMoveMenuTimer("close");
                          moveMenuTimers.current.close = window.setTimeout(
                            () => setMoveFileMenu(null),
                            140
                          );
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              role: "menuitem",
                              className: "submenu-trigger",
                              onClick: (e) => {
                                e.stopPropagation();
                                clearMoveMenuTimer("open");
                                clearMoveMenuTimer("close");
                                if (moveFileMenu === entry.path) setMoveFileMenu(null);
                                else openMoveMenu(entry.path);
                              },
                              children: [
                                t("moveToProject"),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "svg",
                                  {
                                    width: "11",
                                    height: "11",
                                    viewBox: "0 0 12 12",
                                    "aria-hidden": "true",
                                    style: { marginLeft: "auto" },
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "path",
                                      {
                                        d: "M4.5 2.5l4 3.5-4 3.5",
                                        stroke: "currentColor",
                                        strokeWidth: "1.3",
                                        strokeLinecap: "round",
                                        fill: "none"
                                      }
                                    )
                                  }
                                )
                              ]
                            }
                          ),
                          moveFileMenu === entry.path && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: `submenu${moveMenuFlip ? " submenu-left" : ""}`,
                              role: "menu",
                              ref: measureSubmenu,
                              children: otherProjects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  role: "menuitem",
                                  onClick: () => void moveFileTo(entry.path, p.id),
                                  children: p.isDefault ? t("defaultProject") : p.name
                                },
                                p.id
                              ))
                            }
                          )
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row-menu-divider" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "menuitem", onClick: () => startRename(entry), children: t("rename") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "menuitem", onClick: () => duplicateFile(entry.path), children: t("duplicate") }),
                  context === "global" && selectedPaths.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row-menu-divider" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "menuitem", onClick: () => removeRecent([entry.path]), children: t("removeFromList") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        role: "menuitem",
                        className: "danger",
                        onClick: () => deleteFiles([entry.path]),
                        children: t("deleteFiles")
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    ) }, entry.path);
  }
  function renderProjectContent() {
    const proj = projects.find((p) => p.id === selectedProjectId);
    if (!proj) return null;
    const otherProjects = projects.filter((p) => p.id !== proj.id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "quick-start", "aria-label": t("secQuickStart"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-label", children: t("secQuickStart") }) }),
        renderQuickCards()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "recents", "aria-label": t("secProjectFiles"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recents-toolbar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recents-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-label", children: t("secProjectFiles") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "file-count", children: t(fileCountKey(projectFileEntries.length), { n: projectFileEntries.length }) })
          ] }),
          projSelectedPaths.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "selection-bar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "selection-count", children: t("selectedCount", { n: projSelectedPaths.length }) }),
            otherProjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "selection-move-wrap", ref: bulkMoveWrapRef, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "selection-action",
                  "aria-expanded": bulkMoveMenu,
                  onClick: () => setBulkMoveMenu((open) => !open),
                  children: t("moveToProject")
                }
              ),
              bulkMoveMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "selection-move-menu", role: "menu", children: otherProjects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  role: "menuitem",
                  onClick: () => void moveFilesTo(projSelectedPaths, p.id),
                  children: p.isDefault ? t("defaultProject") : p.name
                },
                p.id
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "selection-action danger",
                onClick: () => deleteFiles(projSelectedPaths),
                children: t("deleteFiles")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "selection-action", onClick: () => setSelected(/* @__PURE__ */ new Set()), children: t("cancel") })
          ] })
        ] }),
        projectFileEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "empty proj-empty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "proj-empty-icon",
              width: "48",
              height: "48",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M6.29297 3.75H14.1729C14.4927 3.75 14.7979 3.88392 15.0146 4.11914L18.5566 7.96387C18.7512 8.17512 18.8593 8.45208 18.8594 8.73926V19.1055C18.8593 19.7376 18.346 20.25 17.7139 20.25H6.29297C5.66091 20.2499 5.14855 19.7375 5.14844 19.1055V4.89453C5.14855 4.26247 5.66091 3.75011 6.29297 3.75Z",
                    stroke: "currentColor",
                    strokeWidth: "1.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M13.8984 4V7.11C13.8984 8.15382 14.7446 9 15.7884 9H18.8984",
                    stroke: "currentColor",
                    strokeWidth: "1.5"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-hint", children: t("projEmptyHint") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-columns", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-check", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: projAllSelected,
                onChange: toggleSelectAllProject,
                "aria-label": t("selectAll")
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-name", children: t("colName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("colLocation") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("colModified") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-size", children: t("colSize") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "recent-list", children: projectFileEntries.map((entry) => renderFileRow(entry, "project")) })
        ] })
      ] })
    ] });
  }
  function renderGlobalContent() {
    const now = /* @__PURE__ */ new Date();
    const hour = now.getHours();
    const greetKey = hour < 6 ? "greetEvening" : hour < 12 ? "greetMorning" : hour < 18 ? "greetAfternoon" : "greetEvening";
    const cjk = lang === "zh" || lang === "zh-TW" || lang === "ja";
    const greeting = `${t(greetKey)}${accountName ? (cjk ? "，" : ", ") + accountName : ""}${cjk ? "。" : ". "}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "quick-start", "aria-label": t("secQuickStart"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-hero", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "hero-title", children: [
            greeting,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hero-ask", children: t(greetAskKey) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-launcher-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-launcher", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "17", height: "17", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "7", r: "4.6", stroke: "currentColor", strokeWidth: "1.4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "m10.6 10.6 3 3",
                    stroke: "currentColor",
                    strokeWidth: "1.4",
                    strokeLinecap: "round"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: launcherQ,
                  placeholder: t("heroLauncherHint"),
                  "aria-label": t("heroLauncherHint"),
                  onChange: (event) => {
                    setLauncherQ(event.target.value);
                    setLauncherSel(0);
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Escape") {
                      setLauncherQ("");
                    } else if (event.key === "ArrowDown" && launcherRows.length) {
                      event.preventDefault();
                      setLauncherSel((value) => (value + 1) % launcherRows.length);
                    } else if (event.key === "ArrowUp" && launcherRows.length) {
                      event.preventDefault();
                      setLauncherSel(
                        (value) => (value - 1 + launcherRows.length) % launcherRows.length
                      );
                    } else if (event.key === "Enter" && launcherRows[launcherSel]) {
                      runLauncherRow(launcherRows[launcherSel]);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hero-kbd", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "K" })
              ] })
            ] }),
            launcherRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "launcher-results", role: "listbox", children: launcherRows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                role: "option",
                "aria-selected": index === launcherSel,
                className: `launcher-row${index === launcherSel ? " selected" : ""}`,
                onMouseMove: () => setLauncherSel(index),
                onClick: () => runLauncherRow(row),
                children: [
                  row.ext && /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: row.ext, size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "launcher-label", children: row.label }),
                  row.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "launcher-detail", children: row.detail })
                ]
              },
              row.key
            )) })
          ] })
        ] }),
        renderQuickCards()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "recents",
          "aria-label": view === "recent" ? t("secRecent") : t("secStarred"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recents-toolbar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recents-heading", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-label", children: view === "recent" ? t("secRecent") : t("secStarred") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "file-count", children: t(fileCountKey(listTotal), { n: listTotal }) })
              ] }),
              selectedPaths.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "selection-bar", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "selection-count", children: t("selectedCount", { n: selectedPaths.length }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "selection-action", onClick: () => removeRecent(selectedPaths), children: t("removeFromList") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "selection-action danger",
                    onClick: () => deleteFiles(selectedPaths),
                    children: t("deleteFiles")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "selection-action", onClick: () => setSelected(/* @__PURE__ */ new Set()), children: t("cancel") })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "filter-pills", role: "tablist", "aria-label": t("filterAria"), children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `filter-pill${filter === f.key ? " active" : ""}`,
                  onClick: () => changeFilter(f.key),
                  children: f.text ?? t(f.label)
                },
                f.key
              )) })
            ] }),
            entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "empty proj-empty", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  className: "proj-empty-icon",
                  width: "48",
                  height: "48",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M6.29297 3.75H14.1729C14.4927 3.75 14.7979 3.88392 15.0146 4.11914L18.5566 7.96387C18.7512 8.17512 18.8593 8.45208 18.8594 8.73926V19.1055C18.8593 19.7376 18.346 20.25 17.7139 20.25H6.29297C5.66091 20.2499 5.14855 19.7375 5.14844 19.1055V4.89453C5.14855 4.26247 5.66091 3.75011 6.29297 3.75Z",
                        stroke: "currentColor",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M13.8984 4V7.11C13.8984 8.15382 14.7446 9 15.7884 9H18.8984",
                        stroke: "currentColor",
                        strokeWidth: "1.5"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-hint", children: view === "starred" ? t("emptyStarred") : navCounts.recent === 0 ? t("emptyRecent") : t("emptyFiltered") })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `recent-table${selectedPaths.length > 0 ? " has-selection" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-columns", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-check", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: allSelected,
                    onChange: toggleSelectAll,
                    "aria-label": t("selectAll")
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-name", children: t("colName") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("colLocation") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("colModified") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-size", children: t("colSize") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "recent-list", children: [
                (showAllRecents ? entries : entries.slice(0, 8)).map(
                  (entry) => renderFileRow(entry, "global")
                ),
                !showAllRecents && entries.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "recent-more-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "recent-more", onClick: () => setShowAllRecents(true), children: t("showMoreFiles", { count: String(entries.length - 8) }) }) })
              ] }),
              hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "load-more", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "load-more-spinner" }) })
            ] })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sidebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-logo", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "logo-mark", src: batiMark, alt: "", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "logo-lockup", "aria-label": brand.productName, children: brand.productName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "sidebar-nav", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `nav-item${view === "recent" && !selectedProjectId ? " active" : ""}`,
            onClick: () => {
              changeView("recent");
              setSelectedProjectId(null);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "6.2", stroke: "currentColor", strokeWidth: "1.3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M8 4.8V8l2.2 1.6",
                    stroke: "currentColor",
                    strokeWidth: "1.3",
                    strokeLinecap: "round"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-label", children: t("navRecent") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-count", children: navCounts.recent })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `nav-item${view === "starred" && !selectedProjectId ? " active" : ""}`,
            onClick: () => {
              changeView("starred");
              setSelectedProjectId(null);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M8 1.9l1.9 3.85 4.25.62-3.07 3 .72 4.23L8 11.6l-3.8 2 .72-4.23-3.07-3 4.25-.62z",
                  stroke: "currentColor",
                  strokeWidth: "1.3",
                  strokeLinejoin: "round"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-label", children: t("navStarred") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-count", children: navCounts.starred })
            ]
          }
        ),
        batiWorkspaceAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "nav-item", onClick: () => void window.aiOfficeTabs.openWorkspace(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: batiMark, width: "16", height: "16", alt: "", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-label", children: "Bati Workspace" })
        ] })
      ] }),
      projectMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProjectPanel,
          {
            projects,
            selectedId: selectedProjectId,
            onSelect: (id) => {
              setSelectedProjectId(id);
              setSelected(/* @__PURE__ */ new Set());
              setRowMenu(null);
            },
            onRefresh: refresh
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccountEntry, { onStatusChange: handleAccountStatus })
    ] }),
    selectedProjectId ? renderProjectContent() : renderGlobalContent(),
    confirmDelete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: () => setConfirmDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("deleteModalTitle"),
        onClick: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t("deleteModalTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: confirmDelete.length === 1 ? t("deleteConfirmOne", { name: fileName(confirmDelete[0]) }) : t("deleteConfirmMany", { n: confirmDelete.length }) }),
          confirmDelete.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "modal-file-list", children: [
            confirmDelete.slice(0, 6).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: fileName(p) }, p)),
            confirmDelete.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("deleteMoreCount", { n: confirmDelete.length }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-buttons", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-secondary",
                autoFocus: true,
                onClick: () => setConfirmDelete(null),
                children: t("cancel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: confirmDeleteNow, children: t("delete") })
          ] })
        ]
      }
    ) })
  ] });
}
const SLIDES = [
  { titleKey: "onbTitle1", subtitleKey: "onbSubtitle1", bodyKey: "onbBody1", art: "logo" },
  {
    titleKey: "onbTitle3",
    subtitleKey: "onbBody3",
    showStar: true,
    art: "check"
  }
];
function SlideArt({ kind }) {
  if (kind === "logo") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "onb-art onb-art-logo", src: batiMark, alt: "" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "onb-art onb-art-badge onb-art-check", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 60 60", fill: "none", stroke: "currentColor", strokeWidth: "4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M29.9883 5.5C43.5194 5.5 54.4883 16.469 54.4883 30C54.4883 43.5311 43.5194 54.5 29.9883 54.5C16.4573 54.5 5.48828 43.5311 5.48828 30C5.48828 16.469 16.4573 5.5 29.9883 5.5Z",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M18.125 33.75L24.7764 40.4014C25.8727 41.4977 27.6924 41.342 28.5865 40.0753L41.875 21.25",
        strokeLinecap: "round"
      }
    )
  ] }) });
}
function Onboarding({ onDone }) {
  const { t } = useI18n();
  const [index, setIndex] = reactExports.useState(0);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const cardRef = reactExports.useRef(null);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const finish = () => {
    if (submitting) return;
    setSubmitting(true);
    void onDone().catch(() => false).finally(() => setSubmitting(false));
  };
  const next = () => {
    if (isLast) finish();
    else setIndex((current) => current + 1);
  };
  reactExports.useEffect(() => {
    cardRef.current?.focus();
  }, []);
  reactExports.useEffect(() => {
    const card = cardRef.current;
    const active = document.activeElement;
    if (card && (!(active instanceof HTMLElement) || !card.contains(active))) card.focus();
  }, [index]);
  reactExports.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        finish();
        return;
      }
      if (event.key === "Tab") {
        const card = cardRef.current;
        if (!card) return;
        const focusables = Array.from(card.querySelectorAll("button")).filter(
          (el) => !el.closest("[inert]")
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        const onButton = active instanceof HTMLElement && focusables.includes(active);
        if (!onButton) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      const buttonFocused = event.target instanceof HTMLElement && event.target.closest("button") !== null;
      if (event.key === "Enter" && !buttonFocused || event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onb-overlay", role: "dialog", "aria-modal": "true", "aria-label": t(slide.titleKey), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onb-card", ref: cardRef, tabIndex: -1, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onb-stage", children: SLIDES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `onb-slide${i === index ? " active" : ""}`,
        inert: i !== index,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlideArt, { kind: s.art }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "onb-title", children: t(s.titleKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "onb-subtitle", children: t(s.subtitleKey) }),
          s.bodyKey && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `onb-body${s.bodyDim ? " onb-body-dim" : ""}`, children: t(s.bodyKey) }),
          s.showStar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onb-star", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "onb-star-hint", children: t("onbAutomationHint") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "onb-star-btn",
                onClick: () => void window.aiOffice.openBatiSite(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      width: "13",
                      height: "13",
                      viewBox: "0 0 24 24",
                      fill: "currentColor",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" })
                    }
                  ),
                  t("seeMoreAutomation")
                ]
              }
            )
          ] })
        ]
      },
      s.titleKey
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onb-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onb-dots", children: SLIDES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `onb-dot${i === index ? " active" : ""}`,
          "aria-label": t("onbStepAria", { n: i + 1, total: SLIDES.length }),
          "aria-current": i === index,
          onClick: () => setIndex(i)
        },
        s.titleKey
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onb-nav", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "onb-skip", disabled: submitting, onClick: finish, children: t("onbSkip") }),
        index > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "onb-back",
            disabled: submitting,
            onClick: () => setIndex(index - 1),
            children: t("onbBack")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "onb-next", disabled: submitting, onClick: next, children: isLast ? t("onbStart") : t("onbNext") })
      ] })
    ] })
  ] }) });
}
const PERSONALIZED_MIN_OPENS = 5;
function SparkIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM18 15l.9 2.6L21.5 18.5l-2.6.9L18 22l-.9-2.6L14.5 18.5l2.6-.9L18 15z" }) });
}
function StarPromptCard({ docOpens, onClose }) {
  const { t } = useI18n();
  const react2 = (action) => {
    void window.aiOffice.starPromptAction(action).catch(() => {
    });
    onClose();
  };
  const title = docOpens >= PERSONALIZED_MIN_OPENS ? t("starPromptTitleN", { n: docOpens }) : t("starPromptTitle");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "star-prompt", role: "dialog", "aria-label": title, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "star-prompt-close",
        "aria-label": t("starPromptLater"),
        onClick: () => react2("later"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M2 2l8 8M10 2L2 10",
            stroke: "currentColor",
            strokeWidth: "1.4",
            strokeLinecap: "round"
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "star-prompt-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "star-prompt-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SparkIcon, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "star-prompt-title", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "star-prompt-body", children: t("starPromptBody") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "star-prompt-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "star-prompt-go",
          onClick: () => {
            void window.aiOffice.openBatiSite().catch(() => {
            });
            react2("starred");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SparkIcon, {}),
            t("starPromptGo")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "star-prompt-done", onClick: () => react2("starred"), children: t("starPromptDone") })
    ] })
  ] });
}
function HomeIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M9.06163 4.82633L3.23911 9.92134C2.7398 10.3583 3.07458 11.1343 3.76238 11.1343C4.18259 11.1343 4.52324 11.4489 4.52324 11.8371V15.0806C4.52324 17.871 4.52324 19.2662 5.46176 20.1331C6.40029 21 7.91082 21 10.9319 21H13.0681C16.0892 21 17.5997 21 18.5382 20.1331C19.4768 19.2662 19.4768 17.871 19.4768 15.0806V11.8371C19.4768 11.4489 19.8174 11.1343 20.2376 11.1343C20.9254 11.1343 21.2602 10.3583 20.7609 9.92134L14.9383 4.82633C13.5469 3.60878 12.8512 3 12 3C11.1488 3 10.4531 3.60878 9.06163 4.82633Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M12 16.0011H12.0105",
        stroke: "currentColor",
        strokeWidth: "2.57143",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}
function WorkspaceIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: batiMark, width: "16", height: "16", alt: "", "aria-hidden": "true" });
}
const KIND_ICON = {
  home: /* @__PURE__ */ jsxRuntimeExports.jsx(HomeIcon, {}),
  docs: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.docs, size: 16 }),
  sheets: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.sheets, size: 16 }),
  slides: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.slides, size: 16 }),
  pdf: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.pdf, size: 16 }),
  markdown: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.markdown, size: 16 }),
  hwp: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBadge, { ext: TAB_KIND_EXT.hwp, size: 16 }),
  workspace: /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceIcon, {})
};
function TabBar() {
  const { t } = useI18n();
  const [tabs, setTabs] = reactExports.useState([]);
  const stripRef = reactExports.useRef(null);
  const dragRef = reactExports.useRef(null);
  const [dragVisual, setDragVisual] = reactExports.useState(null);
  const finishDrag = (pointerId, commit) => {
    const drag = dragRef.current;
    if (!drag || pointerId !== drag.pointerId) return;
    dragRef.current = null;
    if (!drag.started) {
      stripRef.current?.querySelector(".tab-item.active")?.scrollIntoView({ inline: "nearest", block: "nearest" });
      return;
    }
    setDragVisual(null);
    if (commit && drag.target !== drag.from) {
      setTabs((prev) => {
        const fromIdx = prev.findIndex((tb) => tb.id === drag.id);
        if (fromIdx < 0) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(Math.min(Math.max(drag.target, 1), next.length), 0, moved);
        return next;
      });
      void window.aiOfficeTabs.reorder(drag.id, drag.target);
    }
  };
  reactExports.useEffect(() => {
    void window.aiOfficeTabs.list().then(setTabs);
    return window.aiOfficeTabs.onChanged(setTabs);
  }, []);
  reactExports.useEffect(() => {
    const notify = () => window.aiOfficeTabs.notifyChromePressed?.();
    document.addEventListener("pointerdown", notify, true);
    return () => document.removeEventListener("pointerdown", notify, true);
  }, []);
  reactExports.useEffect(() => {
    const drag = dragRef.current;
    if (drag && !tabs.some((t2) => t2.id === drag.id)) {
      dragRef.current = null;
      setDragVisual(null);
    }
  }, [tabs]);
  reactExports.useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onWheel = (event) => {
      if (strip.scrollWidth <= strip.clientWidth) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      strip.scrollLeft += event.deltaY;
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => strip.removeEventListener("wheel", onWheel);
  }, []);
  const activeId = tabs.find((tab) => tab.active)?.id;
  reactExports.useEffect(() => {
    if (dragRef.current) return;
    stripRef.current?.querySelector(".tab-item.active")?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [activeId]);
  const isMac = window.aiOfficeTabs.platform === "darwin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `tab-bar${isMac ? "" : " tab-bar-overlay-right"}`, children: [
    isMac ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab-bar-drag-spacer" }) : (
      // With the frame hidden the menu bar is auto-hidden as well, and Alt is
      // not something a user discovers. This is how File/Edit/Window/Help
      // stay reachable.
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "tab-app-menu-btn",
          title: t("tabAppMenu"),
          "aria-label": t("tabAppMenu"),
          onClick: (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            void window.aiOfficeTabs.showAppMenu(Math.round(rect.left), Math.round(rect.bottom));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "15", height: "15", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M2.5 4h11M2.5 8h11M2.5 12h11",
              stroke: "currentColor",
              strokeWidth: "1.4",
              strokeLinecap: "round"
            }
          ) })
        }
      )
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: dragVisual ? "tab-strip dragging" : "tab-strip", ref: stripRef, children: [
      tabs.map((tab, index) => {
        let dragStyle;
        if (dragVisual) {
          if (dragVisual.id === tab.id) {
            dragStyle = { transform: `translateX(${dragVisual.dx}px)` };
          } else if (dragVisual.target <= index && index < dragVisual.from) {
            dragStyle = { transform: `translateX(${dragVisual.width}px)` };
          } else if (dragVisual.from < index && index <= dragVisual.target) {
            dragStyle = { transform: `translateX(-${dragVisual.width}px)` };
          }
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `tab-item ${tab.kind === "home" ? "tab-home" : ""} ${tab.active ? "active" : ""} ${dragVisual?.id === tab.id ? "drag-source" : ""}`,
            style: dragStyle,
            onPointerDown: (event) => {
              if (event.button !== 0) return;
              if (event.target.closest(".tab-close")) return;
              if (!tab.active) void window.aiOfficeTabs.activate(tab.id);
              if (tab.id === "home") return;
              const strip = stripRef.current;
              if (!strip) return;
              const rects = Array.from(
                strip.querySelectorAll(".tab-item"),
                (el) => el.getBoundingClientRect()
              );
              dragRef.current = {
                pointerId: event.pointerId,
                id: tab.id,
                from: index,
                startX: event.clientX,
                lefts: rects.map((r) => r.left),
                widths: rects.map((r) => r.width),
                target: index,
                started: false
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            },
            onPointerMove: (event) => {
              const drag = dragRef.current;
              if (!drag || event.pointerId !== drag.pointerId) return;
              let dx = event.clientX - drag.startX;
              if (!drag.started) {
                if (Math.abs(dx) < 4) return;
                const strip = stripRef.current;
                if (strip) {
                  const rects = Array.from(
                    strip.querySelectorAll(".tab-item"),
                    (el) => el.getBoundingClientRect()
                  );
                  drag.lefts = rects.map((r) => r.left);
                  drag.widths = rects.map((r) => r.width);
                }
                drag.started = true;
              }
              const last = drag.lefts.length - 1;
              const minDx = drag.lefts[1] - drag.lefts[drag.from];
              const maxDx = drag.lefts[last] + drag.widths[last] - drag.widths[drag.from] - drag.lefts[drag.from];
              dx = Math.min(Math.max(dx, minDx), Math.max(minDx, maxDx));
              const draggedLeft = drag.lefts[drag.from] + dx;
              const draggedRight = draggedLeft + drag.widths[drag.from];
              let target = drag.from;
              for (let i = 1; i < drag.from; i++) {
                if (draggedLeft < drag.lefts[i] + drag.widths[i] / 2) {
                  target = i;
                  break;
                }
              }
              for (let i = last; i > drag.from; i--) {
                if (draggedRight > drag.lefts[i] + drag.widths[i] / 2) {
                  target = i;
                  break;
                }
              }
              drag.target = target;
              setDragVisual({
                id: drag.id,
                dx,
                from: drag.from,
                target,
                width: drag.widths[drag.from]
              });
            },
            onPointerUp: (event) => finishDrag(event.pointerId, true),
            onPointerCancel: (event) => finishDrag(event.pointerId, false),
            onLostPointerCapture: (event) => finishDrag(event.pointerId, false),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-plate", "aria-hidden": "true" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-icon", children: KIND_ICON[tab.kind] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-title", children: tab.title }),
              tab.closable && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "tab-close",
                  title: t("closeTab"),
                  "aria-label": t("closeTab"),
                  onClick: (event) => {
                    event.stopPropagation();
                    void window.aiOfficeTabs.close(tab.id);
                  },
                  children: "×"
                }
              )
            ]
          },
          tab.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "tab-new-btn",
          title: t("newTab"),
          "aria-label": t("newTab"),
          onClick: (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            void window.aiOfficeTabs.showNewMenu(Math.round(rect.left), Math.round(rect.bottom));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M12 4.286v15.429M4.286 12h15.429",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "tab-overflow-btn",
        title: t("tabList"),
        "aria-label": t("tabList"),
        onClick: (event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          void window.aiOfficeTabs.showMenu(Math.round(rect.left), Math.round(rect.bottom));
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4Z",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M11.5 9.5H22M11.5 9.5L9.5 4M17.5 9.5L15.5 4M2 19V8.5M22 19V8.5M4.5 20H19.5",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ] })
      }
    )
  ] });
}
function AppFrame({ initialOnboardingSeen }) {
  const [homeActive, setHomeActive] = reactExports.useState(true);
  const [loadingEditor, setLoadingEditor] = reactExports.useState(null);
  const [showOnboarding, setShowOnboarding] = reactExports.useState(!initialOnboardingSeen);
  const [starPromptDocOpens, setStarPromptDocOpens] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const applyTabs = (tabs) => {
      const active = tabs.find((tab) => tab.active);
      setHomeActive(!active || active.kind === "home");
      setLoadingEditor(active && active.kind !== "home" && active.loading ? active : null);
    };
    void window.aiOfficeTabs.list().then(applyTabs);
    return window.aiOfficeTabs.onChanged(applyTabs);
  }, []);
  reactExports.useEffect(() => {
    if (showOnboarding) return;
    let alive = true;
    void window.aiOffice.starPromptShouldShow?.().then((result) => {
      if (alive && result.show) setStarPromptDocOpens(result.docOpens);
    });
    return () => {
      alive = false;
    };
  }, [showOnboarding]);
  const finishOnboarding = async () => {
    try {
      const persisted = await window.aiOffice.setOnboardingSeen();
      if (!persisted) return false;
      setShowOnboarding(false);
      return true;
    } catch {
      return false;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-frame", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "app-frame-content", style: { visibility: homeActive ? "visible" : "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Home, {}) }),
    loadingEditor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editor-loading-surface", role: "status", "aria-live": "polite", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-loading-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `editor-loading-icon editor-loading-icon-${loadingEditor.kind}`, children: loadingEditor.kind === "docs" ? "W" : loadingEditor.kind === "sheets" ? "X" : loadingEditor.kind === "slides" ? "P" : loadingEditor.kind === "hwp" ? "H" : "B" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-loading-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: loadingEditor.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "편집기를 준비하는 중..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-loading-lines", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
      ] })
    ] }) }),
    showOnboarding && homeActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, { onDone: finishOnboarding }),
    starPromptDocOpens !== null && !showOnboarding && homeActive && /* @__PURE__ */ jsxRuntimeExports.jsx(StarPromptCard, { docOpens: starPromptDocOpens, onClose: () => setStarPromptDocOpens(null) })
  ] });
}
installScreenTips();
if (navigator.platform.toLowerCase().includes("mac")) document.body.classList.add("vib");
void Promise.all([
  window.aiOffice.getLanguage(),
  // if the flag is unreadable, skip onboarding rather than block the home screen
  window.aiOffice.onboardingSeen().catch(() => true),
  window.aiOffice.getTheme().catch(() => "system")
]).then(([lang, onboardingSeen, theme]) => {
  document.documentElement.lang = htmlLang(lang);
  if (theme !== "system") {
    document.documentElement.setAttribute("data-theme", theme);
  }
  window.aiOffice.onThemeChanged((next) => {
    if (next === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
  });
  clientExports.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocaleProvider, { initial: lang, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppFrame, { initialOnboardingSeen: onboardingSeen }) }) })
  );
});
