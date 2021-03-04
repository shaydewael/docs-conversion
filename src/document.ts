import { create } from 'domain';
import { default as Schema } from './schema';
import * as path from 'path';
import * as fs from 'fs';
import { getFileName } from './helpers';

export default class Documenter {
  public schema: Schema;
  public content: string[];

  private files: string[] | undefined;
  private directories: { in: string | undefined, out: string; };

  constructor({
    schema = undefined,
    directories = {
      in: undefined,
      out: '.',
    },
    content = [],
    files = ''
  }: DocumenterOptions) {
    
    //TODO
    this.schema = schema as Schema;
    this.directories = directories;
    this.content = content;

    // TODO: probs just handle this in render()
    this.files = this.compileFiles(files);
  }

  public async render() {
    let files = this.files;
    if (!files) return;
  
    for (let f in files) {
      let renderedContent = '';
      let fileName = files[f];
      let pathIn = path.resolve(__dirname, fileName);
      
      try {
        fs.readFile(pathIn, 'utf-8', (err, data) => {
          if (err) throw new Error(`Failed to access defined file: ${pathIn}`);

          let { _, sections } = this.schema.apply(data);
          if (!sections) throw new Error('Invalid content');

          for (let c in this.content) { 
            renderedContent += `${sections[this.content[c]]}\n`;

            let outPath = path.join(__dirname, `../${this.directories.out}`);
            fs.promises.mkdir(outPath, { recursive: true }).then((val) => {
              let str = getFileName(fileName);
              fs.promises.writeFile(outPath + `/${str}.md`, renderedContent, { flag: 'w' });
            });
          }
        });
      } catch(err) {
        console.error(`ERROR: ${err}`);
      }
    }
  }

  async compileFiles(files: string | string[]): string[] {
    let fileArr: string[] = [];

    if (this.directories.in) {
      let f = await getDirectoryFiles(this.directories.in);
      return f;
    } else {
      if (typeof files === 'string') {
        fileArr.push(`${files}`);
      } else {
        for (let f in files) {
          fileArr.push(`${files[f]}`);
        }
      }
      return fileArr;
    }
  }
}

async function getDirectoryFiles(dir: string): Promise<string[]> {
  let inPath = path.join(__dirname, `../${dir}`);
  return fs.promises.readdir(inPath);
}

// compileContent() {
//   for (let section in selected) {
//       content += `${allSections[selected[section]]}\n`;
//   }
// }

/**
 * Interfaces
 */
interface DocumenterOptions {
  schema?: Schema;
  files?: string | string[];
  directories?: {
    in: string | undefined;
    out: string;
  };
  content: string[];
}