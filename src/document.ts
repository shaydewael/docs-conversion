import { create } from 'domain';
import { default as Schema } from './schema';
import * as path from 'path';
import * as fs from 'fs';

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
    let f = '';
    let renderedContent = '';
    let section = '';
    let files = this.files;
    console.log(files);
  
    for (f in files) {
      console.log(f);
      const p = path.resolve(__dirname, "../samples/doc1.md");
      console.log(p)
      const d = fs.readFile(p, (e) => {
        console.log(`Error: ${e}`)
      });
    
      
      console.log(d);
      let { metadata, sections } = this.schema.apply(d);
      
      
      for (section in this.content) { 
        renderedContent += `${sections[this.content[section]]}\n`;
        console.log(renderedContent);

        fs.writeFile(path.resolve(__dirname, `../${this.directories.out}/${files[f]}`), renderedContent, () => {
          console.log(`Created name.md`);
        });
      }
    }
  }
}

function compileFiles(inDir: string, files: string | string[]): string[] {
  let fileArr: string[] = [];
  if (typeof files === 'string') {
    fileArr.push(`${files}`);
  } else {
    let f = '';
    for (let f in files) {
      fileArr.push(`../${inDir}/${files[f]}`);
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