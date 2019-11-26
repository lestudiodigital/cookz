// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/ga.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function init(props) {
  console.log('ga init');
  return {};
}

var _default = init;
exports.default = _default;
},{}],"src/functional.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function init(props) {
  console.log('functionnal init');
}

var _default = init;
exports.default = _default;
},{}],"src/custom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function init(props) {
  console.log('custom init');
}

var _default = init;
exports.default = _default;
},{}],"src/state/Signal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function SignalListener(owner, fn, ctx, once) {
  this.fn = fn;
  this.ctx = ctx || null;
  this.owner = owner;
  this.once = !!once;
}

function removeNode(owner, node) {
  if (node.prev) node.prev.next = node.next;
  if (node.next) node.next.prev = node.prev;
  node.ctx = node.fn = node.owner = null;
  if (node === owner._first) owner._first = node.next;
  if (node === owner._last) owner._last = node.prev;
}
/**
 * Create a new Signal instance
 * @class
 * @constructor
 * @return {Signal} A new signal
 * @example
 * import { Signal } from '@internet/state'
 * const click = new Signal()
 * document.addEventListener('click', click.dispatch)
 *
 * class Component {
 *   constructor () {
 *     click.listen(this.onClick, this)
 *   }
 *
 *   onClick () {
 *     // `this` is the component instance
 *     console.log('clicked')
 *   }
 *
 *   dispose () {
 *     click.unlisten(this.onClick, this)
 *   }
 * }
 */


function Signal() {}
/**
 * Dispatches the signal to all listeners.
 * @method
 * @param {...*} [arguments] Arguments passed to each listeners (:warning: 5 maximum)
 */


Signal.prototype.dispatch = function (a0, a1, a2, a3, a4) {
  var node = this._first;

  while (node) {
    node.fn.call(node.ctx, a0, a1, a2, a3, a4);
    node.once && this.unlisten(node);
    node = node.next;
  }
};
/**
 * Register a new listener
 * @method
 * @param {Function} callback Callback function
 * @param {*} [context] The context to bind the callback to
 * @return {SignalListener} A SignalListener instance containing bindings to the signal.
 */


Signal.prototype.listen = function (fn, ctx, once) {
  var node = new SignalListener(this, fn, ctx, once);

  if (!this._first) {
    this._first = node;
    this._last = node;
  } else {
    this._last.next = node;
    node.prev = this._last;
    this._last = node;
  }

  return node;
};
/**
 * Register a new listener that will be executed only once.
 * @method
 * @param {Function} callback Callback function
 * @param {*} [context] The context to bind the callback to
 * @return {SignalListener} A SignalListener instance containing bindings to the signal.
 */


Signal.prototype.listenOnce = function (fn, ctx) {
  return this.listen(fn, ctx, true);
};
/**
 * Detach a listener from the signal
 * You can also pass
 * @method
 * @param {(Function|SignalListener)} callback The callback used when listening to the signal **OR** The SignalListener instance returned when listening the signal
 * @param {*} [context] The context used when listening to the signal (only when the 1st arg is a function)
 * @example
 * import { Signal } from '@internet/state'
 * const signal = new Signal()
 *
 * // Using the SignalListener binding (better performances)
 * const binding = signal.listen(() => {})
 * signal.unlisten(binding)
 *
 * // Using function
 * function listener () {}
 * signal.listen(listener)
 * signal.unlisten(listener)
 */


Signal.prototype.unlisten = function (fn, ctx) {
  if (fn instanceof SignalListener) return removeNode(this, fn);
  if (!ctx) ctx = null;
  var node = this._first;

  while (node) {
    if (node.fn === fn && node.ctx === ctx) removeNode(this, node);
    node = node.next;
  }
};
/**
 * Remove all listeners attached to the signal instance
 * @method
 */


Signal.prototype.unlistenAll = function () {
  var node = this._first;
  this._first = this._last = null;

  while (node) {
    removeNode(this, node);
    node = node.next;
  }
};

