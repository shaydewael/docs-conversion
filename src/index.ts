import * as core from '@actions/core';
import * as gh from '@actions/github';
import { default as Schema } from './schema';
import { default as Document } from './document';

async function run() {
    try {
        const token = core.getInput('repo-token', { required: true });
        const schemaPath = core.getInput('schema', { required: true });
        // const out_dir = core.getInput('output', { required: true });
        const in_dir = core.getInput('input', { required: true });
    
        const client = gh.getOctokit(token);

        let { data } = await client.repos.getContent({
            owner: gh.context.repo.owner,
            repo: gh.context.repo.repo,
            path: in_dir
        });


        // let s = await client.repos.getContent({
        //     owner: gh.context.repo.owner,
        //     repo: gh.context.repo.repo,
        //     path: schemaPath
        // });

        console.log(`https://api.github.com/repos/
        ${gh.context.repo.owner}/
        ${gh.context.repo.repo}/
        ${schemaPath}`)
        const schema = new Schema({
            path: `https://api.github.com/repos/
                ${gh.context.repo.owner}/
                ${gh.context.repo.repo}/
                ${schemaPath}`
        });

        // for (let d in data) {

        // }


        // Define the template
        // const schema = new Schema({
        //     path: schemaPath,
        // });
    
        // const doc = new Document({
        //     schema: schema,
        //     // files: ['../samples/doc1.md', '../samples/doc2.md'],
        //     directories: {
        //         out: 'compiled',
        //         in: 'samples'
        //     },
        //     content: [ 'main', 'code' ]
        // }).compile();
    } catch (e) {
        console.error(e);
    }
}

run();
