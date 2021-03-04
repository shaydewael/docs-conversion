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
        for (var section in sectionKeys) {
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
    Schema.prototype.buildSection = function (s, name) {
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
        var start = section.start, end = section.end, inclusive = section.inclusive;
        var capture = '';
        if (!inclusive) {
            start = helpers_1.toPosBehind(start);
            end = helpers_1.toPosAhead(end);
            capture = "" + start + helpers_1.lb + "(" + helpers_1.coreGroup + ")" + end;
        }
        else {
            start = helpers_1.toPosAhead(start);
            end = end;
            capture = "" + start + helpers_1.lb + "(" + helpers_1.coreGroup + end + ")";
        }
        return getSection(s, capture, 'gm');
    };
    return Schema;
}());
exports.default = Schema;
function getSection(text, capture, flags) {
    if (flags === void 0) { flags = ''; }
    var re = new RegExp(capture, flags);
    var result = re.exec(text);
    if (result !== null) {
        return result[1];
    }
    else {
        return;
    }
}
