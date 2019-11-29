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
})({"src/state/Signal.js":[function(require,module,exports) {
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
},{"./createStore":"src/state/createStore.js","./Signal":"src/state/Signal.js"}],"node_modules/browser-cookies/src/browser-cookies.js":[function(require,module,exports) {
exports.defaults = {};

exports.set = function(name, value, options) {
  // Retrieve options and defaults
  var opts = options || {};
  var defaults = exports.defaults;

  // Apply default value for unspecified options
  var expires  = opts.expires  || defaults.expires;
  var domain   = opts.domain   || defaults.domain;
  var path     = opts.path     !== undefined ? opts.path     : (defaults.path !== undefined ? defaults.path : '/');
  var secure   = opts.secure   !== undefined ? opts.secure   : defaults.secure;
  var httponly = opts.httponly !== undefined ? opts.httponly : defaults.httponly;
  var samesite = opts.samesite !== undefined ? opts.samesite : defaults.samesite;

  // Determine cookie expiration date
  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
  var expDate = expires ? new Date(
      // in case expires is an integer, it should specify the number of days till the cookie expires
      typeof expires === 'number' ? new Date().getTime() + (expires * 864e5) :
      // else expires should be either a Date object or in a format recognized by Date.parse()
      expires
  ) : 0;

  // Set cookie
  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
  .replace('(', '%28')
  .replace(')', '%29') +
  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
  (domain   ? ';domain=' + domain     : '') +                                      // Add domain
  (path     ? ';path='   + path       : '') +                                      // Add path
  (secure   ? ';secure'               : '') +                                      // Add secure option
  (httponly ? ';httponly'             : '') +                                      // Add httponly option
  (samesite ? ';samesite=' + samesite : '');                                       // Add samesite option
};

exports.get = function(name) {
  var cookies = document.cookie.split(';');
  
  // Iterate all cookies
  while(cookies.length) {
    var cookie = cookies.pop();

    // Determine separator index ("name=value")
    var separatorIndex = cookie.indexOf('=');

    // IE<11 emits the equal sign when the cookie value is empty
    separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;

    var cookie_name = decodeURIComponent(cookie.slice(0, separatorIndex).replace(/^\s+/, ''));

    // Return cookie value if the name matches
    if (cookie_name === name) {
      return decodeURIComponent(cookie.slice(separatorIndex + 1));
    }
  }

  // Return `null` as the cookie was not found
  return null;
};

exports.erase = function(name, options) {
  exports.set(name, '', {
    expires:  -1,
    domain:   options && options.domain,
    path:     options && options.path,
    secure:   0,
    httponly: 0}
  );
};

exports.all = function() {
  var all = {};
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  while(cookies.length) {
    var cookie = cookies.pop();

    // Determine separator index ("name=value")
    var separatorIndex = cookie.indexOf('=');

    // IE<11 emits the equal sign when the cookie value is empty
    separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;

    // add the cookie name and value to the `all` object
    var cookie_name = decodeURIComponent(cookie.slice(0, separatorIndex).replace(/^\s+/, ''));
    all[cookie_name] = decodeURIComponent(cookie.slice(separatorIndex + 1));
  }

  return all;
};

},{}],"src/cookie.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cookies = exports.CookieAbstraction = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var browserCookie;
if (typeof window !== 'undefined') browserCookie = require('browser-cookies');

var CookieAbstraction =
/*#__PURE__*/
function () {
  function CookieAbstraction(key) {
    _classCallCheck(this, CookieAbstraction);

    this.key = key;
  }

  _createClass(CookieAbstraction, [{
    key: "get",
    value: function get() {
      return browserCookie ? browserCookie.get(this.key) : false;
    }
  }, {
    key: "set",
    value: function set(val) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        expires: 365
      };
      browserCookie && browserCookie.set(this.key, val, opts);
    }
  }, {
    key: "erase",
    value: function erase() {
      browserCookie && browserCookie.erase(this.key);
    }
  }]);

  return CookieAbstraction;
}();

exports.CookieAbstraction = CookieAbstraction;
var cookies = {};
exports.cookies = cookies;
},{"browser-cookies":"node_modules/browser-cookies/src/browser-cookies.js"}],"src/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  popinStatus: false,
  bannerStatus: false
};
exports.default = _default;
},{}],"src/ga.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cookie = require("./cookie");

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_cookie.CookieAbstraction);

function getExpirationDate(ga) {
  var secExpire = 60 * 60 * 24 * 30 * 13 * 1000;

  try {
    var gaCreate = Number(ga.split('.').pop()) * 1000;
    var t = new Date().getTime();
    var t0 = new Date(gaCreate).getTime();
    var t1 = t0 + secExpire;
    var tDiff = Math.round((t1 - t) / 1000);
    return tDiff;
  } catch (e) {
    return secExpire / 1000;
  }
}

function appendScript(UA) {
  var libScript = document.createElement('script');
  var funcScript = document.createElement('script');
  libScript.setAttribute('async', 'true');
  libScript.setAttribute('src', "https://www.googletagmanager.com/gtag/js?id=".concat(UA));
  funcScript.setAttribute('type', 'text/javascript');
  funcScript.innerHTML = "\n    window.dataLayer = window.dataLayer || [];\n    function gtag () { dataLayer.push(arguments) };\n    window.gtag = gtag;\n  ";
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(libScript);
  body.appendChild(funcScript);
}

function start(props, cookie) {
  var UA = props.UA,
      _props$anonymizeIp = props.anonymizeIp,
      anonymizeIp = _props$anonymizeIp === void 0 ? true : _props$anonymizeIp,
      _props$forceSSL = props.forceSSL,
      forceSSL = _props$forceSSL === void 0 ? true : _props$forceSSL,
      _props$firstPageView = props.firstPageView,
      firstPageView = _props$firstPageView === void 0 ? false : _props$firstPageView;
  window.gtag('js', new Date());
  var params = {
    'cookie_expires': getExpirationDate(cookie),
    'anonymize_ip': anonymizeIp,
    'forceSSL': forceSSL,
    'send_page_view': firstPageView
  };
  window.gtag('config', "".concat(UA), params);
}

function trigger(func) {
  _store.default.functional.get() === true && func(window.gta);
}

function init(props) {
  var name = props.name,
      logs = props.logs;
  logs && console.log("[_ga] => INIT", props);
  appendScript(props.UA);
  var cookie = new _cookie.CookieAbstraction('_ga');
  start(props, cookie.get());
  return {
    cookie: cookie,
    trigger: trigger
  };
}

var _default = init;
exports.default = _default;
},{"./cookie":"src/cookie.js","./store":"src/store.js"}],"src/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  FUNCTIONAL: 'functional',
  PERFORMANCE: 'performance',
  SOCIAL: 'social'
};
exports.default = _default;
},{}],"../node_modules/crel/crel.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var crel = createCommonjsModule(function (module, exports) {
  /* Copyright (C) 2012 Kory Nunn
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  NOTE:
  This code is formatted for run-speed and to assist compilers.
  This might make it harder to read at times, but the code's intention should be transparent. */
  // IIFE our function
  (exporter => {
    // Define our function and its properties
    // These strings are used multiple times, so this makes things smaller once compiled
    const func = 'function',
          isNodeString = 'isNode',
          d = document,
          // Helper functions used throughout the script
    isType = (object, type) => typeof object === type,
          // Recursively appends children to given element. As a text node if not already an element
    appendChild = (element, child) => {
      if (child !== null) {
        if (Array.isArray(child)) {
          // Support (deeply) nested child elements
          child.map(subChild => appendChild(element, subChild));
        } else {
          if (!crel[isNodeString](child)) {
            child = d.createTextNode(child);
          }

          element.appendChild(child);
        }
      }
    }; //


    function crel(element, settings) {
      // Define all used variables / shortcuts here, to make things smaller once compiled
      let args = arguments,
          // Note: assigned to a variable to assist compilers.
      index = 1,
          key,
          attribute; // If first argument is an element, use it as is, otherwise treat it as a tagname

      element = crel.isElement(element) ? element : d.createElement(element); // Check if second argument is a settings object

      if (isType(settings, 'object') && !crel[isNodeString](settings) && !Array.isArray(settings)) {
        // Don't treat settings as a child
        index++; // Go through settings / attributes object, if it exists

        for (key in settings) {
          // Store the attribute into a variable, before we potentially modify the key
          attribute = settings[key]; // Get mapped key / function, if one exists

          key = crel.attrMap[key] || key; // Note: We want to prioritise mapping over properties

          if (isType(key, func)) {
            key(element, attribute);
          } else if (isType(attribute, func)) {
            // ex. onClick property
            element[key] = attribute;
          } else {
            // Set the element attribute
            element.setAttribute(key, attribute);
          }
        }
      } // Loop through all arguments, if any, and append them to our element if they're not `null`


      for (; index < args.length; index++) {
        appendChild(element, args[index]);
      }

      return element;
    } // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality


    crel.attrMap = {};

    crel.isElement = object => object instanceof Element;

    crel[isNodeString] = node => node instanceof Node; // Expose proxy interface


    crel.proxy = new Proxy(crel, {
      get: (target, key) => {
        !(key in crel) && (crel[key] = crel.bind(null, key));
        return crel[key];
      }
    }); // Export crel

    exporter(crel, func);
  })((product, func) => {
    {
      // Export for Browserify / CommonJS format
      module.exports = product;
    }
  });
});
var _default = crel;
exports.default = _default;
},{}],"../node_modules/jss/lib/utils/getDynamicStyles.js":[function(require,module,exports) {
'use strict';

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function (obj) { return typeof obj; }; } else { _typeof2 = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};
/**
 * Extracts a styles object with only props that contain function values.
 */


exports['default'] = function (styles) {
  // eslint-disable-next-line no-shadow
  function extract(styles) {
    var to = null;

    for (var key in styles) {
      var value = styles[key];
      var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

      if (type === 'function') {
        if (!to) to = {};
        to[key] = value;
      } else if (type === 'object' && value !== null && !Array.isArray(value)) {
        var extracted = extract(value);

        if (extracted) {
          if (!to) to = {};
          to[key] = extracted;
        }
      }
    }

    return to;
  }

  return extract(styles);
};
},{}],"../node_modules/jss/lib/utils/toCssValue.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCssValue;

var join = function join(value, by) {
  var result = '';

  for (var i = 0; i < value.length; i++) {
    // Remove !important from the value, it will be readded later.
    if (value[i] === '!important') break;
    if (result) result += by;
    result += value[i];
  }

  return result;
};
/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 * `color: ['red', !important]` > `color: red !important;`
 */


function toCssValue(value) {
  var ignoreImportant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!Array.isArray(value)) return value;
  var cssValue = ''; // Support space separated values via `[['5px', '10px']]`.

  if (Array.isArray(value[0])) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === '!important') break;
      if (cssValue) cssValue += ', ';
      cssValue += join(value[i], ' ');
    }
  } else cssValue = join(value, ', '); // Add !important, because it was ignored.


  if (!ignoreImportant && value[value.length - 1] === '!important') {
    cssValue += ' !important';
  }

  return cssValue;
}
},{}],"../node_modules/jss/lib/SheetsRegistry.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * Sheets registry to access them all at one place.
 */


var SheetsRegistry = function () {
  function SheetsRegistry() {
    _classCallCheck(this, SheetsRegistry);

    this.registry = [];
  }

  _createClass(SheetsRegistry, [{
    key: 'add',

    /**
     * Register a Style Sheet.
     */
    value: function add(sheet) {
      var registry = this.registry;
      var index = sheet.options.index;
      if (registry.indexOf(sheet) !== -1) return;

      if (registry.length === 0 || index >= this.index) {
        registry.push(sheet);
        return;
      } // Find a position.


      for (var i = 0; i < registry.length; i++) {
        if (registry[i].options.index > index) {
          registry.splice(i, 0, sheet);
          return;
        }
      }
    }
    /**
     * Reset the registry.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.registry = [];
    }
    /**
     * Remove a Style Sheet.
     */

  }, {
    key: 'remove',
    value: function remove(sheet) {
      var index = this.registry.indexOf(sheet);
      this.registry.splice(index, 1);
    }
    /**
     * Convert all attached sheets to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.registry.filter(function (sheet) {
        return sheet.attached;
      }).map(function (sheet) {
        return sheet.toString(options);
      }).join('\n');
    }
  }, {
    key: 'index',

    /**
     * Current highest index number.
     */
    get: function get() {
      return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
    }
  }]);

  return SheetsRegistry;
}();

exports['default'] = SheetsRegistry;
},{}],"../node_modules/warning/browser.js":[function(require,module,exports) {
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';
/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function () {};

if ("development" !== 'production') {
  warning = function (condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);

    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }

    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });

      if (typeof console !== 'undefined') {
        console.error(message);
      }

      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    }
  };
}

module.exports = warning;
},{}],"../node_modules/jss/lib/SheetsManager.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * SheetsManager is like a WeakMap which is designed to count StyleSheet
 * instances and attach/detach automatically.
 */


var SheetsManager = function () {
  function SheetsManager() {
    _classCallCheck(this, SheetsManager);

    this.sheets = [];
    this.refs = [];
    this.keys = [];
  }

  _createClass(SheetsManager, [{
    key: 'get',
    value: function get(key) {
      var index = this.keys.indexOf(key);
      return this.sheets[index];
    }
  }, {
    key: 'add',
    value: function add(key, sheet) {
      var sheets = this.sheets,
          refs = this.refs,
          keys = this.keys;
      var index = sheets.indexOf(sheet);
      if (index !== -1) return index;
      sheets.push(sheet);
      refs.push(0);
      keys.push(key);
      return sheets.length - 1;
    }
  }, {
    key: 'manage',
    value: function manage(key) {
      var index = this.keys.indexOf(key);
      var sheet = this.sheets[index];
      if (this.refs[index] === 0) sheet.attach();
      this.refs[index]++;
      if (!this.keys[index]) this.keys.splice(index, 0, key);
      return sheet;
    }
  }, {
    key: 'unmanage',
    value: function unmanage(key) {
      var index = this.keys.indexOf(key);

      if (index === -1) {
        // eslint-ignore-next-line no-console
        (0, _warning2['default'])(false, "SheetsManager: can't find sheet to unmanage");
        return;
      }

      if (this.refs[index] > 0) {
        this.refs[index]--;
        if (this.refs[index] === 0) this.sheets[index].detach();
      }
    }
  }, {
    key: 'size',
    get: function get() {
      return this.keys.length;
    }
  }]);

  return SheetsManager;
}();

exports['default'] = SheetsManager;
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/jss/lib/utils/toCss.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCss;

var _toCssValue = require('./toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}
/**
 * Indent a string.
 * http://jsperf.com/array-join-vs-for
 */


function indentStr(str, indent) {
  var result = '';

  for (var index = 0; index < indent; index++) {
    result += '  ';
  }

  return result + str;
}
/**
 * Converts a Rule to CSS string.
 */


function toCss(selector, style) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var result = '';
  if (!style) return result;
  var _options$indent = options.indent,
      indent = _options$indent === undefined ? 0 : _options$indent;
  var fallbacks = style.fallbacks;
  indent++; // Apply fallbacks first.

  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (var index = 0; index < fallbacks.length; index++) {
        var fallback = fallbacks[index];

        for (var prop in fallback) {
          var value = fallback[prop];

          if (value != null) {
            result += '\n' + indentStr(prop + ': ' + (0, _toCssValue2['default'])(value) + ';', indent);
          }
        }
      }
    } else {
      // Object syntax {fallbacks: {prop: value}}
      for (var _prop in fallbacks) {
        var _value = fallbacks[_prop];

        if (_value != null) {
          result += '\n' + indentStr(_prop + ': ' + (0, _toCssValue2['default'])(_value) + ';', indent);
        }
      }
    }
  }

  for (var _prop2 in style) {
    var _value2 = style[_prop2];

    if (_value2 != null && _prop2 !== 'fallbacks') {
      result += '\n' + indentStr(_prop2 + ': ' + (0, _toCssValue2['default'])(_value2) + ';', indent);
    }
  } // Allow empty style in this case, because properties will be added dynamically.


  if (!result && !options.allowEmpty) return result;
  indent--;
  result = indentStr(selector + ' {' + result + '\n', indent) + indentStr('}', indent);
  return result;
}
},{"./toCssValue":"../node_modules/jss/lib/utils/toCssValue.js"}],"../node_modules/jss/lib/rules/StyleRule.js":[function(require,module,exports) {
'use strict';

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function (obj) { return typeof obj; }; } else { _typeof2 = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

var _toCssValue = require('../utils/toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var StyleRule = function () {
  function StyleRule(key, style, options) {
    _classCallCheck(this, StyleRule);

    this.type = 'style';
    this.isProcessed = false;
    var sheet = options.sheet,
        Renderer = options.Renderer,
        selector = options.selector;
    this.key = key;
    this.options = options;
    this.style = style;
    if (selector) this.selectorText = selector;
    this.renderer = sheet ? sheet.renderer : new Renderer();
  }
  /**
   * Set selector string.
   * Attention: use this with caution. Most browsers didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */


  _createClass(StyleRule, [{
    key: 'prop',

    /**
     * Get or set a style property.
     */
    value: function prop(name, value) {
      // It's a getter.
      if (value === undefined) return this.style[name]; // Don't do anything if the value has not changed.

      if (this.style[name] === value) return this;
      value = this.options.jss.plugins.onChangeValue(value, name, this);
      var isEmpty = value == null || value === false;
      var isDefined = name in this.style; // Value is empty and wasn't defined before.

      if (isEmpty && !isDefined) return this; // We are going to remove this value.

      var remove = isEmpty && isDefined;
      if (remove) delete this.style[name];else this.style[name] = value; // Renderable is defined if StyleSheet option `link` is true.

      if (this.renderable) {
        if (remove) this.renderer.removeProperty(this.renderable, name);else this.renderer.setProperty(this.renderable, name, value);
        return this;
      }

      var sheet = this.options.sheet;

      if (sheet && sheet.attached) {
        (0, _warning2['default'])(false, 'Rule is not linked. Missing sheet option "link: true".');
      }

      return this;
    }
    /**
     * Apply rule to an element inline.
     */

  }, {
    key: 'applyTo',
    value: function applyTo(renderable) {
      var json = this.toJSON();

      for (var prop in json) {
        this.renderer.setProperty(renderable, prop, json[prop]);
      }

      return this;
    }
    /**
     * Returns JSON representation of the rule.
     * Fallbacks are not supported.
     * Useful for inline styles.
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {};

      for (var prop in this.style) {
        var value = this.style[prop];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') json[prop] = value;else if (Array.isArray(value)) json[prop] = (0, _toCssValue2['default'])(value);
      }

      return json;
    }
    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var sheet = this.options.sheet;
      var link = sheet ? sheet.options.link : false;
      var opts = link ? _extends({}, options, {
        allowEmpty: true
      }) : options;
      return (0, _toCss2['default'])(this.selector, this.style, opts);
    }
  }, {
    key: 'selector',
    set: function set(selector) {
      if (selector === this.selectorText) return;
      this.selectorText = selector;
      if (!this.renderable) return;
      var hasChanged = this.renderer.setSelector(this.renderable, selector); // If selector setter is not implemented, rerender the rule.

      if (!hasChanged && this.renderable) {
        var renderable = this.renderer.replaceRule(this.renderable, this);
        if (renderable) this.renderable = renderable;
      }
    }
    /**
     * Get selector string.
     */
    ,
    get: function get() {
      return this.selectorText;
    }
  }]);

  return StyleRule;
}();

exports['default'] = StyleRule;
},{"warning":"../node_modules/warning/browser.js","../utils/toCss":"../node_modules/jss/lib/utils/toCss.js","../utils/toCssValue":"../node_modules/jss/lib/utils/toCssValue.js"}],"../node_modules/symbol-observable/es/ponyfill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = symbolObservablePonyfill;

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}

;
},{}],"../node_modules/symbol-observable/es/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ponyfill = _interopRequireDefault(require("./ponyfill.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill.default)(root);
var _default = result;
exports.default = _default;
},{"./ponyfill.js":"../node_modules/symbol-observable/es/ponyfill.js"}],"../node_modules/jss/lib/utils/isObservable.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

exports['default'] = function (value) {
  return value && value[_symbolObservable2['default']] && value === value[_symbolObservable2['default']]();
};
},{"symbol-observable":"../node_modules/symbol-observable/es/index.js"}],"../node_modules/jss/lib/utils/cloneStyle.js":[function(require,module,exports) {
'use strict';

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function (obj) { return typeof obj; }; } else { _typeof2 = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports['default'] = cloneStyle;

var _isObservable = require('./isObservable');

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var isArray = Array.isArray;

function cloneStyle(style) {
  // Support empty values in case user ends up with them by accident.
  if (style == null) return style; // Support string value for SimpleRule.

  var typeOfStyle = typeof style === 'undefined' ? 'undefined' : _typeof(style);

  if (typeOfStyle === 'string' || typeOfStyle === 'number' || typeOfStyle === 'function') {
    return style;
  } // Support array for FontFaceRule.


  if (isArray(style)) return style.map(cloneStyle); // Support Observable styles.  Observables are immutable, so we don't need to
  // copy them.

  if ((0, _isObservable2['default'])(style)) return style;
  var newStyle = {};

  for (var name in style) {
    var value = style[name];

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newStyle[name] = cloneStyle(value);
      continue;
    }

    newStyle[name] = value;
  }

  return newStyle;
}
},{"./isObservable":"../node_modules/jss/lib/utils/isObservable.js"}],"../node_modules/jss/lib/utils/createRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = createRule;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _cloneStyle = require('../utils/cloneStyle');

var _cloneStyle2 = _interopRequireDefault(_cloneStyle);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}
/**
 * Create a rule instance.
 */


function createRule() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'unnamed';
  var decl = arguments[1];
  var options = arguments[2];
  var jss = options.jss;
  var declCopy = (0, _cloneStyle2['default'])(decl);
  var rule = jss.plugins.onCreateRule(name, declCopy, options);
  if (rule) return rule; // It is an at-rule and it has no instance.

  if (name[0] === '@') {
    (0, _warning2['default'])(false, '[JSS] Unknown at-rule %s', name);
  }

  return new _StyleRule2['default'](name, declCopy, options);
}
},{"warning":"../node_modules/warning/browser.js","../rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","../utils/cloneStyle":"../node_modules/jss/lib/utils/cloneStyle.js"}],"../node_modules/jss/lib/utils/linkRule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = linkRule;
/**
 * Link rule with CSSStyleRule and nested rules with corresponding nested cssRules if both exists.
 */

function linkRule(rule, cssRule) {
  rule.renderable = cssRule;
  if (rule.rules && cssRule.cssRules) rule.rules.link(cssRule.cssRules);
}
},{}],"../node_modules/jss/lib/utils/escape.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CSS = global.CSS;
var env = "development";
var escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g;

