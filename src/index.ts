import * as core from '@actions/core';
import { default as Schema } from './schema';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
    // Define the template
    const schema = new Schema({
        path: "../samples/jekyll-template.yml",
    });

    // TODO: move to another function
    const p = path.resolve(__dirname, "../samples/doc1.md");
    const d = fs.readFileSync(p, 'utf8');

    let { metadata, sections } = schema.apply(d);
}

run();
