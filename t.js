const jsonFile = 'timy-jco.json';

var arguments = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var moment = require('moment');

const Timy = require('./timy');
const now = new Date();

const laodedJson = Timy.loadJson(jsonFile);
const json = Timy.handleSetup(laodedJson, arguments, error => console.error(error));
if (!json) {
    console.error(' /!\\ Try to use the --setup argument');
    console.error(' /!\\ Program exited: nothing done!');
    return;
}

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
        hasChanged = true;
    }
}

function formatSeconds(seconds) {
    return moment.utc(moment.duration(seconds, "s").asMilliseconds()).format("HH:mm:ss");
}
function formatDuration(start, stop) {
    const seconds = (stop.getTime() - start.getTime()) / 1000;
    return formatSeconds(seconds);
}


function tokensForAlias(a) {
    if (a) {
        const tokens = a.split(':');
        if (tokens && tokens.length == 2) {
            return tokens;
        }
    }
    return undefined;
}

var hasChanged = false;

if (arguments.alias || arguments.a) {
    const tokens = tokensForAlias(arguments.alias || arguments.a);
    if (tokens) {
        const tokens = a.split(':');
        const alias = tokens[0].toLowerCase();
        const project = tokens[1];
        json.aliases = json.aliases || {};
        json.aliases[alias] = project
        hasChanged = true;

    } else {
        console.error(' /!\\ Invalid parameter for alias aka alias:project');

    }
}

if (arguments.start) {
    const alias = arguments.start;
    const project = json.aliases[alias] || alias;

    stopCurrent(json, now);

    json.current = {
        "start": now,
        "project": project
    };
    hasChanged = true;
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
        hasChanged = true;
    }
}

if (arguments.stop) {
    stopCurrent(json, now);
}

const report = Timy.handleReport(json, arguments, now);
if (report.length > 0) {
    report.forEach(r => {
        console.log('  - Duration:', formatSeconds(r.seconds) + 's', '  |   Project:', r.project, r.alias ? '(' + r.alias + ')' : '');
        if (r.comments) {
            r.comments.forEach(c => {
                console.log('      -', c);
            });
        }
    });
}
if (arguments.report || arguments.r) {
    if (hasCurrent(json)) {
        const duration = formatDuration(new Date(json.current.start), now);
        console.log('Including current:');
        console.log('  - Duration:', duration + 's', '  |  Project:', json.current.project);
    } else {
        console.log('  - No pending task!');
    }
}

if (Timy.handleComment(json, arguments, error => console.error(error))) {
    hasChanged = true;
}

if (arguments.help || arguments.sos || arguments.usage || process.argv.length == 2) {
    console.log('$ node t --alias|a alias:project --start aliasOrProject --stop --restart --report|r --comment|c "some comment"');
    console.log(' - comment are added only on current track if exit')
}

if (hasChanged) {
    fs.writeFileSync(jsonFile, JSON.stringify(json), 'utf8');
}
