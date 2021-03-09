import { Octokit } from '@octokit/core';

export async function createGithubFile(metadata: githubMetadata, fileOpts: {
  path: string;
  content: string;
  message?: string;
}, client: Octokit) {
  let { path, content, message } = fileOpts;
  message = message ? message : `Creating file: ${path}`;

  try {
    const res = await client.reposfcreateOrUpdateFileContents({
      path, // `${this.directories.out}/${currentFile.name}`,
      content,
      message,
      owner: metadata.owner,
      repo: metadata.repo
    });
  } catch (e) {
    console.error(`Error creating file: ${path}\n${e}`); 
  }
}


export interface githubMetadata {
  owner: string;
  repo: string;
}