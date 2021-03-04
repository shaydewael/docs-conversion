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
var Schema = /** @class */ (function () {
    function Schema(opts) {
        var _a = this.parseSchema(opts.path), metadata = _a.metadata, sections = _a.sections;
        this.metadata = metadata;
        this.sections = sections;
    }
    Schema.prototype.parseSchema = function (schemaPath) {
        try {
            // TODO: should this be handled by user?
            var p = path.resolve(__dirname, schemaPath);
            var s = yaml.load(fs.readFileSync(p, 'utf8'));
            if (!s["sections"])
                throw new Error("Invalid schema. Sections must exist");
            return {
                metadata: s["metadata"],
                sections: s["sections"],
            };
        }
        catch (e) {
            console.log("ERROR: " + e);
            return;
        }
    };
    // everything between two strings, including new lines: /(?<=---[\r\n])(.|[\r\n])*(?=---)/gm
    Schema.prototype.apply = function (fileContent) {
        var metadataResult = this.buildMetadata(fileContent);
        var contentSections = {};
        var sectionKeys = Object.keys(this.sections);
        for (var section in sectionKeys) {
            var result = this.buildSection(fileContent, sectionKeys[section]);
            contentSections[sectionKeys[section]] = result;
        }
        return {
            sections: contentSections,
            metadata: metadataResult
        };
    };
    // TODO: breakout options discluding first param into an object
    // TODO: strip linebreaks
    Schema.prototype.buildSection = function (s, name, inclusive) {
        if (inclusive === void 0) { inclusive = false; }
        var section = this.sections[name];
        var start = section.start, end = section.end;
        if (!inclusive) {
            start = "" + toPosBehind(start);
            end = "" + toPosAhead(end);
        }
        var res = getSection(s, start, end, 'gm');
        return res ? res[1] : undefined;
    };
    Schema.prototype.buildMetadata = function (m) {
        if (this.metadata === undefined)
            return;
        // TODO: make newline optional
        var start = toPosBehind(this.metadata.start) + "[\\r\\n]?";
        var end = "" + toPosAhead(this.metadata.end);
        // TODO: like...errors tho
        var group = getSection(m, start, end, 'gm');
        if (!group) {
            return new Error("Error parsing metadata");
        }
        else {
            return parseObj(group[0]);
        }
    };
    return Schema;
}());
exports.default = Schema;
function getSection(text, start, end, flags) {
    if (flags === void 0) { flags = ''; }
    // TODO: better way to do this im sure
    var optionalLineBreak = "[\\r\\n]?";
    var chars = optionalLineBreak + "((.|[\\r\\n])+?)" + optionalLineBreak;
    var re = new RegExp(start + chars + end, flags);
    return re.exec(text);
}
/**
 * Helper RegExp functions
 */
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
function toPosBehind(str) {
    return "(?<=" + str + ")";
}
function toPosAhead(str) {
    return "(?=" + str + ")";
}
