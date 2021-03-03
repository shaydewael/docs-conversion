import * as core from "@actions/core";
const yaml = require('js-yaml');
const fs   = require('fs');

let template;

function parseTemplate(path) {
    try {
        const doc = yaml.load(fs.readFileSync(path, 'utf8'));
        console.log(doc);
    } catch (e) {
        console.log(e);
    }
}

async function run() {
    template = parseTemplate(core.getInput("template"));
}

run();

export default run;