exports['default'] = function (str) {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str;

  if (!CSS || !CSS.escape) {
    return str.replace(escapeRegex, '\\$1');
  }

  return CSS.escape(str);
};
},{}],"../node_modules/jss/lib/RuleList.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _createRule = require('./utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

var _linkRule = require('./utils/linkRule');

var _linkRule2 = _interopRequireDefault(_linkRule);

var _StyleRule = require('./rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _escape = require('./utils/escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */


var RuleList = function () {
  // Original styles object.
  function RuleList(options) {
    _classCallCheck(this, RuleList);

    this.map = {};
    this.raw = {};
    this.index = [];
    this.options = options;
    this.classes = options.classes;
  }
  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */
  // Used to ensure correct rules order.
  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.


  _createClass(RuleList, [{
    key: 'add',
    value: function add(name, decl, options) {
      var _options = this.options,
          parent = _options.parent,
          sheet = _options.sheet,
          jss = _options.jss,
          Renderer = _options.Renderer,
          generateClassName = _options.generateClassName;
      options = _extends({
        classes: this.classes,
        parent: parent,
        sheet: sheet,
        jss: jss,
        Renderer: Renderer,
        generateClassName: generateClassName
      }, options);

      if (!options.selector && this.classes[name]) {
        options.selector = '.' + (0, _escape2['default'])(this.classes[name]);
      }

      this.raw[name] = decl;
      var rule = (0, _createRule2['default'])(name, decl, options);
      var className = void 0;

      if (!options.selector && rule instanceof _StyleRule2['default']) {
        className = generateClassName(rule, sheet);
        rule.selector = '.' + (0, _escape2['default'])(className);
      }

      this.register(rule, className);
      var index = options.index === undefined ? this.index.length : options.index;
      this.index.splice(index, 0, rule);
      return rule;
    }
    /**
     * Get a rule.
     */

  }, {
    key: 'get',
    value: function get(name) {
      return this.map[name];
    }
    /**
     * Delete a rule.
     */

  }, {
    key: 'remove',
    value: function remove(rule) {
      this.unregister(rule);
      this.index.splice(this.indexOf(rule), 1);
    }
    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.index.indexOf(rule);
    }
    /**
     * Run `onProcessRule()` plugins on every rule.
     */

  }, {
    key: 'process',
    value: function process() {
      var plugins = this.options.jss.plugins; // We need to clone array because if we modify the index somewhere else during a loop
      // we end up with very hard-to-track-down side effects.

      this.index.slice(0).forEach(plugins.onProcessRule, plugins);
    }
    /**
     * Register a rule in `.map` and `.classes` maps.
     */

  }, {
    key: 'register',
    value: function register(rule, className) {
      this.map[rule.key] = rule;

      if (rule instanceof _StyleRule2['default']) {
        this.map[rule.selector] = rule;
        if (className) this.classes[rule.key] = className;
      }
    }
    /**
     * Unregister a rule.
     */

  }, {
    key: 'unregister',
    value: function unregister(rule) {
      delete this.map[rule.key];

      if (rule instanceof _StyleRule2['default']) {
        delete this.map[rule.selector];
        delete this.classes[rule.key];
      }
    }
    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'update',
    value: function update(name, data) {
      var _options2 = this.options,
          plugins = _options2.jss.plugins,
          sheet = _options2.sheet;

      if (typeof name === 'string') {
        plugins.onUpdate(data, this.get(name), sheet);
        return;
      }

      for (var index = 0; index < this.index.length; index++) {
        plugins.onUpdate(name, this.index[index], sheet);
      }
    }
    /**
     * Link renderable rules with CSSRuleList.
     */

  }, {
    key: 'link',
    value: function link(cssRules) {
      var map = this.options.sheet.renderer.getUnescapedKeysMap(this.index);

      for (var i = 0; i < cssRules.length; i++) {
        var cssRule = cssRules[i];

        var _key = this.options.sheet.renderer.getKey(cssRule);

        if (map[_key]) _key = map[_key];
        var rule = this.map[_key];
        if (rule) (0, _linkRule2['default'])(rule, cssRule);
      }
    }
    /**
     * Convert rules to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var str = '';
      var sheet = this.options.sheet;
      var link = sheet ? sheet.options.link : false;

      for (var index = 0; index < this.index.length; index++) {
        var rule = this.index[index];
        var css = rule.toString(options); // No need to render an empty rule.

        if (!css && !link) continue;
        if (str) str += '\n';
        str += css;
      }

      return str;
    }
  }]);

  return RuleList;
}();

exports['default'] = RuleList;
},{"./utils/createRule":"../node_modules/jss/lib/utils/createRule.js","./utils/linkRule":"../node_modules/jss/lib/utils/linkRule.js","./rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","./utils/escape":"../node_modules/jss/lib/utils/escape.js"}],"../node_modules/jss/lib/sheets.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SheetsRegistry = require('./SheetsRegistry');

var _SheetsRegistry2 = _interopRequireDefault(_SheetsRegistry);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}
/**
 * This is a global sheets registry. Only DomRenderer will add sheets to it.
 * On the server one should use an own SheetsRegistry instance and add the
 * sheets to it, because you need to make sure to create a new registry for
 * each request in order to not leak sheets across requests.
 */


exports['default'] = new _SheetsRegistry2['default']();
},{"./SheetsRegistry":"../node_modules/jss/lib/SheetsRegistry.js"}],"../node_modules/jss/lib/StyleSheet.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _linkRule = require('./utils/linkRule');

var _linkRule2 = _interopRequireDefault(_linkRule);

var _RuleList = require('./RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var StyleSheet = function () {
  function StyleSheet(styles, options) {
    _classCallCheck(this, StyleSheet);

    this.attached = false;
    this.deployed = false;
    this.linked = false;
    this.classes = {};
    this.options = _extends({}, options, {
      sheet: this,
      parent: this,
      classes: this.classes
    });
    this.renderer = new options.Renderer(this);
    this.rules = new _RuleList2['default'](this.options);

    for (var name in styles) {
      this.rules.add(name, styles[name]);
    }

    this.rules.process();
  }
  /**
   * Attach renderable to the render tree.
   */


  _createClass(StyleSheet, [{
    key: 'attach',
    value: function attach() {
      if (this.attached) return this;
      if (!this.deployed) this.deploy();
      this.renderer.attach();
      if (!this.linked && this.options.link) this.link();
      this.attached = true;
      return this;
    }
    /**
     * Remove renderable from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached) return this;
      this.renderer.detach();
      this.attached = false;
      return this;
    }
    /**
     * Add a rule to the current stylesheet.
     * Will insert a rule also after the stylesheet has been rendered first time.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, decl, options) {
      var queue = this.queue; // Plugins can create rules.
      // In order to preserve the right order, we need to queue all `.addRule` calls,
      // which happen after the first `rules.add()` call.

      if (this.attached && !queue) this.queue = [];
      var rule = this.rules.add(name, decl, options);
      this.options.jss.plugins.onProcessRule(rule);

      if (this.attached) {
        if (!this.deployed) return rule; // Don't insert rule directly if there is no stringified version yet.
        // It will be inserted all together when .attach is called.

        if (queue) queue.push(rule);else {
          this.insertRule(rule);

          if (this.queue) {
            this.queue.forEach(this.insertRule, this);
            this.queue = undefined;
          }
        }
        return rule;
      } // We can't add rules to a detached style node.
      // We will redeploy the sheet once user will attach it.


      this.deployed = false;
      return rule;
    }
    /**
     * Insert rule into the StyleSheet
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule) {
      var renderable = this.renderer.insertRule(rule);
      if (renderable && this.options.link) (0, _linkRule2['default'])(rule, renderable);
    }
    /**
     * Create and add rules.
     * Will render also after Style Sheet was rendered the first time.
     */

  }, {
    key: 'addRules',
    value: function addRules(styles, options) {
      var added = [];

      for (var name in styles) {
        added.push(this.addRule(name, styles[name], options));
      }

      return added;
    }
    /**
     * Get a rule by name.
     */

  }, {
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }
    /**
     * Delete a rule by name.
     * Returns `true`: if rule has been deleted from the DOM.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(name) {
      var rule = this.rules.get(name);
      if (!rule) return false;
      this.rules.remove(rule);

      if (this.attached && rule.renderable) {
        return this.renderer.deleteRule(rule.renderable);
      }

      return true;
    }
    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }
    /**
     * Deploy pure CSS string to a renderable.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      this.renderer.deploy();
      this.deployed = true;
      return this;
    }
    /**
     * Link renderable CSS rules from sheet with their corresponding models.
     */

  }, {
    key: 'link',
    value: function link() {
      var cssRules = this.renderer.getRules(); // Is undefined when VirtualRenderer is used.

      if (cssRules) this.rules.link(cssRules);
      this.linked = true;
      return this;
    }
    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'update',
    value: function update(name, data) {
      this.rules.update(name, data);
      return this;
    }
    /**
     * Convert rules to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.rules.toString(options);
    }
  }]);

  return StyleSheet;
}();

exports['default'] = StyleSheet;
},{"./utils/linkRule":"../node_modules/jss/lib/utils/linkRule.js","./RuleList":"../node_modules/jss/lib/RuleList.js"}],"../node_modules/jss/lib/utils/moduleId.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ns = '2f1acc6c3a606b082e5eef5e54414ffb';
if (global[ns] == null) global[ns] = 0; // Bundle may contain multiple JSS versions at the same time. In order to identify
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.

exports['default'] = global[ns]++;
},{}],"../node_modules/jss/lib/utils/createGenerateClassName.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _StyleSheet = require('../StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _moduleId = require('./moduleId');

var _moduleId2 = _interopRequireDefault(_moduleId);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var maxRules = 1e10;
var env = "development";
/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */

exports['default'] = function () {
  var ruleCounter = 0;
  var defaultPrefix = env === 'production' ? 'c' : '';
  return function (rule, sheet) {
    ruleCounter += 1;

    if (ruleCounter > maxRules) {
      (0, _warning2['default'])(false, '[JSS] You might have a memory leak. Rule counter is at %s.', ruleCounter);
    }

    var prefix = defaultPrefix;
    var jssId = '';

    if (sheet) {
      prefix = sheet.options.classNamePrefix || defaultPrefix;
      if (sheet.options.jss.id != null) jssId += sheet.options.jss.id;
    }

    if (env === 'production') {
      return '' + prefix + _moduleId2['default'] + jssId + ruleCounter;
    }

    return prefix + rule.key + '-' + _moduleId2['default'] + (jssId && '-' + jssId) + '-' + ruleCounter;
  };
};
},{"warning":"../node_modules/warning/browser.js","../StyleSheet":"../node_modules/jss/lib/StyleSheet.js","./moduleId":"../node_modules/jss/lib/utils/moduleId.js"}],"../node_modules/is-in-browser/dist/module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isBrowser = void 0;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document.nodeType === 9;
exports.isBrowser = isBrowser;
var _default = isBrowser;
exports.default = _default;
},{}],"../node_modules/jss/lib/PluginsRegistry.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var PluginsRegistry = function () {
  function PluginsRegistry() {
    _classCallCheck(this, PluginsRegistry);

    this.hooks = {
      onCreateRule: [],
      onProcessRule: [],
      onProcessStyle: [],
      onProcessSheet: [],
      onChangeValue: [],
      onUpdate: []
      /**
       * Call `onCreateRule` hooks and return an object if returned by a hook.
       */

    };
  }

  _createClass(PluginsRegistry, [{
    key: 'onCreateRule',
    value: function onCreateRule(name, decl, options) {
      for (var i = 0; i < this.hooks.onCreateRule.length; i++) {
        var rule = this.hooks.onCreateRule[i](name, decl, options);
        if (rule) return rule;
      }

      return null;
    }
    /**
     * Call `onProcessRule` hooks.
     */

  }, {
    key: 'onProcessRule',
    value: function onProcessRule(rule) {
      if (rule.isProcessed) return;
      var sheet = rule.options.sheet;

      for (var i = 0; i < this.hooks.onProcessRule.length; i++) {
        this.hooks.onProcessRule[i](rule, sheet);
      } // $FlowFixMe


      if (rule.style) this.onProcessStyle(rule.style, rule, sheet);
      rule.isProcessed = true;
    }
    /**
     * Call `onProcessStyle` hooks.
     */

  }, {
    key: 'onProcessStyle',
    value: function onProcessStyle(style, rule, sheet) {
      var nextStyle = style;

      for (var i = 0; i < this.hooks.onProcessStyle.length; i++) {
        nextStyle = this.hooks.onProcessStyle[i](nextStyle, rule, sheet); // $FlowFixMe

        rule.style = nextStyle;
      }
    }
    /**
     * Call `onProcessSheet` hooks.
     */

  }, {
    key: 'onProcessSheet',
    value: function onProcessSheet(sheet) {
      for (var i = 0; i < this.hooks.onProcessSheet.length; i++) {
        this.hooks.onProcessSheet[i](sheet);
      }
    }
    /**
     * Call `onUpdate` hooks.
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(data, rule, sheet) {
      for (var i = 0; i < this.hooks.onUpdate.length; i++) {
        this.hooks.onUpdate[i](data, rule, sheet);
      }
    }
    /**
     * Call `onChangeValue` hooks.
     */

  }, {
    key: 'onChangeValue',
    value: function onChangeValue(value, prop, rule) {
      var processedValue = value;

      for (var i = 0; i < this.hooks.onChangeValue.length; i++) {
        processedValue = this.hooks.onChangeValue[i](processedValue, prop, rule);
      }

      return processedValue;
    }
    /**
     * Register a plugin.
     * If function is passed, it is a shortcut for `{onProcessRule}`.
     */

  }, {
    key: 'use',
    value: function use(plugin) {
      for (var name in plugin) {
        if (this.hooks[name]) this.hooks[name].push(plugin[name]);else (0, _warning2['default'])(false, '[JSS] Unknown hook "%s".', name);
      }
    }
  }]);

  return PluginsRegistry;
}();

exports['default'] = PluginsRegistry;
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/jss/lib/rules/SimpleRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var SimpleRule = function () {
  function SimpleRule(key, value, options) {
    _classCallCheck(this, SimpleRule);

    this.type = 'simple';
    this.isProcessed = false;
    this.key = key;
    this.value = value;
    this.options = options;
  }
  /**
   * Generates a CSS string.
   */
  // eslint-disable-next-line no-unused-vars


  _createClass(SimpleRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.value)) {
        var str = '';

        for (var index = 0; index < this.value.length; index++) {
          str += this.key + ' ' + this.value[index] + ';';
          if (this.value[index + 1]) str += '\n';
        }

        return str;
      }

      return this.key + ' ' + this.value + ';';
    }
  }]);

  return SimpleRule;
}();

exports['default'] = SimpleRule;
},{}],"../node_modules/jss/lib/rules/KeyframesRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * Rule for @keyframes
 */


var KeyframesRule = function () {
  function KeyframesRule(key, frames, options) {
    _classCallCheck(this, KeyframesRule);

    this.type = 'keyframes';
    this.isProcessed = false;
    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, {
      parent: this
    }));

    for (var name in frames) {
      this.rules.add(name, frames[name], _extends({}, this.options, {
        parent: this,
        selector: name
      }));
    }

    this.rules.process();
  }
  /**
   * Generates a CSS string.
   */


  _createClass(KeyframesRule, [{
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        indent: 1
      };
      var inner = this.rules.toString(options);
      if (inner) inner += '\n';
      return this.key + ' {\n' + inner + '}';
    }
  }]);

  return KeyframesRule;
}();

exports['default'] = KeyframesRule;
},{"../RuleList":"../node_modules/jss/lib/RuleList.js"}],"../node_modules/jss/lib/rules/ConditionalRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * Conditional rule for @media, @supports
 */


var ConditionalRule = function () {
  function ConditionalRule(key, styles, options) {
    _classCallCheck(this, ConditionalRule);

    this.type = 'conditional';
    this.isProcessed = false;
    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, {
      parent: this
    }));

    for (var name in styles) {
      this.rules.add(name, styles[name]);
    }

    this.rules.process();
  }
  /**
   * Get a rule.
   */


  _createClass(ConditionalRule, [{
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }
    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }
    /**
     * Create and register rule, run plugins.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style, options) {
      var rule = this.rules.add(name, style, options);
      this.options.jss.plugins.onProcessRule(rule);
      return rule;
    }
    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        indent: 1
      };
      var inner = this.rules.toString(options);
      return inner ? this.key + ' {\n' + inner + '\n}' : '';
    }
  }]);

  return ConditionalRule;
}();

exports['default'] = ConditionalRule;
},{"../RuleList":"../node_modules/jss/lib/RuleList.js"}],"../node_modules/jss/lib/rules/FontFaceRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var FontFaceRule = function () {
  function FontFaceRule(key, style, options) {
    _classCallCheck(this, FontFaceRule);

    this.type = 'font-face';
    this.isProcessed = false;
    this.key = key;
    this.style = style;
    this.options = options;
  }
  /**
   * Generates a CSS string.
   */


  _createClass(FontFaceRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.style)) {
        var str = '';

        for (var index = 0; index < this.style.length; index++) {
          str += (0, _toCss2['default'])(this.key, this.style[index]);
          if (this.style[index + 1]) str += '\n';
        }

        return str;
      }

      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return FontFaceRule;
}();

exports['default'] = FontFaceRule;
},{"../utils/toCss":"../node_modules/jss/lib/utils/toCss.js"}],"../node_modules/jss/lib/rules/ViewportRule.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _toCss = require('../utils/toCss');

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var ViewportRule = function () {
  function ViewportRule(key, style, options) {
    _classCallCheck(this, ViewportRule);

    this.type = 'viewport';
    this.isProcessed = false;
    this.key = key;
    this.style = style;
    this.options = options;
  }
  /**
   * Generates a CSS string.
   */


  _createClass(ViewportRule, [{
    key: 'toString',
    value: function toString(options) {
      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return ViewportRule;
}();

exports['default'] = ViewportRule;
},{"../utils/toCss":"../node_modules/jss/lib/utils/toCss.js"}],"../node_modules/jss/lib/plugins/rules.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleRule = require('../rules/SimpleRule');

var _SimpleRule2 = _interopRequireDefault(_SimpleRule);

var _KeyframesRule = require('../rules/KeyframesRule');

var _KeyframesRule2 = _interopRequireDefault(_KeyframesRule);

var _ConditionalRule = require('../rules/ConditionalRule');

var _ConditionalRule2 = _interopRequireDefault(_ConditionalRule);

var _FontFaceRule = require('../rules/FontFaceRule');

var _FontFaceRule2 = _interopRequireDefault(_FontFaceRule);

var _ViewportRule = require('../rules/ViewportRule');

var _ViewportRule2 = _interopRequireDefault(_ViewportRule);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

var classes = {
  '@charset': _SimpleRule2['default'],
  '@import': _SimpleRule2['default'],
  '@namespace': _SimpleRule2['default'],
  '@keyframes': _KeyframesRule2['default'],
  '@media': _ConditionalRule2['default'],
  '@supports': _ConditionalRule2['default'],
  '@font-face': _FontFaceRule2['default'],
  '@viewport': _ViewportRule2['default'],
  '@-ms-viewport': _ViewportRule2['default']
  /**
   * Generate plugins which will register all rules.
   */

};
exports['default'] = Object.keys(classes).map(function (key) {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  var re = new RegExp('^' + key);

  var onCreateRule = function onCreateRule(name, decl, options) {
    return re.test(name) ? new classes[key](name, decl, options) : null;
  };

  return {
    onCreateRule: onCreateRule
  };
});
},{"../rules/SimpleRule":"../node_modules/jss/lib/rules/SimpleRule.js","../rules/KeyframesRule":"../node_modules/jss/lib/rules/KeyframesRule.js","../rules/ConditionalRule":"../node_modules/jss/lib/rules/ConditionalRule.js","../rules/FontFaceRule":"../node_modules/jss/lib/rules/FontFaceRule.js","../rules/ViewportRule":"../node_modules/jss/lib/rules/ViewportRule.js"}],"../node_modules/jss/lib/plugins/observables.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createRule = require('../utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

var _isObservable = require('../utils/isObservable');

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (!(0, _isObservable2['default'])(decl)) return null; // Cast `decl` to `Observable`, since it passed the type guard.

    var style$ = decl;
    var rule = (0, _createRule2['default'])(name, {}, options); // TODO
    // Call `stream.subscribe()` returns a subscription, which should be explicitly
    // unsubscribed from when we know this sheet is no longer needed.

    style$.subscribe(function (style) {
      for (var prop in style) {
        rule.prop(prop, style[prop]);
      }
    });
    return rule;
  },
  onProcessRule: function onProcessRule(rule) {
    if (!(rule instanceof _StyleRule2['default'])) return;
    var styleRule = rule;
    var style = styleRule.style;

    var _loop = function _loop(prop) {
      var value = style[prop];
      if (!(0, _isObservable2['default'])(value)) return 'continue';
      delete style[prop];
      value.subscribe({
        next: function next(nextValue) {
          styleRule.prop(prop, nextValue);
        }
      });
    };

    for (var prop in style) {
      var _ret = _loop(prop);

      if (_ret === 'continue') continue;
    }
  }
};
},{"../rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","../utils/createRule":"../node_modules/jss/lib/utils/createRule.js","../utils/isObservable":"../node_modules/jss/lib/utils/isObservable.js"}],"../node_modules/jss/lib/plugins/functions.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RuleList = require('../RuleList');

var _RuleList2 = _interopRequireDefault(_RuleList);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createRule = require('../utils/createRule');

var _createRule2 = _interopRequireDefault(_createRule);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
} // A symbol replacement.


