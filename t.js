const json1jsonFile = 'timy-jco.json';

var arguments = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var moment = require('moment');

const now = new Date();
var json = JSON.parse(fs.readFileSync(json1jsonFile, 'utf8'));

function hasCurrent(json) {
    return json && json.current && json.current.project;
}

function stopCurrent(json, now) {
    const previous = json.current;
    if (previous && previous.project) {
        previous.stop = now;
        json.tracks = json.tracks || [];
        json.tracks.push(previous);
        json.current = {};
    }
}

function formatDuration(start, stop) {
    const seconds = (stop.getTime() - start.getTime()) / 1000;
    return moment.utc(moment.duration(seconds, "s").asMilliseconds()).format("HH:mm:ss");
}

if (arguments.alias || arguments.a) {
    const a = arguments.alias || arguments.a;
    const tokens = a.split(':');
    const alias = tokens[0];
    const project = tokens[1];
    json.aliases = json.aliases || {};
    json.aliases[alias] = project;
}

if (arguments.start) {
    const alias = arguments.start;
    const project = json.aliases[alias] || alias;

    stopCurrent(json, now);

    json.current = {
        "start": now,
        "project": project
    };
}

if (arguments.restart) {
    if (hasCurrent(json)) {
        console.error(' /!\\ Can not restart because a task is pending.');
    } else if (!json.tracks || json.tracks.length == 0) {
        console.error(' /!\\ Can not restart because no closed task.');
    } else {
        json.current = Object.assign({}, json.tracks[json.tracks.length - 1]);
        json.current.start = now;
        json.current.stop = undefined;
    }
}

if (arguments.stop) {
    stopCurrent(json, now);
}

if (arguments.help || arguments.sos || arguments.usage || process.argv.length == 2) {
    console.log('$ node t --alias|a alias:project --start aliasOrProject --stop --restart --report|r');
}

if (arguments.report || arguments.r) {
    if (hasCurrent(json)) {
        const duration = formatDuration(new Date(json.current.start), now);
        console.log('  - Project :', json.current.project);
        console.log('  - Duration:', duration + 's');
    } else {
        console.log('  - No pending task!');
    }
}

fs.writeFileSync(json1jsonFile, JSON.stringify(json), 'utf8');
