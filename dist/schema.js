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
Object.defineProperty(exports, "__esModule", { value: true });
var yaml = __importStar(require("js-yaml"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var helpers_1 = require("./helpers");
var Schema = /** @class */ (function () {
    function Schema(opts) {
        var _a = this.parse(opts.path), metadata = _a.metadata, sections = _a.sections;
        this.metadata = metadata;
        this.sections = sections;
    }
    Schema.prototype.parse = function (schemaPath) {
        try {
            // TODO: should this be handled by user?
            var p = path.resolve(__dirname, schemaPath);
            var s = yaml.load(fs.readFileSync(p, 'utf8'));
            if (!s["sections"])
                throw new Error("Invalid schema. Sections must exist");
            return {
                metadata: s['metadata'],
                sections: s['sections']
            };
        }
        catch (e) {
            console.log("ERROR: " + e);
            return;
        }
    };
    // everything between two strings, including new lines: /(?<=---[\r\n])(.|[\r\n])*(?=---)/gm
    Schema.prototype.apply = function (fileContent) {
        var metadataResult = this.buildSection(fileContent, 'metadata');
        var sectionResults = {};
        var sectionKeys = Object.keys(this.sections);
        var section;
        for (section in sectionKeys) {
            var result = this.buildSection(fileContent, sectionKeys[section]);
            if (result)
                sectionResults[sectionKeys[section]] = result;
        }
        return {
            sections: sectionResults,
            metadata: metadataResult
        };
    };
    // TODO: breakout options discluding first param into an object
    // TODO: strip linebreaks
    Schema.prototype.buildSection = function (s, name, inclusive) {
        if (inclusive === void 0) { inclusive = false; }
        var section;
        if (name === 'metadata') {
            if (!this.metadata)
                return;
            // TODO don't hack this lol
            section = this.metadata;
        }
        else {
            section = this.sections[name];
        }
        var start = section.start, end = section.end;
        start = helpers_1.toPosBehind(start);
        end = helpers_1.toPosAhead(end);
        return getSection(s, start, end, 'gm');
    };
    return Schema;
}());
exports.default = Schema;
function getSection(text, start, end, flags) {
    if (flags === void 0) { flags = ''; }
    // TODO: better way to do this im sure
    var capture = "((.|[\\r\\n])+?)";
    var re = new RegExp(start + helpers_1.lb + capture + end, flags);
    var result = re.exec(text);
    if (result !== null) {
        return result[1];
    }
    else {
        return;
    }
}