var now = Date.now();
var fnValuesNs = 'fnValues' + now;
var fnStyleNs = 'fnStyle' + ++now;
exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (typeof decl !== 'function') return null;
    var rule = (0, _createRule2['default'])(name, {}, options);
    rule[fnStyleNs] = decl;
    return rule;
  },
  onProcessStyle: function onProcessStyle(style, rule) {
    var fn = {};

    for (var prop in style) {
      var value = style[prop];
      if (typeof value !== 'function') continue;
      delete style[prop];
      fn[prop] = value;
    }

    rule = rule;
    rule[fnValuesNs] = fn;
    return style;
  },
  onUpdate: function onUpdate(data, rule) {
    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof _RuleList2['default']) {
      rule.rules.update(data);
      return;
    }

    if (!(rule instanceof _StyleRule2['default'])) return;
    rule = rule; // If we have a fn values map, it is a rule with function values.

    if (rule[fnValuesNs]) {
      for (var prop in rule[fnValuesNs]) {
        rule.prop(prop, rule[fnValuesNs][prop](data));
      }
    }

    rule = rule;
    var fnStyle = rule[fnStyleNs]; // If we have a style function, the entire rule is dynamic and style object
    // will be returned from that function.

    if (fnStyle) {
      var style = fnStyle(data);

      for (var _prop in style) {
        rule.prop(_prop, style[_prop]);
      }
    }
  }
};
},{"../RuleList":"../node_modules/jss/lib/RuleList.js","../rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","../utils/createRule":"../node_modules/jss/lib/utils/createRule.js"}],"../node_modules/jss/lib/renderers/DomRenderer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _sheets = require('../sheets');

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = require('../rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _toCssValue = require('../utils/toCssValue');

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * Cache the value from the first time a function is called.
 */


var memoize = function memoize(fn) {
  var value = void 0;
  return function () {
    if (!value) value = fn();
    return value;
  };
};
/**
 * Get a style property value.
 */


function getPropertyValue(cssRule, prop) {
  try {
    return cssRule.style.getPropertyValue(prop);
  } catch (err) {
    // IE may throw if property is unknown.
    return '';
  }
}
/**
 * Set a style property.
 */


function setProperty(cssRule, prop, value) {
  try {
    var cssValue = value;

    if (Array.isArray(value)) {
      cssValue = (0, _toCssValue2['default'])(value, true);

      if (value[value.length - 1] === '!important') {
        cssRule.style.setProperty(prop, cssValue, 'important');
        return true;
      }
    }

    cssRule.style.setProperty(prop, cssValue);
  } catch (err) {
    // IE may throw if property is unknown.
    return false;
  }

  return true;
}
/**
 * Remove a style property.
 */


function removeProperty(cssRule, prop) {
  try {
    cssRule.style.removeProperty(prop);
  } catch (err) {
    (0, _warning2['default'])(false, '[JSS] DOMException "%s" was thrown. Tried to remove property "%s".', err.message, prop);
  }
}

var CSSRuleTypes = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7
  /**
   * Get the CSS Rule key.
   */

};

var getKey = function () {
  var extractKey = function extractKey(cssText) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return cssText.substr(from, cssText.indexOf('{') - 1);
  };

  return function (cssRule) {
    if (cssRule.type === CSSRuleTypes.STYLE_RULE) return cssRule.selectorText;

    if (cssRule.type === CSSRuleTypes.KEYFRAMES_RULE) {
      var name = cssRule.name;
      if (name) return '@keyframes ' + name; // There is no rule.name in the following browsers:
      // - IE 9
      // - Safari 7.1.8
      // - Mobile Safari 9.0.0

      var cssText = cssRule.cssText;
      return '@' + extractKey(cssText, cssText.indexOf('keyframes'));
    } // Conditionals.


    return extractKey(cssRule.cssText);
  };
}();
/**
 * Set the selector.
 */


function setSelector(cssRule, selectorText) {
  cssRule.selectorText = selectorText; // Return false if setter was not successful.
  // Currently works in chrome only.

  return cssRule.selectorText === selectorText;
}
/**
 * Gets the `head` element upon the first call and caches it.
 */


var getHead = memoize(function () {
  return document.head || document.getElementsByTagName('head')[0];
});
/**
 * Gets a map of rule keys, where the property is an unescaped key and value
 * is a potentially escaped one.
 * It is used to identify CSS rules and the corresponding JSS rules. As an identifier
 * for CSSStyleRule we normally use `selectorText`. Though if original selector text
 * contains escaped code points e.g. `:not(#\\20)`, CSSOM will compile it to `:not(# )`
 * and so CSS rule's `selectorText` won't match JSS rule selector.
 *
 * https://www.w3.org/International/questions/qa-escapes#cssescapes
 */

var getUnescapedKeysMap = function () {
  var style = void 0;
  var isAttached = false;
  return function (rules) {
    var map = {}; // https://github.com/facebook/flow/issues/2696

    if (!style) style = document.createElement('style');

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (!(rule instanceof _StyleRule2['default'])) continue;
      var selector = rule.selector; // Only unescape selector over CSSOM if it contains a back slash.

      if (selector && selector.indexOf('\\') !== -1) {
        // Lazilly attach when needed.
        if (!isAttached) {
          getHead().appendChild(style);
          isAttached = true;
        }

        style.textContent = selector + ' {}';
        var _style = style,
            sheet = _style.sheet;

        if (sheet) {
          var cssRules = sheet.cssRules;
          if (cssRules) map[cssRules[0].selectorText] = rule.key;
        }
      }
    }

    if (isAttached) {
      getHead().removeChild(style);
      isAttached = false;
    }

    return map;
  };
}();
/**
 * Find attached sheet with an index higher than the passed one.
 */


function findHigherSheet(registry, options) {
  for (var i = 0; i < registry.length; i++) {
    var sheet = registry[i];

    if (sheet.attached && sheet.options.index > options.index && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }

  return null;
}
/**
 * Find attached sheet with the highest index.
 */


function findHighestSheet(registry, options) {
  for (var i = registry.length - 1; i >= 0; i--) {
    var sheet = registry[i];

    if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }

  return null;
}
/**
 * Find a comment with "jss" inside.
 */


function findCommentNode(text) {
  var head = getHead();

  for (var i = 0; i < head.childNodes.length; i++) {
    var node = head.childNodes[i];

    if (node.nodeType === 8 && node.nodeValue.trim() === text) {
      return node;
    }
  }

  return null;
}
/**
 * Find a node before which we can insert the sheet.
 */


function findPrevNode(options) {
  var registry = _sheets2['default'].registry;

  if (registry.length > 0) {
    // Try to insert before the next higher sheet.
    var sheet = findHigherSheet(registry, options);
    if (sheet) return sheet.renderer.element; // Otherwise insert after the last attached.

    sheet = findHighestSheet(registry, options);
    if (sheet) return sheet.renderer.element.nextElementSibling;
  } // Try to find a comment placeholder if registry is empty.


  var insertionPoint = options.insertionPoint;

  if (insertionPoint && typeof insertionPoint === 'string') {
    var comment = findCommentNode(insertionPoint);
    if (comment) return comment.nextSibling; // If user specifies an insertion point and it can't be found in the document -
    // bad specificity issues may appear.

    (0, _warning2['default'])(insertionPoint === 'jss', '[JSS] Insertion point "%s" not found.', insertionPoint);
  }

  return null;
}
/**
 * Insert style element into the DOM.
 */


function insertStyle(style, options) {
  var insertionPoint = options.insertionPoint;
  var prevNode = findPrevNode(options);

  if (prevNode) {
    var parentNode = prevNode.parentNode;
    if (parentNode) parentNode.insertBefore(style, prevNode);
    return;
  } // Works with iframes and any node types.


  if (insertionPoint && typeof insertionPoint.nodeType === 'number') {
    // https://stackoverflow.com/questions/41328728/force-casting-in-flow
    var insertionPointElement = insertionPoint;
    var _parentNode = insertionPointElement.parentNode;
    if (_parentNode) _parentNode.insertBefore(style, insertionPointElement.nextSibling);else (0, _warning2['default'])(false, '[JSS] Insertion point is not in the DOM.');
    return;
  }

  getHead().insertBefore(style, prevNode);
}
/**
 * Read jss nonce setting from the page if the user has set it.
 */


var getNonce = memoize(function () {
  var node = document.querySelector('meta[property="csp-nonce"]');
  return node ? node.getAttribute('content') : null;
});

var DomRenderer = function () {
  function DomRenderer(sheet) {
    _classCallCheck(this, DomRenderer);

    this.getPropertyValue = getPropertyValue;
    this.setProperty = setProperty;
    this.removeProperty = removeProperty;
    this.setSelector = setSelector;
    this.getKey = getKey;
    this.getUnescapedKeysMap = getUnescapedKeysMap;
    this.hasInsertedRules = false; // There is no sheet when the renderer is used from a standalone StyleRule.

    if (sheet) _sheets2['default'].add(sheet);
    this.sheet = sheet;

    var _ref = this.sheet ? this.sheet.options : {},
        media = _ref.media,
        meta = _ref.meta,
        element = _ref.element;

    this.element = element || document.createElement('style');
    this.element.type = 'text/css';
    this.element.setAttribute('data-jss', '');
    if (media) this.element.setAttribute('media', media);
    if (meta) this.element.setAttribute('data-meta', meta);
    var nonce = getNonce();
    if (nonce) this.element.setAttribute('nonce', nonce);
  }
  /**
   * Insert style element into render tree.
   */
  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696


  _createClass(DomRenderer, [{
    key: 'attach',
    value: function attach() {
      // In the case the element node is external and it is already in the DOM.
      if (this.element.parentNode || !this.sheet) return; // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
      // browsers remove those rules.
      // TODO figure out if its a bug and if it is known.
      // Workaround is to redeploy the sheet before attaching as a string.

      if (this.hasInsertedRules) {
        this.deploy();
        this.hasInsertedRules = false;
      }

      insertStyle(this.element, this.sheet.options);
    }
    /**
     * Remove style element from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.element.parentNode.removeChild(this.element);
    }
    /**
     * Inject CSS string into element.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      if (!this.sheet) return;
      this.element.textContent = '\n' + this.sheet.toString() + '\n';
    }
    /**
     * Insert a rule into element.
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule, index) {
      var sheet = this.element.sheet;
      var cssRules = sheet.cssRules;
      var str = rule.toString();
      if (!index) index = cssRules.length;
      if (!str) return false;

      try {
        sheet.insertRule(str, index);
      } catch (err) {
        (0, _warning2['default'])(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule);
        return false;
      }

      this.hasInsertedRules = true;
      return cssRules[index];
    }
    /**
     * Delete a rule.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(cssRule) {
      var sheet = this.element.sheet;
      var index = this.indexOf(cssRule);
      if (index === -1) return false;
      sheet.deleteRule(index);
      return true;
    }
    /**
     * Get index of a CSS Rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(cssRule) {
      var cssRules = this.element.sheet.cssRules;

      for (var _index = 0; _index < cssRules.length; _index++) {
        if (cssRule === cssRules[_index]) return _index;
      }

      return -1;
    }
    /**
     * Generate a new CSS rule and replace the existing one.
     */

  }, {
    key: 'replaceRule',
    value: function replaceRule(cssRule, rule) {
      var index = this.indexOf(cssRule);
      var newCssRule = this.insertRule(rule, index);
      this.element.sheet.deleteRule(index);
      return newCssRule;
    }
    /**
     * Get all rules elements.
     */

  }, {
    key: 'getRules',
    value: function getRules() {
      return this.element.sheet.cssRules;
    }
  }]);

  return DomRenderer;
}();

exports['default'] = DomRenderer;
},{"warning":"../node_modules/warning/browser.js","../sheets":"../node_modules/jss/lib/sheets.js","../rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","../utils/toCssValue":"../node_modules/jss/lib/utils/toCssValue.js"}],"../node_modules/jss/lib/renderers/VirtualRenderer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/* eslint-disable class-methods-use-this */

/**
 * Rendering backend to do nothing in nodejs.
 */


var VirtualRenderer = function () {
  function VirtualRenderer() {
    _classCallCheck(this, VirtualRenderer);
  }

  _createClass(VirtualRenderer, [{
    key: 'setProperty',
    value: function setProperty() {
      return true;
    }
  }, {
    key: 'getPropertyValue',
    value: function getPropertyValue() {
      return '';
    }
  }, {
    key: 'removeProperty',
    value: function removeProperty() {}
  }, {
    key: 'setSelector',
    value: function setSelector() {
      return true;
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return '';
    }
  }, {
    key: 'attach',
    value: function attach() {}
  }, {
    key: 'detach',
    value: function detach() {}
  }, {
    key: 'deploy',
    value: function deploy() {}
  }, {
    key: 'insertRule',
    value: function insertRule() {
      return false;
    }
  }, {
    key: 'deleteRule',
    value: function deleteRule() {
      return true;
    }
  }, {
    key: 'replaceRule',
    value: function replaceRule() {
      return false;
    }
  }, {
    key: 'getRules',
    value: function getRules() {}
  }, {
    key: 'indexOf',
    value: function indexOf() {
      return -1;
    }
  }]);

  return VirtualRenderer;
}();

exports['default'] = VirtualRenderer;
},{}],"../node_modules/jss/lib/Jss.js":[function(require,module,exports) {
'use strict';

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function (obj) { return typeof obj; }; } else { _typeof2 = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _PluginsRegistry = require('./PluginsRegistry');

var _PluginsRegistry2 = _interopRequireDefault(_PluginsRegistry);

var _rules = require('./plugins/rules');

var _rules2 = _interopRequireDefault(_rules);

var _observables = require('./plugins/observables');

var _observables2 = _interopRequireDefault(_observables);

var _functions = require('./plugins/functions');

var _functions2 = _interopRequireDefault(_functions);

var _sheets = require('./sheets');

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = require('./rules/StyleRule');

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createGenerateClassName = require('./utils/createGenerateClassName');

var _createGenerateClassName2 = _interopRequireDefault(_createGenerateClassName);

var _createRule2 = require('./utils/createRule');

var _createRule3 = _interopRequireDefault(_createRule2);

var _DomRenderer = require('./renderers/DomRenderer');

var _DomRenderer2 = _interopRequireDefault(_DomRenderer);

var _VirtualRenderer = require('./renderers/VirtualRenderer');

var _VirtualRenderer2 = _interopRequireDefault(_VirtualRenderer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var defaultPlugins = _rules2['default'].concat([_observables2['default'], _functions2['default']]);

var instanceCounter = 0;

var Jss = function () {
  function Jss(options) {
    _classCallCheck(this, Jss);

    this.id = instanceCounter++;
    this.version = "9.8.0";
    this.plugins = new _PluginsRegistry2['default']();
    this.options = {
      createGenerateClassName: _createGenerateClassName2['default'],
      Renderer: _isInBrowser2['default'] ? _DomRenderer2['default'] : _VirtualRenderer2['default'],
      plugins: []
    };
    this.generateClassName = (0, _createGenerateClassName2['default'])(); // eslint-disable-next-line prefer-spread

    this.use.apply(this, defaultPlugins);
    this.setup(options);
  }

  _createClass(Jss, [{
    key: 'setup',
    value: function setup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.createGenerateClassName) {
        this.options.createGenerateClassName = options.createGenerateClassName; // $FlowFixMe

        this.generateClassName = options.createGenerateClassName();
      }

      if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint;

      if (options.virtual || options.Renderer) {
        this.options.Renderer = options.Renderer || (options.virtual ? _VirtualRenderer2['default'] : _DomRenderer2['default']);
      } // eslint-disable-next-line prefer-spread


      if (options.plugins) this.use.apply(this, options.plugins);
      return this;
    }
    /**
     * Create a Style Sheet.
     */

  }, {
    key: 'createStyleSheet',
    value: function createStyleSheet(styles) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var index = options.index;

      if (typeof index !== 'number') {
        index = _sheets2['default'].index === 0 ? 0 : _sheets2['default'].index + 1;
      }

      var sheet = new _StyleSheet2['default'](styles, _extends({}, options, {
        jss: this,
        generateClassName: options.generateClassName || this.generateClassName,
        insertionPoint: this.options.insertionPoint,
        Renderer: this.options.Renderer,
        index: index
      }));
      this.plugins.onProcessSheet(sheet);
      return sheet;
    }
    /**
     * Detach the Style Sheet and remove it from the registry.
     */

  }, {
    key: 'removeStyleSheet',
    value: function removeStyleSheet(sheet) {
      sheet.detach();

      _sheets2['default'].remove(sheet);

      return this;
    }
    /**
     * Create a rule without a Style Sheet.
     */

  }, {
    key: 'createRule',
    value: function createRule(name) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}; // Enable rule without name for inline styles.

      if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
        options = style;
        style = name;
        name = undefined;
      } // Cast from RuleFactoryOptions to RuleOptions
      // https://stackoverflow.com/questions/41328728/force-casting-in-flow


      var ruleOptions = options;
      ruleOptions.jss = this;
      ruleOptions.Renderer = this.options.Renderer;
      if (!ruleOptions.generateClassName) ruleOptions.generateClassName = this.generateClassName;
      if (!ruleOptions.classes) ruleOptions.classes = {};
      var rule = (0, _createRule3['default'])(name, style, ruleOptions);

      if (!ruleOptions.selector && rule instanceof _StyleRule2['default']) {
        rule.selector = '.' + ruleOptions.generateClassName(rule);
      }

      this.plugins.onProcessRule(rule);
      return rule;
    }
    /**
     * Register plugin. Passed function will be invoked with a rule instance.
     */

  }, {
    key: 'use',
    value: function use() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      plugins.forEach(function (plugin) {
        // Avoids applying same plugin twice, at least based on ref.
        if (_this.options.plugins.indexOf(plugin) === -1) {
          _this.options.plugins.push(plugin);

          _this.plugins.use(plugin);
        }
      });
      return this;
    }
  }]);

  return Jss;
}();

exports['default'] = Jss;
},{"is-in-browser":"../node_modules/is-in-browser/dist/module.js","./StyleSheet":"../node_modules/jss/lib/StyleSheet.js","./PluginsRegistry":"../node_modules/jss/lib/PluginsRegistry.js","./plugins/rules":"../node_modules/jss/lib/plugins/rules.js","./plugins/observables":"../node_modules/jss/lib/plugins/observables.js","./plugins/functions":"../node_modules/jss/lib/plugins/functions.js","./sheets":"../node_modules/jss/lib/sheets.js","./rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js","./utils/createGenerateClassName":"../node_modules/jss/lib/utils/createGenerateClassName.js","./utils/createRule":"../node_modules/jss/lib/utils/createRule.js","./renderers/DomRenderer":"../node_modules/jss/lib/renderers/DomRenderer.js","./renderers/VirtualRenderer":"../node_modules/jss/lib/renderers/VirtualRenderer.js"}],"../node_modules/jss/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.createGenerateClassName = exports.sheets = exports.RuleList = exports.SheetsManager = exports.SheetsRegistry = exports.toCssValue = exports.getDynamicStyles = undefined;

var _getDynamicStyles = require('./utils/getDynamicStyles');

Object.defineProperty(exports, 'getDynamicStyles', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getDynamicStyles)['default'];
  }
});

var _toCssValue = require('./utils/toCssValue');

Object.defineProperty(exports, 'toCssValue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toCssValue)['default'];
  }
});

var _SheetsRegistry = require('./SheetsRegistry');

Object.defineProperty(exports, 'SheetsRegistry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsRegistry)['default'];
  }
});

var _SheetsManager = require('./SheetsManager');

Object.defineProperty(exports, 'SheetsManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsManager)['default'];
  }
});

var _RuleList = require('./RuleList');

Object.defineProperty(exports, 'RuleList', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RuleList)['default'];
  }
});

var _sheets = require('./sheets');

Object.defineProperty(exports, 'sheets', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sheets)['default'];
  }
});

var _createGenerateClassName = require('./utils/createGenerateClassName');

Object.defineProperty(exports, 'createGenerateClassName', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createGenerateClassName)['default'];
  }
});

var _Jss = require('./Jss');

var _Jss2 = _interopRequireDefault(_Jss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    'default': obj
  };
}
/**
 * Creates a new instance of Jss.
 */


var create = exports.create = function create(options) {
  return new _Jss2['default'](options);
};
/**
 * A global Jss instance.
 */


exports['default'] = create();
},{"./utils/getDynamicStyles":"../node_modules/jss/lib/utils/getDynamicStyles.js","./utils/toCssValue":"../node_modules/jss/lib/utils/toCssValue.js","./SheetsRegistry":"../node_modules/jss/lib/SheetsRegistry.js","./SheetsManager":"../node_modules/jss/lib/SheetsManager.js","./RuleList":"../node_modules/jss/lib/RuleList.js","./sheets":"../node_modules/jss/lib/sheets.js","./utils/createGenerateClassName":"../node_modules/jss/lib/utils/createGenerateClassName.js","./Jss":"../node_modules/jss/lib/Jss.js"}],"../node_modules/es6-weak-map/is-implemented.js":[function(require,module,exports) {
'use strict';

module.exports = function () {
	var weakMap, x;
	if (typeof WeakMap !== 'function') return false;
	try {
		// WebKit doesn't support arguments and crashes
		weakMap = new WeakMap([[x = {}, 'one'], [{}, 'two'], [{}, 'three']]);
	} catch (e) {
		return false;
	}
	if (String(weakMap) !== '[object WeakMap]') return false;
	if (typeof weakMap.set !== 'function') return false;
	if (weakMap.set({}, 1) !== weakMap) return false;
	if (typeof weakMap.delete !== 'function') return false;
	if (typeof weakMap.has !== 'function') return false;
	if (weakMap.get(x) !== 'one') return false;

	return true;
};

},{}],"../node_modules/es5-ext/global.js":[function(require,module,exports) {
var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Fallback to standard globalThis if available
	if (typeof globalThis === "object" && globalThis) return globalThis;

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of updates to Object.prototype being restricted
		// via preventExtensions, seal or freeze
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ works, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();

},{}],"../node_modules/es5-ext/object/set-prototype-of/is-implemented.js":[function(require,module,exports) {
"use strict";

var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

},{}],"../node_modules/es5-ext/function/noop.js":[function(require,module,exports) {
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],"../node_modules/es5-ext/object/is-value.js":[function(require,module,exports) {
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) { return val !== _undefined && val !== null; };

},{"../function/noop":"../node_modules/es5-ext/function/noop.js"}],"../node_modules/es5-ext/object/is-object.js":[function(require,module,exports) {
"use strict";

var isValue = require("./is-value");

var map = { function: true, object: true };

module.exports = function (value) { return (isValue(value) && map[typeof value]) || false; };

},{"./is-value":"../node_modules/es5-ext/object/is-value.js"}],"../node_modules/es5-ext/object/valid-value.js":[function(require,module,exports) {
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":"../node_modules/es5-ext/object/is-value.js"}],"../node_modules/es5-ext/object/create.js":[function(require,module,exports) {
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

"use strict";

var create = Object.create, shim;

if (!require("./set-prototype-of/is-implemented")()) {
	shim = require("./set-prototype-of/shim");
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = { configurable: false, enumerable: false, writable: true, value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
})();

},{"./set-prototype-of/is-implemented":"../node_modules/es5-ext/object/set-prototype-of/is-implemented.js","./set-prototype-of/shim":"../node_modules/es5-ext/object/set-prototype-of/shim.js"}],"../node_modules/es5-ext/object/set-prototype-of/shim.js":[function(require,module,exports) {
/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

"use strict";

var isObject         = require("../is-object")
  , value            = require("../valid-value")
  , objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty   = Object.defineProperty
  , nullDesc         = { configurable: true, enumerable: false, writable: true, value: undefined }
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
})(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
);

