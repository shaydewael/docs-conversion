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
      files.push({ name: data[d].name, url: data[d].download_url });
    }
    return files;
  }

  public async compile() {
    const files = await this.fetchFiles(this.files);
    
    for (let f in files) {
      let renderedContent = '';
      let currentFile = files[f];
      
      try {
        const { data } = await axios.get(currentFile.url);

        let { _, sections } = this.schema.apply(data);
        if (!sections) throw new Error('Invalid content');

        for (let c in this.content) {
          renderedContent += `${sections[this.content[c]]}\n`;
          // console.log(renderedContent);
          // renderFile(renderedContent, this.directories.out, fileName);
        }
        // console.log(renderedContent);
        // });

        renderedContent = btoa(renderedContent);

        const res = await this.client.repos.putContent({
          owner: this.schema.githubMetadata?.owner,
          repo: this.schema.githubMetadata?.repo,
          path: `${this.directories.out}/${currentFile.name}`,
          content: renderedContent,
          message: `Document Conversion: Add ${currentFile.name}`
        });

        console.log(res);

      } catch(err) {
        console.error(`ERROR: ${err}`);
      }
    }
  }

  private async fetchFiles(files?: string[]): Promise<DocumentFile[]> {
    let fileArr: DocumentFile[] = [];

    if (this.directories.in !== '') {
      return await this.fetchDirectory(this.directories.in)
    } else {
      // for (let f in files) {
      //   fileArr.push(`${f}`);
      // }
      return fileArr;
    }
  }
}

/**
 * Interfaces
 */

interface DocumentFile {
  name: string;
  url: string;
}

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