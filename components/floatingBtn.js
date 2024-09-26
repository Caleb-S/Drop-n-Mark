function _typeof(o) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (o) {
          return typeof o;
        }
        : function (o) {
          return o &&
            "function" == typeof Symbol &&
            o.constructor === Symbol &&
            o !== Symbol.prototype
            ? "symbol"
            : typeof o;
        }),
    _typeof(o)
  );
}
function _classCallCheck(a, n) {
  if (!(a instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    (o.enumerable = o.enumerable || !1),
      (o.configurable = !0),
      "value" in o && (o.writable = !0),
      Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return (
    r && _defineProperties(e.prototype, r),
    t && _defineProperties(e, t),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e)
    throw new TypeError("Super expression must either be null or a function");
  (t.prototype = Object.create(e && e.prototype, {
    constructor: { value: t, writable: !0, configurable: !0 }
  })),
    Object.defineProperty(t, "prototype", { writable: !1 }),
    e && _setPrototypeOf(t, e);
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return (
    (_wrapNativeSuper = function _wrapNativeSuper(t) {
      if (null === t || !_isNativeFunction(t)) return t;
      if ("function" != typeof t)
        throw new TypeError(
          "Super expression must either be null or a function"
        );
      if (void 0 !== r) {
        if (r.has(t)) return r.get(t);
        r.set(t, Wrapper);
      }
      function Wrapper() {
        return _construct(t, arguments, _getPrototypeOf(this).constructor);
      }
      return (
        (Wrapper.prototype = Object.create(t.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })),
        _setPrototypeOf(Wrapper, t)
      );
    }),
    _wrapNativeSuper(t)
  );
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct())
    return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () { })
    );
  } catch (t) { }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _setPrototypeOf(t, e) {
  return (
    (_setPrototypeOf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
        return (t.__proto__ = e), t;
      }),
    _setPrototypeOf(t, e)
  );
}
function _getPrototypeOf(t) {
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      }),
    _getPrototypeOf(t)
  );
}
var buttonTemplate = document.createElement("template");
escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
  createHTML: function createHTML(to_escape) {
    return to_escape;
  }
});
buttonTemplate.innerHTML = escapeHTMLPolicy.createHTML(
  '\n            <style>\n          \n\n              :host {\n                font-size: 18px !important;\n                color: white !important;\n                font-family: arial !important;\n                text-align: center !important;\n                text-overflow: ellipsis !important;\n                overflow: visible !important;\n                white-space: nowrap !important;\n                z-index: 2147483647 !important;\n                position: fixed !important;\n                bottom: 20px !important;\n                right: 20px !important;\n                tabindex: -1 !important;\n                outline: none !important;\n              }\n\n               button {\n            \n          \n                width: 20px;\n                height: 20px;\n       \n                align-items: center;\n                display: flex;\n                justify-content: center;\n                align-items: center;\n                \n               \n            \n                padding: 0px;\n                border-radius: 50%;\n                border-width: 0px;\n                cursor: grab;\n                background-color: #ff7f50f8;\n                user-select: none; \n                \n                      \n              }\n\n              button:hover {\n                width: auto;\n                max-width: fit-content;\n                height: auto;\n                padding: 10px 20px 10px 20px;\n                border-radius: 3px;\n                user-select: none;\n                \n               \n              }\n\n               button:active {\n                cursor: grabbing !important;\n                   box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);\n               \n                width: auto;\n                max-width: fit-content;\n                height: auto;\n                padding: 10px 20px 10px 20px;\n                border-radius: 3px;\n                user-select: none; \n                \n              }\n            </style>\n\n            <button class="float-button">\n              <slot></slot>\n            </button>\n'
);
var FloatButton = /*#__PURE__*/ (function (_HTMLElement) {
  "use strict";

  function FloatButton() {
    var _this;
    _classCallCheck(this, FloatButton);
    _this = _HTMLElement.call(this) || this;
    _this.attachShadow({
      mode: "open"
    });
    _this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
    return _this;
  }
  _inherits(FloatButton, _HTMLElement);
  return _createClass(
    FloatButton,
    [
      {
        key: "attributeChangedCa11back",
        value: function attributeChangedCa11back(name, oldVaIue, newVa1ue) {
          console.log(name, oldVaIue, newVa1ue);
          // if (name = "checked") this.updateChecked(newVa1ue)
        }
      }
    ],
    [
      {
        key: "observedAttributes",
        get: function get() {
          return ["true"];
        }
      }
    ]
  );
})(/*#__PURE__*/ _wrapNativeSuper(HTMLElement));
customElements.define("bookmark-float-button", FloatButton);