require("../create");

},{"../is-object":"../node_modules/es5-ext/object/is-object.js","../valid-value":"../node_modules/es5-ext/object/valid-value.js","../create":"../node_modules/es5-ext/object/create.js"}],"../node_modules/es5-ext/object/set-prototype-of/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Object.setPrototypeOf : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/object/set-prototype-of/is-implemented.js","./shim":"../node_modules/es5-ext/object/set-prototype-of/shim.js"}],"../node_modules/es5-ext/object/valid-object.js":[function(require,module,exports) {
"use strict";

var isObject = require("./is-object");

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};

},{"./is-object":"../node_modules/es5-ext/object/is-object.js"}],"../node_modules/es5-ext/string/random-uniq.js":[function(require,module,exports) {
"use strict";

var generated = Object.create(null), random = Math.random;

module.exports = function () {
	var str;
	do {
		str = random().toString(36).slice(2);
	} while (generated[str]);
	return str;
};

},{}],"../node_modules/type/value/is.js":[function(require,module,exports) {
"use strict";

// ES3 safe
var _undefined = void 0;

module.exports = function (value) { return value !== _undefined && value !== null; };

},{}],"../node_modules/type/object/is.js":[function(require,module,exports) {
"use strict";

var isValue = require("../value/is");

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

module.exports = function (value) {
	if (!isValue(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};

},{"../value/is":"../node_modules/type/value/is.js"}],"../node_modules/type/prototype/is.js":[function(require,module,exports) {
"use strict";

var isObject = require("../object/is");

module.exports = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};

},{"../object/is":"../node_modules/type/object/is.js"}],"../node_modules/type/function/is.js":[function(require,module,exports) {
"use strict";

var isPrototype = require("../prototype/is");

module.exports = function (value) {
	if (typeof value !== "function") return false;

	if (!hasOwnProperty.call(value, "length")) return false;

	try {
		if (typeof value.length !== "number") return false;
		if (typeof value.call !== "function") return false;
		if (typeof value.apply !== "function") return false;
	} catch (error) {
		return false;
	}

	return !isPrototype(value);
};

},{"../prototype/is":"../node_modules/type/prototype/is.js"}],"../node_modules/type/plain-function/is.js":[function(require,module,exports) {
"use strict";

var isFunction = require("../function/is");

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

module.exports = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};

},{"../function/is":"../node_modules/type/function/is.js"}],"../node_modules/es5-ext/object/assign/is-implemented.js":[function(require,module,exports) {
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};

},{}],"../node_modules/es5-ext/object/keys/is-implemented.js":[function(require,module,exports) {
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],"../node_modules/es5-ext/object/keys/shim.js":[function(require,module,exports) {
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":"../node_modules/es5-ext/object/is-value.js"}],"../node_modules/es5-ext/object/keys/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/object/keys/is-implemented.js","./shim":"../node_modules/es5-ext/object/keys/shim.js"}],"../node_modules/es5-ext/object/assign/shim.js":[function(require,module,exports) {
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":"../node_modules/es5-ext/object/keys/index.js","../valid-value":"../node_modules/es5-ext/object/valid-value.js"}],"../node_modules/es5-ext/object/assign/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Object.assign : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/object/assign/is-implemented.js","./shim":"../node_modules/es5-ext/object/assign/shim.js"}],"../node_modules/es5-ext/object/normalize-options.js":[function(require,module,exports) {

"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":"../node_modules/es5-ext/object/is-value.js"}],"../node_modules/es5-ext/string/#/contains/is-implemented.js":[function(require,module,exports) {
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};

},{}],"../node_modules/es5-ext/string/#/contains/shim.js":[function(require,module,exports) {
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],"../node_modules/es5-ext/string/#/contains/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? String.prototype.contains : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/string/#/contains/is-implemented.js","./shim":"../node_modules/es5-ext/string/#/contains/shim.js"}],"../node_modules/d/index.js":[function(require,module,exports) {
"use strict";

var isValue         = require("type/value/is")
  , isPlainFunction = require("type/plain-function/is")
  , assign          = require("es5-ext/object/assign")
  , normalizeOpts   = require("es5-ext/object/normalize-options")
  , contains        = require("es5-ext/string/#/contains");

var d = (module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== "string") {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
		w = contains.call(dscr, "w");
	} else {
		c = w = true;
		e = false;
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
});

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== "string") {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (!isValue(get)) {
		get = undefined;
	} else if (!isPlainFunction(get)) {
		options = get;
		get = set = undefined;
	} else if (!isValue(set)) {
		set = undefined;
	} else if (!isPlainFunction(set)) {
		options = set;
		set = undefined;
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
	} else {
		c = true;
		e = false;
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"type/value/is":"../node_modules/type/value/is.js","type/plain-function/is":"../node_modules/type/plain-function/is.js","es5-ext/object/assign":"../node_modules/es5-ext/object/assign/index.js","es5-ext/object/normalize-options":"../node_modules/es5-ext/object/normalize-options.js","es5-ext/string/#/contains":"../node_modules/es5-ext/string/#/contains/index.js"}],"../node_modules/es5-ext/function/is-arguments.js":[function(require,module,exports) {
"use strict";

var objToString = Object.prototype.toString
  , id = objToString.call((function () { return arguments; })());

module.exports = function (value) { return objToString.call(value) === id; };

},{}],"../node_modules/es5-ext/string/is-string.js":[function(require,module,exports) {
"use strict";

var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};

},{}],"../node_modules/ext/global-this/is-implemented.js":[function(require,module,exports) {
"use strict";

module.exports = function () {
	if (typeof globalThis !== "object") return false;
	if (!globalThis) return false;
	return globalThis.Array === Array;
};

},{}],"../node_modules/ext/global-this/implementation.js":[function(require,module,exports) {
var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of Object.prototype being sealed (via preventExtensions, seal or freeze)
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ is resolved with global context, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();

},{}],"../node_modules/ext/global-this/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? globalThis : require("./implementation");

},{"./is-implemented":"../node_modules/ext/global-this/is-implemented.js","./implementation":"../node_modules/ext/global-this/implementation.js"}],"../node_modules/es6-symbol/is-implemented.js":[function(require,module,exports) {

"use strict";

var global     = require("ext/global-this")
  , validTypes = { object: true, symbol: true };

module.exports = function () {
	var Symbol = global.Symbol;
	var symbol;
	if (typeof Symbol !== "function") return false;
	symbol = Symbol("test symbol");
	try { String(symbol); }
	catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{"ext/global-this":"../node_modules/ext/global-this/index.js"}],"../node_modules/es6-symbol/is-symbol.js":[function(require,module,exports) {
"use strict";

module.exports = function (value) {
	if (!value) return false;
	if (typeof value === "symbol") return true;
	if (!value.constructor) return false;
	if (value.constructor.name !== "Symbol") return false;
	return value[value.constructor.toStringTag] === "Symbol";
};

},{}],"../node_modules/es6-symbol/validate-symbol.js":[function(require,module,exports) {
"use strict";

var isSymbol = require("./is-symbol");

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":"../node_modules/es6-symbol/is-symbol.js"}],"../node_modules/es6-symbol/lib/private/generate-name.js":[function(require,module,exports) {
"use strict";

var d = require("d");

var create = Object.create, defineProperty = Object.defineProperty, objPrototype = Object.prototype;

var created = create(null);
module.exports = function (desc) {
	var postfix = 0, name, ie11BugWorkaround;
	while (created[desc + (postfix || "")]) ++postfix;
	desc += postfix || "";
	created[desc] = true;
	name = "@@" + desc;
	defineProperty(
		objPrototype,
		name,
		d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		})
	);
	return name;
};

},{"d":"../node_modules/d/index.js"}],"../node_modules/es6-symbol/lib/private/setup/standard-symbols.js":[function(require,module,exports) {
"use strict";

var d            = require("d")
  , NativeSymbol = require("ext/global-this").Symbol;

module.exports = function (SymbolPolyfill) {
	return Object.defineProperties(SymbolPolyfill, {
		// To ensure proper interoperability with other native functions (e.g. Array.from)
		// fallback to eventual native implementation of given symbol
		hasInstance: d(
			"", (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill("hasInstance")
		),
		isConcatSpreadable: d(
			"",
			(NativeSymbol && NativeSymbol.isConcatSpreadable) ||
				SymbolPolyfill("isConcatSpreadable")
		),
		iterator: d("", (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill("iterator")),
		match: d("", (NativeSymbol && NativeSymbol.match) || SymbolPolyfill("match")),
		replace: d("", (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill("replace")),
		search: d("", (NativeSymbol && NativeSymbol.search) || SymbolPolyfill("search")),
		species: d("", (NativeSymbol && NativeSymbol.species) || SymbolPolyfill("species")),
		split: d("", (NativeSymbol && NativeSymbol.split) || SymbolPolyfill("split")),
		toPrimitive: d(
			"", (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill("toPrimitive")
		),
		toStringTag: d(
			"", (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill("toStringTag")
		),
		unscopables: d(
			"", (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill("unscopables")
		)
	});
};

},{"d":"../node_modules/d/index.js","ext/global-this":"../node_modules/ext/global-this/index.js"}],"../node_modules/es6-symbol/lib/private/setup/symbol-registry.js":[function(require,module,exports) {
"use strict";

var d              = require("d")
  , validateSymbol = require("../../../validate-symbol");

var registry = Object.create(null);

module.exports = function (SymbolPolyfill) {
	return Object.defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (registry[key]) return registry[key];
			return (registry[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (symbol) {
			var key;
			validateSymbol(symbol);
			for (key in registry) {
				if (registry[key] === symbol) return key;
			}
			return undefined;
		})
	});
};

},{"d":"../node_modules/d/index.js","../../../validate-symbol":"../node_modules/es6-symbol/validate-symbol.js"}],"../node_modules/es6-symbol/polyfill.js":[function(require,module,exports) {
// ES2015 Symbol polyfill for environments that do not (or partially) support it

"use strict";

var d                    = require("d")
  , validateSymbol       = require("./validate-symbol")
  , NativeSymbol         = require("ext/global-this").Symbol
  , generateName         = require("./lib/private/generate-name")
  , setupStandardSymbols = require("./lib/private/setup/standard-symbols")
  , setupSymbolRegistry  = require("./lib/private/setup/symbol-registry");

var create = Object.create
  , defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty;

var SymbolPolyfill, HiddenSymbol, isNativeSafe;

if (typeof NativeSymbol === "function") {
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
} else {
	NativeSymbol = null;
}

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError("Symbol is not a constructor");
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError("Symbol is not a constructor");
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = description === undefined ? "" : String(description);
	return defineProperties(symbol, {
		__description__: d("", description),
		__name__: d("", generateName(description))
	});
};

setupStandardSymbols(SymbolPolyfill);
setupSymbolRegistry(SymbolPolyfill);

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d("", function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return "Symbol (" + validateSymbol(this).__description__ + ")"; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(
	SymbolPolyfill.prototype,
	SymbolPolyfill.toPrimitive,
	d("", function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === "symbol") return symbol;
		return symbol.toString();
	})
);
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d("c", "Symbol"));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(
	HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d("c", SymbolPolyfill.prototype[SymbolPolyfill.toStringTag])
);

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(
	HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d("c", SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive])
);

},{"d":"../node_modules/d/index.js","./validate-symbol":"../node_modules/es6-symbol/validate-symbol.js","ext/global-this":"../node_modules/ext/global-this/index.js","./lib/private/generate-name":"../node_modules/es6-symbol/lib/private/generate-name.js","./lib/private/setup/standard-symbols":"../node_modules/es6-symbol/lib/private/setup/standard-symbols.js","./lib/private/setup/symbol-registry":"../node_modules/es6-symbol/lib/private/setup/symbol-registry.js"}],"../node_modules/es6-symbol/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")()
	? require("ext/global-this").Symbol
	: require("./polyfill");

},{"./is-implemented":"../node_modules/es6-symbol/is-implemented.js","ext/global-this":"../node_modules/ext/global-this/index.js","./polyfill":"../node_modules/es6-symbol/polyfill.js"}],"../node_modules/es5-ext/array/#/clear.js":[function(require,module,exports) {
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

"use strict";

var value = require("../../object/valid-value");

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":"../node_modules/es5-ext/object/valid-value.js"}],"../node_modules/es5-ext/object/valid-callable.js":[function(require,module,exports) {
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],"../node_modules/type/string/coerce.js":[function(require,module,exports) {
"use strict";

var isValue  = require("../value/is")
  , isObject = require("../object/is");

var objectToString = Object.prototype.toString;

module.exports = function (value) {
	if (!isValue(value)) return null;
	if (isObject(value)) {
		// Reject Object.prototype.toString coercion
		var valueToString = value.toString;
		if (typeof valueToString !== "function") return null;
		if (valueToString === objectToString) return null;
		// Note: It can be object coming from other realm, still as there's no ES3 and CSP compliant
		// way to resolve its realm's Object.prototype.toString it's left as not addressed edge case
	}
	try {
		return "" + value; // Ensure implicit coercion
	} catch (error) {
		return null;
	}
};

},{"../value/is":"../node_modules/type/value/is.js","../object/is":"../node_modules/type/object/is.js"}],"../node_modules/type/lib/safe-to-string.js":[function(require,module,exports) {
"use strict";

module.exports = function (value) {
	try {
		return value.toString();
	} catch (error) {
		try { return String(value); }
		catch (error2) { return null; }
	}
};

},{}],"../node_modules/type/lib/to-short-string.js":[function(require,module,exports) {
"use strict";

var safeToString = require("./safe-to-string");

var reNewLine = /[\n\r\u2028\u2029]/g;

module.exports = function (value) {
	var string = safeToString(value);
	if (string === null) return "<Non-coercible to string value>";
	// Trim if too long
	if (string.length > 100) string = string.slice(0, 99) + "…";
	// Replace eventual new lines
	string = string.replace(reNewLine, function (char) {
		switch (char) {
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\u2028":
				return "\\u2028";
			case "\u2029":
				return "\\u2029";
			/* istanbul ignore next */
			default:
				throw new Error("Unexpected character");
		}
	});
	return string;
};

},{"./safe-to-string":"../node_modules/type/lib/safe-to-string.js"}],"../node_modules/type/lib/resolve-exception.js":[function(require,module,exports) {
"use strict";

var isValue       = require("../value/is")
  , isObject      = require("../object/is")
  , stringCoerce  = require("../string/coerce")
  , toShortString = require("./to-short-string");

var resolveMessage = function (message, value) {
	return message.replace("%v", toShortString(value));
};

module.exports = function (value, defaultMessage, inputOptions) {
	if (!isObject(inputOptions)) throw new TypeError(resolveMessage(defaultMessage, value));
	if (!isValue(value)) {
		if ("default" in inputOptions) return inputOptions["default"];
		if (inputOptions.isOptional) return null;
	}
	var errorMessage = stringCoerce(inputOptions.errorMessage);
	if (!isValue(errorMessage)) errorMessage = defaultMessage;
	throw new TypeError(resolveMessage(errorMessage, value));
};

},{"../value/is":"../node_modules/type/value/is.js","../object/is":"../node_modules/type/object/is.js","../string/coerce":"../node_modules/type/string/coerce.js","./to-short-string":"../node_modules/type/lib/to-short-string.js"}],"../node_modules/type/value/ensure.js":[function(require,module,exports) {
"use strict";

var resolveException = require("../lib/resolve-exception")
  , is               = require("./is");

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "Cannot use %v", arguments[1]);
};

},{"../lib/resolve-exception":"../node_modules/type/lib/resolve-exception.js","./is":"../node_modules/type/value/is.js"}],"../node_modules/type/plain-function/ensure.js":[function(require,module,exports) {
"use strict";

var resolveException = require("../lib/resolve-exception")
  , is               = require("./is");

module.exports = function (value/*, options*/) {
	if (is(value)) return value;
	return resolveException(value, "%v is not a plain function", arguments[1]);
};

},{"../lib/resolve-exception":"../node_modules/type/lib/resolve-exception.js","./is":"../node_modules/type/plain-function/is.js"}],"../node_modules/es5-ext/array/from/is-implemented.js":[function(require,module,exports) {
"use strict";

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && result !== arr && result[1] === "dwa");
};

},{}],"../node_modules/es5-ext/function/is-function.js":[function(require,module,exports) {
"use strict";

var objToString = Object.prototype.toString
  , isFunctionStringTag = RegExp.prototype.test.bind(/^[object [A-Za-z0-9]*Function]$/);

module.exports = function (value) {
	return typeof value === "function" && isFunctionStringTag(objToString.call(value));
};

},{}],"../node_modules/es5-ext/math/sign/is-implemented.js":[function(require,module,exports) {
"use strict";

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return sign(10) === 1 && sign(-20) === -1;
};

},{}],"../node_modules/es5-ext/math/sign/shim.js":[function(require,module,exports) {
"use strict";

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || value === 0) return value;
	return value > 0 ? 1 : -1;
};

},{}],"../node_modules/es5-ext/math/sign/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Math.sign : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/math/sign/is-implemented.js","./shim":"../node_modules/es5-ext/math/sign/shim.js"}],"../node_modules/es5-ext/number/to-integer.js":[function(require,module,exports) {
"use strict";

var sign  = require("../math/sign")
  , abs   = Math.abs
  , floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if (value === 0 || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":"../node_modules/es5-ext/math/sign/index.js"}],"../node_modules/es5-ext/number/to-pos-integer.js":[function(require,module,exports) {
"use strict";

var toInteger = require("./to-integer")
  , max       = Math.max;

module.exports = function (value) { return max(0, toInteger(value)); };

},{"./to-integer":"../node_modules/es5-ext/number/to-integer.js"}],"../node_modules/es5-ext/array/from/shim.js":[function(require,module,exports) {
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isArguments    = require("../../function/is-arguments")
  , isFunction     = require("../../function/is-function")
  , toPosInt       = require("../../number/to-pos-integer")
  , callable       = require("../../object/valid-callable")
  , validValue     = require("../../object/valid-value")
  , isValue        = require("../../object/is-value")
  , isString       = require("../../string/is-string")
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity, max-lines-per-function
module.exports = function (arrayLike/*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array((length = arrayLike.length));
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

},{"es6-symbol":"../node_modules/es6-symbol/index.js","../../function/is-arguments":"../node_modules/es5-ext/function/is-arguments.js","../../function/is-function":"../node_modules/es5-ext/function/is-function.js","../../number/to-pos-integer":"../node_modules/es5-ext/number/to-pos-integer.js","../../object/valid-callable":"../node_modules/es5-ext/object/valid-callable.js","../../object/valid-value":"../node_modules/es5-ext/object/valid-value.js","../../object/is-value":"../node_modules/es5-ext/object/is-value.js","../../string/is-string":"../node_modules/es5-ext/string/is-string.js"}],"../node_modules/es5-ext/array/from/index.js":[function(require,module,exports) {
"use strict";

module.exports = require("./is-implemented")() ? Array.from : require("./shim");

},{"./is-implemented":"../node_modules/es5-ext/array/from/is-implemented.js","./shim":"../node_modules/es5-ext/array/from/shim.js"}],"../node_modules/es5-ext/object/copy.js":[function(require,module,exports) {
"use strict";

var aFrom  = require("../array/from")
  , assign = require("./assign")
  , value  = require("./valid-value");

module.exports = function (obj/*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};

},{"../array/from":"../node_modules/es5-ext/array/from/index.js","./assign":"../node_modules/es5-ext/object/assign/index.js","./valid-value":"../node_modules/es5-ext/object/valid-value.js"}],"../node_modules/es5-ext/object/_iterate.js":[function(require,module,exports) {
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

"use strict";

var callable                = require("./valid-callable")
  , value                   = require("./valid-value")
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb/*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":"../node_modules/es5-ext/object/valid-callable.js","./valid-value":"../node_modules/es5-ext/object/valid-value.js"}],"../node_modules/es5-ext/object/for-each.js":[function(require,module,exports) {
"use strict";

module.exports = require("./_iterate")("forEach");

},{"./_iterate":"../node_modules/es5-ext/object/_iterate.js"}],"../node_modules/es5-ext/object/map.js":[function(require,module,exports) {
"use strict";

var callable = require("./valid-callable")
  , forEach  = require("./for-each")
  , call     = Function.prototype.call;

module.exports = function (obj, cb/*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};

},{"./valid-callable":"../node_modules/es5-ext/object/valid-callable.js","./for-each":"../node_modules/es5-ext/object/for-each.js"}],"../node_modules/d/auto-bind.js":[function(require,module,exports) {

"use strict";

var isValue             = require("type/value/is")
  , ensureValue         = require("type/value/ensure")
  , ensurePlainFunction = require("type/plain-function/ensure")
  , copy                = require("es5-ext/object/copy")
  , normalizeOptions    = require("es5-ext/object/normalize-options")
  , map                 = require("es5-ext/object/map");

var bind = Function.prototype.bind
  , defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = ensureValue(desc) && ensurePlainFunction(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (isValue(options.resolveContext)) ensurePlainFunction(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};

},{"type/value/is":"../node_modules/type/value/is.js","type/value/ensure":"../node_modules/type/value/ensure.js","type/plain-function/ensure":"../node_modules/type/plain-function/ensure.js","es5-ext/object/copy":"../node_modules/es5-ext/object/copy.js","es5-ext/object/normalize-options":"../node_modules/es5-ext/object/normalize-options.js","es5-ext/object/map":"../node_modules/es5-ext/object/map.js"}],"../node_modules/es6-iterator/index.js":[function(require,module,exports) {
"use strict";

var clear    = require("es5-ext/array/#/clear")
  , assign   = require("es5-ext/object/assign")
  , callable = require("es5-ext/object/valid-callable")
  , value    = require("es5-ext/object/valid-value")
  , d        = require("d")
  , autoBind = require("d/auto-bind")
  , Symbol   = require("es6-symbol");

var defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
	defineProperties(this, {
		__list__: d("w", value(list)),
		__context__: d("w", context),
		__nextIndex__: d("w", 0)
	});
	if (!context) return;
	callable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties(
	Iterator.prototype,
	assign(
		{
			_next: d(function () {
				var i;
				if (!this.__list__) return undefined;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
				return undefined;
			}),
			next: d(function () {
				return this._createResult(this._next());
			}),
			_createResult: d(function (i) {
				if (i === undefined) return { done: true, value: undefined };
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d(function (i) {
				return this.__list__[i];
			}),
			_unBind: d(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d(function () {
				return "[object " + (this[Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d(function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty(this, "__redo__", d("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d(function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) this.__redo__[j] = --redo;
				}, this);
			}),
			_onClear: d(function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty(
	Iterator.prototype,
	Symbol.iterator,
	d(function () {
		return this;
	})
);

},{"es5-ext/array/#/clear":"../node_modules/es5-ext/array/#/clear.js","es5-ext/object/assign":"../node_modules/es5-ext/object/assign/index.js","es5-ext/object/valid-callable":"../node_modules/es5-ext/object/valid-callable.js","es5-ext/object/valid-value":"../node_modules/es5-ext/object/valid-value.js","d":"../node_modules/d/index.js","d/auto-bind":"../node_modules/d/auto-bind.js","es6-symbol":"../node_modules/es6-symbol/index.js"}],"../node_modules/es6-iterator/array.js":[function(require,module,exports) {
"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , contains       = require("es5-ext/string/#/contains")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
	Iterator.call(this, arr);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else if (contains.call(kind, "key")) kind = "key";
	else kind = "value";
	defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		if (this.__kind__ === "key+value") return [i, this.__list__[i]];
		return i;
	})
});
defineProperty(ArrayIterator.prototype, Symbol.toStringTag, d("c", "Array Iterator"));

},{"es5-ext/object/set-prototype-of":"../node_modules/es5-ext/object/set-prototype-of/index.js","es5-ext/string/#/contains":"../node_modules/es5-ext/string/#/contains/index.js","d":"../node_modules/d/index.js","es6-symbol":"../node_modules/es6-symbol/index.js","./":"../node_modules/es6-iterator/index.js"}],"../node_modules/es6-iterator/string.js":[function(require,module,exports) {
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

"use strict";

var setPrototypeOf = require("es5-ext/object/set-prototype-of")
  , d              = require("d")
  , Symbol         = require("es6-symbol")
  , Iterator       = require("./");

var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, "__length__", d("", str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(Iterator.prototype, {
	_next: d(function () {
		if (!this.__list__) return undefined;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
		return undefined;
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
		return char;
	})
});
defineProperty(StringIterator.prototype, Symbol.toStringTag, d("c", "String Iterator"));

},{"es5-ext/object/set-prototype-of":"../node_modules/es5-ext/object/set-prototype-of/index.js","d":"../node_modules/d/index.js","es6-symbol":"../node_modules/es6-symbol/index.js","./":"../node_modules/es6-iterator/index.js"}],"../node_modules/es6-iterator/is-iterable.js":[function(require,module,exports) {
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , isValue     = require("es5-ext/object/is-value")
  , isString    = require("es5-ext/string/is-string");

var iteratorSymbol = require("es6-symbol").iterator
  , isArray        = Array.isArray;

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === "function";
};

},{"es5-ext/function/is-arguments":"../node_modules/es5-ext/function/is-arguments.js","es5-ext/object/is-value":"../node_modules/es5-ext/object/is-value.js","es5-ext/string/is-string":"../node_modules/es5-ext/string/is-string.js","es6-symbol":"../node_modules/es6-symbol/index.js"}],"../node_modules/es6-iterator/valid-iterable.js":[function(require,module,exports) {
"use strict";

var isIterable = require("./is-iterable");

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":"../node_modules/es6-iterator/is-iterable.js"}],"../node_modules/es6-iterator/get.js":[function(require,module,exports) {
"use strict";

var isArguments    = require("es5-ext/function/is-arguments")
  , isString       = require("es5-ext/string/is-string")
  , ArrayIterator  = require("./array")
  , StringIterator = require("./string")
  , iterable       = require("./valid-iterable")
  , iteratorSymbol = require("es6-symbol").iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === "function") return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"es5-ext/function/is-arguments":"../node_modules/es5-ext/function/is-arguments.js","es5-ext/string/is-string":"../node_modules/es5-ext/string/is-string.js","./array":"../node_modules/es6-iterator/array.js","./string":"../node_modules/es6-iterator/string.js","./valid-iterable":"../node_modules/es6-iterator/valid-iterable.js","es6-symbol":"../node_modules/es6-symbol/index.js"}],"../node_modules/es6-iterator/for-of.js":[function(require,module,exports) {
"use strict";

var isArguments = require("es5-ext/function/is-arguments")
  , callable    = require("es5-ext/object/valid-callable")
  , isString    = require("es5-ext/string/is-string")
  , get         = require("./get");

var isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = "array";
	else if (isString(iterable)) mode = "string";
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"es5-ext/function/is-arguments":"../node_modules/es5-ext/function/is-arguments.js","es5-ext/object/valid-callable":"../node_modules/es5-ext/object/valid-callable.js","es5-ext/string/is-string":"../node_modules/es5-ext/string/is-string.js","./get":"../node_modules/es6-iterator/get.js"}],"../node_modules/es6-weak-map/is-native-implemented.js":[function(require,module,exports) {
// Exports true if environment provides native `WeakMap` implementation, whatever that is.

'use strict';

module.exports = (function () {
	if (typeof WeakMap !== 'function') return false;
	return (Object.prototype.toString.call(new WeakMap()) === '[object WeakMap]');
}());

},{}],"../node_modules/es6-weak-map/polyfill.js":[function(require,module,exports) {
'use strict';

var setPrototypeOf    = require('es5-ext/object/set-prototype-of')
  , object            = require('es5-ext/object/valid-object')
  , value             = require('es5-ext/object/valid-value')
  , randomUniq        = require('es5-ext/string/random-uniq')
  , d                 = require('d')
  , getIterator       = require('es6-iterator/get')
  , forOf             = require('es6-iterator/for-of')
  , toStringTagSymbol = require('es6-symbol').toStringTag
  , isNative          = require('./is-native-implemented')

  , isArray = Array.isArray, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty, getPrototypeOf = Object.getPrototypeOf
  , WeakMapPoly;

module.exports = WeakMapPoly = function (/*iterable*/) {
	var iterable = arguments[0], self;
	if (!(this instanceof WeakMapPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf && (WeakMap !== WeakMapPoly)) {
		self = setPrototypeOf(new WeakMap(), getPrototypeOf(this));
	} else {
		self = this;
	}
	if (iterable != null) {
		if (!isArray(iterable)) iterable = getIterator(iterable);
	}
	defineProperty(self, '__weakMapData__', d('c', '$weakMap$' + randomUniq()));
	if (!iterable) return self;
	forOf(iterable, function (val) {
		value(val);
		self.set(val[0], val[1]);
	});
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(WeakMapPoly, WeakMap);
	WeakMapPoly.prototype = Object.create(WeakMap.prototype, {
		constructor: d(WeakMapPoly)
	});
}

Object.defineProperties(WeakMapPoly.prototype, {
	delete: d(function (key) {
		if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
			delete key[this.__weakMapData__];
			return true;
		}
		return false;
	}),
	get: d(function (key) {
		if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
			return key[this.__weakMapData__];
		}
	}),
	has: d(function (key) {
		return hasOwnProperty.call(object(key), this.__weakMapData__);
	}),
	set: d(function (key, value) {
		defineProperty(object(key), this.__weakMapData__, d('c', value));
		return this;
	}),
	toString: d(function () { return '[object WeakMap]'; })
});
defineProperty(WeakMapPoly.prototype, toStringTagSymbol, d('c', 'WeakMap'));

},{"es5-ext/object/set-prototype-of":"../node_modules/es5-ext/object/set-prototype-of/index.js","es5-ext/object/valid-object":"../node_modules/es5-ext/object/valid-object.js","es5-ext/object/valid-value":"../node_modules/es5-ext/object/valid-value.js","es5-ext/string/random-uniq":"../node_modules/es5-ext/string/random-uniq.js","d":"../node_modules/d/index.js","es6-iterator/get":"../node_modules/es6-iterator/get.js","es6-iterator/for-of":"../node_modules/es6-iterator/for-of.js","es6-symbol":"../node_modules/es6-symbol/index.js","./is-native-implemented":"../node_modules/es6-weak-map/is-native-implemented.js"}],"../node_modules/es6-weak-map/implement.js":[function(require,module,exports) {
'use strict';

if (!require('./is-implemented')()) {
	Object.defineProperty(require('es5-ext/global'), 'WeakMap',
		{ value: require('./polyfill'), configurable: true, enumerable: false,
			writable: true });
}

},{"./is-implemented":"../node_modules/es6-weak-map/is-implemented.js","es5-ext/global":"../node_modules/es5-ext/global.js","./polyfill":"../node_modules/es6-weak-map/polyfill.js"}],"../node_modules/jss-template/lib/parse.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var semiWithNl = /;\n/;

