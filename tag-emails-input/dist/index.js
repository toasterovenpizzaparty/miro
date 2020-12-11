(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Tagify"] = factory();
	else
		root["Tagify"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 551:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/*
 * Element creation toolset
 */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createWordBlockNodes = exports.createEmailBlockNodes = exports.insertBefore = exports.appendChildren = exports.createWordBlockNode = exports.createEmailBlockNode = exports.createNode = void 0;

var createNode = function createNode(text, className) {
  var isHTML = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var node = document.createElement("div");
  isHTML ? node.innerHTML = text : node.innerText = text;
  node.className = className;
  return node;
};

exports.createNode = createNode;

var createEmailBlockNode = function createEmailBlockNode(email) {
  return exports.createNode(email, "block block__tag block__tag--email");
};

exports.createEmailBlockNode = createEmailBlockNode;

var createWordBlockNode = function createWordBlockNode(word) {
  return exports.createNode(word, "block block__tag block__tag--word");
};

exports.createWordBlockNode = createWordBlockNode;

var appendChildren = function appendChildren(node, elements) {
  for (var i = 0; i < elements.length; i++) {
    node.appendChild(elements[i]);
  }
};

exports.appendChildren = appendChildren;

var insertBefore = function insertBefore(parentNode, elements, before) {
  for (var i = 0; i < elements.length; i++) {
    parentNode.insertBefore(elements[i], before);
  }
};

exports.insertBefore = insertBefore;

var createEmailBlockNodes = function createEmailBlockNodes(emails) {
  return emails.map(exports.createEmailBlockNode);
};

exports.createEmailBlockNodes = createEmailBlockNodes;

var createWordBlockNodes = function createWordBlockNodes(words) {
  return words.map(exports.createWordBlockNode);
};

exports.createWordBlockNodes = createWordBlockNodes;

/***/ }),

/***/ 989:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var tslib_1 = __webpack_require__(655);

var elements_1 = __webpack_require__(551);

var strings_1 = __webpack_require__(204);

var main_css_1 = tslib_1.__importDefault(__webpack_require__(112));

var BLOCK_TYPE;

(function (BLOCK_TYPE) {
  BLOCK_TYPE[BLOCK_TYPE["EMAIL"] = 0] = "EMAIL";
  BLOCK_TYPE[BLOCK_TYPE["WORD"] = 1] = "WORD";
})(BLOCK_TYPE || (BLOCK_TYPE = {}));

var STYLE_ID = "TAGIFY_STYLE";

var classifyBlockType = function classifyBlockType(word) {
  console.log("word", word);
  var emails = strings_1.extractEmails(word);
  console.log("emails", emails);
  return {
    type: emails.length ? BLOCK_TYPE.EMAIL : BLOCK_TYPE.WORD,
    values: emails.length ? emails : [word]
  };
};

var scrollToEnd = function scrollToEnd(targetElement) {
  return targetElement.scrollTop = targetElement.scrollHeight;
};

var enhanceBlockWithCloseButton = function enhanceBlockWithCloseButton(parentNode, onClick) {
  var closeNode = elements_1.createNode("", "block__close");
  parentNode.appendChild(closeNode);
  closeNode.addEventListener("mousedown", onClick);
};
/* Since IE11 is to be supported, i will not use arrow functions as these are part */


var Tagify = function Tagify(DOMElement) {
  DOMElement.className = DOMElement.className + "tagify form";
  var blocks = elements_1.createNode("", "blocks");
  DOMElement.appendChild(blocks);
  var inputField = document.createElement("input");
  inputField.className = "blocks__input";
  inputField.placeholder = "add more people";
  blocks.appendChild(inputField);
  var headNode = document.querySelector("head");
  var isStyleApplied = !!document.querySelector("#" + STYLE_ID);

  if (headNode && !isStyleApplied) {
    var styleNode = document.createElement("style");
    styleNode.innerHTML = main_css_1["default"].toString();
    styleNode.id = STYLE_ID;
    headNode.appendChild(styleNode);
  }

  var onPressDelete = function onPressDelete(event) {
    if (event.target) {
      blocks.removeChild(event.target.parentNode);
    }
  };

  var captureWordsAndEmails = function captureWordsAndEmails(text, node, insertBeforeNode, scrollAreaElement) {
    var words = strings_1.extractWords(text);

    for (var i = 0; i < words.length; i++) {
      var word = words[i];

      var _classifyBlockType = classifyBlockType(word),
          type = _classifyBlockType.type,
          values = _classifyBlockType.values;

      var blockNodes = [];

      for (var j = 0; j < values.length; j++) {
        var blockNode = type === BLOCK_TYPE.EMAIL ? elements_1.createEmailBlockNode(values[j]) : elements_1.createWordBlockNode(values[j]);
        enhanceBlockWithCloseButton(blockNode, onPressDelete);
        blockNodes.push(blockNode);
      }

      elements_1.insertBefore(node, blockNodes, insertBeforeNode);
    }

    scrollToEnd(scrollAreaElement);
  };

  var onKeyPressed = function onKeyPressed(event) {
    // https://caniuse.com/?search=keyboardevent. event.key has best coverage for our supported browsers.
    var key = event.key.toLowerCase();
    var isInputEmpty = inputField.value.trim() === "";
    var hasBlocks = blocks.children.length > 1;
    var isEmailsReadyForCapture = [",", "enter"].indexOf(key) > -1;
    var isBlockReadyForDelete = ["del", "backspace"].indexOf(key) > -1 && isInputEmpty && hasBlocks;

    if (isEmailsReadyForCapture) {
      captureWordsAndEmails(inputField.value, blocks, inputField, DOMElement);
      inputField.value = "";
    } else if (isBlockReadyForDelete) {
      var lastIndex = blocks.children.length - 2; // last index is our input

      var node = blocks.children[lastIndex];
      blocks.removeChild(node);
    }

    scrollToEnd(DOMElement);
  };

  var onPaste = function onPaste(event) {
    event.preventDefault(); // Do not let the paste data into the inputfield.

    var pastedText = (event.clipboardData || window.clipboardData).getData("text");
    captureWordsAndEmails(pastedText, blocks, inputField, DOMElement);
    scrollToEnd(DOMElement);
  };

  var onInputFieldBlur = function onInputFieldBlur() {
    captureWordsAndEmails(inputField.value, blocks, inputField, DOMElement);
    scrollToEnd(DOMElement);
    inputField.value = "";
  };

  inputField.addEventListener("blur", onInputFieldBlur);
  inputField.addEventListener("keyup", onKeyPressed);
  inputField.addEventListener("paste", onPaste);
  return {
    addEmail: function addEmail(email) {
      return captureWordsAndEmails(email, blocks, inputField, DOMElement);
    },
    getEmailCount: function getEmailCount() {
      var emails = strings_1.extractEmails(DOMElement.textContent || "");
      return emails.length;
    },
    destroy: function destroy() {
      inputField.removeEventListener("blur", onInputFieldBlur);
      inputField.removeEventListener("keyup", onKeyPressed);
      inputField.removeEventListener("paste", onPaste);
    }
  };
};

