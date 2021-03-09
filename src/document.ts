import axios from 'axios';
import { Octokit } from '@octokit/core';
import { default as Schema } from './schema';
import { createGithubFile, getGithubDirectoryFiles, getGithubFile } from './github';

export default class Document {
  public schema: Schema;
  public client: Octokit;
  public components: string[];
  public directories: { in: string, out: string; };
  private files: string[] | undefined;

  constructor({
    client,
    files,
    schema = undefined,
    directories = {
      in: '',
      out: '',
    }
  }: DocumentOptions) {
    this.schema = schema as Schema;
    this.client = client;
    this.directories = directories.in ? directories : { in: '', out: directories.out };
    this.components = this.schema.output;

    if (typeof files === 'string') files = [files];
    this.files = this.files ? this.files : [];
  }

  public async compile() {
    const files = await this.fetchFiles(this.files);
    
    for (let f in files) {
      let renderedContent = '';
      let currentFile = files[f];
      
      try {
        // Apply schema to single file
        let { _, sections } = this.schema.apply(currentFile.content);
        if (!sections) throw new Error('Invalid content');
        // Fetch each component from file
        for (let c in this.components) {
          renderedContent += `${sections[this.components[c]]}\n`;
        }

        await createGithubFile(this.client, this.schema.githubMetadata, {
          path: `${this.directories.out}/${currentFile.name}`,
          content: renderedContent,
        });
      } catch(err) {
        console.error(`ERROR: ${err}`);
      }
    }
  }

  private async fetchFiles(files?: string[]): Promise<DocumentFile[]> {
    let fileArr: DocumentFile[] = [];
    files = files ? files : [];

    if (this.directories.in !== '') {
      // Get directory contents
      files = await getGithubDirectoryFiles(this.client, this.schema.githubMetadata, this.directories.in);
    }

    for (let f in files) {
      // Get the file contents
      let ghFile = await getGithubFile(this.client, this.schema.githubMetadata, f);
      // TODO: error check
      fileArr.push(ghFile);
    }
    return fileArr;
  }
}

/**
 * Interfaces
 */

export interface DocumentFile {
  name: string;
  content: string;
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
  components: string[];
}