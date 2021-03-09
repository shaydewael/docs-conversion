import { getOctokit } from '@actions/github';
import { Octokit } from '@octokit/core';
import {
  Endpoints
} from "@octokit/types";
import { DocumentFile } from './document';

export type GetRepoContentResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];

export async function createGithubFile(client: Octokit, metadata: GithubMetadata, fileOpts: GithubCreateFileOpts) {
  let { path, content, message } = fileOpts;
  if (typeof content === 'string') {
    content = Buffer.from(content).toString('base64');
  }
  message = message ? message : `Creating file: ${path}`;

  try {
    const res = await client.repos.createOrUpdateFileContents({
      path,
      content,
      message,
      owner: metadata.owner,
      repo: metadata.repo
    });

    // TODO
    if (!res.content) throw new Error(`No content`);
  } catch (e) {
    console.error(`Error creating file: ${path}\n${e}`); 
  }
}

export async function getGithubFile(client: Octokit, metadata: GithubMetadata, path: string): Promise<DocumentFile> {
  try {
    const { data } = await client.repos.getContent({
      path,
      owner: metadata.owner,
      repo: metadata.repo
    });

    let content = Buffer.from(data.content, 'base64').toString('ascii');
    if (content === '') throw new Error(`Error parsing content: ${path}`);
    return {
      content,
      name: data.name,
      url: data.url
    };
  } catch (e) {
    console.error(`Error fetching file: ${e}`);
    return Promise.reject(e);
  }
}

export async function getGithubDirectoryFiles(client: Octokit, metadata: GithubMetadata, path: string): Promise<any> {
  let files = [];

  try {
    // TODO: Handle cascading directories
    const { data } = await client.repos.getContent({
      path,
      owner: metadata.owner,
      repo: metadata.repo
    });
    

    for (let f in data) {
      files.push(`${path}/${data[f].path}`);
    }
    return files;
  } catch (e) {
    return console.error(`Error fetching file: ${e}`);
  }
}

export interface GithubMetadata {
  owner: string;
  repo: string;
}

export interface GithubCreateFileOpts {
  path: string;
  content: string;
  message?: string;
}
