const core = require('@actions/core');
const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');


/**
 * Parse a given yaml template
 * 
 * Returns a JSON object
 */
function parseTemplate(p) {
    // for now faking path
    p = "../jekyll-template.yml";
    p = path.resolve(__dirname, p)
    try {
        const t = yaml.load(fs.readFileSync(p, 'utf8'));
        console.log(`Template:\n ${t}\n\n\n`);
    } catch (e) {
        console.log(`Template error: ${e}\n\n\n`);
        return;
    }

    return t;
}

function parseFile(template, file) {

}


/**
 * Gather markdown files in directory
 * 
 * Returns an array of resolved paths
 */
function fetchMDFiles(dir) {

}



function run() {
    // Define the template
    schema = parseTemplate(core.getInput("schema"));


}

run();