/**
 * Naive CSS parser.
 * - Supports only rule body (no selectors)
 * - Requires semicolon and new line after the value (except of last line)
 * - No nested rules support
 */

exports['default'] = function (cssText) {
  var style = {};
  var split = cssText.split(semiWithNl);
  for (var i = 0; i < split.length; i++) {
    var decl = (split[i] || '').trim();

    if (!decl) continue;
    var colonIndex = decl.indexOf(':');
    if (colonIndex === -1) {
      (0, _warning2['default'])(false, 'Malformed CSS string "%s"', decl);
      continue;
    }
    var prop = decl.substr(0, colonIndex).trim();
    var value = decl.substr(colonIndex + 1).trim();
    style[prop] = value;
  }
  return style;
};
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/jss-template/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var onProcessRule = function onProcessRule(rule) {
  if (typeof rule.style === 'string') {
    rule.style = (0, _parse2['default'])(rule.style);
  }
};

exports['default'] = function () {
  return { onProcessRule: onProcessRule };
};
},{"./parse":"../node_modules/jss-template/lib/parse.js"}],"../node_modules/jss-global/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports['default'] = jssGlobal;

var _jss = require('jss');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var propKey = '@global';
var prefixKey = '@global ';

var GlobalContainerRule = function () {
  function GlobalContainerRule(key, styles, options) {
    _classCallCheck(this, GlobalContainerRule);

    this.type = 'global';

    this.key = key;
    this.options = options;
    this.rules = new _jss.RuleList(_extends({}, options, {
      parent: this
    }));

    for (var selector in styles) {
      this.rules.add(selector, styles[selector], { selector: selector });
    }

    this.rules.process();
  }

  /**
   * Get a rule.
   */


  _createClass(GlobalContainerRule, [{
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Create and register rule, run plugins.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style, options) {
      var rule = this.rules.add(name, style, options);
      this.options.jss.plugins.onProcessRule(rule);
      return rule;
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.rules.toString();
    }
  }]);

  return GlobalContainerRule;
}();

var GlobalPrefixedRule = function () {
  function GlobalPrefixedRule(name, style, options) {
    _classCallCheck(this, GlobalPrefixedRule);

    this.name = name;
    this.options = options;
    var selector = name.substr(prefixKey.length);
    this.rule = options.jss.createRule(selector, style, _extends({}, options, {
      parent: this,
      selector: selector
    }));
  }

  _createClass(GlobalPrefixedRule, [{
    key: 'toString',
    value: function toString(options) {
      return this.rule.toString(options);
    }
  }]);

  return GlobalPrefixedRule;
}();

var separatorRegExp = /\s*,\s*/g;

function addScope(selector, scope) {
  var parts = selector.split(separatorRegExp);
  var scoped = '';
  for (var i = 0; i < parts.length; i++) {
    scoped += scope + ' ' + parts[i].trim();
    if (parts[i + 1]) scoped += ', ';
  }
  return scoped;
}

function handleNestedGlobalContainerRule(rule) {
  var options = rule.options,
      style = rule.style;

  var rules = style[propKey];

  if (!rules) return;

  for (var name in rules) {
    options.sheet.addRule(name, rules[name], _extends({}, options, {
      selector: addScope(name, rule.selector)
    }));
  }

  delete style[propKey];
}

function handlePrefixedGlobalRule(rule) {
  var options = rule.options,
      style = rule.style;

  for (var prop in style) {
    if (prop.substr(0, propKey.length) !== propKey) continue;

    var selector = addScope(prop.substr(propKey.length), rule.selector);
    options.sheet.addRule(selector, style[prop], _extends({}, options, {
      selector: selector
    }));
    delete style[prop];
  }
}

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssGlobal() {
  function onCreateRule(name, styles, options) {
    if (name === propKey) {
      return new GlobalContainerRule(name, styles, options);
    }

    if (name[0] === '@' && name.substr(0, prefixKey.length) === prefixKey) {
      return new GlobalPrefixedRule(name, styles, options);
    }

    var parent = options.parent;


    if (parent) {
      if (parent.type === 'global' || parent.options.parent.type === 'global') {
        options.global = true;
      }
    }

    if (options.global) options.selector = name;

    return null;
  }

  function onProcessRule(rule) {
    if (rule.type !== 'style') return;

    handleNestedGlobalContainerRule(rule);
    handlePrefixedGlobalRule(rule);
  }

  return { onCreateRule: onCreateRule, onProcessRule: onProcessRule };
}
},{"jss":"../node_modules/jss/lib/index.js"}],"../node_modules/jss-extend/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports['default'] = jssExtend;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var isObject = function isObject(obj) {
  return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj);
};
var valueNs = 'extendCurrValue' + Date.now();

function mergeExtend(style, rule, sheet, newStyle) {
  var extendType = _typeof(style.extend);
  // Extend using a rule name.
  if (extendType === 'string') {
    if (!sheet) return;
    var refRule = sheet.getRule(style.extend);
    if (!refRule) return;
    if (refRule === rule) {
      (0, _warning2['default'])(false, '[JSS] A rule tries to extend itself \r\n%s', rule);
      return;
    }
    var parent = refRule.options.parent;

    if (parent) {
      var originalStyle = parent.rules.raw[style.extend];
      extend(originalStyle, rule, sheet, newStyle);
    }
    return;
  }

  // Extend using an array of objects.
  if (Array.isArray(style.extend)) {
    for (var index = 0; index < style.extend.length; index++) {
      extend(style.extend[index], rule, sheet, newStyle);
    }
    return;
  }

  // Extend is a style object.
  for (var prop in style.extend) {
    if (prop === 'extend') {
      extend(style.extend.extend, rule, sheet, newStyle);
      continue;
    }
    if (isObject(style.extend[prop])) {
      if (!(prop in newStyle)) newStyle[prop] = {};
      extend(style.extend[prop], rule, sheet, newStyle[prop]);
      continue;
    }
    newStyle[prop] = style.extend[prop];
  }
}

function mergeRest(style, rule, sheet, newStyle) {
  // Copy base style.
  for (var prop in style) {
    if (prop === 'extend') continue;
    if (isObject(newStyle[prop]) && isObject(style[prop])) {
      extend(style[prop], rule, sheet, newStyle[prop]);
      continue;
    }

    if (isObject(style[prop])) {
      newStyle[prop] = extend(style[prop], rule, sheet);
      continue;
    }

    newStyle[prop] = style[prop];
  }
}

/**
 * Recursively extend styles.
 */
function extend(style, rule, sheet) {
  var newStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  mergeExtend(style, rule, sheet, newStyle);
  mergeRest(style, rule, sheet, newStyle);
  return newStyle;
}

/**
 * Handle `extend` property.
 *
 * @param {Rule} rule
 * @api public
 */
function jssExtend() {
  function onProcessStyle(style, rule, sheet) {
    if ('extend' in style) return extend(style, rule, sheet);
    return style;
  }

  function onChangeValue(value, prop, rule) {
    if (prop !== 'extend') return value;

    // Value is empty, remove properties set previously.
    if (value == null || value === false) {
      for (var key in rule[valueNs]) {
        rule.prop(key, null);
      }
      rule[valueNs] = null;
      return null;
    }

    for (var _key in value) {
      rule.prop(_key, value[_key]);
    }
    rule[valueNs] = value;

    // Make sure we don't set the value in the core.
    return null;
  }

  return { onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/jss-nested/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = jssNested;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var separatorRegExp = /\s*,\s*/g;
var parentRegExp = /&/g;
var refRegExp = /\$([\w-]+)/g;

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssNested() {
  // Get a function to be used for $ref replacement.
  function getReplaceRef(container) {
    return function (match, key) {
      var rule = container.getRule(key);
      if (rule) return rule.selector;
      (0, _warning2.default)(false, '[JSS] Could not find the referenced rule %s in %s.', key, container.options.meta || container);
      return key;
    };
  }

  var hasAnd = function hasAnd(str) {
    return str.indexOf('&') !== -1;
  };

  function replaceParentRefs(nestedProp, parentProp) {
    var parentSelectors = parentProp.split(separatorRegExp);
    var nestedSelectors = nestedProp.split(separatorRegExp);

    var result = '';

    for (var i = 0; i < parentSelectors.length; i++) {
      var parent = parentSelectors[i];

      for (var j = 0; j < nestedSelectors.length; j++) {
        var nested = nestedSelectors[j];
        if (result) result += ', ';
        // Replace all & by the parent or prefix & with the parent.
        result += hasAnd(nested) ? nested.replace(parentRegExp, parent) : parent + ' ' + nested;
      }
    }

    return result;
  }

  function getOptions(rule, container, options) {
    // Options has been already created, now we only increase index.
    if (options) return _extends({}, options, { index: options.index + 1 });

    var nestingLevel = rule.options.nestingLevel;

    nestingLevel = nestingLevel === undefined ? 1 : nestingLevel + 1;

    return _extends({}, rule.options, {
      nestingLevel: nestingLevel,
      index: container.indexOf(rule) + 1
    });
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;
    var container = rule.options.parent;
    var options = void 0;
    var replaceRef = void 0;
    for (var prop in style) {
      var isNested = hasAnd(prop);
      var isNestedConditional = prop[0] === '@';

      if (!isNested && !isNestedConditional) continue;

      options = getOptions(rule, container, options);

      if (isNested) {
        var selector = replaceParentRefs(prop, rule.selector
        // Lazily create the ref replacer function just once for
        // all nested rules within the sheet.
        );if (!replaceRef) replaceRef = getReplaceRef(container
        // Replace all $refs.
        );selector = selector.replace(refRegExp, replaceRef);

        container.addRule(selector, style[prop], _extends({}, options, { selector: selector }));
      } else if (isNestedConditional) {
        container
        // Place conditional right after the parent rule to ensure right ordering.
        .addRule(prop, null, options).addRule(rule.key, style[prop], { selector: rule.selector });
      }

      delete style[prop];
    }

    return style;
  }

  return { onProcessStyle: onProcessStyle };
}
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/jss-compose/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jssCompose;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Set selector.
 *
 * @param {Object} original rule
 * @param {String} className class string
 * @return {Boolean} flag, indicating function was successfull or not
 */
function registerClass(rule, className) {
  // Skip falsy values
  if (!className) return true;

  // Support array of class names `{composes: ['foo', 'bar']}`
  if (Array.isArray(className)) {
    for (var index = 0; index < className.length; index++) {
      var isSetted = registerClass(rule, className[index]);
      if (!isSetted) return false;
    }

    return true;
  }

  // Support space separated class names `{composes: 'foo bar'}`
  if (className.indexOf(' ') > -1) {
    return registerClass(rule, className.split(' '));
  }

  var parent = rule.options.parent;

  // It is a ref to a local rule.

  if (className[0] === '$') {
    var refRule = parent.getRule(className.substr(1));

    if (!refRule) {
      (0, _warning2.default)(false, '[JSS] Referenced rule is not defined. \r\n%s', rule);
      return false;
    }

    if (refRule === rule) {
      (0, _warning2.default)(false, '[JSS] Cyclic composition detected. \r\n%s', rule);
      return false;
    }

    parent.classes[rule.key] += ' ' + parent.classes[refRule.key];

    return true;
  }

  rule.options.parent.classes[rule.key] += ' ' + className;

  return true;
}

/**
 * Convert compose property to additional class, remove property from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssCompose() {
  function onProcessStyle(style, rule) {
    if (!style.composes) return style;
    registerClass(rule, style.composes);
    // Remove composes property to prevent infinite loop.
    delete style.composes;
    return style;
  }
  return { onProcessStyle: onProcessStyle };
}
},{"warning":"../node_modules/warning/browser.js"}],"../node_modules/hyphenate-style-name/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-var, prefer-template */
var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};

function toHyphenLower(match) {
  return '-' + match.toLowerCase();
}

function hyphenateStyleName(name) {
  if (cache.hasOwnProperty(name)) {
    return cache[name];
  }

  var hName = name.replace(uppercasePattern, toHyphenLower);
  return cache[name] = msPattern.test(hName) ? '-' + hName : hName;
}

var _default = hyphenateStyleName;
exports.default = _default;
},{}],"../node_modules/jss-camel-case/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = camelCase;

var _hyphenateStyleName = require('hyphenate-style-name');

var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Convert camel cased property names to dash separated.
 *
 * @param {Object} style
 * @return {Object}
 */
function convertCase(style) {
  var converted = {};

  for (var prop in style) {
    converted[(0, _hyphenateStyleName2['default'])(prop)] = style[prop];
  }

  if (style.fallbacks) {
    if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase);else converted.fallbacks = convertCase(style.fallbacks);
  }

  return converted;
}

/**
 * Allow camel cased property names by converting them back to dasherized.
 *
 * @param {Rule} rule
 */
function camelCase() {
  function onProcessStyle(style) {
    if (Array.isArray(style)) {
      // Handle rules like @font-face, which can have multiple styles in an array
      for (var index = 0; index < style.length; index++) {
        style[index] = convertCase(style[index]);
      }
      return style;
    }

    return convertCase(style);
  }

  function onChangeValue(value, prop, rule) {
    var hyphenatedProp = (0, _hyphenateStyleName2['default'])(prop);

    // There was no camel case in place
    if (prop === hyphenatedProp) return value;

    rule.prop(hyphenatedProp, value);

    // Core will ignore that property value we set the proper one above.
    return null;
  }

  return { onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}
},{"hyphenate-style-name":"../node_modules/hyphenate-style-name/index.js"}],"../node_modules/jss-default-unit/lib/defaultUnits.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Generated jss-default-unit CSS property units
 *
 * @type object
 */