exports.default = Tagify;
module.exports = Tagify;

/***/ }),

/***/ 204:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extractEmails = exports.extractWords = void 0;
/*
 * String manipulation tools
 */
// Capture anything that is not a space or comma.

var extractWords = function extractWords(text) {
  return text.match(/([^,\s]+)/gi) || [];
};

exports.extractWords = extractWords; // Extract any emails from the text and return these as an array.

var extractEmails = function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
};

exports.extractEmails = extractEmails;

/***/ }),

/***/ 655:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": function() { return /* binding */ __extends; },
/* harmony export */   "__assign": function() { return /* binding */ __assign; },
/* harmony export */   "__rest": function() { return /* binding */ __rest; },
/* harmony export */   "__decorate": function() { return /* binding */ __decorate; },
/* harmony export */   "__param": function() { return /* binding */ __param; },
/* harmony export */   "__metadata": function() { return /* binding */ __metadata; },
/* harmony export */   "__awaiter": function() { return /* binding */ __awaiter; },
/* harmony export */   "__generator": function() { return /* binding */ __generator; },
/* harmony export */   "__createBinding": function() { return /* binding */ __createBinding; },
/* harmony export */   "__exportStar": function() { return /* binding */ __exportStar; },
/* harmony export */   "__values": function() { return /* binding */ __values; },
/* harmony export */   "__read": function() { return /* binding */ __read; },
/* harmony export */   "__spread": function() { return /* binding */ __spread; },
/* harmony export */   "__spreadArrays": function() { return /* binding */ __spreadArrays; },
/* harmony export */   "__await": function() { return /* binding */ __await; },
/* harmony export */   "__asyncGenerator": function() { return /* binding */ __asyncGenerator; },
/* harmony export */   "__asyncDelegator": function() { return /* binding */ __asyncDelegator; },
/* harmony export */   "__asyncValues": function() { return /* binding */ __asyncValues; },
/* harmony export */   "__makeTemplateObject": function() { return /* binding */ __makeTemplateObject; },
/* harmony export */   "__importStar": function() { return /* binding */ __importStar; },
/* harmony export */   "__importDefault": function() { return /* binding */ __importDefault; },
/* harmony export */   "__classPrivateFieldGet": function() { return /* binding */ __classPrivateFieldGet; },
/* harmony export */   "__classPrivateFieldSet": function() { return /* binding */ __classPrivateFieldSet; }
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(609);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.id, ".block {\n}\n\n.tagify.form {\n  /* max-width: 500px; */\n  background: yellow;\n  display: flex;\n  flex-direction: row;\n}\n\n.tagify .block {\n  position: relative;\n}\n\n.tagify .block.block__tag {\n  padding: 5px;\n  margin: 5px;\n  border-radius: 25px;\n}\n.tagify .block.block__tag--email {\n  background-color: red;\n}\n.tagify .block.block__tag--word {\n  background-color: none;\n}\n\n.tagify .block__close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 15px;\n  height: 15px;\n  /* background: url('data:image/svg+xml; ... '); */\n}\n\n.tagify .blocks {\n  display: flex;\n  flex: 1 0 100%;\n  flex-wrap: wrap;\n}\n\n.tagify .blocks__input {\n  height: 35px;\n  background: red;\n  border: 0;\n  flex: 1 1 0%;\n  min-width: 100px;\n}\n.tagify .blocks__input:focus {\n  outline: none;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 609:
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(989);
/******/ })()
;
});