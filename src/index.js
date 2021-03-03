const core = require('@actions/core');
const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

let template;

function parseTemplate(path) {
    // for now faking path
    path = '../jekyll-template.yml';
    
    try {
        const doc = yaml.load(fs.readFileSync(path, 'utf8'));
        console.log(doc);
    } catch (e) {
        console.log(e);
    }
}

function run() {
    template = parseTemplate(core.getInput("template"));
}

run();