exports['default'] = {
  'animation-delay': 'ms',
  'animation-duration': 'ms',
  'background-position': 'px',
  'background-position-x': 'px',
  'background-position-y': 'px',
  'background-size': 'px',
  border: 'px',
  'border-bottom': 'px',
  'border-bottom-left-radius': 'px',
  'border-bottom-right-radius': 'px',
  'border-bottom-width': 'px',
  'border-left': 'px',
  'border-left-width': 'px',
  'border-radius': 'px',
  'border-right': 'px',
  'border-right-width': 'px',
  'border-spacing': 'px',
  'border-top': 'px',
  'border-top-left-radius': 'px',
  'border-top-right-radius': 'px',
  'border-top-width': 'px',
  'border-width': 'px',
  'border-after-width': 'px',
  'border-before-width': 'px',
  'border-end-width': 'px',
  'border-horizontal-spacing': 'px',
  'border-start-width': 'px',
  'border-vertical-spacing': 'px',
  bottom: 'px',
  'box-shadow': 'px',
  'column-gap': 'px',
  'column-rule': 'px',
  'column-rule-width': 'px',
  'column-width': 'px',
  'flex-basis': 'px',
  'font-size': 'px',
  'font-size-delta': 'px',
  height: 'px',
  left: 'px',
  'letter-spacing': 'px',
  'logical-height': 'px',
  'logical-width': 'px',
  margin: 'px',
  'margin-after': 'px',
  'margin-before': 'px',
  'margin-bottom': 'px',
  'margin-left': 'px',
  'margin-right': 'px',
  'margin-top': 'px',
  'max-height': 'px',
  'max-width': 'px',
  'margin-end': 'px',
  'margin-start': 'px',
  'mask-position-x': 'px',
  'mask-position-y': 'px',
  'mask-size': 'px',
  'max-logical-height': 'px',
  'max-logical-width': 'px',
  'min-height': 'px',
  'min-width': 'px',
  'min-logical-height': 'px',
  'min-logical-width': 'px',
  motion: 'px',
  'motion-offset': 'px',
  outline: 'px',
  'outline-offset': 'px',
  'outline-width': 'px',
  padding: 'px',
  'padding-bottom': 'px',
  'padding-left': 'px',
  'padding-right': 'px',
  'padding-top': 'px',
  'padding-after': 'px',
  'padding-before': 'px',
  'padding-end': 'px',
  'padding-start': 'px',
  'perspective-origin-x': '%',
  'perspective-origin-y': '%',
  perspective: 'px',
  right: 'px',
  'shape-margin': 'px',
  size: 'px',
  'text-indent': 'px',
  'text-stroke': 'px',
  'text-stroke-width': 'px',
  top: 'px',
  'transform-origin': '%',
  'transform-origin-x': '%',
  'transform-origin-y': '%',
  'transform-origin-z': '%',
  'transition-delay': 'ms',
  'transition-duration': 'ms',
  'vertical-align': 'px',
  width: 'px',
  'word-spacing': 'px',
  // Not existing properties.
  // Used to avoid issues with jss-expand intergration.
  'box-shadow-x': 'px',
  'box-shadow-y': 'px',
  'box-shadow-blur': 'px',
  'box-shadow-spread': 'px',
  'font-line-height': 'px',
  'text-shadow-x': 'px',
  'text-shadow-y': 'px',
  'text-shadow-blur': 'px'
};
},{}],"../node_modules/jss-default-unit/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports['default'] = defaultUnit;

var _defaultUnits = require('./defaultUnits');

var _defaultUnits2 = _interopRequireDefault(_defaultUnits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Clones the object and adds a camel cased property version.
 */
function addCamelCasedVersion(obj) {
  var regExp = /(-[a-z])/g;
  var replace = function replace(str) {
    return str[1].toUpperCase();
  };
  var newObj = {};
  for (var key in obj) {
    newObj[key] = obj[key];
    newObj[key.replace(regExp, replace)] = obj[key];
  }
  return newObj;
}

var units = addCamelCasedVersion(_defaultUnits2['default']);

/**
 * Recursive deep style passing function
 *
 * @param {String} current property
 * @param {(Object|Array|Number|String)} property value
 * @param {Object} options
 * @return {(Object|Array|Number|String)} resulting value
 */
function iterate(prop, value, options) {
  if (!value) return value;

  var convertedValue = value;

  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (type === 'object' && Array.isArray(value)) type = 'array';

  switch (type) {
    case 'object':
      if (prop === 'fallbacks') {
        for (var innerProp in value) {
          value[innerProp] = iterate(innerProp, value[innerProp], options);
        }
        break;
      }
      for (var _innerProp in value) {
        value[_innerProp] = iterate(prop + '-' + _innerProp, value[_innerProp], options);
      }
      break;
    case 'array':
      for (var i = 0; i < value.length; i++) {
        value[i] = iterate(prop, value[i], options);
      }
      break;
    case 'number':
      if (value !== 0) {
        convertedValue = value + (options[prop] || units[prop] || '');
      }
      break;
    default:
      break;
  }

  return convertedValue;
}

/**
 * Add unit to numeric values.
 */
function defaultUnit() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var camelCasedOptions = addCamelCasedVersion(options);

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    for (var prop in style) {
      style[prop] = iterate(prop, style[prop], camelCasedOptions);
    }

    return style;
  }

  function onChangeValue(value, prop) {
    return iterate(prop, value, camelCasedOptions);
  }

  return { onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}
},{"./defaultUnits":"../node_modules/jss-default-unit/lib/defaultUnits.js"}],"../node_modules/jss-expand/lib/props.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A scheme for converting properties from array to regular style.
 * All properties listed below will be transformed to a string separated by space.
 */
var propArray = exports.propArray = {
  'background-size': true,
  'background-position': true,
  border: true,
  'border-bottom': true,
  'border-left': true,
  'border-top': true,
  'border-right': true,
  'border-radius': true,
  'border-image': true,
  'border-width': true,
  'border-style': true,
  'border-color': true,
  'box-shadow': true,
  flex: true,
  margin: true,
  padding: true,
  outline: true,
  'transform-origin': true,
  transform: true,
  transition: true

  /**
   * A scheme for converting arrays to regular styles inside of objects.
   * For e.g.: "{position: [0, 0]}" => "background-position: 0 0;".
   */
};var propArrayInObj = exports.propArrayInObj = {
  position: true, // background-position
  size: true // background-size


  /**
   * A scheme for parsing and building correct styles from passed objects.
   */
};var propObj = exports.propObj = {
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  background: {
    attachment: null,
    color: null,
    image: null,
    position: null,
    repeat: null
  },
  border: {
    width: null,
    style: null,
    color: null
  },
  'border-top': {
    width: null,
    style: null,
    color: null
  },
  'border-right': {
    width: null,
    style: null,
    color: null
  },
  'border-bottom': {
    width: null,
    style: null,
    color: null
  },
  'border-left': {
    width: null,
    style: null,
    color: null
  },
  outline: {
    width: null,
    style: null,
    color: null
  },
  'list-style': {
    type: null,
    position: null,
    image: null
  },
  transition: {
    property: null,
    duration: null,
    'timing-function': null,
    timingFunction: null, // Needed for avoiding comilation issues with jss-camel-case
    delay: null
  },
  animation: {
    name: null,
    duration: null,
    'timing-function': null,
    timingFunction: null, // Needed to avoid compilation issues with jss-camel-case
    delay: null,
    'iteration-count': null,
    iterationCount: null, // Needed to avoid compilation issues with jss-camel-case
    direction: null,
    'fill-mode': null,
    fillMode: null, // Needed to avoid compilation issues with jss-camel-case
    'play-state': null,
    playState: null // Needed to avoid compilation issues with jss-camel-case
  },
  'box-shadow': {
    x: 0,
    y: 0,
    blur: 0,
    spread: 0,
    color: null,
    inset: null
  },
  'text-shadow': {
    x: 0,
    y: 0,
    blur: null,
    color: null
  }

  /**
   * A scheme for converting non-standart properties inside object.
   * For e.g.: include 'border-radius' property inside 'border' object.
   */
};var customPropObj = exports.customPropObj = {
  border: {
    radius: 'border-radius',
    image: 'border-image',
    width: 'border-width',
    style: 'border-style',
    color: 'border-color'
  },
  background: {
    size: 'background-size',
    image: 'background-image'
  },
  font: {
    style: 'font-style',
    variant: 'font-variant',
    weight: 'font-weight',
    stretch: 'font-stretch',
    size: 'font-size',
    family: 'font-family',
    lineHeight: 'line-height', // Needed to avoid compilation issues with jss-camel-case
    'line-height': 'line-height'
  },
  flex: {
    grow: 'flex-grow',
    basis: 'flex-basis',
    direction: 'flex-direction',
    wrap: 'flex-wrap',
    flow: 'flex-flow',
    shrink: 'flex-shrink'
  },
  align: {
    self: 'align-self',
    items: 'align-items',
    content: 'align-content'
  },
  grid: {
    'template-columns': 'grid-template-columns',
    templateColumns: 'grid-template-columns',

    'template-rows': 'grid-template-rows',
    templateRows: 'grid-template-rows',

    'template-areas': 'grid-template-areas',
    templateAreas: 'grid-template-areas',

    template: 'grid-template',

    'auto-columns': 'grid-auto-columns',
    autoColumns: 'grid-auto-columns',

    'auto-rows': 'grid-auto-rows',
    autoRows: 'grid-auto-rows',

    'auto-flow': 'grid-auto-flow',
    autoFlow: 'grid-auto-flow',

    row: 'grid-row',
    column: 'grid-column',

    'row-start': 'grid-row-start',
    rowStart: 'grid-row-start',
    'row-end': 'grid-row-end',
    rowEnd: 'grid-row-end',

    'column-start': 'grid-column-start',
    columnStart: 'grid-column-start',
    'column-end': 'grid-column-end',
    columnEnd: 'grid-column-end',

    area: 'grid-area',
    gap: 'grid-gap',

    'row-gap': 'grid-row-gap',
    rowGap: 'grid-row-gap',

    'column-gap': 'grid-column-gap',
    columnGap: 'grid-column-gap'
  }
};
},{}],"../node_modules/jss-expand/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = jssExpand;

var _props = require('./props');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Map values by given prop.
 *
 * @param {Array} array of values
 * @param {String} original property
 * @param {String} original rule
 * @return {String} mapped values
 */
function mapValuesByProp(value, prop, rule) {
  return value.map(function (item) {
    return objectToArray(item, prop, rule, false, true);
  });
}

/**
 * Convert array to nested array, if needed
 *
 * @param {Array} array of values
 * @param {String} original property
 * @param {Object} sheme, for converting arrays in strings
 * @param {Object} original rule
 * @return {String} converted string
 */
function processArray(value, prop, scheme, rule) {
  if (scheme[prop] == null) return value;
  if (value.length === 0) return [];
  if (Array.isArray(value[0])) return processArray(value[0], prop, scheme);
  if (_typeof(value[0]) === 'object') {
    return mapValuesByProp(value, prop, rule);
  }

  return [value];
}

/**
 * Convert object to array.
 *
 * @param {Object} object of values
 * @param {String} original property
 * @param {Object} original rule
 * @param {Boolean} is fallback prop
 * @param {Boolean} object is inside array
 * @return {String} converted string
 */
function objectToArray(value, prop, rule, isFallback, isInArray) {
  if (!(_props.propObj[prop] || _props.customPropObj[prop])) return [];

  var result = [];

  // Check if exists any non-standart property
  if (_props.customPropObj[prop]) {
    value = customPropsToStyle(value, rule, _props.customPropObj[prop], isFallback);
  }

  // Pass throught all standart props
  if (Object.keys(value).length) {
    for (var baseProp in _props.propObj[prop]) {
      if (value[baseProp]) {
        if (Array.isArray(value[baseProp])) {
          result.push(_props.propArrayInObj[baseProp] === null ? value[baseProp] : value[baseProp].join(' '));
        } else result.push(value[baseProp]);
        continue;
      }

      // Add default value from props config.
      if (_props.propObj[prop][baseProp] != null) {
        result.push(_props.propObj[prop][baseProp]);
      }
    }
  }

  if (!result.length || isInArray) return result;
  return [result];
}

/**
 * Convert custom properties values to styles adding them to rule directly
 *
 * @param {Object} object of values
 * @param {Object} original rule
 * @param {String} property, that contain partial custom properties
 * @param {Boolean} is fallback prop
 * @return {Object} value without custom properties, that was already added to rule
 */
function customPropsToStyle(value, rule, customProps, isFallback) {
  for (var prop in customProps) {
    var propName = customProps[prop];

    // If current property doesn't exist already in rule - add new one
    if (typeof value[prop] !== 'undefined' && (isFallback || !rule.prop(propName))) {
      var appendedValue = styleDetector(_defineProperty({}, propName, value[prop]), rule)[propName];

      // Add style directly in rule
      if (isFallback) rule.style.fallbacks[propName] = appendedValue;else rule.style[propName] = appendedValue;
    }
    // Delete converted property to avoid double converting
    delete value[prop];
  }

  return value;
}

/**
 * Detect if a style needs to be converted.
 *
 * @param {Object} style
 * @param {Object} rule
 * @param {Boolean} is fallback prop
 * @return {Object} convertedStyle
 */
function styleDetector(style, rule, isFallback) {
  for (var prop in style) {
    var value = style[prop];

    if (Array.isArray(value)) {
      // Check double arrays to avoid recursion.
      if (!Array.isArray(value[0])) {
        if (prop === 'fallbacks') {
          for (var index = 0; index < style.fallbacks.length; index++) {
            style.fallbacks[index] = styleDetector(style.fallbacks[index], rule, true);
          }
          continue;
        }

        style[prop] = processArray(value, prop, _props.propArray);
        // Avoid creating properties with empty values
        if (!style[prop].length) delete style[prop];
      }
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      if (prop === 'fallbacks') {
        style.fallbacks = styleDetector(style.fallbacks, rule, true);
        continue;
      }

      style[prop] = objectToArray(value, prop, rule, isFallback);
      // Avoid creating properties with empty values
      if (!style[prop].length) delete style[prop];
    }

    // Maybe a computed value resulting in an empty string
    else if (style[prop] === '') delete style[prop];
  }

  return style;
}

/**
 * Adds possibility to write expanded styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssExpand() {
  function onProcessStyle(style, rule) {
    if (!style || rule.type !== 'style') return style;

    if (Array.isArray(style)) {
      // Pass rules one by one and reformat them
      for (var index = 0; index < style.length; index++) {
        style[index] = styleDetector(style[index], rule);
      }
      return style;
    }

    return styleDetector(style, rule);
  }

  return { onProcessStyle: onProcessStyle };
}
},{"./props":"../node_modules/jss-expand/lib/props.js"}],"../node_modules/css-vendor/lib/prefix.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var js = ''; /**
              * Export javascript style and css style vendor prefixes.
              * Based on "transform" support test.
              */

var css = '';

// We should not do anything if required serverside.
if (_isInBrowser2['default']) {
  // Order matters. We need to check Webkit the last one because
  // other vendors use to add Webkit prefixes to some properties
  var jsCssMap = {
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-',
    Webkit: '-webkit-'
  };
  var style = document.createElement('p').style;
  var testProp = 'Transform';

  for (var key in jsCssMap) {
    if (key + testProp in style) {
      js = key;
      css = jsCssMap[key];
      break;
    }
  }
}

/**
 * Vendor prefix string for the current browser.
 *
 * @type {{js: String, css: String}}
 * @api public
 */
exports['default'] = { js: js, css: css };
},{"is-in-browser":"../node_modules/is-in-browser/dist/module.js"}],"../node_modules/css-vendor/lib/camelize.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = camelize;
var regExp = /[-\s]+(.)?/g;

/**
 * Convert dash separated strings to camel cased.
 *
 * @param {String} str
 * @return {String}
 */
function camelize(str) {
  return str.replace(regExp, toUpper);
}

function toUpper(match, c) {
  return c ? c.toUpperCase() : '';
}
},{}],"../node_modules/css-vendor/lib/supported-property.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedProperty;

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var el = void 0;
var cache = {};

if (_isInBrowser2['default']) {
  el = document.createElement('p');

  /**
   * We test every property on vendor prefix requirement.
   * Once tested, result is cached. It gives us up to 70% perf boost.
   * http://jsperf.com/element-style-object-access-vs-plain-object
   *
   * Prefill cache with known css properties to reduce amount of
   * properties we need to feature test at runtime.
   * http://davidwalsh.name/vendor-prefix
   */
  var computed = window.getComputedStyle(document.documentElement, '');
  for (var key in computed) {
    if (!isNaN(key)) cache[computed[key]] = computed[key];
  }
}

/**
 * Test if a property is supported, returns supported property with vendor
 * prefix if required. Returns `false` if not supported.
 *
 * @param {String} prop dash separated
 * @return {String|Boolean}
 * @api public
 */
function supportedProperty(prop) {
  // For server-side rendering.
  if (!el) return prop;

  // We have not tested this prop yet, lets do the test.
  if (cache[prop] != null) return cache[prop];

  // Camelization is required because we can't test using
  // css syntax for e.g. in FF.
  // Test if property is supported as it is.
  if ((0, _camelize2['default'])(prop) in el.style) {
    cache[prop] = prop;
  }
  // Test if property is supported with vendor prefix.
  else if (_prefix2['default'].js + (0, _camelize2['default'])('-' + prop) in el.style) {
      cache[prop] = _prefix2['default'].css + prop;
    } else {
      cache[prop] = false;
    }

  return cache[prop];
}
},{"is-in-browser":"../node_modules/is-in-browser/dist/module.js","./prefix":"../node_modules/css-vendor/lib/prefix.js","./camelize":"../node_modules/css-vendor/lib/camelize.js"}],"../node_modules/css-vendor/lib/supported-value.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedValue;

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var cache = {};
var el = void 0;

if (_isInBrowser2['default']) el = document.createElement('p');

/**
 * Returns prefixed value if needed. Returns `false` if value is not supported.
 *
 * @param {String} property
 * @param {String} value
 * @return {String|Boolean}
 * @api public
 */
function supportedValue(property, value) {
  // For server-side rendering.
  if (!el) return value;

  // It is a string or a number as a string like '1'.
  // We want only prefixable values here.
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) return value;

  var cacheKey = property + value;

  if (cache[cacheKey] != null) return cache[cacheKey];

  // IE can even throw an error in some cases, for e.g. style.content = 'bar'
  try {
    // Test value as it is.
    el.style[property] = value;
  } catch (err) {
    cache[cacheKey] = false;
    return false;
  }

  // Value is supported as it is.
  if (el.style[property] !== '') {
    cache[cacheKey] = value;
  } else {
    // Test value with vendor prefix.
    value = _prefix2['default'].css + value;

    // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
    if (value === '-ms-flex') value = '-ms-flexbox';

    el.style[property] = value;

    // Value is supported with vendor prefix.
    if (el.style[property] !== '') cache[cacheKey] = value;
  }

  if (!cache[cacheKey]) cache[cacheKey] = false;

  // Reset style value.
  el.style[property] = '';

  return cache[cacheKey];
}
},{"is-in-browser":"../node_modules/is-in-browser/dist/module.js","./prefix":"../node_modules/css-vendor/lib/prefix.js"}],"../node_modules/css-vendor/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedValue = exports.supportedProperty = exports.prefix = undefined;

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);

var _supportedProperty = require('./supported-property');

var _supportedProperty2 = _interopRequireDefault(_supportedProperty);

var _supportedValue = require('./supported-value');

var _supportedValue2 = _interopRequireDefault(_supportedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  prefix: _prefix2['default'],
  supportedProperty: _supportedProperty2['default'],
  supportedValue: _supportedValue2['default']
}; /**
    * CSS Vendor prefix detection and property feature testing.
    *
    * @copyright Oleg Slobodskoi 2015
    * @website https://github.com/jsstyles/css-vendor
    * @license MIT
    */

exports.prefix = _prefix2['default'];
exports.supportedProperty = _supportedProperty2['default'];
exports.supportedValue = _supportedValue2['default'];
},{"./prefix":"../node_modules/css-vendor/lib/prefix.js","./supported-property":"../node_modules/css-vendor/lib/supported-property.js","./supported-value":"../node_modules/css-vendor/lib/supported-value.js"}],"../node_modules/jss-vendor-prefixer/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = jssVendorPrefixer;

var _cssVendor = require('css-vendor');

var vendor = _interopRequireWildcard(_cssVendor);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * Add vendor prefix to a property name when needed.
 *
 * @param {Rule} rule
 * @api public
 */
function jssVendorPrefixer() {
  function onProcessRule(rule) {
    if (rule.type === 'keyframes') {
      rule.key = '@' + vendor.prefix.css + rule.key.substr(1);
    }
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    for (var prop in style) {
      var value = style[prop];

      var changeProp = false;
      var supportedProp = vendor.supportedProperty(prop);
      if (supportedProp && supportedProp !== prop) changeProp = true;

      var changeValue = false;
      var supportedValue = vendor.supportedValue(supportedProp, value);
      if (supportedValue && supportedValue !== value) changeValue = true;

      if (changeProp || changeValue) {
        if (changeProp) delete style[prop];
        style[supportedProp || prop] = supportedValue || value;
      }
    }

    return style;
  }

  function onChangeValue(value, prop) {
    return vendor.supportedValue(prop, value);
  }

  return { onProcessRule: onProcessRule, onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}
},{"css-vendor":"../node_modules/css-vendor/lib/index.js"}],"../node_modules/jss-props-sort/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = jssPropsSort;
/**
 * Sort props by length.
 */
function jssPropsSort() {
  function sort(prop0, prop1) {
    return prop0.length - prop1.length;
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    var newStyle = {};
    var props = Object.keys(style).sort(sort);
    for (var prop in props) {
      newStyle[props[prop]] = style[props[prop]];
    }
    return newStyle;
  }

  return { onProcessStyle: onProcessStyle };
}
},{}],"../node_modules/jss-preset-default/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jssTemplate = require('jss-template');

var _jssTemplate2 = _interopRequireDefault(_jssTemplate);

var _jssGlobal = require('jss-global');

var _jssGlobal2 = _interopRequireDefault(_jssGlobal);

var _jssExtend = require('jss-extend');

var _jssExtend2 = _interopRequireDefault(_jssExtend);

var _jssNested = require('jss-nested');

var _jssNested2 = _interopRequireDefault(_jssNested);

var _jssCompose = require('jss-compose');

var _jssCompose2 = _interopRequireDefault(_jssCompose);

var _jssCamelCase = require('jss-camel-case');

var _jssCamelCase2 = _interopRequireDefault(_jssCamelCase);

var _jssDefaultUnit = require('jss-default-unit');

var _jssDefaultUnit2 = _interopRequireDefault(_jssDefaultUnit);

var _jssExpand = require('jss-expand');

var _jssExpand2 = _interopRequireDefault(_jssExpand);

var _jssVendorPrefixer = require('jss-vendor-prefixer');

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

var _jssPropsSort = require('jss-props-sort');

