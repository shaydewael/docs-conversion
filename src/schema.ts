import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import {
  lb,
  parseObj, 
  toPosAhead, 
  toPosBehind
} from './helpers';

export default class Schema {
  public metadata: SchemaMetadata | undefined;
  public sections: { [key: string]: SchemaSection };

  constructor(opts: SchemaOptions) {
      let { metadata, sections } = this.parse(opts.path);

      this.metadata = metadata;
      this.sections = sections;
  }

  parse(schemaPath: string): any {
    try {
      // TODO: should this be handled by user?
      let p = path.resolve(__dirname, schemaPath);
      const s: any = yaml.load(fs.readFileSync(p, 'utf8'));
      if (!s["sections"]) throw new Error("Invalid schema. Sections must exist");

      return {
        metadata: s['metadata'],
        sections: s['sections']
      };
    } catch (e) {
      console.log(`ERROR: ${e}`);
      return;
    }
  }

  // everything between two strings, including new lines: /(?<=---[\r\n])(.|[\r\n])*(?=---)/gm
  apply(fileContent: any): any {
    let metadataResult = this.buildSection(fileContent, 'metadata');
    let sectionResults: {[key: string]: string} = {};
    let sectionKeys = Object.keys(this.sections);

    let section
    for (section in sectionKeys) {
      let result = this.buildSection(fileContent, sectionKeys[section]);
      if (result) sectionResults[sectionKeys[section]] = result;
    }

    return {
      sections: sectionResults,
      metadata: metadataResult
    };
  }

  // TODO: breakout options discluding first param into an object
  // TODO: strip linebreaks
  buildSection(s: string, name: string, inclusive: boolean = false): string | undefined {
    let section: SchemaMetadata;
    if (name === 'metadata') {
      if (!this.metadata) return;
      // TODO don't hack this lol
      section = this.metadata;
    } else {
      section = this.sections[name];
    }

    let { start, end } = section;
    start = toPosBehind(start);
    end = toPosAhead(end);
    return getSection(s, start, end, 'gm');
  }
}

function getSection(text: string, start: string, end: string, flags: string = ''): string | undefined  {
  // TODO: better way to do this im sure
  let capture =  "((.|[\\r\\n])+?)";

  let re: RegExp = new RegExp(start + lb + capture + end, flags);
  let result = re.exec(text);
  if (result !== null) {
    return result[1];
  } else { return; }
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

