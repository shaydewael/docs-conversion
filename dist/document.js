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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Document = /** @class */ (function () {
    function Document(_a) {
        var client = _a.client, files = _a.files, _b = _a.schema, schema = _b === void 0 ? undefined : _b, _c = _a.directories, directories = _c === void 0 ? {
            in: '',
            out: '',
        } : _c, _d = _a.content, content = _d === void 0 ? [] : _d;
        this.schema = schema;
        this.client = client;
        this.directories = directories.in ? directories : { in: '', out: directories.out };
        this.content = content;
        if (typeof files === 'string')
            files = [files];
        this.files = this.files ? this.files : [];
    }
    Document.prototype.fetchDirectory = function (path) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var files, data, d;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        files = [];
                        return [4 /*yield*/, this.client.repos.getContent({
                                owner: (_a = this.schema.githubMetadata) === null || _a === void 0 ? void 0 : _a.owner,
                                repo: (_b = this.schema.githubMetadata) === null || _b === void 0 ? void 0 : _b.repo,
                                path: path
                            })];
                    case 1:
                        data = (_c.sent()).data;
                        for (d in data) {
                            files.push({ name: data[d].name, url: data[d].download_url });
                        }
                        return [2 /*return*/, files];
                }
            });
        });
    };
    Document.prototype.compile = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var files, _c, _d, _i, f, renderedContent, currentFile, data, _e, _, sections, c, res, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.fetchFiles(this.files)];
                    case 1:
                        files = _f.sent();
                        _c = [];
                        for (_d in files)
                            _c.push(_d);
                        _i = 0;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _c.length)) return [3 /*break*/, 8];
                        f = _c[_i];
                        renderedContent = '';
                        currentFile = files[f];
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, axios_1.default.get(currentFile.url)];
                    case 4:
                        data = (_f.sent()).data;
                        _e = this.schema.apply(data), _ = _e._, sections = _e.sections;
                        if (!sections)
                            throw new Error('Invalid content');
                        for (c in this.content) {
                            renderedContent += sections[this.content[c]] + "\n";
                            // console.log(renderedContent);
                            // renderFile(renderedContent, this.directories.out, fileName);
                        }
                        // console.log(renderedContent);
                        // });
                        renderedContent = Buffer.from(renderedContent).toString('base64');
                        return [4 /*yield*/, this.client.repos.putContent({
                                owner: (_a = this.schema.githubMetadata) === null || _a === void 0 ? void 0 : _a.owner,
                                repo: (_b = this.schema.githubMetadata) === null || _b === void 0 ? void 0 : _b.repo,
                                path: this.directories.out + "/" + currentFile.name,
                                content: renderedContent,
                                message: "Document Conversion: Add " + currentFile.name
                            })];
                    case 5:
                        res = _f.sent();
                        console.log(res);
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _f.sent();
                        console.error("ERROR: " + err_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Document.prototype.fetchFiles = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var fileArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileArr = [];
                        if (!(this.directories.in !== '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchDirectory(this.directories.in)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: 
                    // for (let f in files) {
                    //   fileArr.push(`${f}`);
                    // }
                    return [2 /*return*/, fileArr];
                }
            });
        });
    };
    return Document;
}());
exports.default = Document;
