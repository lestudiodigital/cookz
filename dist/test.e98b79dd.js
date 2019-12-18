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
exports.add = add;
exports.get = get;
exports.set = set;
exports.eraseAll = eraseAll;
exports.cookies = void 0;

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

var cookies = {};
exports.cookies = cookies;

function add(key) {
  if (cookies[key]) {
    console.warn('Cookie already exist');
    return;
  }

  return cookies[key] = new CookieAbstraction(key);
}

function get(key) {
  if (!cookies[key]) console.warn("".concat(key, " does not exist"));else return cookies[key];
}

function set(key, val) {
  if (!cookies[key]) console.warn("".concat(key, " does not exist"));else cookies[key].set(val);
}

function eraseAll() {
  for (var key in cookies) {
    cookies[key].erase();
  }
}
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
  var cookie = (0, _cookie.add)('_ga');
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
  SOCIAL: 'social',
  ADVERTISING: 'advertising'
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
},{}],"node_modules/classnames/index.js":[function(require,module,exports) {
var define;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"src/ui/banner.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crel = _interopRequireDefault(require("crel"));

var _classnames = _interopRequireDefault(require("classnames"));

var _store = _interopRequireDefault(require("../store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $banner;
var $accept;
var $configure;
var cookies;

function create() {
  $accept = (0, _crel.default)('button', {
    class: 'banner-button'
  }, 'Accept all'), $configure = (0, _crel.default)('button', {
    class: 'banner-button'
  }, 'Configure');
  $banner = (0, _crel.default)('div', {
    class: (0, _classnames.default)('banner-component', {
      hide: !_store.default.bannerStatus.get()
    })
  }, (0, _crel.default)('div', {
    class: 'banner-content'
  }, (0, _crel.default)('div', {
    class: 'banner-title'
  }, 'Title banner'), (0, _crel.default)('div', {
    class: 'banner-description'
  }, 'Description banner'), (0, _crel.default)('div', {
    class: 'banner-ctas'
  }, $accept, $configure)));
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
    destroy: destroy,
    dom: $banner
  };
}

var _default = init;
exports.default = _default;
},{"crel":"../node_modules/crel/crel.mjs","classnames":"node_modules/classnames/index.js","../store":"src/store.js"}],"src/ui/popin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crel = _interopRequireDefault(require("crel"));

var _store = _interopRequireDefault(require("../store"));

var _types = _interopRequireDefault(require("../types"));

var _cookie = require("../cookie");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translations;
var cookies;
var $popin;
var $fields = [];
var $form;

function createField(key) {
  var field = translations[key];

  if (!field || !field.title || !field.description) {
    console.warn("Missing title or description for type ".concat(key));
    return;
  }

  var inputParams = {
    type: 'checkbox',
    name: key,
    id: key
  };
  if (_store.default[key].get()) inputParams.checked = true;
  $fields.push((0, _crel.default)('div', {
    class: 'field'
  }, (0, _crel.default)('input', inputParams), (0, _crel.default)('label', {
    class: 'label',
    type: 'checkbox',
    for: key
  }, (0, _crel.default)('span', {
    class: 'field-title'
  }, field.title), (0, _crel.default)('span', {
    class: 'field-description'
  }, field.description))));
}

function create() {
  for (var key in cookies) {
    createField(key);
  }

  $form = (0, _crel.default)('form', $fields, (0, _crel.default)('input', {
    type: 'submit'
  }, 'submit'));
  $popin = (0, _crel.default)('div', {
    class: (0, _classnames.default)('popin-component', {
      hide: !_store.default.popinStatus.get()
    })
  }, $form);
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

    (0, _cookie.set)(key, val ? '1' : '0');
  });
  if (!state[_types.default.FUNCTIONAL]) (0, _cookie.eraseAll)();

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
    destroy: destroy,
    dom: $popin
  };
}

var _default = init;
exports.default = _default;
},{"crel":"../node_modules/crel/crel.mjs","../store":"src/store.js","../types":"src/types.js","../cookie":"src/cookie.js","classnames":"node_modules/classnames/index.js"}],"src/ui/debug.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crel = _interopRequireDefault(require("crel"));

