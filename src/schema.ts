import {
  lb,
  toPosAhead, 
  toPosBehind,
  coreGroup
} from './helpers';
import { GithubMetadata } from './github';

export default class Schema {
  public metadata: SchemaSection | undefined;
  public sections: { [key: string]: SchemaSection };
  public output: string[];
  public githubMetadata: GithubMetadata;

  constructor(opts: SchemaOptions) {
      this.metadata = opts.metadata;
      this.sections = opts.sections;
      this.output = opts.output;
      this.githubMetadata = opts.githubMetadata;
  }

  // everything between two strings, including new lines: /(?<=---[\r\n])(.|[\r\n])*(?=---)/gm
  apply(fileContent: any): any {
    let metadataResult = this.buildSection(fileContent, 'metadata');
    let sectionResults: {[key: string]: string} = {};
    let sectionKeys = Object.keys(this.sections);

    for (let section in sectionKeys) {
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
  buildSection(s: string, name: string): string | undefined {
    let section: SchemaSection;
    if (name === 'metadata') {
      if (!this.metadata) return;
      // TODO don't hack this lol
      section = this.metadata;
    } else { 
      section = this.sections[name];
    }

    let { start, end, inclusive } = section;
    let capture = '';

    if (!inclusive) {
      start = toPosBehind(start);
      end = toPosAhead(end);
      capture = `${start}${lb}(${coreGroup})${end}`;
    } else {
      start = toPosAhead(start);
      end = end;
      capture = `${start}${lb}(${coreGroup}${end})`;
    }
    return getSection(s, capture, 'gm');
  }
}

function getSection(text: string, capture: string, flags: string = ''): string | undefined  {
  let re: RegExp = new RegExp(capture, flags);
  let result = re.exec(text);

  if (result !== null) {
    return result[1];
  } else { return; }
}



/**
 * Interfaces
 */
interface SchemaOptions {
  metadata: SchemaSection | undefined;
  sections: { [key: string]: SchemaSection };
  output: string[];
  githubMetadata: GithubMetadata;
}

export interface SchemaSection extends BaseSection {
  delimiter?: string;
  required?: boolean;
  inclusive?: boolean;
}

interface BaseSection {
  start: string;
  end: string;
}