var _default = Signal;
exports.default = _default;
},{}],"src/state/createStore.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Signal = _interopRequireDefault(require("./Signal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * StoreSignal created by [createStore](#createStore).
 * Inherits from [Signal](#Signal) - See its API for `listen` / `unlisten` methods
 *
 * :warning: `dispatch()` method from Signal is removed and replaced by a `set()` method
 * @param {*} initialValue Initial value
 * @augments Signal
 * @return {StoreSignal} StoreSignal instance
 */
function StoreSignal(value) {
  this.current = value;
}

StoreSignal.prototype = Object.create(_Signal.default.prototype);
StoreSignal.prototype.constructor = StoreSignal;
StoreSignal.prototype.dispatch = undefined;
/**
 * Change the stored value. Dispatch to all listeners the new value
 * @method
 * @param {*} newValue New value to store
 * @param {boolean} [force=false] Nothing is distpatched if the value doesn't change. Set force to true to `force` the dispatch.
 * @return {SignalListener} A SignalListener instance containing bindings to the signal.
 */

StoreSignal.prototype.set = function (value, force) {
  if (!force && this.current === value) return;
  this.current = value;
  var node = this._first;

  while (node) {
    node.once && this.unlisten(node);
    node.fn.call(node.ctx, this.current);
    node = node.next;
  }
};
/**
 * Get current stored value
 * @method
 * @return {*} Current stored value
 */


StoreSignal.prototype.get = function (value) {
  return this.current;
};
/**
 * Create a new store containing [StoreSignal](#StoreSignal) instances
 * @param {Object} state Initial state
 * @return {Object} Frozen object containing [StoreSignal](#StoreSignal) instances
 * @example
 * import { createStore } from '@internet/state'
 * const store = createStore({
 *   value: 0
 * })
 *
 * store.value.listen(v => console.log(`value is now ${v}`))
 * store.value.set(3)
 */


function createStore(state) {
  var signals = {};

  for (var k in state) {
    signals[k] = new StoreSignal(state[k]);
  }

  signals = Object.freeze(signals);
  return signals;
}

var _default = createStore;
exports.default = _default;
},{"./Signal":"src/state/Signal.js"}],"src/state/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createStore", {
  enumerable: true,
  get: function () {
    return _createStore.default;
  }
});
Object.defineProperty(exports, "Signal", {
  enumerable: true,
  get: function () {
    return _Signal.default;
  }
});

var _createStore = _interopRequireDefault(require("./createStore"));

var _Signal = _interopRequireDefault(require("./Signal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./createStore":"src/state/createStore.js","./Signal":"src/state/Signal.js"}],"src/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = require("./state");

var _default = function _default(props) {
  return (0, _state.createStore)(props);
};

exports.default = _default;
},{"./state":"src/state/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.TYPES = exports.store = void 0;

var _ga = _interopRequireDefault(require("./src/ga.js"));

var _functional = _interopRequireDefault(require("./src/functional.js"));

var _custom = _interopRequireDefault(require("./src/custom.js"));

var _store = _interopRequireDefault(require("./src/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPES = {
  GA: 0,
  FUNCTIONAL: 1,
  CUSTOM: 2
};
exports.TYPES = TYPES;
var plugins = {};
var storeValues = {};
var store;
exports.store = store;

function init(params) {
  params.forEach(function (plugin) {
    if (plugin.type === TYPES.GA) {
      storeValues.performance = false;
      plugins.ga = (0, _ga.default)(plugin);
    } else if (plugin.type === TYPES.FUNCTIONAL) {
      storeValues.functional = false;
      plugins.func = (0, _functional.default)(plugin);
    } else if (plugin.type === TYPES.CUSTOM) {
      storeValues[plugin.name] = false;
      plugins[plugin.name] = (0, _custom.default)(plugin);
    }
  });
  exports.store = store = (0, _store.default)(storeValues);
  return {
    plugins: plugins,
    store: store
  };
}
},{"./src/ga.js":"src/ga.js","./src/functional.js":"src/functional.js","./src/custom.js":"src/custom.js","./src/store":"src/store.js"}],"test.js":[function(require,module,exports) {
"use strict";

var _index = require("./index");

var params = [{
  type: _index.TYPES.FUNCTIONAL
}, {
  type: _index.TYPES.GA,
  UA: 'IZDJID-ZA',
  anonymizeIp: true
}, {
  type: _index.TYPES.CUSTOM,
  name: 'test'
}];
(0, _index.init)(params);

_index.store.functional.listen(function (val) {
  return console.log(val);
});
},{"./index":"index.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50832" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","test.js"], null)
//# sourceMappingURL=/test.e98b79dd.js.map