var _jssPropsSort2 = _interopRequireDefault(_jssPropsSort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    plugins: [(0, _jssTemplate2.default)(options.template), (0, _jssGlobal2.default)(options.global), (0, _jssExtend2.default)(options.extend), (0, _jssNested2.default)(options.nested), (0, _jssCompose2.default)(options.compose), (0, _jssCamelCase2.default)(options.camelCase), (0, _jssDefaultUnit2.default)(options.defaultUnit), (0, _jssExpand2.default)(options.expand), (0, _jssVendorPrefixer2.default)(options.vendorPrefixer), (0, _jssPropsSort2.default)(options.propsSort)]
  };
};
},{"jss-template":"../node_modules/jss-template/lib/index.js","jss-global":"../node_modules/jss-global/lib/index.js","jss-extend":"../node_modules/jss-extend/lib/index.js","jss-nested":"../node_modules/jss-nested/lib/index.js","jss-compose":"../node_modules/jss-compose/lib/index.js","jss-camel-case":"../node_modules/jss-camel-case/lib/index.js","jss-default-unit":"../node_modules/jss-default-unit/lib/index.js","jss-expand":"../node_modules/jss-expand/lib/index.js","jss-vendor-prefixer":"../node_modules/jss-vendor-prefixer/lib/index.js","jss-props-sort":"../node_modules/jss-props-sort/lib/index.js"}],"../node_modules/json-prune/JSON.prune.js":[function(require,module,exports) {
// JSON.prune : a function to stringify any object without overflow
// two additional optional parameters :
//   - the maximal depth (default : 6)
//   - the maximal length of arrays (default : 50)
// You can also pass an "options" object.
// examples :
//   var json = JSON.prune(window)
//   var arr = Array.apply(0,Array(1000)); var json = JSON.prune(arr, 4, 20)
//   var json = JSON.prune(window.location, {inheritedProperties:true})
// Web site : http://dystroy.org/JSON.prune/
// JSON.prune on github : https://github.com/Canop/JSON.prune
// This was discussed here : http://stackoverflow.com/q/13861254/263525
// The code is based on Douglas Crockford's code : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
// No effort was done to support old browsers. JSON.prune will fail on IE8.
(function () {
	'use strict';

	var DEFAULT_MAX_DEPTH = 6;
	var DEFAULT_ARRAY_MAX_LENGTH = 50;
	var DEFAULT_PRUNED_VALUE = '"-pruned-"';
	var seen; // Same variable used for all stringifications
	var iterator; // either forEachEnumerableOwnProperty, forEachEnumerableProperty or forEachProperty
	
	// iterates on enumerable own properties (default behavior)
	var forEachEnumerableOwnProperty = function(obj, callback) {
		for (var k in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, k)) callback(k);
		}
	};
	// iterates on enumerable properties
	var forEachEnumerableProperty = function(obj, callback) {
		for (var k in obj) callback(k);
	};
	// iterates on properties, even non enumerable and inherited ones
	// This is dangerous
	var forEachProperty = function(obj, callback, excluded) {
		if (obj==null) return;
		excluded = excluded || {};
		Object.getOwnPropertyNames(obj).forEach(function(k){
			if (!excluded[k]) {
				callback(k);
				excluded[k] = true;
			}
		});
		forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
	};

	Object.defineProperty(Date.prototype, "toPrunedJSON", {value:Date.prototype.toJSON});

	var	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	var prune = function (value, depthDecr, arrayMaxLength) {
		var prunedString = DEFAULT_PRUNED_VALUE;
		var replacer;
		if (typeof depthDecr == "object") {
			var options = depthDecr;
			depthDecr = options.depthDecr;
			arrayMaxLength = options.arrayMaxLength;
			iterator = options.iterator || forEachEnumerableOwnProperty;
			if (options.allProperties) iterator = forEachProperty;
			else if (options.inheritedProperties) iterator = forEachEnumerableProperty
			if ("prunedString" in options) {
				prunedString = options.prunedString;
			}
			if (options.replacer) {
				replacer = options.replacer;
			}
		} else {
			iterator = forEachEnumerableOwnProperty;
		}
		seen = [];
		depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
		arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
		function str(key, holder, depthDecr) {
			var i, k, v, length, partial, value = holder[key];

			if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
				value = value.toPrunedJSON(key);
			}
			if (value && typeof value.toJSON === 'function') {
				value = value.toJSON(); 
			}

			switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) {
					return 'null';
				}
				if (depthDecr<=0 || seen.indexOf(value)!==-1) {
					if (replacer) {
						var replacement = replacer(value, prunedString, true);
						return replacement===undefined ? undefined : ''+replacement;
					}
					return prunedString;
				}
				seen.push(value);
				partial = [];
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = Math.min(value.length, arrayMaxLength);
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value, depthDecr-1) || 'null';
					}
					v = '[' + partial.join(',') + ']';
					if (replacer && value.length>arrayMaxLength) return replacer(value, v, false);
					return v;
				}
				iterator(value, function(k) {
					try {
						v = str(k, value, depthDecr-1);
						if (v) partial.push(quote(k) + ':' + v);
					} catch (e) { 
						// this try/catch due to forbidden accessors on some objects
					}				
				});
				return '{' + partial.join(',') + '}';
			case 'function':
			case 'undefined':
				return replacer ? replacer(value, undefined, false) : undefined;
			}
		}
		return str('', {'': value}, depthDecr);
	};
	
	prune.log = function() {
		console.log.apply(console, Array.prototype.map.call(arguments, function(v) {
			return JSON.parse(JSON.prune(v));
		}));
	};
	prune.forEachProperty = forEachProperty; // you might want to also assign it to Object.forEachProperty

	if (typeof module !== "undefined") module.exports = prune;
	else JSON.prune = prune;
}());

},{}],"../node_modules/hash-it/es/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MATH_OBJECT = exports.HTML_ELEMENT_REGEXP = exports.STRINGIFY_TYPEOF_TYPES = exports.STRINGIFY_TOSTRING_TYPES = exports.STRINGIFY_PREFIX_TYPES = exports.STRINGIFY_SELF_TYPES = exports.STRINGIFY_PREFIX_JOIN_CLASSES = exports.STRINGIFY_NOT_ENUMERABLE_CLASSES = exports.STRINGIFY_ITERABLE_CLASSES = exports.STRINGIFY_PREFIX_CLASSES = exports.STRINGIFY_SELF_CLASSES = exports.REPLACE_STRINGIFICATION_CLASSES = exports.REPLACE_RECURSIVE_VALUE_CLASSES = exports.RECURSIVE_COUNTER_CUTOFF = exports.OBJECT_CLASS_TYPE_MAP = exports.OBJECT_CLASS_MAP = exports.OBJECT_CLASSES = void 0;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
/**
 * @constant {Array<string>} OBJECT_CLASSES
 */


var OBJECT_CLASSES = ['Arguments', 'Array', 'ArrayBuffer', 'Boolean', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'Generator', 'GeneratorFunction', 'HTMLElement', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Null', 'Number', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'Undefined', 'WeakMap', 'WeakSet'];
/**
 * @constant {Object} OBJECT_CLASS_MAP
 */

exports.OBJECT_CLASSES = OBJECT_CLASSES;
var OBJECT_CLASS_MAP = OBJECT_CLASSES.reduce(function (objectClasses, type) {
  objectClasses['[object ' + type + ']'] = type;
  return objectClasses;
}, {});
/**
 * @constant {Object} OBJECT_CLASS_TYPE_MAP
 */

exports.OBJECT_CLASS_MAP = OBJECT_CLASS_MAP;
var OBJECT_CLASS_TYPE_MAP = Object.keys(OBJECT_CLASS_MAP).reduce(function (objectClassTypes, objectClass) {
  objectClassTypes[OBJECT_CLASS_MAP[objectClass].toUpperCase()] = objectClass;
  return objectClassTypes;
}, {});
/**
 * @constant {number} RECURSIVE_COUNTER_CUTOFF
 */

exports.OBJECT_CLASS_TYPE_MAP = OBJECT_CLASS_TYPE_MAP;
var RECURSIVE_COUNTER_CUTOFF = 512;
/**
 * @constant {Array<string>} REPLACE_RECURSIVE_VALUE_CLASSES
 */

exports.RECURSIVE_COUNTER_CUTOFF = RECURSIVE_COUNTER_CUTOFF;
var REPLACE_RECURSIVE_VALUE_CLASSES = [OBJECT_CLASS_TYPE_MAP.ARRAY, OBJECT_CLASS_TYPE_MAP.OBJECT];
/**
 * @constant {Array<string>} REPLACE_STRINGIFICATION_CLASSES
 */

exports.REPLACE_RECURSIVE_VALUE_CLASSES = REPLACE_RECURSIVE_VALUE_CLASSES;
var REPLACE_STRINGIFICATION_CLASSES = [OBJECT_CLASS_TYPE_MAP.DATE, OBJECT_CLASS_TYPE_MAP.MAP, OBJECT_CLASS_TYPE_MAP.SET, OBJECT_CLASS_TYPE_MAP.REGEXP, OBJECT_CLASS_TYPE_MAP.ERROR, OBJECT_CLASS_TYPE_MAP.GENERATORFUNCTION, OBJECT_CLASS_TYPE_MAP.MATH, OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER, OBJECT_CLASS_TYPE_MAP.DATAVIEW, OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY, OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY, OBJECT_CLASS_TYPE_MAP.INT8ARRAY, OBJECT_CLASS_TYPE_MAP.INT16ARRAY, OBJECT_CLASS_TYPE_MAP.INT32ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY, OBJECT_CLASS_TYPE_MAP.UINT16ARRAY, OBJECT_CLASS_TYPE_MAP.UINT32ARRAY, OBJECT_CLASS_TYPE_MAP.PROMISE, OBJECT_CLASS_TYPE_MAP.GENERATOR, OBJECT_CLASS_TYPE_MAP.WEAKMAP, OBJECT_CLASS_TYPE_MAP.WEAKSET];
/**
 * @constant {Array<string>} STRINGIFY_SELF_CLASSES
 */

exports.REPLACE_STRINGIFICATION_CLASSES = REPLACE_STRINGIFICATION_CLASSES;
var STRINGIFY_SELF_CLASSES = [OBJECT_CLASS_TYPE_MAP.ARRAY, OBJECT_CLASS_TYPE_MAP.OBJECT, OBJECT_CLASS_TYPE_MAP.ARGUMENTS];
/**
 * @constant {Array<string>} STRINGIFY_PREFIX_CLASSES
 */

exports.STRINGIFY_SELF_CLASSES = STRINGIFY_SELF_CLASSES;
var STRINGIFY_PREFIX_CLASSES = [OBJECT_CLASS_TYPE_MAP.ERROR, OBJECT_CLASS_TYPE_MAP.REGEXP];
/**
 * @constant {Array<string>} STRINGIFY_ITERABLE_CLASSES
 */

exports.STRINGIFY_PREFIX_CLASSES = STRINGIFY_PREFIX_CLASSES;
var STRINGIFY_ITERABLE_CLASSES = [OBJECT_CLASS_TYPE_MAP.MAP, OBJECT_CLASS_TYPE_MAP.SET];
/**
 * @constant {Array<string>} STRINGIFY_NOT_ENUMERABLE_CLASSES
 */

exports.STRINGIFY_ITERABLE_CLASSES = STRINGIFY_ITERABLE_CLASSES;
var STRINGIFY_NOT_ENUMERABLE_CLASSES = [OBJECT_CLASS_TYPE_MAP.PROMISE, OBJECT_CLASS_TYPE_MAP.GENERATOR, OBJECT_CLASS_TYPE_MAP.WEAKMAP, OBJECT_CLASS_TYPE_MAP.WEAKSET];
/**
 * @constant {Array<string>} STRINGIFY_PREFIX_JOIN_CLASSES
 */

exports.STRINGIFY_NOT_ENUMERABLE_CLASSES = STRINGIFY_NOT_ENUMERABLE_CLASSES;
var STRINGIFY_PREFIX_JOIN_CLASSES = [OBJECT_CLASS_TYPE_MAP.FLOAT32ARRAY, OBJECT_CLASS_TYPE_MAP.FLOAT64ARRAY, OBJECT_CLASS_TYPE_MAP.INT8ARRAY, OBJECT_CLASS_TYPE_MAP.INT16ARRAY, OBJECT_CLASS_TYPE_MAP.INT32ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8ARRAY, OBJECT_CLASS_TYPE_MAP.UINT8CLAMPEDARRAY, OBJECT_CLASS_TYPE_MAP.UINT16ARRAY, OBJECT_CLASS_TYPE_MAP.UINT32ARRAY];
/**
 * @constant {Array<string>} STRINGIFY_SELF_TYPES
 */

exports.STRINGIFY_PREFIX_JOIN_CLASSES = STRINGIFY_PREFIX_JOIN_CLASSES;
var STRINGIFY_SELF_TYPES = ['string', 'number'];
/**
 * @constant {Array<string>} STRINGIFY_PREFIX_TYPES
 */

exports.STRINGIFY_SELF_TYPES = STRINGIFY_SELF_TYPES;
var STRINGIFY_PREFIX_TYPES = ['boolean', 'undefined', 'function', 'symbol'];
/**
 * @constant {Array<string>} STRINGIFY_TOSTRING_TYPES
 */

exports.STRINGIFY_PREFIX_TYPES = STRINGIFY_PREFIX_TYPES;
var STRINGIFY_TOSTRING_TYPES = ['symbol', 'function'];
/**
 * @constant {Array<string>} STRINGIFY_TYPEOF_TYPES
 */

exports.STRINGIFY_TOSTRING_TYPES = STRINGIFY_TOSTRING_TYPES;
var STRINGIFY_TYPEOF_TYPES = [].concat(STRINGIFY_SELF_TYPES, STRINGIFY_PREFIX_TYPES);
/**
 * @constant {RegExp} HTML_ELEMENT_REGEXP
 */

exports.STRINGIFY_TYPEOF_TYPES = STRINGIFY_TYPEOF_TYPES;
var HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
/**
 * @constant {Object} MATH_OBJECT
 */

exports.HTML_ELEMENT_REGEXP = HTML_ELEMENT_REGEXP;
var MATH_OBJECT = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2'].reduce(function (mathObject, property) {
  var _extends2;

  return _extends({}, mathObject, (_extends2 = {}, _extends2[property] = Math[property], _extends2));
}, {});
exports.MATH_OBJECT = MATH_OBJECT;
},{}],"../node_modules/hash-it/es/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStringifiedValue = exports.tryCatch = exports.getIntegerHashValue = exports.createReplacer = exports.getCircularStackValue = exports.getValueForStringification = exports.getStringifiedValueByObjectClass = exports.getStringifiedElement = exports.getTypePrefixedString = exports.getStringFromArrayBuffer = exports.getIterablePairs = void 0;

var _jsonPrune = _interopRequireDefault(require("json-prune"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
}; // external dependencies


var toString = Object.prototype.toString;
/**
 * @function getIterablePairs
 *
 * @description
 * get the [key,value] pairs for maps and sets
 *
 * @param {Map|Set} iterable the iterable to map
 * @param {string} type the type of object class
 * @returns {Array<Array>} the [key, value] pairs
 */

var getIterablePairs = function getIterablePairs(iterable, type) {
  var pairs = [_constants.OBJECT_CLASS_MAP[type]];
  iterable.forEach(function (item, key) {
    pairs.push([key, item]);
  });
  return pairs;
};
/**
 * @function getStringFromArrayBuffer
 *
 * @description
 * get the string value of the buffer passed
 *
 * @param {ArrayBuffer} buffer the array buffer to convert
 * @returns {string} the stringified buffer
 */


exports.getIterablePairs = getIterablePairs;

var getStringFromArrayBuffer = function getStringFromArrayBuffer(buffer) {
  return typeof Uint16Array === 'undefined' ? '' : String.fromCharCode.apply(null, new Uint16Array(buffer));
};
/**
 * @function getTypePrefixedString
 *
 * @description
 * prepend type to string value
 *
 * @param {string} string the string to prepend
 * @param {string} type the type to add as a prefix
 * @returns {string} the prefixed string
 */


exports.getStringFromArrayBuffer = getStringFromArrayBuffer;

var getTypePrefixedString = function getTypePrefixedString(string, type) {
  return _constants.OBJECT_CLASS_MAP[type] + ' ' + string;
};
/**
 * @function getStringifiedElement
 *
 * @description
 * get the HTML element stringified by its type, attributes, and contents
 *
 * @param {HTMLElement} element the element to stringify
 * @returns {string} the stringified elements
 */


exports.getTypePrefixedString = getTypePrefixedString;

var getStringifiedElement = function getStringifiedElement(element) {
  var attributes = element.attributes;
  var attributesString = '';

  for (var index = 0; index < attributes.length; index++) {
    attributesString += attributes[index].name + '="' + attributes[index].value + '",';
  }

  return element.tagName + ' ' + attributesString + ' ' + element.innerHTML;
};
/**
 * @function getStringifiedValueByObjectClass
 *
 * @description
 * get the stringified value of the object based based on its toString class
 *
 * @param {*} object the object to get the stringification value for
 * @param {string} [passedObjectClass] the object class for the object passed
 * @returns {*} the value to stringify with
 */


exports.getStringifiedElement = getStringifiedElement;

var getStringifiedValueByObjectClass = function getStringifiedValueByObjectClass(object, passedObjectClass) {
  var objectClass = passedObjectClass || toString.call(object);

  if (~_constants.STRINGIFY_SELF_CLASSES.indexOf(objectClass)) {
    return object;
  }

  if (~_constants.STRINGIFY_PREFIX_CLASSES.indexOf(objectClass) || object === null) {
    return getTypePrefixedString(object, objectClass);
  }

  if (objectClass === _constants.OBJECT_CLASS_TYPE_MAP.DATE) {
    return getTypePrefixedString(object.valueOf(), objectClass);
  }

  if (~_constants.STRINGIFY_ITERABLE_CLASSES.indexOf(objectClass)) {
    return getIterablePairs(object, objectClass);
  }

  if (~_constants.STRINGIFY_NOT_ENUMERABLE_CLASSES.indexOf(objectClass)) {
    return getTypePrefixedString('NOT_ENUMERABLE', objectClass);
  }

  if (objectClass === _constants.OBJECT_CLASS_TYPE_MAP.ARRAYBUFFER) {
    return getTypePrefixedString(getStringFromArrayBuffer(object), objectClass);
  }

  if (objectClass === _constants.OBJECT_CLASS_TYPE_MAP.DATAVIEW) {
    return getTypePrefixedString(getStringFromArrayBuffer(object.buffer), objectClass);
  }

  if (~_constants.STRINGIFY_PREFIX_JOIN_CLASSES.indexOf(objectClass)) {
    return getTypePrefixedString(object.join(','), objectClass);
  }

  if (objectClass === _constants.OBJECT_CLASS_TYPE_MAP.MATH) {
    return _constants.MATH_OBJECT;
  }

  return _constants.HTML_ELEMENT_REGEXP.test(objectClass) ? getTypePrefixedString(getStringifiedElement(object), _constants.OBJECT_CLASS_TYPE_MAP.HTMLELEMENT) : object;
};
/**
 * @function getValueForStringification
 *
 * @description
 * get the string value for the object used for stringification
 *
 * @param {*} object the object to get the stringification value for
 * @returns {*} the value to stringify with
 */


exports.getStringifiedValueByObjectClass = getStringifiedValueByObjectClass;

var getValueForStringification = function getValueForStringification(object) {
  var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);

  if (~_constants.STRINGIFY_SELF_TYPES.indexOf(type)) {
    return object;
  }

  if (~_constants.STRINGIFY_PREFIX_TYPES.indexOf(type)) {
    return getTypePrefixedString(~_constants.STRINGIFY_TOSTRING_TYPES.indexOf(type) ? object.constructor.prototype.toString.call(object) : object, toString.call(object));
  }

  return getStringifiedValueByObjectClass(object);
};
/**
 * @function getCircularStackValue
 *
 * @description
 * get the value either from the recursive storage stack
 * or itself after being added to that stack
 *
 * @param {*} value the value to check for existing
 * @param {string} type the type of the value
 * @param {Array<*>} stack the current stack of values
 * @param {number} circularCounter the counter of circular references
 * @returns {*} the value to apply
 */


exports.getValueForStringification = getValueForStringification;

var getCircularStackValue = function getCircularStackValue(value, type, stack, circularCounter) {
  if (!value) {
    return getTypePrefixedString(value, type);
  }

  if (circularCounter > _constants.RECURSIVE_COUNTER_CUTOFF) {
    stack.length = 0;
    return value;
  }

  var existingIndex = stack.indexOf(value);

  if (!~existingIndex) {
    stack.push(value);
    return value;
  }

  return '*Circular-' + existingIndex;
};
/**
 * @function createReplacer
 *
 * @description
 * create the replacer function leveraging closure for recursive stack storage
 *
 * @param {Array<*>} stack the stack to store in memory
 * @returns {function} the replacer to use
 */


exports.getCircularStackValue = getCircularStackValue;

var createReplacer = function createReplacer(stack) {
  var circularCounter = 1,
      objectClass = void 0;
  return function (key, value) {
    if (!key) {
      stack = [value];
      return value;
    }

    if (value === null) {
      return getStringifiedValueByObjectClass(value, _constants.OBJECT_CLASS_TYPE_MAP.NULL);
    }

    if (~_constants.STRINGIFY_TYPEOF_TYPES.indexOf(typeof value === 'undefined' ? 'undefined' : _typeof(value))) {
      return getValueForStringification(value);
    }

    objectClass = toString.call(value);

    if (~_constants.REPLACE_RECURSIVE_VALUE_CLASSES.indexOf(objectClass)) {
      return getCircularStackValue(value, objectClass, stack, ++circularCounter);
    }

    if (~_constants.REPLACE_STRINGIFICATION_CLASSES.indexOf(objectClass)) {
      return getStringifiedValueByObjectClass(value, objectClass);
    }

    return value;
  };
};
/**
 * @function getIntegerHashValue
 *
 * @description
 * based on string passed, get the integer hash value
 * through bitwise operation (based on spinoff of dbj2)
 *
 * @param {string} string the string to get the hash value for
 * @returns {number} the hash value
 */


exports.createReplacer = createReplacer;

var getIntegerHashValue = function getIntegerHashValue(string) {
  if (!string) {
    return 0;
  }

  var hashValue = 5381;

  for (var index = 0; index < string.length; index++) {
    hashValue = (hashValue << 5) + hashValue + string.charCodeAt(index);
  }

  return hashValue >>> 0;
};
/**
 * @function tryCatch
 *
 * @description
 * move try/catch to standalone function as any function that contains a try/catch
 * is not optimized (this allows optimization for as much as possible)
 *
 * @param {*} value the value to stringify
 * @returns {string} the stringified value
 */


exports.getIntegerHashValue = getIntegerHashValue;

var tryCatch = function tryCatch(value) {
  try {
    return JSON.stringify(value, createReplacer([]));
  } catch (exception) {
    return (0, _jsonPrune.default)(value);
  }
};
/**
 * @function getStringifiedValue
 *
 * @description
 * stringify the object passed leveraging JSON.stringify
 * with REPLACER, falling back to prune
 *
 * @param {*} object the object to stringify
 * @param {boolean} isCircular is the object circular or not
 * @returns {string} the stringified object
 */


exports.tryCatch = tryCatch;

var getStringifiedValue = function getStringifiedValue(object, isCircular) {
  var valueForStringification = getValueForStringification(object);

  if (typeof valueForStringification === 'string') {
    return valueForStringification;
  }

  return isCircular ? tryCatch(getValueForStringification(object)) : JSON.stringify(valueForStringification, createReplacer([]));
};

exports.getStringifiedValue = getStringifiedValue;
},{"json-prune":"../node_modules/json-prune/JSON.prune.js","./constants":"../node_modules/hash-it/es/constants.js"}],"../node_modules/hash-it/es/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _EMPTY_HASHES;

/**
 * @function hashIt
 *
 * @description
 * return the unique integer hash value for the object
 *
 * @param {*} object the object to hash
 * @param {boolean} [isCircular] is the object a circular object
 * @returns {number}
 */
