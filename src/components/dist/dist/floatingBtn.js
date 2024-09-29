"use strict";function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==_typeof(i)?i:i+""}function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}function _wrapNativeSuper(t){var r="function"==typeof Map?new Map:void 0;return _wrapNativeSuper=function _wrapNativeSuper(t){if(null===t||!_isNativeFunction(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==r){if(r.has(t))return r.get(t);r.set(t,Wrapper)}function Wrapper(){return _construct(t,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(t.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,t)},_wrapNativeSuper(t)}function _construct(t,e,r){if(_isNativeReflectConstruct())return Reflect.construct.apply(null,arguments);var o=[null];o.push.apply(o,e);var p=new(t.bind.apply(t,o));return r&&_setPrototypeOf(p,r.prototype),p}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _isNativeFunction(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function buttonTemplate(){var template=document.createElement("template");escapeHTMLPolicy=trustedTypes.createPolicy("forceInner",{createHTML:function createHTML(to_escape){return to_escape}});template.innerHTML=escapeHTMLPolicy.createHTML("\n              <style>\n                :host { \n                  z-index: 2147483647 !important;\n                  position: fixed !important;\n                  bottom: 20px !important;\n                  right: 20px !important;\n                  tabindex: -1 !important;\n                  outline: none !important;\n                  overflow: visible !important;\n                }\n  \n                 button {\n                  width: 20px;\n                  height: 20px;\n                  padding: 0px;\n                  display: flex;\n                  justify-content: center;\n                  align-items: center;\n                  border-radius: 50%;\n                  border-width: 0px; \n                  font-size: 0px;\n                  overflow: hidden;\n                  background-color: #ff7f50f8;   \n                }\n  \n                button:hover, button:active {\n                  width: auto;\n                  max-width: fit-content;\n                  height: auto;\n                  padding: 10px 20px 10px 20px;\n                  border-radius: 3px;\n                  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);\n                  white-space: nowrap;\n                  overflow: visible;\n                  color: #f7f4ee;\n                  font-size: 16px;\n                  text-align: center;\n                  text-overflow: ellipsis;\n                  user-select: none;\n                  cursor: grab;\n                  user-select: none; \n                }\n                  \n                button:active {\n                  cursor: grabbing;\n                }\n              </style>\n  \n              <button class=\"float-button\">\n                <slot></slot>\n              </button>\n  ");return template.content.cloneNode(true)}var FloatButton=/*#__PURE__*/function(_HTMLElement){function FloatButton(){var _this;_classCallCheck(this,FloatButton);_this=_HTMLElement.call(this)||this;_this.attachShadow({mode:"open"});_this.shadowRoot.appendChild(buttonTemplate());_this.isFloatBtnActive=false;_this.offsetX=0;_this.offsetY=0;_this.initialX=0;_this.initialY=0;_this.boundHandleMouseMove=_this.handleMouseMove.bind(_this);_this.boundResetFloatBtn=_this.resetFloatBtn.bind(_this);return _this}_inherits(FloatButton,_HTMLElement);return _createClass(FloatButton,[{key:"connectedCallback",value:function connectedCallback(){var _this2=this;this.restrictHighlighting.bind(this);this.shadowRoot.addEventListener("mousedown",this.handlemousedown.bind(this));var floatingButton=this.shadowRoot.querySelector(".float-button");this.shadowRoot.addEventListener("mouseover",function(){floatingButton.textContent=_this2.truncateText(document.title)})}},{key:"handlemousedown",value:function handlemousedown(event){try{this.initialX=event.clientX;this.initialY=event.clientY}catch(error){return}//console.log('mousedown')
this.floatDragState()}},{key:"handleMouseMove",value:function handleMouseMove(event){this.offsetX=event.clientX-this.initialX;this.offsetY=event.clientY-this.initialY;//console.log('mousemove: ', this.offsetX, this.offsetY);
var floatingButton=this.shadowRoot.querySelector(".float-button");floatingButton.style.transform="translate(".concat(this.offsetX,"px, ").concat(this.offsetY,"px)");//console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
//this.updateFloatingButtonPosition.bind(this);
}},{key:"updateFloatingButtonPosition",value:function updateFloatingButtonPosition(){//console.log('offsetX', this.offsetX, 'offsetY', this.offsetY);
var floatingButton=this.shadowRoot.querySelector(".float-button");floatingButton.style.transform="translate(".concat(this.offsetX,"px, ").concat(this.offsetY,"px)");//console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
}},{key:"floatDragState",value:function floatDragState(){document.addEventListener("mousemove",this.boundHandleMouseMove);//console.log('floatDragState');
var floatingButton=this.shadowRoot.querySelector(".float-button");document.addEventListener("mouseup",this.boundResetFloatBtn);floatingButton.addEventListener("contextmenu",function(event){return event.preventDefault()});floatingButton.addEventListener("selectstart",function(event){return event.preventDefault()});floatingButton.addEventListener("mousedown",function(event){return event.preventDefault()});floatingButton.style.pointerEvents="none";document.body.style.cursor="grabbing"}},{key:"resetFloatBtn",value:function resetFloatBtn(){var floatingButton=this.shadowRoot.querySelector(".float-button");this.offsetX=0;this.offsetY=0;document.removeEventListener("mousemove",this.boundHandleMouseMove);document.removeEventListener("mouseup",this.boundResetFloatBtn);floatingButton.style.transform="translate3d(0, 0, 0)";floatingButton.style.pointerEvents="auto";floatingButton.textContent="";//set floating button to not active
document.body.style.cursor="auto"}// Make text fit within the button.
},{key:"truncateText",value:function truncateText(text){var maxLength=20;return text.length>maxLength?text.substring(0,maxLength)+"...":text}// Restricts text highlighting button text.
},{key:"restrictHighlighting",value:function restrictHighlighting(){var menuItems=this.shadowRoot.querySelectorAll(".float-button");menuItems.forEach(function(item){item.addEventListener("contextmenu",function(event){event.preventDefault()});item.addEventListener("selectstart",function(event){event.preventDefault()});item.addEventListener("mousedown",function(event){if(event.button===2){event.preventDefault()}});item.draggable=false})}}])}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));customElements.define("bookmark-float-button",FloatButton);