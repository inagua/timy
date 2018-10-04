const jsonFile = 'timy-jco.json';

var arguments = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var moment = require('moment');

const Timy = require('./timy');
const now = new Date();

const StartCommand = require('./commands/start.command');
const RestartCommand = require('./commands/restart.command');

const loadedJson = Timy.loadJson(jsonFile);
Timy.backupJson(jsonFile);

const json = Timy.handleSetup(loadedJson, arguments, error => console.error(error));
if (!json) {
    console.error(' /!\\ Try to use the --setup argument');
    console.error(' /!\\ Program exited: nothing done!');
    return;
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


// Timy.handleStart(json, arguments, now, function (status, _json) {
//     hasChanged = hasChanged || status.changed;
//     if (status.error) {
//         console.error(status.error);
//     }
// });
// Timy.handleRestart(json, arguments, now, function (changed, error) {
//     hasChanged = hasChanged || changed;
//     if (error) {
//         console.error(error);
//     }
// });
new StartCommand().handle(json, arguments, now)
    .then(status => {
        hasChanged = hasChanged || status.modified; // StartCommand
        return new RestartCommand().handle(json, arguments, now);
    })
    .then(status => {
        hasChanged = hasChanged || status.modified; // RestartCommand
        if (hasChanged) {
            fs.writeFileSync(jsonFile, JSON.stringify(json), 'utf8');
        }
    })
    .catch(error => console.error(error.error))
;



Timy.handleStop(json, arguments, now, function (status, _jsons) {
    hasChanged = hasChanged || status.changed;
    if (status.error) {
        console.error(status.error);
    }
});

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
    if (report.current) {
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
    console.log('$ node t --alias|a alias:project --start aliasOrProject --stop [minutesToRemove] --restart --report|r --comment|c "some comment"');
    console.log(' - comment are added only on current track if exit')
}

if (hasChanged) {
    fs.writeFileSync(jsonFile, JSON.stringify(json), 'utf8');
}
