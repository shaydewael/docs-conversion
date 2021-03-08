import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as fs from 'fs';
import { default as Schema, parseSchemaPath } from './schema';
import { default as Document } from './document';
import axios from 'axios';

async function run() {
    try {
        const token = core.getInput('repo-token', { required: true });
        const schemaPath = core.getInput('schema', { required: true });
        const out_dir = core.getInput('output', { required: true });
        const in_dir = core.getInput('input', { required: true });
    
        const client = gh.getOctokit(token);
        const ghUser = { 
            owner: gh.context.repo.owner,
            repo: gh.context.repo.repo
        };

        // let { data } = await client.repos.getContent({
        //     owner: gh.context.repo.owner,
        //     repo: gh.context.repo.repo,
        //     path: in_dir
        // });

        const schemaContent = await parseSchemaPath(
            `https://raw.githubusercontent.com/${gh.context.repo.owner}/${gh.context.repo.repo}/main/${schemaPath}`,
            { owner: gh.context.repo.owner, repo: gh.context.repo.repo})
        const schema = new Schema(schemaContent);

        // let files = [];
        // for (let d in data) {
        //     files.push(d);
        //     console.log(files);
        //     const doc = new Document({
        //         schema: schema,
        //         client: client,
        //         // files: ['../samples/doc1.md', '../samples/doc2.md'],
        //         directories: {
        //             out: 'compiled',
        //             in: in_dir
        //         },
        //         content: [ 'main', 'code' ]
        //     }).compile();
        // }


        // Define the template
        // const schema = new Schema({
        //     path: schemaPath,
        // });
    
    //     const doc = new Document({
    //         schema: schema,
    //         // files: ['../samples/doc1.md', '../samples/doc2.md'],
    //         directories: {
    //             out: 'compiled',
    //             in: 'samples'
    //         },
    //         content: [ 'main', 'code' ]
    //     }).compile();
    } catch (e) {
        console.error(e);
    }
}

run();
