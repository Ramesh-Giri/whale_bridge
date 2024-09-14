/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-hex-prefixed";
exports.ids = ["vendor-chunks/is-hex-prefixed"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-hex-prefixed/src/index.js":
/*!***************************************************!*\
  !*** ./node_modules/is-hex-prefixed/src/index.js ***!
  \***************************************************/
/***/ ((module) => {

eval("/**\n * Returns a `Boolean` on whether or not the a `String` starts with '0x'\n * @param {String} str the string input value\n * @return {Boolean} a boolean if it is or is not hex prefixed\n * @throws if the str input is not a string\n */\nmodule.exports = function isHexPrefixed(str) {\n  if (typeof str !== 'string') {\n    throw new Error(\"[is-hex-prefixed] value must be type 'string', is currently type \" + (typeof str) + \", while checking isHexPrefixed.\");\n  }\n\n  return str.slice(0, 2) === '0x';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtaGV4LXByZWZpeGVkL3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3doYWxlLWJyaWRnZS8uL25vZGVfbW9kdWxlcy9pcy1oZXgtcHJlZml4ZWQvc3JjL2luZGV4LmpzPzE5ODYiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm5zIGEgYEJvb2xlYW5gIG9uIHdoZXRoZXIgb3Igbm90IHRoZSBhIGBTdHJpbmdgIHN0YXJ0cyB3aXRoICcweCdcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgdGhlIHN0cmluZyBpbnB1dCB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn0gYSBib29sZWFuIGlmIGl0IGlzIG9yIGlzIG5vdCBoZXggcHJlZml4ZWRcbiAqIEB0aHJvd3MgaWYgdGhlIHN0ciBpbnB1dCBpcyBub3QgYSBzdHJpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0hleFByZWZpeGVkKHN0cikge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJbaXMtaGV4LXByZWZpeGVkXSB2YWx1ZSBtdXN0IGJlIHR5cGUgJ3N0cmluZycsIGlzIGN1cnJlbnRseSB0eXBlIFwiICsgKHR5cGVvZiBzdHIpICsgXCIsIHdoaWxlIGNoZWNraW5nIGlzSGV4UHJlZml4ZWQuXCIpO1xuICB9XG5cbiAgcmV0dXJuIHN0ci5zbGljZSgwLCAyKSA9PT0gJzB4Jztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-hex-prefixed/src/index.js\n");

/***/ })

};
;