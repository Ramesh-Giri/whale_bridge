/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/eth-json-rpc-middleware";
exports.ids = ["vendor-chunks/eth-json-rpc-middleware"];
exports.modules = {

/***/ "(ssr)/./node_modules/eth-json-rpc-middleware/block-cache.js":
/*!*************************************************************!*\
  !*** ./node_modules/eth-json-rpc-middleware/block-cache.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const cacheUtils = __webpack_require__(/*! ./cache-utils.js */ \"(ssr)/./node_modules/eth-json-rpc-middleware/cache-utils.js\")\nconst createAsyncMiddleware = __webpack_require__(/*! json-rpc-engine/src/createAsyncMiddleware */ \"(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createAsyncMiddleware.js\")\n// `<nil>` comes from https://github.com/ethereum/go-ethereum/issues/16925\nconst emptyValues = [undefined, null, '\\u003cnil\\u003e']\n\nmodule.exports = createBlockCacheMiddleware\n\n\nfunction createBlockCacheMiddleware(opts = {}) {\n  // validate options\n  const { blockTracker } = opts\n  if (!blockTracker) throw new Error('createBlockCacheMiddleware - No BlockTracker specified')\n\n  // create caching strategies\n  const blockCache = new BlockCacheStrategy()\n  const strategies = {\n    perma: blockCache,\n    block: blockCache,\n    fork: blockCache,\n  }\n\n  return createAsyncMiddleware(async (req, res, next) => {\n    // allow cach to be skipped if so specified\n    if (req.skipCache) {\n      return next()\n    }\n    // check type and matching strategy\n    const type = cacheUtils.cacheTypeForPayload(req)\n    const strategy = strategies[type]\n    // If there's no strategy in place, pass it down the chain.\n    if (!strategy) {\n      return next()\n    }\n    // If the strategy can't cache this request, ignore it.\n    if (!strategy.canCacheRequest(req)) {\n      return next()\n    }\n\n    // get block reference (number or keyword)\n    let blockTag = cacheUtils.blockTagForPayload(req)\n    if (!blockTag) blockTag = 'latest'\n\n    // get exact block number\n    let requestedBlockNumber\n    if (blockTag === 'earliest') {\n      // this just exists for symmetry with \"latest\"\n      requestedBlockNumber = '0x00'\n    } else if (blockTag === 'latest') {\n      // fetch latest block number\n      const latestBlockNumber = await blockTracker.getLatestBlock()\n      // clear all cache before latest block\n      blockCache.clearBefore(latestBlockNumber)\n      requestedBlockNumber = latestBlockNumber\n    } else {\n      // We have a hex number\n      requestedBlockNumber = blockTag\n    }\n\n    // end on a hit, continue on a miss\n    const cacheResult = await strategy.get(req, requestedBlockNumber)\n    if (cacheResult === undefined) {\n      // cache miss\n      // wait for other middleware to handle request\n      await next()\n      // add result to cache\n      await strategy.set(req, requestedBlockNumber, res.result)\n    } else {\n      // fill in result from cache\n      res.result = cacheResult\n    }\n  })\n}\n\n\n//\n// Cache Strategies\n//\n\nclass BlockCacheStrategy {\n  \n  constructor () {\n    this.cache = {}\n  }\n\n  getBlockCacheForPayload (payload, blockNumberHex) {\n    const blockNumber = Number.parseInt(blockNumberHex, 16)\n    let blockCache = this.cache[blockNumber]\n    // create new cache if necesary\n    if (!blockCache) {\n      const newCache = {}\n      this.cache[blockNumber] = newCache\n      blockCache = newCache\n    }\n    return blockCache\n  }\n\n  async get (payload, requestedBlockNumber) {\n    // lookup block cache\n    const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber)\n    if (!blockCache) return\n    // lookup payload in block cache\n    const identifier = cacheUtils.cacheIdentifierForPayload(payload, true)\n    const cached = blockCache[identifier]\n    // may be undefined\n    return cached\n  }\n\n  async set (payload, requestedBlockNumber, result) {\n    // check if we can cached this result\n    const canCache = this.canCacheResult(payload, result)\n    if (!canCache) return\n    // set the value in the cache\n    const blockCache = this.getBlockCacheForPayload(payload, requestedBlockNumber)\n    const identifier = cacheUtils.cacheIdentifierForPayload(payload, true)\n    blockCache[identifier] = result\n  }\n\n  canCacheRequest (payload) {\n    // check request method\n    if (!cacheUtils.canCache(payload)) {\n      return false\n    }\n    // check blockTag\n    const blockTag = cacheUtils.blockTagForPayload(payload)\n    if (blockTag === 'pending') {\n      return false\n    }\n    // can be cached\n    return true\n  }\n\n  canCacheResult (payload, result) {\n    // never cache empty values (e.g. undefined)\n    if (emptyValues.includes(result)) return\n    // check if transactions have block reference before caching\n    if (['eth_getTransactionByHash', 'eth_getTransactionReceipt'].includes(payload.method)) {\n      if (!result || !result.blockHash || result.blockHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {\n        return false\n      }\n    }\n    // otherwise true\n    return true\n  }\n\n  // removes all block caches with block number lower than `oldBlockHex`\n  clearBefore (oldBlockHex){\n    const self = this\n    const oldBlockNumber = Number.parseInt(oldBlockHex, 16)\n    // clear old caches\n    Object.keys(self.cache)\n      .map(Number)\n      .filter(num => num < oldBlockNumber)\n      .forEach(num => delete self.cache[num])\n  }\n\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvYmxvY2stY2FjaGUuanMiLCJtYXBwaW5ncyI6IkFBQUEsbUJBQW1CLG1CQUFPLENBQUMscUZBQWtCO0FBQzdDLDhCQUE4QixtQkFBTyxDQUFDLHlKQUEyQztBQUNqRjtBQUNBOztBQUVBOzs7QUFHQSw2Q0FBNkM7QUFDN0M7QUFDQSxVQUFVLGVBQWU7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3doYWxlLWJyaWRnZS8uL25vZGVfbW9kdWxlcy9ldGgtanNvbi1ycGMtbWlkZGxld2FyZS9ibG9jay1jYWNoZS5qcz84OTE5Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNhY2hlVXRpbHMgPSByZXF1aXJlKCcuL2NhY2hlLXV0aWxzLmpzJylcbmNvbnN0IGNyZWF0ZUFzeW5jTWlkZGxld2FyZSA9IHJlcXVpcmUoJ2pzb24tcnBjLWVuZ2luZS9zcmMvY3JlYXRlQXN5bmNNaWRkbGV3YXJlJylcbi8vIGA8bmlsPmAgY29tZXMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vZ28tZXRoZXJldW0vaXNzdWVzLzE2OTI1XG5jb25zdCBlbXB0eVZhbHVlcyA9IFt1bmRlZmluZWQsIG51bGwsICdcXHUwMDNjbmlsXFx1MDAzZSddXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmxvY2tDYWNoZU1pZGRsZXdhcmVcblxuXG5mdW5jdGlvbiBjcmVhdGVCbG9ja0NhY2hlTWlkZGxld2FyZShvcHRzID0ge30pIHtcbiAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICBjb25zdCB7IGJsb2NrVHJhY2tlciB9ID0gb3B0c1xuICBpZiAoIWJsb2NrVHJhY2tlcikgdGhyb3cgbmV3IEVycm9yKCdjcmVhdGVCbG9ja0NhY2hlTWlkZGxld2FyZSAtIE5vIEJsb2NrVHJhY2tlciBzcGVjaWZpZWQnKVxuXG4gIC8vIGNyZWF0ZSBjYWNoaW5nIHN0cmF0ZWdpZXNcbiAgY29uc3QgYmxvY2tDYWNoZSA9IG5ldyBCbG9ja0NhY2hlU3RyYXRlZ3koKVxuICBjb25zdCBzdHJhdGVnaWVzID0ge1xuICAgIHBlcm1hOiBibG9ja0NhY2hlLFxuICAgIGJsb2NrOiBibG9ja0NhY2hlLFxuICAgIGZvcms6IGJsb2NrQ2FjaGUsXG4gIH1cblxuICByZXR1cm4gY3JlYXRlQXN5bmNNaWRkbGV3YXJlKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgIC8vIGFsbG93IGNhY2ggdG8gYmUgc2tpcHBlZCBpZiBzbyBzcGVjaWZpZWRcbiAgICBpZiAocmVxLnNraXBDYWNoZSkge1xuICAgICAgcmV0dXJuIG5leHQoKVxuICAgIH1cbiAgICAvLyBjaGVjayB0eXBlIGFuZCBtYXRjaGluZyBzdHJhdGVneVxuICAgIGNvbnN0IHR5cGUgPSBjYWNoZVV0aWxzLmNhY2hlVHlwZUZvclBheWxvYWQocmVxKVxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gc3RyYXRlZ2llc1t0eXBlXVxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gc3RyYXRlZ3kgaW4gcGxhY2UsIHBhc3MgaXQgZG93biB0aGUgY2hhaW4uXG4gICAgaWYgKCFzdHJhdGVneSkge1xuICAgICAgcmV0dXJuIG5leHQoKVxuICAgIH1cbiAgICAvLyBJZiB0aGUgc3RyYXRlZ3kgY2FuJ3QgY2FjaGUgdGhpcyByZXF1ZXN0LCBpZ25vcmUgaXQuXG4gICAgaWYgKCFzdHJhdGVneS5jYW5DYWNoZVJlcXVlc3QocmVxKSkge1xuICAgICAgcmV0dXJuIG5leHQoKVxuICAgIH1cblxuICAgIC8vIGdldCBibG9jayByZWZlcmVuY2UgKG51bWJlciBvciBrZXl3b3JkKVxuICAgIGxldCBibG9ja1RhZyA9IGNhY2hlVXRpbHMuYmxvY2tUYWdGb3JQYXlsb2FkKHJlcSlcbiAgICBpZiAoIWJsb2NrVGFnKSBibG9ja1RhZyA9ICdsYXRlc3QnXG5cbiAgICAvLyBnZXQgZXhhY3QgYmxvY2sgbnVtYmVyXG4gICAgbGV0IHJlcXVlc3RlZEJsb2NrTnVtYmVyXG4gICAgaWYgKGJsb2NrVGFnID09PSAnZWFybGllc3QnKSB7XG4gICAgICAvLyB0aGlzIGp1c3QgZXhpc3RzIGZvciBzeW1tZXRyeSB3aXRoIFwibGF0ZXN0XCJcbiAgICAgIHJlcXVlc3RlZEJsb2NrTnVtYmVyID0gJzB4MDAnXG4gICAgfSBlbHNlIGlmIChibG9ja1RhZyA9PT0gJ2xhdGVzdCcpIHtcbiAgICAgIC8vIGZldGNoIGxhdGVzdCBibG9jayBudW1iZXJcbiAgICAgIGNvbnN0IGxhdGVzdEJsb2NrTnVtYmVyID0gYXdhaXQgYmxvY2tUcmFja2VyLmdldExhdGVzdEJsb2NrKClcbiAgICAgIC8vIGNsZWFyIGFsbCBjYWNoZSBiZWZvcmUgbGF0ZXN0IGJsb2NrXG4gICAgICBibG9ja0NhY2hlLmNsZWFyQmVmb3JlKGxhdGVzdEJsb2NrTnVtYmVyKVxuICAgICAgcmVxdWVzdGVkQmxvY2tOdW1iZXIgPSBsYXRlc3RCbG9ja051bWJlclxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBoYXZlIGEgaGV4IG51bWJlclxuICAgICAgcmVxdWVzdGVkQmxvY2tOdW1iZXIgPSBibG9ja1RhZ1xuICAgIH1cblxuICAgIC8vIGVuZCBvbiBhIGhpdCwgY29udGludWUgb24gYSBtaXNzXG4gICAgY29uc3QgY2FjaGVSZXN1bHQgPSBhd2FpdCBzdHJhdGVneS5nZXQocmVxLCByZXF1ZXN0ZWRCbG9ja051bWJlcilcbiAgICBpZiAoY2FjaGVSZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gY2FjaGUgbWlzc1xuICAgICAgLy8gd2FpdCBmb3Igb3RoZXIgbWlkZGxld2FyZSB0byBoYW5kbGUgcmVxdWVzdFxuICAgICAgYXdhaXQgbmV4dCgpXG4gICAgICAvLyBhZGQgcmVzdWx0IHRvIGNhY2hlXG4gICAgICBhd2FpdCBzdHJhdGVneS5zZXQocmVxLCByZXF1ZXN0ZWRCbG9ja051bWJlciwgcmVzLnJlc3VsdClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZmlsbCBpbiByZXN1bHQgZnJvbSBjYWNoZVxuICAgICAgcmVzLnJlc3VsdCA9IGNhY2hlUmVzdWx0XG4gICAgfVxuICB9KVxufVxuXG5cbi8vXG4vLyBDYWNoZSBTdHJhdGVnaWVzXG4vL1xuXG5jbGFzcyBCbG9ja0NhY2hlU3RyYXRlZ3kge1xuICBcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fVxuICB9XG5cbiAgZ2V0QmxvY2tDYWNoZUZvclBheWxvYWQgKHBheWxvYWQsIGJsb2NrTnVtYmVySGV4KSB7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBOdW1iZXIucGFyc2VJbnQoYmxvY2tOdW1iZXJIZXgsIDE2KVxuICAgIGxldCBibG9ja0NhY2hlID0gdGhpcy5jYWNoZVtibG9ja051bWJlcl1cbiAgICAvLyBjcmVhdGUgbmV3IGNhY2hlIGlmIG5lY2VzYXJ5XG4gICAgaWYgKCFibG9ja0NhY2hlKSB7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHt9XG4gICAgICB0aGlzLmNhY2hlW2Jsb2NrTnVtYmVyXSA9IG5ld0NhY2hlXG4gICAgICBibG9ja0NhY2hlID0gbmV3Q2FjaGVcbiAgICB9XG4gICAgcmV0dXJuIGJsb2NrQ2FjaGVcbiAgfVxuXG4gIGFzeW5jIGdldCAocGF5bG9hZCwgcmVxdWVzdGVkQmxvY2tOdW1iZXIpIHtcbiAgICAvLyBsb29rdXAgYmxvY2sgY2FjaGVcbiAgICBjb25zdCBibG9ja0NhY2hlID0gdGhpcy5nZXRCbG9ja0NhY2hlRm9yUGF5bG9hZChwYXlsb2FkLCByZXF1ZXN0ZWRCbG9ja051bWJlcilcbiAgICBpZiAoIWJsb2NrQ2FjaGUpIHJldHVyblxuICAgIC8vIGxvb2t1cCBwYXlsb2FkIGluIGJsb2NrIGNhY2hlXG4gICAgY29uc3QgaWRlbnRpZmllciA9IGNhY2hlVXRpbHMuY2FjaGVJZGVudGlmaWVyRm9yUGF5bG9hZChwYXlsb2FkLCB0cnVlKVxuICAgIGNvbnN0IGNhY2hlZCA9IGJsb2NrQ2FjaGVbaWRlbnRpZmllcl1cbiAgICAvLyBtYXkgYmUgdW5kZWZpbmVkXG4gICAgcmV0dXJuIGNhY2hlZFxuICB9XG5cbiAgYXN5bmMgc2V0IChwYXlsb2FkLCByZXF1ZXN0ZWRCbG9ja051bWJlciwgcmVzdWx0KSB7XG4gICAgLy8gY2hlY2sgaWYgd2UgY2FuIGNhY2hlZCB0aGlzIHJlc3VsdFxuICAgIGNvbnN0IGNhbkNhY2hlID0gdGhpcy5jYW5DYWNoZVJlc3VsdChwYXlsb2FkLCByZXN1bHQpXG4gICAgaWYgKCFjYW5DYWNoZSkgcmV0dXJuXG4gICAgLy8gc2V0IHRoZSB2YWx1ZSBpbiB0aGUgY2FjaGVcbiAgICBjb25zdCBibG9ja0NhY2hlID0gdGhpcy5nZXRCbG9ja0NhY2hlRm9yUGF5bG9hZChwYXlsb2FkLCByZXF1ZXN0ZWRCbG9ja051bWJlcilcbiAgICBjb25zdCBpZGVudGlmaWVyID0gY2FjaGVVdGlscy5jYWNoZUlkZW50aWZpZXJGb3JQYXlsb2FkKHBheWxvYWQsIHRydWUpXG4gICAgYmxvY2tDYWNoZVtpZGVudGlmaWVyXSA9IHJlc3VsdFxuICB9XG5cbiAgY2FuQ2FjaGVSZXF1ZXN0IChwYXlsb2FkKSB7XG4gICAgLy8gY2hlY2sgcmVxdWVzdCBtZXRob2RcbiAgICBpZiAoIWNhY2hlVXRpbHMuY2FuQ2FjaGUocGF5bG9hZCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvLyBjaGVjayBibG9ja1RhZ1xuICAgIGNvbnN0IGJsb2NrVGFnID0gY2FjaGVVdGlscy5ibG9ja1RhZ0ZvclBheWxvYWQocGF5bG9hZClcbiAgICBpZiAoYmxvY2tUYWcgPT09ICdwZW5kaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIC8vIGNhbiBiZSBjYWNoZWRcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY2FuQ2FjaGVSZXN1bHQgKHBheWxvYWQsIHJlc3VsdCkge1xuICAgIC8vIG5ldmVyIGNhY2hlIGVtcHR5IHZhbHVlcyAoZS5nLiB1bmRlZmluZWQpXG4gICAgaWYgKGVtcHR5VmFsdWVzLmluY2x1ZGVzKHJlc3VsdCkpIHJldHVyblxuICAgIC8vIGNoZWNrIGlmIHRyYW5zYWN0aW9ucyBoYXZlIGJsb2NrIHJlZmVyZW5jZSBiZWZvcmUgY2FjaGluZ1xuICAgIGlmIChbJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCcsICdldGhfZ2V0VHJhbnNhY3Rpb25SZWNlaXB0J10uaW5jbHVkZXMocGF5bG9hZC5tZXRob2QpKSB7XG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0LmJsb2NrSGFzaCB8fCByZXN1bHQuYmxvY2tIYXNoID09PSAnMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlIHRydWVcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gcmVtb3ZlcyBhbGwgYmxvY2sgY2FjaGVzIHdpdGggYmxvY2sgbnVtYmVyIGxvd2VyIHRoYW4gYG9sZEJsb2NrSGV4YFxuICBjbGVhckJlZm9yZSAob2xkQmxvY2tIZXgpe1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgY29uc3Qgb2xkQmxvY2tOdW1iZXIgPSBOdW1iZXIucGFyc2VJbnQob2xkQmxvY2tIZXgsIDE2KVxuICAgIC8vIGNsZWFyIG9sZCBjYWNoZXNcbiAgICBPYmplY3Qua2V5cyhzZWxmLmNhY2hlKVxuICAgICAgLm1hcChOdW1iZXIpXG4gICAgICAuZmlsdGVyKG51bSA9PiBudW0gPCBvbGRCbG9ja051bWJlcilcbiAgICAgIC5mb3JFYWNoKG51bSA9PiBkZWxldGUgc2VsZi5jYWNoZVtudW1dKVxuICB9XG5cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/eth-json-rpc-middleware/block-cache.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/eth-json-rpc-middleware/cache-utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/eth-json-rpc-middleware/cache-utils.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const stringify = __webpack_require__(/*! json-stable-stringify */ \"(ssr)/./node_modules/json-stable-stringify/index.js\")\n\nmodule.exports = {\n  cacheIdentifierForPayload: cacheIdentifierForPayload,\n  canCache: canCache,\n  blockTagForPayload: blockTagForPayload,\n  paramsWithoutBlockTag: paramsWithoutBlockTag,\n  blockTagParamIndex: blockTagParamIndex,\n  cacheTypeForPayload: cacheTypeForPayload\n}\n\nfunction cacheIdentifierForPayload (payload, skipBlockRef) {\n  const simpleParams = skipBlockRef ? paramsWithoutBlockTag(payload) : payload.params\n  if (canCache(payload)) {\n    return payload.method + ':' + stringify(simpleParams)\n  } else {\n    return null\n  }\n}\n\nfunction canCache (payload) {\n  return cacheTypeForPayload(payload) !== 'never'\n}\n\nfunction blockTagForPayload (payload) {\n  let index = blockTagParamIndex(payload)\n\n  // Block tag param not passed.\n  if (index >= payload.params.length) {\n    return null\n  }\n\n  return payload.params[index]\n}\n\nfunction paramsWithoutBlockTag (payload) {\n  const index = blockTagParamIndex(payload)\n\n  // Block tag param not passed.\n  if (index >= payload.params.length) {\n    return payload.params\n  }\n\n  // eth_getBlockByNumber has the block tag first, then the optional includeTx? param\n  if (payload.method === 'eth_getBlockByNumber') {\n    return payload.params.slice(1)\n  }\n\n  return payload.params.slice(0, index)\n}\n\nfunction blockTagParamIndex (payload) {\n  switch (payload.method) {\n    // blockTag is at index 2\n    case 'eth_getStorageAt':\n      return 2\n    // blockTag is at index 1\n    case 'eth_getBalance':\n    case 'eth_getCode':\n    case 'eth_getTransactionCount':\n    case 'eth_call':\n      return 1\n    // blockTag is at index 0\n    case 'eth_getBlockByNumber':\n      return 0\n    // there is no blockTag\n    default:\n      return undefined\n  }\n}\n\nfunction cacheTypeForPayload (payload) {\n  switch (payload.method) {\n    // cache permanently\n    case 'web3_clientVersion':\n    case 'web3_sha3':\n    case 'eth_protocolVersion':\n    case 'eth_getBlockTransactionCountByHash':\n    case 'eth_getUncleCountByBlockHash':\n    case 'eth_getCode':\n    case 'eth_getBlockByHash':\n    case 'eth_getTransactionByHash':\n    case 'eth_getTransactionByBlockHashAndIndex':\n    case 'eth_getTransactionReceipt':\n    case 'eth_getUncleByBlockHashAndIndex':\n    case 'eth_getCompilers':\n    case 'eth_compileLLL':\n    case 'eth_compileSolidity':\n    case 'eth_compileSerpent':\n    case 'shh_version':\n    case 'test_permaCache':\n      return 'perma'\n\n    // cache until fork\n    case 'eth_getBlockByNumber':\n    case 'eth_getBlockTransactionCountByNumber':\n    case 'eth_getUncleCountByBlockNumber':\n    case 'eth_getTransactionByBlockNumberAndIndex':\n    case 'eth_getUncleByBlockNumberAndIndex':\n    case 'test_forkCache':\n      return 'fork'\n\n    // cache for block\n    case 'eth_gasPrice':\n    case 'eth_blockNumber':\n    case 'eth_getBalance':\n    case 'eth_getStorageAt':\n    case 'eth_getTransactionCount':\n    case 'eth_call':\n    case 'eth_estimateGas':\n    case 'eth_getFilterLogs':\n    case 'eth_getLogs':\n    case 'test_blockCache':\n      return 'block'\n\n    // never cache\n    case 'net_version':\n    case 'net_peerCount':\n    case 'net_listening':\n    case 'eth_syncing':\n    case 'eth_sign':\n    case 'eth_coinbase':\n    case 'eth_mining':\n    case 'eth_hashrate':\n    case 'eth_accounts':\n    case 'eth_sendTransaction':\n    case 'eth_sendRawTransaction':\n    case 'eth_newFilter':\n    case 'eth_newBlockFilter':\n    case 'eth_newPendingTransactionFilter':\n    case 'eth_uninstallFilter':\n    case 'eth_getFilterChanges':\n    case 'eth_getWork':\n    case 'eth_submitWork':\n    case 'eth_submitHashrate':\n    case 'db_putString':\n    case 'db_getString':\n    case 'db_putHex':\n    case 'db_getHex':\n    case 'shh_post':\n    case 'shh_newIdentity':\n    case 'shh_hasIdentity':\n    case 'shh_newGroup':\n    case 'shh_addToGroup':\n    case 'shh_newFilter':\n    case 'shh_uninstallFilter':\n    case 'shh_getFilterChanges':\n    case 'shh_getMessages':\n    case 'test_neverCache':\n      return 'never'\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvY2FjaGUtdXRpbHMuanMiLCJtYXBwaW5ncyI6IkFBQUEsa0JBQWtCLG1CQUFPLENBQUMsa0ZBQXVCOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93aGFsZS1icmlkZ2UvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvY2FjaGUtdXRpbHMuanM/MjQ5ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzdHJpbmdpZnkgPSByZXF1aXJlKCdqc29uLXN0YWJsZS1zdHJpbmdpZnknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2FjaGVJZGVudGlmaWVyRm9yUGF5bG9hZDogY2FjaGVJZGVudGlmaWVyRm9yUGF5bG9hZCxcbiAgY2FuQ2FjaGU6IGNhbkNhY2hlLFxuICBibG9ja1RhZ0ZvclBheWxvYWQ6IGJsb2NrVGFnRm9yUGF5bG9hZCxcbiAgcGFyYW1zV2l0aG91dEJsb2NrVGFnOiBwYXJhbXNXaXRob3V0QmxvY2tUYWcsXG4gIGJsb2NrVGFnUGFyYW1JbmRleDogYmxvY2tUYWdQYXJhbUluZGV4LFxuICBjYWNoZVR5cGVGb3JQYXlsb2FkOiBjYWNoZVR5cGVGb3JQYXlsb2FkXG59XG5cbmZ1bmN0aW9uIGNhY2hlSWRlbnRpZmllckZvclBheWxvYWQgKHBheWxvYWQsIHNraXBCbG9ja1JlZikge1xuICBjb25zdCBzaW1wbGVQYXJhbXMgPSBza2lwQmxvY2tSZWYgPyBwYXJhbXNXaXRob3V0QmxvY2tUYWcocGF5bG9hZCkgOiBwYXlsb2FkLnBhcmFtc1xuICBpZiAoY2FuQ2FjaGUocGF5bG9hZCkpIHtcbiAgICByZXR1cm4gcGF5bG9hZC5tZXRob2QgKyAnOicgKyBzdHJpbmdpZnkoc2ltcGxlUGFyYW1zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FuQ2FjaGUgKHBheWxvYWQpIHtcbiAgcmV0dXJuIGNhY2hlVHlwZUZvclBheWxvYWQocGF5bG9hZCkgIT09ICduZXZlcidcbn1cblxuZnVuY3Rpb24gYmxvY2tUYWdGb3JQYXlsb2FkIChwYXlsb2FkKSB7XG4gIGxldCBpbmRleCA9IGJsb2NrVGFnUGFyYW1JbmRleChwYXlsb2FkKVxuXG4gIC8vIEJsb2NrIHRhZyBwYXJhbSBub3QgcGFzc2VkLlxuICBpZiAoaW5kZXggPj0gcGF5bG9hZC5wYXJhbXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHJldHVybiBwYXlsb2FkLnBhcmFtc1tpbmRleF1cbn1cblxuZnVuY3Rpb24gcGFyYW1zV2l0aG91dEJsb2NrVGFnIChwYXlsb2FkKSB7XG4gIGNvbnN0IGluZGV4ID0gYmxvY2tUYWdQYXJhbUluZGV4KHBheWxvYWQpXG5cbiAgLy8gQmxvY2sgdGFnIHBhcmFtIG5vdCBwYXNzZWQuXG4gIGlmIChpbmRleCA+PSBwYXlsb2FkLnBhcmFtcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gcGF5bG9hZC5wYXJhbXNcbiAgfVxuXG4gIC8vIGV0aF9nZXRCbG9ja0J5TnVtYmVyIGhhcyB0aGUgYmxvY2sgdGFnIGZpcnN0LCB0aGVuIHRoZSBvcHRpb25hbCBpbmNsdWRlVHg/IHBhcmFtXG4gIGlmIChwYXlsb2FkLm1ldGhvZCA9PT0gJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJykge1xuICAgIHJldHVybiBwYXlsb2FkLnBhcmFtcy5zbGljZSgxKVxuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQucGFyYW1zLnNsaWNlKDAsIGluZGV4KVxufVxuXG5mdW5jdGlvbiBibG9ja1RhZ1BhcmFtSW5kZXggKHBheWxvYWQpIHtcbiAgc3dpdGNoIChwYXlsb2FkLm1ldGhvZCkge1xuICAgIC8vIGJsb2NrVGFnIGlzIGF0IGluZGV4IDJcbiAgICBjYXNlICdldGhfZ2V0U3RvcmFnZUF0JzpcbiAgICAgIHJldHVybiAyXG4gICAgLy8gYmxvY2tUYWcgaXMgYXQgaW5kZXggMVxuICAgIGNhc2UgJ2V0aF9nZXRCYWxhbmNlJzpcbiAgICBjYXNlICdldGhfZ2V0Q29kZSc6XG4gICAgY2FzZSAnZXRoX2dldFRyYW5zYWN0aW9uQ291bnQnOlxuICAgIGNhc2UgJ2V0aF9jYWxsJzpcbiAgICAgIHJldHVybiAxXG4gICAgLy8gYmxvY2tUYWcgaXMgYXQgaW5kZXggMFxuICAgIGNhc2UgJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJzpcbiAgICAgIHJldHVybiAwXG4gICAgLy8gdGhlcmUgaXMgbm8gYmxvY2tUYWdcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbmZ1bmN0aW9uIGNhY2hlVHlwZUZvclBheWxvYWQgKHBheWxvYWQpIHtcbiAgc3dpdGNoIChwYXlsb2FkLm1ldGhvZCkge1xuICAgIC8vIGNhY2hlIHBlcm1hbmVudGx5XG4gICAgY2FzZSAnd2ViM19jbGllbnRWZXJzaW9uJzpcbiAgICBjYXNlICd3ZWIzX3NoYTMnOlxuICAgIGNhc2UgJ2V0aF9wcm90b2NvbFZlcnNpb24nOlxuICAgIGNhc2UgJ2V0aF9nZXRCbG9ja1RyYW5zYWN0aW9uQ291bnRCeUhhc2gnOlxuICAgIGNhc2UgJ2V0aF9nZXRVbmNsZUNvdW50QnlCbG9ja0hhc2gnOlxuICAgIGNhc2UgJ2V0aF9nZXRDb2RlJzpcbiAgICBjYXNlICdldGhfZ2V0QmxvY2tCeUhhc2gnOlxuICAgIGNhc2UgJ2V0aF9nZXRUcmFuc2FjdGlvbkJ5SGFzaCc6XG4gICAgY2FzZSAnZXRoX2dldFRyYW5zYWN0aW9uQnlCbG9ja0hhc2hBbmRJbmRleCc6XG4gICAgY2FzZSAnZXRoX2dldFRyYW5zYWN0aW9uUmVjZWlwdCc6XG4gICAgY2FzZSAnZXRoX2dldFVuY2xlQnlCbG9ja0hhc2hBbmRJbmRleCc6XG4gICAgY2FzZSAnZXRoX2dldENvbXBpbGVycyc6XG4gICAgY2FzZSAnZXRoX2NvbXBpbGVMTEwnOlxuICAgIGNhc2UgJ2V0aF9jb21waWxlU29saWRpdHknOlxuICAgIGNhc2UgJ2V0aF9jb21waWxlU2VycGVudCc6XG4gICAgY2FzZSAnc2hoX3ZlcnNpb24nOlxuICAgIGNhc2UgJ3Rlc3RfcGVybWFDYWNoZSc6XG4gICAgICByZXR1cm4gJ3Blcm1hJ1xuXG4gICAgLy8gY2FjaGUgdW50aWwgZm9ya1xuICAgIGNhc2UgJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJzpcbiAgICBjYXNlICdldGhfZ2V0QmxvY2tUcmFuc2FjdGlvbkNvdW50QnlOdW1iZXInOlxuICAgIGNhc2UgJ2V0aF9nZXRVbmNsZUNvdW50QnlCbG9ja051bWJlcic6XG4gICAgY2FzZSAnZXRoX2dldFRyYW5zYWN0aW9uQnlCbG9ja051bWJlckFuZEluZGV4JzpcbiAgICBjYXNlICdldGhfZ2V0VW5jbGVCeUJsb2NrTnVtYmVyQW5kSW5kZXgnOlxuICAgIGNhc2UgJ3Rlc3RfZm9ya0NhY2hlJzpcbiAgICAgIHJldHVybiAnZm9yaydcblxuICAgIC8vIGNhY2hlIGZvciBibG9ja1xuICAgIGNhc2UgJ2V0aF9nYXNQcmljZSc6XG4gICAgY2FzZSAnZXRoX2Jsb2NrTnVtYmVyJzpcbiAgICBjYXNlICdldGhfZ2V0QmFsYW5jZSc6XG4gICAgY2FzZSAnZXRoX2dldFN0b3JhZ2VBdCc6XG4gICAgY2FzZSAnZXRoX2dldFRyYW5zYWN0aW9uQ291bnQnOlxuICAgIGNhc2UgJ2V0aF9jYWxsJzpcbiAgICBjYXNlICdldGhfZXN0aW1hdGVHYXMnOlxuICAgIGNhc2UgJ2V0aF9nZXRGaWx0ZXJMb2dzJzpcbiAgICBjYXNlICdldGhfZ2V0TG9ncyc6XG4gICAgY2FzZSAndGVzdF9ibG9ja0NhY2hlJzpcbiAgICAgIHJldHVybiAnYmxvY2snXG5cbiAgICAvLyBuZXZlciBjYWNoZVxuICAgIGNhc2UgJ25ldF92ZXJzaW9uJzpcbiAgICBjYXNlICduZXRfcGVlckNvdW50JzpcbiAgICBjYXNlICduZXRfbGlzdGVuaW5nJzpcbiAgICBjYXNlICdldGhfc3luY2luZyc6XG4gICAgY2FzZSAnZXRoX3NpZ24nOlxuICAgIGNhc2UgJ2V0aF9jb2luYmFzZSc6XG4gICAgY2FzZSAnZXRoX21pbmluZyc6XG4gICAgY2FzZSAnZXRoX2hhc2hyYXRlJzpcbiAgICBjYXNlICdldGhfYWNjb3VudHMnOlxuICAgIGNhc2UgJ2V0aF9zZW5kVHJhbnNhY3Rpb24nOlxuICAgIGNhc2UgJ2V0aF9zZW5kUmF3VHJhbnNhY3Rpb24nOlxuICAgIGNhc2UgJ2V0aF9uZXdGaWx0ZXInOlxuICAgIGNhc2UgJ2V0aF9uZXdCbG9ja0ZpbHRlcic6XG4gICAgY2FzZSAnZXRoX25ld1BlbmRpbmdUcmFuc2FjdGlvbkZpbHRlcic6XG4gICAgY2FzZSAnZXRoX3VuaW5zdGFsbEZpbHRlcic6XG4gICAgY2FzZSAnZXRoX2dldEZpbHRlckNoYW5nZXMnOlxuICAgIGNhc2UgJ2V0aF9nZXRXb3JrJzpcbiAgICBjYXNlICdldGhfc3VibWl0V29yayc6XG4gICAgY2FzZSAnZXRoX3N1Ym1pdEhhc2hyYXRlJzpcbiAgICBjYXNlICdkYl9wdXRTdHJpbmcnOlxuICAgIGNhc2UgJ2RiX2dldFN0cmluZyc6XG4gICAgY2FzZSAnZGJfcHV0SGV4JzpcbiAgICBjYXNlICdkYl9nZXRIZXgnOlxuICAgIGNhc2UgJ3NoaF9wb3N0JzpcbiAgICBjYXNlICdzaGhfbmV3SWRlbnRpdHknOlxuICAgIGNhc2UgJ3NoaF9oYXNJZGVudGl0eSc6XG4gICAgY2FzZSAnc2hoX25ld0dyb3VwJzpcbiAgICBjYXNlICdzaGhfYWRkVG9Hcm91cCc6XG4gICAgY2FzZSAnc2hoX25ld0ZpbHRlcic6XG4gICAgY2FzZSAnc2hoX3VuaW5zdGFsbEZpbHRlcic6XG4gICAgY2FzZSAnc2hoX2dldEZpbHRlckNoYW5nZXMnOlxuICAgIGNhc2UgJ3NoaF9nZXRNZXNzYWdlcyc6XG4gICAgY2FzZSAndGVzdF9uZXZlckNhY2hlJzpcbiAgICAgIHJldHVybiAnbmV2ZXInXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/eth-json-rpc-middleware/cache-utils.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createAsyncMiddleware.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createAsyncMiddleware.js ***!
  \********************************************************************************************************/
/***/ ((module) => {

eval("/**\n * JsonRpcEngine only accepts callback-based middleware directly.\n * createAsyncMiddleware exists to enable consumers to pass in async middleware\n * functions.\n *\n * Async middleware have no \"end\" function. Instead, they \"end\" if they return\n * without calling \"next\". Rather than passing in explicit return handlers,\n * async middleware can simply await \"next\", and perform operations on the\n * response object when execution resumes.\n *\n * To accomplish this, createAsyncMiddleware passes the async middleware a\n * wrapped \"next\" function. That function calls the internal JsonRpcEngine\n * \"next\" function with a return handler that resolves a promise when called.\n *\n * The return handler will always be called. Its resolution of the promise\n * enables the control flow described above.\n */\n\nmodule.exports = function createAsyncMiddleware (asyncMiddleware) {\n  return (req, res, next, end) => {\n\n    // nextPromise is the key to the implementation\n    // it is resolved by the return handler passed to the\n    // \"next\" function\n    let resolveNextPromise\n    const nextPromise = new Promise((resolve) => {\n      resolveNextPromise = resolve\n    })\n\n    let returnHandlerCallback, nextWasCalled\n\n    const asyncNext = async () => {\n\n      nextWasCalled = true\n\n      next((callback) => { // eslint-disable-line callback-return\n        returnHandlerCallback = callback\n        resolveNextPromise()\n      })\n      await nextPromise\n    }\n\n    asyncMiddleware(req, res, asyncNext)\n      .then(async () => {\n        if (nextWasCalled) {\n          await nextPromise // we must wait until the return handler is called\n          returnHandlerCallback(null)\n        } else {\n          end(null)\n        }\n      })\n      .catch((error) => {\n        if (returnHandlerCallback) {\n          returnHandlerCallback(error)\n        } else {\n          end(error)\n        }\n      })\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvbm9kZV9tb2R1bGVzL2pzb24tcnBjLWVuZ2luZS9zcmMvY3JlYXRlQXN5bmNNaWRkbGV3YXJlLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93aGFsZS1icmlkZ2UvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvbm9kZV9tb2R1bGVzL2pzb24tcnBjLWVuZ2luZS9zcmMvY3JlYXRlQXN5bmNNaWRkbGV3YXJlLmpzP2U4NDUiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBKc29uUnBjRW5naW5lIG9ubHkgYWNjZXB0cyBjYWxsYmFjay1iYXNlZCBtaWRkbGV3YXJlIGRpcmVjdGx5LlxuICogY3JlYXRlQXN5bmNNaWRkbGV3YXJlIGV4aXN0cyB0byBlbmFibGUgY29uc3VtZXJzIHRvIHBhc3MgaW4gYXN5bmMgbWlkZGxld2FyZVxuICogZnVuY3Rpb25zLlxuICpcbiAqIEFzeW5jIG1pZGRsZXdhcmUgaGF2ZSBubyBcImVuZFwiIGZ1bmN0aW9uLiBJbnN0ZWFkLCB0aGV5IFwiZW5kXCIgaWYgdGhleSByZXR1cm5cbiAqIHdpdGhvdXQgY2FsbGluZyBcIm5leHRcIi4gUmF0aGVyIHRoYW4gcGFzc2luZyBpbiBleHBsaWNpdCByZXR1cm4gaGFuZGxlcnMsXG4gKiBhc3luYyBtaWRkbGV3YXJlIGNhbiBzaW1wbHkgYXdhaXQgXCJuZXh0XCIsIGFuZCBwZXJmb3JtIG9wZXJhdGlvbnMgb24gdGhlXG4gKiByZXNwb25zZSBvYmplY3Qgd2hlbiBleGVjdXRpb24gcmVzdW1lcy5cbiAqXG4gKiBUbyBhY2NvbXBsaXNoIHRoaXMsIGNyZWF0ZUFzeW5jTWlkZGxld2FyZSBwYXNzZXMgdGhlIGFzeW5jIG1pZGRsZXdhcmUgYVxuICogd3JhcHBlZCBcIm5leHRcIiBmdW5jdGlvbi4gVGhhdCBmdW5jdGlvbiBjYWxscyB0aGUgaW50ZXJuYWwgSnNvblJwY0VuZ2luZVxuICogXCJuZXh0XCIgZnVuY3Rpb24gd2l0aCBhIHJldHVybiBoYW5kbGVyIHRoYXQgcmVzb2x2ZXMgYSBwcm9taXNlIHdoZW4gY2FsbGVkLlxuICpcbiAqIFRoZSByZXR1cm4gaGFuZGxlciB3aWxsIGFsd2F5cyBiZSBjYWxsZWQuIEl0cyByZXNvbHV0aW9uIG9mIHRoZSBwcm9taXNlXG4gKiBlbmFibGVzIHRoZSBjb250cm9sIGZsb3cgZGVzY3JpYmVkIGFib3ZlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQXN5bmNNaWRkbGV3YXJlIChhc3luY01pZGRsZXdhcmUpIHtcbiAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCwgZW5kKSA9PiB7XG5cbiAgICAvLyBuZXh0UHJvbWlzZSBpcyB0aGUga2V5IHRvIHRoZSBpbXBsZW1lbnRhdGlvblxuICAgIC8vIGl0IGlzIHJlc29sdmVkIGJ5IHRoZSByZXR1cm4gaGFuZGxlciBwYXNzZWQgdG8gdGhlXG4gICAgLy8gXCJuZXh0XCIgZnVuY3Rpb25cbiAgICBsZXQgcmVzb2x2ZU5leHRQcm9taXNlXG4gICAgY29uc3QgbmV4dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgcmVzb2x2ZU5leHRQcm9taXNlID0gcmVzb2x2ZVxuICAgIH0pXG5cbiAgICBsZXQgcmV0dXJuSGFuZGxlckNhbGxiYWNrLCBuZXh0V2FzQ2FsbGVkXG5cbiAgICBjb25zdCBhc3luY05leHQgPSBhc3luYyAoKSA9PiB7XG5cbiAgICAgIG5leHRXYXNDYWxsZWQgPSB0cnVlXG5cbiAgICAgIG5leHQoKGNhbGxiYWNrKSA9PiB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FsbGJhY2stcmV0dXJuXG4gICAgICAgIHJldHVybkhhbmRsZXJDYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgIHJlc29sdmVOZXh0UHJvbWlzZSgpXG4gICAgICB9KVxuICAgICAgYXdhaXQgbmV4dFByb21pc2VcbiAgICB9XG5cbiAgICBhc3luY01pZGRsZXdhcmUocmVxLCByZXMsIGFzeW5jTmV4dClcbiAgICAgIC50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKG5leHRXYXNDYWxsZWQpIHtcbiAgICAgICAgICBhd2FpdCBuZXh0UHJvbWlzZSAvLyB3ZSBtdXN0IHdhaXQgdW50aWwgdGhlIHJldHVybiBoYW5kbGVyIGlzIGNhbGxlZFxuICAgICAgICAgIHJldHVybkhhbmRsZXJDYWxsYmFjayhudWxsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZChudWxsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBpZiAocmV0dXJuSGFuZGxlckNhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuSGFuZGxlckNhbGxiYWNrKGVycm9yKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuZChlcnJvcilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createAsyncMiddleware.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createScaffoldMiddleware.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createScaffoldMiddleware.js ***!
  \***********************************************************************************************************/
/***/ ((module) => {

eval("module.exports = function createScaffoldMiddleware (handlers) {\n  return (req, res, next, end) => {\n    const handler = handlers[req.method]\n    // if no handler, return\n    if (handler === undefined) {\n      return next()\n    }\n    // if handler is fn, call as middleware\n    if (typeof handler === 'function') {\n      return handler(req, res, next, end)\n    }\n    // if handler is some other value, use as result\n    res.result = handler\n    return end()\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvbm9kZV9tb2R1bGVzL2pzb24tcnBjLWVuZ2luZS9zcmMvY3JlYXRlU2NhZmZvbGRNaWRkbGV3YXJlLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2hhbGUtYnJpZGdlLy4vbm9kZV9tb2R1bGVzL2V0aC1qc29uLXJwYy1taWRkbGV3YXJlL25vZGVfbW9kdWxlcy9qc29uLXJwYy1lbmdpbmUvc3JjL2NyZWF0ZVNjYWZmb2xkTWlkZGxld2FyZS5qcz9jMWI5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU2NhZmZvbGRNaWRkbGV3YXJlIChoYW5kbGVycykge1xuICByZXR1cm4gKHJlcSwgcmVzLCBuZXh0LCBlbmQpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gaGFuZGxlcnNbcmVxLm1ldGhvZF1cbiAgICAvLyBpZiBubyBoYW5kbGVyLCByZXR1cm5cbiAgICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbmV4dCgpXG4gICAgfVxuICAgIC8vIGlmIGhhbmRsZXIgaXMgZm4sIGNhbGwgYXMgbWlkZGxld2FyZVxuICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGhhbmRsZXIocmVxLCByZXMsIG5leHQsIGVuZClcbiAgICB9XG4gICAgLy8gaWYgaGFuZGxlciBpcyBzb21lIG90aGVyIHZhbHVlLCB1c2UgYXMgcmVzdWx0XG4gICAgcmVzLnJlc3VsdCA9IGhhbmRsZXJcbiAgICByZXR1cm4gZW5kKClcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createScaffoldMiddleware.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/eth-json-rpc-middleware/scaffold.js":
/*!**********************************************************!*\
  !*** ./node_modules/eth-json-rpc-middleware/scaffold.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// for backwards compat\nmodule.exports = __webpack_require__(/*! json-rpc-engine/src/createScaffoldMiddleware */ \"(ssr)/./node_modules/eth-json-rpc-middleware/node_modules/json-rpc-engine/src/createScaffoldMiddleware.js\")\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvc2NhZmZvbGQuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxxTUFBd0UiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93aGFsZS1icmlkZ2UvLi9ub2RlX21vZHVsZXMvZXRoLWpzb24tcnBjLW1pZGRsZXdhcmUvc2NhZmZvbGQuanM/MDU2YyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3IgYmFja3dhcmRzIGNvbXBhdFxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdqc29uLXJwYy1lbmdpbmUvc3JjL2NyZWF0ZVNjYWZmb2xkTWlkZGxld2FyZScpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/eth-json-rpc-middleware/scaffold.js\n");

/***/ })

};
;