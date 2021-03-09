"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var Schema = /** @class */ (function () {
    function Schema(opts) {
        this.metadata = opts.metadata;
        this.sections = opts.sections;
        this.output = opts.output;
        this.githubMetadata = opts.githubMetadata;
    }
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
