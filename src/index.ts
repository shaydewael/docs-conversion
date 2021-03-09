import * as core from '@actions/core';
import * as gh from '@actions/github';
import { default as Schema } from './schema';
import { default as Document } from './document';
import { getGithubFile } from './github';
import * as yaml from 'js-yaml';

async function run() {
    try {
        const action = {
            token: core.getInput('repo-token', { required: true }),
            schemaPath: core.getInput('schema', { required: true }),
            out_dir: core.getInput('output', { required: false }),
            in_dir: core.getInput('input', { required: false })
        };
    
        const client = gh.getOctokit(action.token);
        const user = { 
            owner: gh.context.repo.owner,
            repo: gh.context.repo.repo
        };

        // Get schema file
        const schemaFile = await getGithubFile(client, user, action.schemaPath);
        if (!schemaFile.content) throw new Error(`No content in schema`);
        // convert from yaml -> json
        const schemaContent: any = yaml.load(schemaFile.content);
        const schema = new Schema({
            metadata: schemaContent['metadata'],
            sections: schemaContent['sections'],
            output: schemaContent['output'],
            githubMetadata: user
        });

        const doc = new Document({
            schema: schema,
            client: client,
            directories: {
                out: action.out_dir,
                in: action.in_dir
            }
        }).compile();
    } catch (e) {
        console.error(e);
    }
}

run();
