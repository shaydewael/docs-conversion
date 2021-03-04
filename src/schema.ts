import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export default class Schema {
  public metadata: SchemaMetadata | undefined;
  public sections: SchemaSection[];

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
  apply(file: string): any {
    let metadataResult = this.buildMetadata(file);
    
  }

  buildMetadata(m: string): any {
    if (this.metadata === undefined) return;

    // TODO: make newline optional
    let start = `${toPosBehind(this.metadata.start)}[\\r\\n]`;
    let end = `${toPosAhead(this.metadata.end)}`;

    // TODO: like...errors tho
    let group = getSection(m, start, end, 'gm');
    return parseObj(group[0]);
  }
}

function getSection(str: string, start: string, end: string, flags?: string): any {
  let f = flags ? flags : '';
  let chars = "(.|[\r\n])*";

  let re = new RegExp(start + chars + end, f);
  return re.exec(str);
}

/**
 * Helper RegExp functions
 */

function toPosBehind(str: string): string {
  return `(?<=${str})`;
}

function toPosAhead(str: string): string {
  return `(?=${str})`;
}

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


