import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { Octokit } from '@octokit/core';
// import { Octokit } from "@octokit/types";
import { default as Schema } from './schema';
import { renderFile } from './helpers';

export default class Document {
  public schema: Schema;
  // TODO: find type (https://www.npmjs.com/package/@octokit/types??)
  public client: Octokit;
  public content: string[];
  public directories: { in: string, out: string; };
  private files: string[] | undefined;

  constructor({
    client,
    files,
    schema = undefined,
    directories = {
      in: '',
      out: '',
    },
    content = []
  }: DocumentOptions) {
    this.schema = schema as Schema;
    this.client = client;
    this.directories = directories.in ? directories : { in: '', out: directories.out };
    this.content = content;

    if (typeof files === 'string') files = [files];
    this.files = this.files ? this.files : [];
  }

  private async fetchDirectory(path: string) {
    const files = [];
    let { data } = await this.client.repos.getContent({
      owner: this.schema.githubMetadata?.owner,
      repo: this.schema.githubMetadata?.repo,
      path: path
    });

    for (let d in data) {
      files.push(data[d].download_url);
    }
    return files;
  }

  public async compile() {
    // const dir = await this.fetchDirectory(this.directories.in);
    const files = await this.fetchFiles(this.files);
    // console.log(files);
    
    for (let f in files) {
      let renderedContent = '';
      let fileName = files[f];
      // console.log(fileName);
      // let pathIn = path.resolve(__dirname, '../', this.directories.in, fileName);
      
      try {
        // fs.readFile(pathIn, 'utf-8', (err, data) => {
        //   if (err) throw new Error(`Failed to access defined file: ${pathIn}`);
        const { data } = await axios.get(files[f]);
        // console.log(data);

        let { _, sections } = this.schema.apply(data);
        if (!sections) throw new Error('Invalid content');

        for (let c in this.content) {
          renderedContent += `${sections[this.content[c]]}\n`;
          // console.log(renderedContent);
          // renderFile(renderedContent, this.directories.out, fileName);
        }
        console.log(renderedContent);
        // });
        

      } catch(err) {
        console.error(`ERROR: ${err}`);
      }
    }
  }

  private async fetchFiles(files?: string[]): Promise<string[]> {
    let fileArr: string[] = [];

    if (this.directories.in !== '') {
      return await this.fetchDirectory(this.directories.in)
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
  client: Octokit;
  schema?: Schema;
  files?: string | string[];
  directories?: {
    in: string;
    out: string;
  };
  content: string[];
}