var _store = _interopRequireDefault(require("../store"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $fields = {};
var $debug;

function createField(key, val) {
  return (0, _crel.default)('div', {
    class: (0, _classnames.default)('debug-field', {
      valid: val
    })
  }, "".concat(key, " = ").concat(val));
}

var updateField = function updateField(key) {
  return function (val) {
    $fields[key].innerHTML = "".concat(key, " = ").concat(val);
    $fields[key].classList.toggle('valid', val);
  };
};

function create() {
  for (var key in _store.default) {
    $fields[key] = createField(key, _store.default[key].get());
  }

  $debug = (0, _crel.default)('div', {
    class: 'debug-component'
  }, Object.values($fields));
  listen();
}

function listen() {
  for (var key in _store.default) {
    _store.default[key].listen(updateField(key));
  }
}

function unlisten() {
  for (var key in _store.default) {
    _store.default[key].unlisten(updateField);
  }
}

function update() {}

function destroy() {
  unlisten();
}

function init() {
  create();
  return {
    update: update,
    destroy: destroy,
    dom: $debug
  };
}

var _default = init;
exports.default = _default;
},{"crel":"../node_modules/crel/crel.mjs","../store":"src/store.js","classnames":"node_modules/classnames/index.js"}],"src/ui/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _banner = _interopRequireDefault(require("./banner"));

var _popin = _interopRequireDefault(require("./popin"));

var _debug = _interopRequireDefault(require("./debug"));

var _store = _interopRequireDefault(require("../store"));

var _crel = _interopRequireDefault(require("crel"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var banner;
var popin;
var debug;
var body = document.getElementsByTagName('body')[0];

function update() {
  banner.update();
  popin.update();
  debug && debug.update();
}

function destroy() {
  banner.destroy();
  popin.destroy();
  debug && debug.destroy();
}

function init(cookies, translations, dbg) {
  var className = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  banner = (0, _banner.default)(translations, cookies);
  popin = (0, _popin.default)(translations, cookies);
  if (dbg) debug = (0, _debug.default)();
  var $cookz = (0, _crel.default)('div', {
    class: (0, _classnames.default)('cookz-component', className)
  }, banner.dom, popin.dom, dbg ? debug.dom : null);
  body.appendChild($cookz);
  return {
    update: update,
    destroy: destroy,
    dom: $cookz
  };
}
},{"./banner":"src/ui/banner.js","./popin":"src/ui/popin.js","./debug":"src/ui/debug.js","../store":"src/store.js","crel":"../node_modules/crel/crel.mjs","classnames":"node_modules/classnames/index.js"}],"node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel/src/builtins/bundle-url.js"}],"src/main.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
Object.defineProperty(exports, "css", {
  enumerable: true,
  get: function () {
    return _main.default;
  }
});
exports.services = exports.default = void 0;

var _state = require("./src/state");

var _ga = _interopRequireDefault(require("./src/ga.js"));

var _store = _interopRequireDefault(require("./src/store"));

var _cookie = require("./src/cookie");

var _types = _interopRequireDefault(require("./src/types"));

var _index = _interopRequireDefault(require("./src/ui/index"));

