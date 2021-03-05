import * as path from 'path';
import * as fs from 'fs';
import { default as Schema } from './schema';
import { renderFile } from './helpers';

export default class Document {
  public schema: Schema;
  public content: string[];
  public directories: { in: string, out: string; };
  private files: string[] | undefined;

  constructor({
    schema = undefined,
    directories = {
      in: '',
      out: '',
    },
    content = [],
    files = ''
  }: DocumentOptions) {
    this.schema = schema as Schema;
    this.directories = directories.in ? directories : { in: '', out: directories.out };
    this.content = content;

    if (typeof files === 'string') files = [files];
    this.files = files;
  }

  public async compile() {
    if (!this.files) return;
    const files = await this.fetchFiles(this.files);
    
    for (let f in files) {
      let renderedContent = '';
      let fileName = files[f];
      let pathIn = path.resolve(__dirname, '../', this.directories.in, fileName);
      
      try {
        fs.readFile(pathIn, 'utf-8', (err, data) => {
          if (err) throw new Error(`Failed to access defined file: ${pathIn}`);
          let { _, sections } = this.schema.apply(data);
          if (!sections) throw new Error('Invalid content');

          for (let c in this.content) {
            renderedContent += `${sections[this.content[c]]}\n`;
            renderFile(renderedContent, this.directories.out, fileName);
          }
        });
      } catch(err) {
        console.error(`ERROR: ${err}`);
      }
    }
  }

  private async fetchFiles(files?: string[]): Promise<string[]> {
    let fileArr: string[] = [];

    if (this.directories.in !== '') {
      let inPath = path.join(__dirname, `../${this.directories.in}`);
      return await fs.promises.readdir(inPath);
    } else {
      for (let f in files) {
        fileArr.push(`${f}`);
      }
      return fileArr;
    }
  }
}

/**
 * Interfaces
 */

interface DocumentOptions {
  schema?: Schema;
  files?: string | string[];
  directories?: {
    in: string;
    out: string;
  };
  content: string[];
}