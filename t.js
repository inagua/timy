const jsonPath = 'timy-jco.json';
const now = new Date();

const arguments = require('minimist')(process.argv.slice(2));
const moment = require('moment');

const FileStore = require('./storage/file.store');
const fileStore = new FileStore(jsonPath);

const Engine = require('./commands/engine');
const engine = new Engine(fileStore);

engine.run(arguments, now)
    .then(status => {
        if (status.report) {
            function formatSeconds(seconds) { return moment.utc(moment.duration(seconds, "s").asMilliseconds()).format("HH:mm:ss"); }

            function formatProject(p) { return '  - Duration: ' + formatSeconds(p.seconds) + 's   |   Project: ' + p.project + (p.alias ? ' (' + p.alias + ')' : ''); }

            const report = status.report;
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
