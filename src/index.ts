import * as core from '@actions/core';
import { default as Schema } from './schema';
import { default as Document } from './document';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
    // Define the template
    const schema = new Schema({
        path: "../samples/jekyll-template.yml",
    });

    const doc = new Document({
        schema: schema,
        files: ['../samples/doc1.md', '../samples/doc2.md'],
        directories: {
            out: 'render',
            in: '.'
        },
        content: [ 'main', 'code' ]
    });

    doc.render();

    
    
}


run();
