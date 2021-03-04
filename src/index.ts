import * as core from '@actions/core';
import { default as Schema } from './schema';
import * as path from 'path';
import * as fs from 'fs';

function parseMetadata() {

}

// function parseFile(template, file) {

// }


/**
 * Gather markdown files in directory
 * 
 * Returns an array of resolved paths
 */
// function fetchMarkdownFiles(dir) {

// }



async function run() {
    // Define the template
    const schema = new Schema({
        path: "../samples/jekyll-template.yml",
    });

    const p = path.resolve(__dirname, "../samples/doc1.md");
    const d = fs.readFileSync(p, 'utf8');

    const result = schema.apply(d);
    // console.log(result[0]);

    //console.log(schema);

}

run();
