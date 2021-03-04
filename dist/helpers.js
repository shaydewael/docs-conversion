"use strict";
/**
 * Helper RegExp functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.lb = exports.toPosAhead = exports.toPosBehind = exports.parseObj = void 0;
function parseObj(str) {
    var result = {};
    var pair;
    var jsonExp = new RegExp("([a-zA-Z]+)[:\\s]+(.*)[\\n]?", 'g');
    while ((pair = jsonExp.exec(str)) !== null) {
        if (pair[1] && pair[2]) {
            result[pair[1]] = pair[2];
        }
        else {
            continue;
        }
    }
    return result;
}
exports.parseObj = parseObj;
function toPosBehind(str) {
    return "(?<=" + str + ")";
}
exports.toPosBehind = toPosBehind;
function toPosAhead(str) {
    return "(?=" + str + ")";
}
exports.toPosAhead = toPosAhead;
exports.lb = "[\\r\\n]?";
