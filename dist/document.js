"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var helpers_1 = require("./helpers");
var Document = /** @class */ (function () {
    function Document(_a) {
        var _b = _a.schema, schema = _b === void 0 ? undefined : _b, _c = _a.directories, directories = _c === void 0 ? {
            in: '',
            out: '',
        } : _c, _d = _a.content, content = _d === void 0 ? [] : _d, _e = _a.files, files = _e === void 0 ? '' : _e;
        this.schema = schema;
        this.directories = directories.in ? directories : { in: '', out: directories.out };
        this.content = content;
        if (typeof files === 'string')
            files = [files];
        this.files = files;
    }
    Document.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, _loop_1, this_1, f;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.files)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.fetchFiles(this.files)];
                    case 1:
                        files = _a.sent();
                        _loop_1 = function (f) {
                            var renderedContent = '';
                            var fileName = files[f];
                            var pathIn = path.resolve(__dirname, '../', this_1.directories.in, fileName);
                            try {
                                fs.readFile(pathIn, 'utf-8', function (err, data) {
                                    if (err)
                                        throw new Error("Failed to access defined file: " + pathIn);
                                    var _a = _this.schema.apply(data), _ = _a._, sections = _a.sections;
                                    if (!sections)
                                        throw new Error('Invalid content');
                                    for (var c in _this.content) {
                                        renderedContent += sections[_this.content[c]] + "\n";
                                        helpers_1.renderFile(renderedContent, _this.directories.out, fileName);
                                    }
                                });
                            }
                            catch (err) {
                                console.error("ERROR: " + err);
                            }
                        };
                        this_1 = this;
                        for (f in files) {
                            _loop_1(f);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Document.prototype.fetchFiles = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var fileArr, inPath, f;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileArr = [];
                        if (!(this.directories.in !== '')) return [3 /*break*/, 2];
                        inPath = path.join(__dirname, "../" + this.directories.in);
                        return [4 /*yield*/, fs.promises.readdir(inPath)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        for (f in files) {
                            fileArr.push("" + f);
                        }
                        return [2 /*return*/, fileArr];
                }
            });
        });
    };
    return Document;
}());
exports.default = Document;
