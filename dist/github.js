"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubDirectoryFiles = exports.getGithubFile = exports.createGithubFile = void 0;
function createGithubFile(client, metadata, fileOpts) {
    return __awaiter(this, void 0, void 0, function () {
        var path, content, message, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = fileOpts.path, content = fileOpts.content, message = fileOpts.message;
                    if (typeof content === 'string') {
                        content = Buffer.from(content).toString('base64');
                    }
                    message = message ? message : "Creating file: " + path;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.repos.createOrUpdateFileContents({
                            path: path,
                            content: content,
                            message: message,
                            owner: metadata.owner,
                            repo: metadata.repo
                        })];
                case 2:
                    res = _a.sent();
                    // TODO
                    if (!res.content)
                        throw new Error("No content");
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Error creating file: " + path + "\n" + e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createGithubFile = createGithubFile;
function getGithubFile(client, metadata, path) {
    return __awaiter(this, void 0, void 0, function () {
        var data, content, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.repos.getContent({
                            path: path,
                            owner: metadata.owner,
                            repo: metadata.repo
                        })];
                case 1:
                    data = (_a.sent()).data;
                    content = Buffer.from(data.content, 'base64').toString('ascii');
                    if (content === '')
                        throw new Error("Error parsing content: " + path);
                    return [2 /*return*/, {
                            content: content,
                            name: data.name,
                            url: data.url
                        }];
                case 2:
                    e_2 = _a.sent();
                    console.error("Error fetching file: " + e_2);
                    return [2 /*return*/, Promise.reject(e_2)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getGithubFile = getGithubFile;
function getGithubDirectoryFiles(client, metadata, path) {
    return __awaiter(this, void 0, void 0, function () {
        var files, data, f, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.repos.getContent({
                            path: path,
                            owner: metadata.owner,
                            repo: metadata.repo
                        })];
                case 2:
                    data = (_a.sent()).data;
                    for (f in data) {
                        files.push(path + "/" + data[f].path);
                    }
                    return [2 /*return*/, files];
                case 3:
                    e_3 = _a.sent();
                    return [2 /*return*/, console.error("Error fetching file: " + e_3)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getGithubDirectoryFiles = getGithubDirectoryFiles;
