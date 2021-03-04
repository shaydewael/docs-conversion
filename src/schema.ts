import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export default class Schema {
  public metadata: SchemaMetadata | undefined;
  public sections: { [key: string]: SchemaSection };

  constructor(opts: SchemaOptions) {
      let { metadata, sections } = this.parseSchema(opts.path);

      this.metadata = metadata;
      this.sections = sections;
  }

  parseSchema(schemaPath: string): any {
    try {
      // TODO: should this be handled by user?
      let p = path.resolve(__dirname, schemaPath);
      const s: any = yaml.load(fs.readFileSync(p, 'utf8'));
      if (!s["sections"]) throw new Error("Invalid schema. Sections must exist");

      return {
        metadata: s["metadata"],
        sections: s["sections"],
      };
    } catch (e) {
      console.log(`ERROR: ${e}`);
      return;
    }
  }

  // everything between two strings, including new lines: /(?<=---[\r\n])(.|[\r\n])*(?=---)/gm
  apply(fileContent: any): any {
    let metadataResult = this.buildMetadata(fileContent);
    let contentSections: {[key: string]: any} = {};
    let sectionKeys = Object.keys(this.sections);

    for (var section in sectionKeys) {
      let result = this.buildSection(fileContent, sectionKeys[section]);
      contentSections[sectionKeys[section]] = result;
    }

    return {
      sections: contentSections,
      metadata: metadataResult
    };
  }

  // TODO: breakout options discluding first param into an object
  // TODO: strip linebreaks
  buildSection(s: string, name: string, inclusive: boolean = false): any {
    let section = this.sections[name];
    let { start, end } = section;

    if (!inclusive) {
      start = `${toPosBehind(start)}`;
      end = `${toPosAhead(end)}`;
    }

    const res = getSection(s, start, end, 'gm')

    return res ? res[1] : undefined;
  }

  buildMetadata(m: any): any {
    if (this.metadata === undefined) return;

    // TODO: make newline optional
    let start = `${toPosBehind(this.metadata.start)}[\\r\\n]?`;
    let end = `${toPosAhead(this.metadata.end)}`;

    // TODO: like...errors tho
    let group = getSection(m, start, end, 'gm');

    if (!group) {
      return new Error("Error parsing metadata");
    } else {
      return parseObj(group[0]);
    }
  }
}

function getSection(text: string, start: string, end: string, flags: string = ''): RegExpExecArray | null {
  // TODO: better way to do this im sure
  const optionalLineBreak = "[\\r\\n]?";
  let chars = optionalLineBreak + "((.|[\\r\\n])+?)" + optionalLineBreak;

  let re = new RegExp(start + chars + end, flags);
  return re.exec(text);
}

/**
 * Helper RegExp functions
 */

function parseObj(str: string): any {
  let result: {[key: string]: any} = {};
  let pair: RegExpExecArray | null;
  const jsonExp = new RegExp("([a-zA-Z]+)[:\\s]+(.*)[\\n]?", 'g');

  while ((pair = jsonExp.exec(str)) !== null) {
    if (pair[1] && pair[2]) {
      result[pair[1]] = pair[2];
    } else {
      continue;
    }
  }

  return result;
}

function toPosBehind(str: string): string {
  return `(?<=${str})`;
}

function toPosAhead(str: string): string {
  return `(?=${str})`;
}


/**
 * Interfaces
 */
interface SchemaOptions {
  path: string;
}

export interface SchemaMetadata extends BaseSection {
  delimiter?: string;
}

export interface SchemaSection extends BaseSection {
  required: boolean;
}

interface BaseSection {
  start: string;
  end: string;
}