var hashIt = function hashIt(object, isCircular) {
  var stringifiedValue = (0, _utils.getStringifiedValue)(object, isCircular);
  return (0, _utils.getIntegerHashValue)(stringifiedValue);
};

var UNDEFINED_HASH = hashIt(undefined);
var NULL_HASH = hashIt(null);
var EMPTY_ARRAY_HASH = hashIt([]);
var EMPTY_MAP_HASH = hashIt(new Map());
var EMPTY_NUMBER_HASH = hashIt(0);
var EMPTY_OBJECT_HASH = hashIt({});
var EMPTY_SET_HASH = hashIt(new Set());
var EMPTY_STRING_HASH = hashIt('');
var EMPTY_HASHES = (_EMPTY_HASHES = {}, _EMPTY_HASHES[EMPTY_ARRAY_HASH] = true, _EMPTY_HASHES[EMPTY_MAP_HASH] = true, _EMPTY_HASHES[EMPTY_NUMBER_HASH] = true, _EMPTY_HASHES[EMPTY_OBJECT_HASH] = true, _EMPTY_HASHES[EMPTY_SET_HASH] = true, _EMPTY_HASHES[EMPTY_STRING_HASH] = true, _EMPTY_HASHES[NULL_HASH] = true, _EMPTY_HASHES[UNDEFINED_HASH] = true, _EMPTY_HASHES);
/**
 * @function hashIt.isEqual
 *
 * @description
 * determine if all objects passed are equal in value to one another
 *
 * @param {...Array<*>} objects the objects to test for equality
 * @returns {boolean} are the objects equal
 */

hashIt.isEqual = function () {
  for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  var length = objects.length;

  if (length === 1) {
    throw new Error('isEqual requires at least two objects to be passed for comparison.');
  }

  for (var index = 1; index < length; index++) {
    if (hashIt(objects[index - 1]) !== hashIt(objects[index])) {
      return false;
    }
  }

  return true;
};
/**
 * @function hashIt.isEmpty
 *
 * @description
 * determine if object is empty, meaning it is an array / object / map / set with values populated,
 * or is a string with no length, or is undefined or null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object empty
 */


hashIt.isEmpty = function (object) {
  return !!EMPTY_HASHES[hashIt(object)];
};
/**
 * @function hashIt.isNull
 *
 * @description
 * determine if object is null
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object null
 */


hashIt.isNull = function (object) {
  return hashIt(object) === NULL_HASH;
};
/**
 * @function hashIt.isUndefined
 *
 * @description
 * determine if object is undefined
 *
 * @param {*} object the object to test
 * @returns {boolean} is the object undefined
 */


hashIt.isUndefined = function (object) {
  return hashIt(object) === UNDEFINED_HASH;
};

var _default = hashIt;
exports.default = _default;
},{"./utils":"../node_modules/hash-it/es/utils.js"}],"../node_modules/memoize-weak/lib/memoize.js":[function(require,module,exports) {
function isPrimitive(value) {
  return ((typeof value !== 'object') && (typeof value !== 'function')) || (value === null);
}

function MapTree() {
  this.childBranches = new WeakMap();
  this.primitiveKeys = new Map();
  this.hasValue = false;
  this.value = undefined;
}

MapTree.prototype.has = function has(key) {
  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
  return (keyObject ? this.childBranches.has(keyObject) : false);
};

MapTree.prototype.get = function get(key) {
  var keyObject = (isPrimitive(key) ? this.primitiveKeys.get(key) : key);
  return (keyObject ? this.childBranches.get(keyObject) : undefined);
};

MapTree.prototype.resolveBranch = function resolveBranch(key) {
  if (this.has(key)) { return this.get(key); }
  var newBranch = new MapTree();
  var keyObject = this.createKey(key);
  this.childBranches.set(keyObject, newBranch);
  return newBranch;
};

MapTree.prototype.setValue = function setValue(value) {
  this.hasValue = true;
  return (this.value = value);
};

MapTree.prototype.createKey = function createKey(key) {
  if (isPrimitive(key)) {
    var keyObject = {};
    this.primitiveKeys.set(key, keyObject);
    return keyObject;
  }
  return key;
};

MapTree.prototype.clear = function clear() {
  if (arguments.length === 0) {
    this.childBranches = new WeakMap();
    this.primitiveKeys.clear();
    this.hasValue = false;
    this.value = undefined;
  } else if (arguments.length === 1) {
    var key = arguments[0];
    if (isPrimitive(key)) {
      var keyObject = this.primitiveKeys.get(key);
      if (keyObject) {
        this.childBranches.delete(keyObject);
        this.primitiveKeys.delete(key);
      }
    } else {
      this.childBranches.delete(key);
    }
  } else {
    var childKey = arguments[0];
    if (this.has(childKey)) {
      var childBranch = this.get(childKey);
      childBranch.clear.apply(childBranch, Array.prototype.slice.call(arguments, 1));
    }
  }
};

module.exports = function memoize(fn) {
  var argsTree = new MapTree();

  function memoized() {
    var args = Array.prototype.slice.call(arguments);
    var argNode = args.reduce(function getBranch(parentBranch, arg) {
      return parentBranch.resolveBranch(arg);
    }, argsTree);
    if (argNode.hasValue) { return argNode.value; }
    var value = fn.apply(null, args);
    return argNode.setValue(value);
  }

  memoized.clear = argsTree.clear.bind(argsTree);

  return memoized;
};

},{}],"../node_modules/memoize-weak/index.js":[function(require,module,exports) {
module.exports = require('./lib/memoize');

},{"./lib/memoize":"../node_modules/memoize-weak/lib/memoize.js"}],"../node_modules/glamor-jss/lib/glamor-jss.cjs.js":[function(require,module,exports) {
module.exports=function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});r(2);var n=r(1),o=r(3),u=r.n(o),i=r(4),c=r.n(i),a=r(5),s=r.n(a),f=r(6),l=r.n(f),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},h={onCreateRule:function(e,t,r){return null==t&&"string"!=typeof e&&(t=e,e=void 0),Object.keys(t).forEach(function(e){0!==(e=e.trim()).indexOf(":")&&0!==e.indexOf(">")||(t["&"+e]=p({},t[e]),delete t[e])}),new l.a(e,t,r)}},y={onProcessRule:function(e){var t=e.selectorText,r=e.type,n=e.options.parent;return"style"!==r||n.type||/\[data-css-.+\]/.test(t)||(e.originalSelectorText=t,e.classSelector=t.substring(1),e.dataSelector="data-"+e.classSelector,e.selectorText=t+", ["+e.dataSelector+"]"),e}},d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};function m(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}var b=function(e){return"[object Object]"===Object.prototype.toString.call(e)},g=function(e){return null===e||void 0===e||!1===e||"object"===(void 0===e?"undefined":d(e))&&0===Object.keys(e).length},S=function e(t){return Object.keys(t).forEach(function(r){b(t[r])?e(t[r]):g(t[r])&&delete t[r]}),t},O=function(e){for(var t in e)return!1;return!0},j=function(e,t){var r,n=e.map(function(e){return e&&e.hash?t[e.hash].values:e}).map(function(e){return Array.isArray(e)?function(e){return e.reduce(function(e,t){return v({},e,t)},{})}((t=e,(r=Array.prototype).concat.apply(r,m(t)))):e;var t,r}).filter(function(e){return e}),o=function e(){for(var t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n];return r.reduce(function(t,r){return Object.keys(r).forEach(function(n){var o=t[n],u=r[n];Array.isArray(o)&&Array.isArray(u)?t[n]=o.concat.apply(o,m(u)):b(o)&&b(u)?t[n]=e(o,u):t[n]=u}),t},{})}.apply(void 0,m(n));return r=o,Object.keys(r).reduce(function(e,t){var n="other";return 0===t.indexOf("@supports")?n="supports":0===t.indexOf("@media")?n="media":0!==t.indexOf(":")&&0!==t.indexOf("&:")||(n="pseudo"),e[n][t]=r[t],e},{media:{},supports:{},pseudo:{},other:{}})},x=r(7);r.d(t,"renderToString",function(){return T}),r.d(t,"reset",function(){return A}),r.d(t,"jss",function(){return P}),r.d(t,"getSheet",function(){return k}),r.d(t,"css",function(){return R});var w=new x.a,T=function(){return w.registry.toString()},A=function(){return w.reset()},P=Object(n.create)(u()()),k=function(){return w.getSheet()},E={};P.use(y),P.use(h);var R=s()(function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=c()(t);if(n in E)return E[n];if(g(t))return;var o=j(t,E),u=["other","pseudo","media","supports"].reduce(function(e,t){var r=o[t];if(!O(r)){var u=S(r);return w.addRule(n,u)}return e},""),i=(a={},s=u.dataSelector,f="",s in a?Object.defineProperty(a,s,{value:f,enumerable:!0,configurable:!0,writable:!0}):a[s]=f,a);var a,s,f;return Object.defineProperties(i,{toString:{enumerable:!1,value:function(){return u.classSelector}},hash:{enumerable:!1,value:n},values:{enumerable:!1,value:t}}),E[n]=i,i});var C=0;R.keyframes=function(e,t){"string"!=typeof e&&(t=e,e="animation");var r=e+"-"+C++;return w.addRule("@keyframes "+r,t),r};t.default=R},function(e,t){e.exports=require("jss")},function(e,t){e.exports=require("es6-weak-map/implement")},function(e,t){e.exports=require("jss-preset-default")},function(e,t){e.exports=require("hash-it")},function(e,t){e.exports=require("memoize-weak")},function(e,t){e.exports=require("jss/lib/rules/StyleRule")},function(e,t,r){"use strict";(function(e){var n=r(1),o=(r.n(n),r(0)),u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};var i="production"!==e.env.NODE_ENV,c=function(){var e=this;this.registry=new n.SheetsRegistry,this.currentSheet=null,this.rulesCount=0,this.sheetCount=0,this.reset=function(){e.registry.reset(),e.currentSheet=null},this.createSheet=function(){var t=e.options.sheetPrefix,r=o.jss.createStyleSheet(null,{generateClassName:function(t){return e.options.classNamePrefix+"-"+t.key},meta:t+"-"+e.sheetCount++});return e.registry.add(r),r},this.getSheet=function(){return e.currentSheet||(e.currentSheet=e.createSheet()),e.currentSheet},this.addRule=function(t,r,n){var o=e.getSheet();i&&o.detach();var u=o.addRule(t,r,n);return++e.rulesCount%65534==0&&(e.currentSheet=e.createSheet()),i&&o.attach(),u}};t.a=function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),c.call(this),this.options=u({sheetPrefix:"glamor-jss",classNamePrefix:"css"},t)}}).call(t,r(8))},function(e,t){var r,n,o=e.exports={};function u(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function c(e){if(r===setTimeout)return setTimeout(e,0);if((r===u||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:u}catch(e){r=u}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var a,s=[],f=!1,l=-1;function p(){f&&a&&(f=!1,a.length?s=a.concat(s):l=-1,s.length&&h())}function h(){if(!f){var e=c(p);f=!0;for(var t=s.length;t;){for(a=s,s=[];++l<t;)a&&a[l].run();l=-1,t=s.length}a=null,f=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function y(e,t){this.fun=e,this.array=t}function d(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new y(e,t)),1!==s.length||f||c(h)},y.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=d,o.addListener=d,o.once=d,o.off=d,o.removeListener=d,o.removeAllListeners=d,o.emit=d,o.prependListener=d,o.prependOnceListener=d,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}}]);
},{"jss":"../node_modules/jss/lib/index.js","es6-weak-map/implement":"../node_modules/es6-weak-map/implement.js","jss-preset-default":"../node_modules/jss-preset-default/lib/index.js","hash-it":"../node_modules/hash-it/es/index.js","memoize-weak":"../node_modules/memoize-weak/index.js","jss/lib/rules/StyleRule":"../node_modules/jss/lib/rules/StyleRule.js"}],"src/ui/banner.css.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glamorJss = _interopRequireDefault(require("glamor-jss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  container: (0, _glamorJss.default)({
    position: 'fixed',
    bottom: '0',
    left: '0',
    color: 'red',
    '&.hide': {
      display: 'none'
    }
  }),
  title: (0, _glamorJss.default)({
    color: 'blue'
  }),
  description: (0, _glamorJss.default)({
    color: 'yellow'
  }),
  button: (0, _glamorJss.default)({
    color: 'purple'
  })
};
exports.default = _default;
},{"glamor-jss":"../node_modules/glamor-jss/lib/glamor-jss.cjs.js"}],"src/ui/banner.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crel = _interopRequireDefault(require("crel"));

var _store = _interopRequireDefault(require("../store"));

var _banner = _interopRequireDefault(require("./banner.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var body = document.getElementsByTagName('body')[0];
var $banner;
var $accept;
var $configure;
var cookies;

function create() {
  $accept = (0, _crel.default)('button', {
    class: _banner.default.button
  }, 'Accept all'), $configure = (0, _crel.default)('button', {
    class: _banner.default.button
  }, 'Configure');
  $banner = (0, _crel.default)('div', {
    class: [_banner.default.container, !_store.default.bannerStatus.get() ? 'hide' : ''].join(' ')
  }, (0, _crel.default)('div', {
    class: _banner.default.title
  }, 'Title banner'), (0, _crel.default)('div', {
    class: _banner.default.description
  }, 'Description banner'), $accept, $configure);
  body.appendChild($banner);
  listen();
}

function update() {
  $configure.innerHTML = 'test';
}

function destroy() {
  unlisten();
}

function show() {
  $banner.classList.remove('hide');
}

function hide() {
  $banner.classList.add('hide');
}

function onAccept() {
  _store.default.bannerStatus.set(false);

  for (var key in cookies) {
    _store.default[key].set(true);
  }
}

function onConfigure() {
  _store.default.bannerStatus.set(false);

  _store.default.popinStatus.set(true);
}

var toggle = function toggle(bool) {
  return bool ? show() : hide();
};

function listen() {
  _store.default.bannerStatus.listen(toggle);

  $accept.addEventListener('click', onAccept);
  $configure.addEventListener('click', onConfigure);
}

function unlisten() {
  _store.default.bannerStatus.unlisten(toggle);

  $accept.removeEventListener('click', onAccept);
  $configure.removeEventListener('click', onConfigure);
}

function init(translations, cks) {
  cookies = cks;
  create();
  return {
    update: update,
    destroy: destroy
  };
}

var _default = init;
exports.default = _default;
},{"crel":"../node_modules/crel/crel.mjs","../store":"src/store.js","./banner.css":"src/ui/banner.css.js"}],"src/ui/popin.css.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glamorJss = _interopRequireDefault(require("glamor-jss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  container: (0, _glamorJss.default)({
    zIndex: 10,
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
    '&.hide': {
      display: 'none'
    }
  }),
  form: (0, _glamorJss.default)({
    padding: '10px'
  }),
  field: (0, _glamorJss.default)({
    color: 'blue',
    display: 'flex',
    flexDirection: 'row'
  }),
  label: (0, _glamorJss.default)({
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  }),
  fieldTitle: (0, _glamorJss.default)({
    color: 'blue'
  }),
  fieldDescription: (0, _glamorJss.default)({
    color: 'blue'
  })
};
exports.default = _default;
},{"glamor-jss":"../node_modules/glamor-jss/lib/glamor-jss.cjs.js"}],"src/ui/popin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crel = _interopRequireDefault(require("crel"));

var _popin = _interopRequireDefault(require("./popin.css"));

var _store = _interopRequireDefault(require("../store"));

var _types = _interopRequireDefault(require("../types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var body = document.getElementsByTagName('body')[0];
var translations;
var cookies;
var $popin;
var $fields = [];
var $form;

function createField(key) {
  var _translations$key = translations[key],
      title = _translations$key.title,
      description = _translations$key.description;
  return (0, _crel.default)('div', {
    class: _popin.default.field
  }, (0, _crel.default)('input', {
    type: 'checkbox',
    name: key,
    id: key
  }), (0, _crel.default)('label', {
    class: _popin.default.label,
    type: 'checkbox',
    for: key
  }, (0, _crel.default)('span', {
    class: _popin.default.fieldTitle
  }, title), (0, _crel.default)('span', {
    class: _popin.default.fieldDescription
  }, description)));
}

function create() {
  for (var key in cookies) {
    $fields.push(createField(key));
  }

  $form = (0, _crel.default)('form', {
    class: _popin.default.form
  }, $fields, (0, _crel.default)('input', {
    type: 'submit'
  }, 'submit'));
  $popin = (0, _crel.default)('div', {
    class: [_popin.default.container, !_store.default.popinStatus.get() ? 'hide' : ''].join(' ')
  }, $form);
  body.appendChild($popin);
  listen();
}

function onSubmit(e) {
  e.preventDefault();
  var $inputs = [].slice.call(e.srcElement.querySelectorAll('input[type="checkbox"]'));
  var state = {};
  $inputs.forEach(function (input) {
    var key = input.getAttribute('name');
    var val = input.checked;
    state[key] = val;

    _store.default[key].set(val);
  });
  if (!state[_types.default.FUNCTIONAL]) eraseAll();

  _store.default.popinStatus.set(false);
}

function show() {
  $popin.classList.remove('hide');
}

function hide() {
  $popin.classList.add('hide');
}

var toggle = function toggle(bool) {
  return bool ? show() : hide();
};

function listen() {
  $form.addEventListener('submit', onSubmit);

  _store.default.popinStatus.listen(toggle);
}

function unlisten() {
  $form.removeEventListener('submit', onSubmit);

  _store.default.popinStatus.unlisten(toggle);
}

function update() {}

function destroy() {
  unlisten();
}

function init(trlts, cks) {
  translations = trlts;
  cookies = cks;
  create();
  return {
    update: update,
    destroy: destroy
  };
}

var _default = init;
exports.default = _default;
},{"crel":"../node_modules/crel/crel.mjs","./popin.css":"src/ui/popin.css.js","../store":"src/store.js","../types":"src/types.js"}],"src/ui/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _banner = _interopRequireDefault(require("./banner"));

var _popin = _interopRequireDefault(require("./popin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var banner;
var popin;

function update() {
  banner.update();
  popin.update();
}

function destroy() {
  banner.destroy();
  popin.destroy();
}

function init(cookies, translations) {
  banner = (0, _banner.default)(translations, cookies);
  popin = (0, _popin.default)(translations, cookies);
  return {
    update: update,
    destroy: destroy
  };
}

var _default = init;
exports.default = _default;
},{"./banner":"src/ui/banner.js","./popin":"src/ui/popin.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "store", {
  enumerable: true,
  get: function () {
    return _store.default;
  }
});
Object.defineProperty(exports, "TYPES", {
  enumerable: true,
  get: function () {
    return _types.default;
  }
});

var _state = require("./src/state");

var _ga = _interopRequireDefault(require("./src/ga.js"));

var _store = _interopRequireDefault(require("./src/store"));

var _cookie = require("./src/cookie");

var _types = _interopRequireDefault(require("./src/types"));

var _index = _interopRequireDefault(require("./src/ui/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _cookies = {};
var services = {};
var customCookies = {};
var UI;

var update = function update(name) {
  return function (val) {
    console.log('UPDATE COOKIE', name, val, _cookies);

    _cookies[name].set(val ? '1' : '0');
  };
};

var erase = function erase() {
  _cookies.forEach(function (cookie) {
    return cookie.erase();
  });
};

function listen() {
  for (var key in _cookies) {
    _store.default[key].listen(update(key));
  }
}

function init(params) {
  var plugins = params.plugins,
      logs = params.logs,
      translations = params.translations;
  var storeValues = {};
  storeValues.logs = params.logs || false;
  var isFunctional;
  var isPerformance;
  var isSocial;
  plugins.forEach(function (plugin) {
    var name = plugin.name;
    plugin.logs = logs;
    isFunctional |= plugin.type === _types.default.FUNCTIONAL;
    isPerformance |= plugin.type === _types.default.PERFORMANCE;
    isSocial |= plugin.type === _types.default.SOCIAL;

    if (plugin.service === 'GA' && plugin.type === _types.default.PERFORMANCE) {
      services.ga = (0, _ga.default)(plugin);
    } else {
      customCookies[name] = new _cookie.CookieAbstraction(plugin.name);
    }
  }); // Enable functionnal when there at least 1 coookie

  if (isSocial || isPerformance) isFunctional = true;

  if (isFunctional) {
    _cookies[_types.default.FUNCTIONAL] = new _cookie.CookieAbstraction(_types.default.FUNCTIONAL);
    storeValues[_types.default.FUNCTIONAL] = _cookies[_types.default.FUNCTIONAL].get() === '1';
  }

  if (isPerformance) {
    _cookies[_types.default.PERFORMANCE] = new _cookie.CookieAbstraction(_types.default.PERFORMANCE);
    storeValues[_types.default.PERFORMANCE] = _cookies[_types.default.PERFORMANCE].get() === '1';
  }

  if (isSocial) {
    _cookies[_types.default.SOCIAL] = new _cookie.CookieAbstraction(_types.default.SOCIAL);
    storeValues[_types.default.SOCIAL] = _cookies[_types.default.SOCIAL].get() === '1';
  } // Create store from dynamic & static values


  Object.assign(_store.default, (0, _state.createStore)(Object.assign(_store.default, storeValues)));
  Object.assign(_cookie.cookies, Object.assign(customCookies, _cookies));
  console.log(_cookie.cookies); // Show cookie is there's no functionnal cookie

  _store.default.bannerStatus.set(!_store.default[_types.default.FUNCTIONAL].get()); // Listen store events


  listen(); // UI Instance

  UI = (0, _index.default)(_cookies, translations); // return cookies
}
},{"./src/state":"src/state/index.js","./src/ga.js":"src/ga.js","./src/store":"src/store.js","./src/cookie":"src/cookie.js","./src/types":"src/types.js","./src/ui/index":"src/ui/index.js"}],"test.js":[function(require,module,exports) {
"use strict";

var _index = require("./index");

var _translations;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var plugins = [{
  type: _index.TYPES.PERFORMANCE,
  service: 'GA',
  UA: 'UA-150555555-1',
  anonymizeIp: true
}, {
  type: _index.TYPES.FUNCTIONAL,
  name: 'experience'
}, {
  type: _index.TYPES.SOCIAL,
  name: 'social'
}];
var cookies = (0, _index.init)({
  logs: true,
  translations: (_translations = {}, _defineProperty(_translations, _index.TYPES.FUNCTIONAL, {
    title: 'title func',
    description: 'description func'
  }), _defineProperty(_translations, _index.TYPES.PERFORMANCE, {
    title: 'title perf',
    description: 'description perf'
  }), _defineProperty(_translations, _index.TYPES.SOCIAL, {
    title: 'title social',
    description: 'description social'
  }), _translations),
  plugins: plugins
}); // cookies.ga.trigger((gtag) => { gtag.sendPageView() })
// store.functional.listen(val => console.log(val))
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49787" + '/');

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