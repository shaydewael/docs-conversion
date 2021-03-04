"use strict";
/**
 * Helper RegExp functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreGroup = exports.lb = exports.getFileName = exports.toPosAhead = exports.toPosBehind = exports.parseObj = void 0;
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
function getFileName(str) {
    var filter = (new RegExp("^.*/\/?(.*)\\..*$")).exec(str);
    return filter ? filter[1] : str;
}
exports.getFileName = getFileName;
exports.lb = "[\\r\\n]?";
exports.coreGroup = "(.|[\\r\\n])+?";
