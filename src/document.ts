import { create } from 'domain';
import { default as Schema } from './schema';
import * as path from 'path';
import * as fs from 'fs';
import { getFileName } from './helpers';

export default class Documenter {
  public schema: Schema;
  public content: string[];

  private files: string[];
  private directories: { in: string, out: string; };

  constructor({
    schema = undefined,
    directories = {
      in: '.',
      out: '.',
    },
    content = [],
    files = ''
  }: DocumenterOptions) {
    
    //TODO
    this.schema = schema as Schema;
    this.directories = directories;
    this.content = content;

    this.files = compileFiles(directories.in, files);
    
  }

  public async render() {
    let files = this.files;
  
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
}

function compileFiles(inDir: string, files: string | string[]): string[] {
  let fileArr: string[] = [];
  if (typeof files === 'string') {
    fileArr.push(`${files}`);
  } else {
    for (let f in files) {
      fileArr.push(`${files[f]}`);
    }
  }

  return fileArr;
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
    in: string;
    out: string;
  };
  content: string[];
}