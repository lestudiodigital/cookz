parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"zEJc":[function(require,module,exports) {
"use strict";function t(t,n,s,e){this.fn=n,this.ctx=s||null,this.owner=t,this.once=!!e}function n(t,n){n.prev&&(n.prev.next=n.next),n.next&&(n.next.prev=n.prev),n.ctx=n.fn=n.owner=null,n===t._first&&(t._first=n.next),n===t._last&&(t._last=n.prev)}function s(){}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,s.prototype.dispatch=function(t,n,s,e,i){for(var r=this._first;r;)r.fn.call(r.ctx,t,n,s,e,i),r.once&&this.unlisten(r),r=r.next},s.prototype.listen=function(n,s,e){var i=new t(this,n,s,e);return this._first?(this._last.next=i,i.prev=this._last,this._last=i):(this._first=i,this._last=i),i},s.prototype.listenOnce=function(t,n){return this.listen(t,n,!0)},s.prototype.unlisten=function(s,e){if(s instanceof t)return n(this,s);e||(e=null);for(var i=this._first;i;)i.fn===s&&i.ctx===e&&n(this,i),i=i.next},s.prototype.unlistenAll=function(){var t=this._first;for(this._first=this._last=null;t;)n(this,t),t=t.next};var e=s;exports.default=e;
},{}],"rsaY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("./Signal"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t){this.current=t}function o(t){var e={};for(var o in t)e[o]=new r(t[o]);return e=Object.freeze(e)}r.prototype=Object.create(t.default.prototype),r.prototype.constructor=r,r.prototype.dispatch=void 0,r.prototype.set=function(t,e){if(e||this.current!==t){this.current=t;for(var r=this._first;r;)r.once&&this.unlisten(r),r.fn.call(r.ctx,this.current),r=r.next}},r.prototype.get=function(t){return this.current};var n=o;exports.default=n;
},{"./Signal":"zEJc"}],"HavA":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"createStore",{enumerable:!0,get:function(){return e.default}}),Object.defineProperty(exports,"Signal",{enumerable:!0,get:function(){return r.default}});var e=t(require("./createStore")),r=t(require("./Signal"));function t(e){return e&&e.__esModule?e:{default:e}}
},{"./createStore":"rsaY","./Signal":"zEJc"}],"Teav":[function(require,module,exports) {
exports.defaults={},exports.set=function(e,t,o){var n=o||{},p=exports.defaults,r=n.expires||p.expires,i=n.domain||p.domain,s=void 0!==n.path?n.path:void 0!==p.path?p.path:"/",a=void 0!==n.secure?n.secure:p.secure,c=void 0!==n.httponly?n.httponly:p.httponly,d=void 0!==n.samesite?n.samesite:p.samesite,l=r?new Date("number"==typeof r?(new Date).getTime()+864e5*r:r):0;document.cookie=e.replace(/[^+#$&^`|]/g,encodeURIComponent).replace("(","%28").replace(")","%29")+"="+t.replace(/[^+#$&\/:<-\[\]-}]/g,encodeURIComponent)+(l&&l.getTime()>=0?";expires="+l.toUTCString():"")+(i?";domain="+i:"")+(s?";path="+s:"")+(a?";secure":"")+(c?";httponly":"")+(d?";samesite="+d:"")},exports.get=function(e){for(var t=document.cookie.split(";");t.length;){var o=t.pop(),n=o.indexOf("=");if(n=n<0?o.length:n,decodeURIComponent(o.slice(0,n).replace(/^\s+/,""))===e)return decodeURIComponent(o.slice(n+1))}return null},exports.erase=function(e,t){exports.set(e,"",{expires:-1,domain:t&&t.domain,path:t&&t.path,secure:0,httponly:0})},exports.all=function(){for(var e={},t=document.cookie.split(";");t.length;){var o=t.pop(),n=o.indexOf("=");n=n<0?o.length:n,e[decodeURIComponent(o.slice(0,n).replace(/^\s+/,""))]=decodeURIComponent(o.slice(n+1))}return e};
},{}],"MDSA":[function(require,module,exports) {
"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function t(e,t,o){return t&&n(e.prototype,t),o&&n(e,o),e}var o;Object.defineProperty(exports,"__esModule",{value:!0}),exports.add=s,exports.get=a,exports.set=c,exports.eraseAll=u,exports.cookies=void 0,"undefined"!=typeof window&&(o=require("browser-cookies"));var r=function(){function n(t){e(this,n),this.key=t}return t(n,[{key:"get",value:function(){return!!o&&o.get(this.key)}},{key:"set",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{expires:365};o&&o.set(this.key,e,n)}},{key:"erase",value:function(){o&&o.erase(this.key)}}]),n}(),i={};function s(e){if(!i[e])return i[e]=new r(e);console.warn("Cookie already exist")}function a(e){if(i[e])return i[e];console.warn("".concat(e," does not exist"))}function c(e,n){i[e]?i[e].set(n):console.warn("".concat(e," does not exist"))}function u(){for(var e in i)i[e].erase()}exports.cookies=i;
},{"browser-cookies":"Teav"}],"ONc1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={popinStatus:!1,bannerStatus:!1};exports.default=e;
},{}],"sn6o":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=require("./cookie"),t=a(require("./store"));function a(e){return e&&e.__esModule?e:{default:e}}function n(e){try{var t=1e3*Number(e.split(".").pop()),a=(new Date).getTime(),n=new Date(t).getTime()+33696e6;return Math.round((n-a)/1e3)}catch(r){return 33696e3}}function r(e){var t=document.createElement("script"),a=document.createElement("script");t.setAttribute("async","true"),t.setAttribute("src","https://www.googletagmanager.com/gtag/js?id=".concat(e)),a.setAttribute("type","text/javascript"),a.innerHTML="\n    window.dataLayer = window.dataLayer || [];\n    function gtag () { dataLayer.push(arguments) };\n    window.gtag = gtag;\n  ";var n=document.getElementsByTagName("body")[0];n.appendChild(t),n.appendChild(a)}function o(e,t){var a=e.UA,r=e.anonymizeIp,o=void 0===r||r,i=e.forceSSL,c=void 0===i||i,d=e.firstPageView,g=void 0!==d&&d;window.gtag("js",new Date);var u={cookie_expires:n(t),anonymize_ip:o,forceSSL:c,send_page_view:g};window.gtag("config","".concat(a),u)}function i(e){!0===t.default.functional.get()&&e(window.gta)}function c(t){t.name;t.logs&&console.log("[_ga] => INIT",t),r(t.UA);var a=(0,e.add)("_ga");return o(t,a.get()),{cookie:a,trigger:i}}var d=c;exports.default=d;
},{"./cookie":"MDSA","./store":"ONc1"}],"Omma":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={FUNCTIONAL:"functional",PERFORMANCE:"performance",SOCIAL:"social",ADVERTISING:"advertising"};exports.default=e;
},{}],"dTu4":[function(require,module,exports) {
"use strict";function e(e,t){return e(t={exports:{}},t.exports),t.exports}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(function(e,t){(t=>{const r="function",n="isNode",o=document,i=(e,t)=>typeof e===t,s=(e,t)=>{null!==t&&(Array.isArray(t)?t.map(t=>s(e,t)):(a[n](t)||(t=o.createTextNode(t)),e.appendChild(t)))};function a(e,t){let l,p,u=arguments,c=1;if(e=a.isElement(e)?e:o.createElement(e),i(t,"object")&&!a[n](t)&&!Array.isArray(t))for(l in c++,t)p=t[l],l=a.attrMap[l]||l,i(l,r)?l(e,p):i(p,r)?e[l]=p:e.setAttribute(l,p);for(;c<u.length;c++)s(e,u[c]);return e}a.attrMap={},a.isElement=(e=>e instanceof Element),a[n]=(e=>e instanceof Node),a.proxy=new Proxy(a,{get:(e,t)=>(!(t in a)&&(a[t]=a.bind(null,t)),a[t])}),((t,r)=>{e.exports=t})(a)})()}),r=t;exports.default=r;
},{}],"m5Ls":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e,t,n,a,u=i(require("crel")),r=i(require("../store"));function i(e){return e&&e.__esModule?e:{default:e}}function s(){t=(0,u.default)("button",{class:"banner-button"},"Accept all"),n=(0,u.default)("button",{class:"banner-button"},"Configure"),e=(0,u.default)("div",{class:["banner-component",r.default.bannerStatus.get()?"":"hide"].join(" ")},(0,u.default)("div",{class:"banner-title"},"Title banner"),(0,u.default)("div",{class:"banner-description"},"Description banner"),t,n),p()}function o(){n.innerHTML="test"}function l(){L()}function c(){e.classList.remove("hide")}function d(){e.classList.add("hide")}function f(){for(var e in r.default.bannerStatus.set(!1),a)r.default[e].set(!0)}function b(){r.default.bannerStatus.set(!1),r.default.popinStatus.set(!0)}var v=function(e){return e?c():d()};function p(){r.default.bannerStatus.listen(v),t.addEventListener("click",f),n.addEventListener("click",b)}function L(){r.default.bannerStatus.unlisten(v),t.removeEventListener("click",f),n.removeEventListener("click",b)}function S(t,n){return a=n,s(),{update:o,destroy:l,dom:e}}var m=S;exports.default=m;
},{"crel":"dTu4","../store":"ONc1"}],"KX9H":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e,t,i,n=l(require("crel")),u=l(require("../store")),s=l(require("../types")),a=require("../cookie");function l(e){return e&&e.__esModule?e:{default:e}}var r,o=[];function c(t){var i=e[t];if(i&&i.title&&i.description){var s={type:"checkbox",name:t,id:t};u.default[t].get()&&(s.checked=!0),o.push((0,n.default)("div",{class:"field"},(0,n.default)("input",s),(0,n.default)("label",{class:"label",type:"checkbox",for:t},(0,n.default)("span",{class:"field-title"},i.title),(0,n.default)("span",{class:"field-description"},i.description))))}else console.warn("Missing title or description for type ".concat(t))}function d(){for(var e in t)c(e);r=(0,n.default)("form",o,(0,n.default)("input",{type:"submit"},"submit")),i=(0,n.default)("div",{class:["popin-component",u.default.popinStatus.get()?"":"hide"].join(" ")},r),b()}function f(e){e.preventDefault();var t=[].slice.call(e.srcElement.querySelectorAll('input[type="checkbox"]')),i={};t.forEach(function(e){var t=e.getAttribute("name"),n=e.checked;i[t]=n,u.default[t].set(n),(0,a.set)(t,n?"1":"0")}),i[s.default.FUNCTIONAL]||(0,a.eraseAll)(),u.default.popinStatus.set(!1)}function p(){i.classList.remove("hide")}function v(){i.classList.add("hide")}var m=function(e){return e?p():v()};function b(){r.addEventListener("submit",f),u.default.popinStatus.listen(m)}function h(){r.removeEventListener("submit",f),u.default.popinStatus.unlisten(m)}function y(){}function k(){h()}function x(n,u){return e=n,t=u,d(),{update:y,destroy:k,dom:i}}var q=x;exports.default=q;
},{"crel":"dTu4","../store":"ONc1","../types":"Omma","../cookie":"MDSA"}],"RFu3":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("crel")),t=n(require("../store"));function n(e){return e&&e.__esModule?e:{default:e}}var u,r={};function o(t,n){return(0,e.default)("div",{class:["debug-field",n?"valid":""].join(" ")},"".concat(t," = ").concat(n))}var a=function(e){return function(t){r[e].innerHTML="".concat(e," = ").concat(t),r[e].classList.toggle("valid",t)}};function i(){for(var n in t.default)r[n]=o(n,t.default[n].get());u=(0,e.default)("div",{class:"debug-component"},Object.values(r)),c()}function c(){for(var e in t.default)t.default[e].listen(a(e))}function f(){for(var e in t.default)t.default[e].unlisten(a)}function d(){}function l(){f()}function s(){return i(),{update:d,destroy:l,dom:u}}var v=s;exports.default=v;
},{"crel":"dTu4","../store":"ONc1"}],"RaCv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=c;var e,t,r,d=i(require("./banner")),u=i(require("./popin")),o=i(require("./debug")),a=i(require("../store")),n=i(require("crel"));function i(e){return e&&e.__esModule?e:{default:e}}var s=document.getElementsByTagName("body")[0];function l(){e.update(),t.update(),r&&r.update()}function p(){e.destroy(),t.destroy(),r&&r.destroy()}function c(a,i,c){e=(0,d.default)(i,a),t=(0,u.default)(i,a),c&&(r=(0,o.default)());var f=(0,n.default)("div",{class:"cookz-component"},e.dom,t.dom,r.dom);return s.appendChild(f),{update:l,destroy:p,dom:f}}
},{"./banner":"m5Ls","./popin":"KX9H","./debug":"RFu3","../store":"ONc1","crel":"dTu4"}],"VU4E":[function(require,module,exports) {

},{}],"Focm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"store",{enumerable:!0,get:function(){return a.default}}),Object.defineProperty(exports,"TYPES",{enumerable:!0,get:function(){return u.default}}),Object.defineProperty(exports,"css",{enumerable:!0,get:function(){return l.default}}),exports.services=exports.default=void 0;var e=require("./src/state"),t=f(require("./src/ga.js")),a=f(require("./src/store")),r=require("./src/cookie"),u=f(require("./src/types")),d=f(require("./src/ui/index")),l=f(require("./src/main.scss"));function f(e){return e&&e.__esModule?e:{default:e}}console.log(l.default);var s,o={},n={},c={};exports.services=c;var i=function(e){return function(t){a.default.logs.get()&&console.log("[store] => update ".concat(e," to ").concat(t)),o[e].set(t?"1":"0")}};function N(){for(var e in o)a.default[e].listen(i(e))}function A(l){var f,i,A,O,I=l.cookies,g=(l.logs,l.translations),p=l.debug,E={};E.logs=l.logs||!1,I.forEach(function(e){var a=e.name;f|=e.type===u.default.FUNCTIONAL,i|=e.type===u.default.PERFORMANCE,A|=e.type===u.default.SOCIAL,O|=e.type===u.default.ADVERTISING,"GA"===e.service&&e.type===u.default.PERFORMANCE?c.ga=(0,t.default)(e):e.type===u.default.FUNCTIONAL&&(n[a]=(0,r.add)(e.name))}),(A||i||O)&&(f=!0),f&&(o[u.default.FUNCTIONAL]=(0,r.add)(u.default.FUNCTIONAL),E[u.default.FUNCTIONAL]="1"===o[u.default.FUNCTIONAL].get()),i&&(o[u.default.PERFORMANCE]=(0,r.add)(u.default.PERFORMANCE),E[u.default.PERFORMANCE]="1"===o[u.default.PERFORMANCE].get()),A&&(o[u.default.SOCIAL]=(0,r.add)(u.default.SOCIAL),E[u.default.SOCIAL]="1"===o[u.default.SOCIAL].get()),O&&(o[u.default.ADVERTISING]=(0,r.add)(u.default.ADVERTISING),E[u.default.ADVERTISING]="1"===o[u.default.ADVERTISING].get()),Object.assign(a.default,(0,e.createStore)(Object.assign(a.default,E))),a.default.bannerStatus.set(!o[u.default.FUNCTIONAL].get()),N(),s=(0,d.default)(o,g,p)}var O=A;exports.default=O;
},{"./src/state":"HavA","./src/ga.js":"sn6o","./src/store":"ONc1","./src/cookie":"MDSA","./src/types":"Omma","./src/ui/index":"RaCv","./src/main.scss":"VU4E"}],"HdJB":[function(require,module,exports) {
"use strict";var e,t=r(require("./index"));function n(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return n=function(){return e},e}function r(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n();if(t&&t.has(e))return t.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var c=i?Object.getOwnPropertyDescriptor(e,o):null;c&&(c.get||c.set)?Object.defineProperty(r,o,c):r[o]=e[o]}return r.default=e,t&&t.set(e,r),r}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=[{type:t.TYPES.PERFORMANCE,service:"GA",UA:"UA-150555555-1",anonymizeIp:!0},{type:t.TYPES.FUNCTIONAL,name:"experience"},{type:t.TYPES.SOCIAL},{type:t.TYPES.ADVERTISING}];(0,t.default)({logs:!1,debug:!0,translations:(e={banner:{title:"",description:"",accept:"",configure:""}},i(e,t.TYPES.FUNCTIONAL,{title:"title func",description:"description func"}),i(e,t.TYPES.PERFORMANCE,{title:"title perf",description:"description perf"}),i(e,t.TYPES.SOCIAL,{title:"title social",description:"description social"}),i(e,t.TYPES.ADVERTISING,{title:"title advert",description:"description advert"}),e),cookies:o});var c=document.getElementById("show-banner"),a=document.getElementById("show-popin");c.addEventListener("click",function(){t.store.bannerStatus.set(!0)}),a.addEventListener("click",function(){t.store.popinStatus.set(!0)});
},{"./index":"Focm"}]},{},["HdJB"], null)
//# sourceMappingURL=/cookz/test.91bf2eff.js.map