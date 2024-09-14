/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/strip-hex-prefix";
exports.ids = ["vendor-chunks/strip-hex-prefix"];
exports.modules = {

/***/ "(ssr)/./node_modules/strip-hex-prefix/src/index.js":
/*!****************************************************!*\
  !*** ./node_modules/strip-hex-prefix/src/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var isHexPrefixed = __webpack_require__(/*! is-hex-prefixed */ \"(ssr)/./node_modules/is-hex-prefixed/src/index.js\");\n\n/**\n * Removes '0x' from a given `String` is present\n * @param {String} str the string value\n * @return {String|Optional} a string by pass if necessary\n */\nmodule.exports = function stripHexPrefix(str) {\n  if (typeof str !== 'string') {\n    return str;\n  }\n\n  return isHexPrefixed(str) ? str.slice(2) : str;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc3RyaXAtaGV4LXByZWZpeC9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CLG1CQUFPLENBQUMsMEVBQWlCOztBQUU3QztBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksaUJBQWlCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3doYWxlLWJyaWRnZS8uL25vZGVfbW9kdWxlcy9zdHJpcC1oZXgtcHJlZml4L3NyYy9pbmRleC5qcz8zNGE5Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBpc0hleFByZWZpeGVkID0gcmVxdWlyZSgnaXMtaGV4LXByZWZpeGVkJyk7XG5cbi8qKlxuICogUmVtb3ZlcyAnMHgnIGZyb20gYSBnaXZlbiBgU3RyaW5nYCBpcyBwcmVzZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIHRoZSBzdHJpbmcgdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ3xPcHRpb25hbH0gYSBzdHJpbmcgYnkgcGFzcyBpZiBuZWNlc3NhcnlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJpcEhleFByZWZpeChzdHIpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIHJldHVybiBpc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHI7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/strip-hex-prefix/src/index.js\n");

/***/ })

};
;