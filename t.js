const jsonPath = 'timy-jco.json';

const arguments = require('minimist')(process.argv.slice(2));
const moment = require('moment');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const Encoding = 'utf8';
const now = new Date();
const Engine = require('./commands/engine');

const engine = new Engine();

const loadedJson = loadJson(jsonPath);
backupJson(jsonPath);

const json = handleSetup(loadedJson, arguments, error => console.error(error));
if (!json) {
    console.error(' /!\\ Try to use the --setup argument');
    console.error(' /!\\ Program exited: nothing done!');
    return;
}

function formatSeconds(seconds) {
    return moment.utc(moment.duration(seconds, "s").asMilliseconds()).format("HH:mm:ss");
}

function loadJson(path) {
    var content;
    try {
        content = fs.readFileSync(path, Encoding);
    } catch (e) {
        console.error(' /!\\ Json file not found at:', e.path);
        return undefined;
    }
    return JSON.parse(content);
}

function backupJson(jsonPath) {
    const yesterday = moment().add(-1, 'days').format('YYMMDD');
    const fileExtension = path.extname(jsonPath);
    const backupPath = jsonPath.replace(fileExtension, '-' + yesterday + fileExtension);
    if (!fs.existsSync(backupPath)) {
        fsExtra.copySync(jsonPath, backupPath);
        return true;
    }
    return false;
}

function handleSetup(json, arguments) {
    if (arguments.setup) {
        return {
            "aliases": {},
            "tracks": [],
            "current": {}
        };
    }
    return json;
}

function saveJsonAtPath(jsonContent, jsonPath) {
    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent), Encoding);
}

engine.handle(json, arguments, now)
    .then(status => {
        if (status.modified) {
            saveJsonAtPath(json, jsonPath);
        }
        if (status.report) {
            const report = status.report;
            function formatProject(p) {
                return '  - Duration: ' + formatSeconds(p.seconds) + 's   |   Project: ' + p.project + (p.alias ? ' (' + p.alias + ')' : '');
            }

            console.log('Projects of the day:');
            report.projects.forEach(r => {
                console.log(formatProject(r));
                (r.comments || []).forEach(c => console.log('      -', c));
            });
            if (report.current) {
                console.log('Including current:');
                console.log(formatProject(report.current));
            } else {
                console.log('  - No pending task!');
            }
            console.log('=========================');
            console.log('TOTAL.......:', formatSeconds(report.seconds) + 's');
        }
    })
    .catch(error => console.error(error.error))
;


if (arguments.help || arguments.sos || arguments.usage || process.argv.length == 2) {
    console.log('$ node t --alias|a alias:project --start aliasOrProject --stop [minutesToRemove] --restart --report|r --comment|c "some comment"');
    console.log(' - comment are added only on current track if exit')
}
