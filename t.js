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


Timy.handleStart(json, arguments, now, function (status, _json) {
    hasChanged = hasChanged || status.changed;
    if (status.error) {
        console.error(status.error);
    }
});

Timy.handleRestart(json, arguments, now, function (changed, error) {
    hasChanged = hasChanged || changed;
    if (error) {
        console.error(error);
    }
});

if (arguments.stop) {
    stopCurrent(json, now); // TODO: reuse new one
}

const report = Timy.handleReport(json, arguments, now);
if (report) {
    function formatProject(p) {
        return '  - Duration: ' + formatSeconds(p.seconds) + 's   |   Project: ' + p.project + (p.alias ? ' (' + p.alias + ')' : '');
    }

    console.log('Projects of the day:');
    report.projects.forEach(r => {
        console.log(formatProject(r));
        (r.comments || []).forEach(c => console.log('      -', c));
    });
    if (!report.current) {
        console.log('Including current:');
        console.log(formatProject(report.current));
    } else {
        console.log('  - No pending task!');
    }
    console.log('=========================');
    console.log('TOTAL.......:', formatSeconds(report.seconds) + 's');
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
