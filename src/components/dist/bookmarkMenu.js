"use strict";function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==_typeof(i)?i:i+""}function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}function _wrapNativeSuper(t){var r="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function _wrapNativeSuper(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(t))return r.get(t);r.set(t,Wrapper)}function Wrapper(){return _construct(t,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(t.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,t)},_wrapNativeSuper(t)}function _construct(t,e,r){if(_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var o=[null];o.push.apply(o,e);var p=new(t.bind.apply(t,o));return r&&_setPrototypeOf(p,r.prototype),p}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}var menuTemplate=document.createElement("template");var escapeHTMLPolicy=trustedTypes.createPolicy("forceInner",{createHTML:function createHTML(to_escape){return to_escape}});menuTemplate.innerHTML=escapeHTMLPolicy.createHTML("<style>\n              :host {\n              font-size: 20px;\n              color: black;\n              font-family: arial;\n              }\n\n               dialog {\n                width: auto;\n                max-width: fit-content;\n                height: auto;\n                max-height: fit-content;\n                background-color: #FDBA74;\n                position: fixed;\n                bottom: 20px;\n                z-index: 9999;\n                padding: 10px 20px;\n                border-width: 0px;\n                border-radius: 3px;\n              }\n\n            </style>\n\n            <dialog open>\n             \n                    <slot></slot>\n               \n            </dialog>");var BookmarkMenu=/*#__PURE__*/function(_HTMLElement){function BookmarkMenu(){var _this;_classCallCheck(this,BookmarkMenu);_this=_HTMLElement.call(this)||this;_this.attachShadow({mode:"open"});_this.shadowRoot.appendChild(menuTemplate.content.cloneNode(true));return _this}_inherits(BookmarkMenu,_HTMLElement);return _createClass(BookmarkMenu,[{key:"connectedCallback",value:function connectedCallback(){// will trigger everytime somthing is added to the dom
console.log("connected")}},{key:"disconnectedCallback",value:function disconnectedCallback(){// will trigger everytime somthing is removed from the dom
console.log("disconnected")}}])}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));customElements.define("bookmark-menu",BookmarkMenu);