var _main = _interopRequireDefault(require("./src/main.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_main.default);
var _cookies = {};
var customCookies = {};
var services = {};
exports.services = services;
var UI;

var update = function update(name) {
  return function (val) {
    _store.default.logs.get() && console.log("[store] => update ".concat(name, " to ").concat(val));

    _cookies[name].set(val ? '1' : '0');
  };
};

function listen() {
  for (var key in _cookies) {
    _store.default[key].listen(update(key));
  }
}

function init(params) {
  var cookies = params.cookies,
      logs = params.logs,
      translations = params.translations,
      debug = params.debug,
      className = params.className;
  var storeValues = {};
  storeValues.logs = params.logs || false;
  var isFunctional;
  var isPerformance;
  var isSocial;
  var isAdvertising;
  cookies.forEach(function (cookie) {
    var name = cookie.name;
    isFunctional |= cookie.type === _types.default.FUNCTIONAL;
    isPerformance |= cookie.type === _types.default.PERFORMANCE;
    isSocial |= cookie.type === _types.default.SOCIAL;
    isAdvertising |= cookie.type === _types.default.ADVERTISING; // GA service

    if (cookie.service === 'GA' && cookie.type === _types.default.PERFORMANCE) {
      services.ga = (0, _ga.default)(cookie);
    } else if (cookie.type === _types.default.FUNCTIONAL) {
      customCookies[name] = (0, _cookie.add)(cookie.name);
    }
  }); // Enable functionnal when there at least 1 coookie

  if (isSocial || isPerformance || isAdvertising) isFunctional = true; // Check functional type

  if (isFunctional) {
    _cookies[_types.default.FUNCTIONAL] = (0, _cookie.add)(_types.default.FUNCTIONAL);
    storeValues[_types.default.FUNCTIONAL] = _cookies[_types.default.FUNCTIONAL].get() === '1';
  } // Check performance type


  if (isPerformance) {
    _cookies[_types.default.PERFORMANCE] = (0, _cookie.add)(_types.default.PERFORMANCE);
    storeValues[_types.default.PERFORMANCE] = _cookies[_types.default.PERFORMANCE].get() === '1';
  } // Check social type


  if (isSocial) {
    _cookies[_types.default.SOCIAL] = (0, _cookie.add)(_types.default.SOCIAL);
    storeValues[_types.default.SOCIAL] = _cookies[_types.default.SOCIAL].get() === '1';
  } // Check advertising type


  if (isAdvertising) {
    _cookies[_types.default.ADVERTISING] = (0, _cookie.add)(_types.default.ADVERTISING);
    storeValues[_types.default.ADVERTISING] = _cookies[_types.default.ADVERTISING].get() === '1';
  } // Create store from dynamic & static values


  Object.assign(_store.default, (0, _state.createStore)(Object.assign(_store.default, storeValues))); // Show cookie is there's no functionnal cookie

  _store.default.bannerStatus.set(!_cookies[_types.default.FUNCTIONAL].get()); // Listen store events


  listen(); // UI Instance

  UI = (0, _index.default)(_cookies, translations, debug, className);
}

var _default = init;
exports.default = _default;
},{"./src/state":"src/state/index.js","./src/ga.js":"src/ga.js","./src/store":"src/store.js","./src/cookie":"src/cookie.js","./src/types":"src/types.js","./src/ui/index":"src/ui/index.js","./src/main.scss":"src/main.scss"}],"test.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireWildcard(require("./index"));

var _translations;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cookies = [{
  type: _index.TYPES.PERFORMANCE,
  service: 'GA',
  UA: 'UA-150555555-1',
  anonymizeIp: true
}, {
  type: _index.TYPES.FUNCTIONAL,
  name: 'experience'
}, {
  type: _index.TYPES.SOCIAL
}, {
  type: _index.TYPES.ADVERTISING
}];
(0, _index.default)({
  logs: false,
  // debug: true,
  className: 'test-cookies',
  translations: (_translations = {
    banner: {
      title: '',
      description: '',
      accept: '',
      configure: ''
    }
  }, _defineProperty(_translations, _index.TYPES.FUNCTIONAL, {
    title: 'title func',
    description: 'description func'
  }), _defineProperty(_translations, _index.TYPES.PERFORMANCE, {
    title: 'title perf',
    description: 'description perf'
  }), _defineProperty(_translations, _index.TYPES.SOCIAL, {
    title: 'title social',
    description: 'description social'
  }), _defineProperty(_translations, _index.TYPES.ADVERTISING, {
    title: 'title advert',
    description: 'description advert'
  }), _translations),
  cookies: cookies
});
var $buttonBanner = document.getElementById('show-banner');
var $buttonPopin = document.getElementById('show-popin');
$buttonBanner.addEventListener('click', function () {
  _index.store.bannerStatus.set(true);
});
$buttonPopin.addEventListener('click', function () {
  _index.store.popinStatus.set(true);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57211" + '/');

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