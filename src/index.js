const core = require('@actions/core');
const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

let template;

function parseTemplate(p) {
    // for now faking path
    p = path.resolve(__dirname, "../jekyll-template.yml")

    try {
        const doc = yaml.load(fs.readFileSync(p, 'utf8'));
        console.log(doc);
    } catch (e) {
        console.log(e);
    }
}

function run() {
    template = parseTemplate(core.getInput("template"));
}

run();