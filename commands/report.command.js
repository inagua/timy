const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class ReportCommand extends Command {

    constructor() {
        super(['report'], /*aliases*/['r'], /*value*/undefined, /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                const report = this.buildReport(json, now);
                resolve(super.status(Activated, Modified, json, report));
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

    buildReport(json, now) {
        const summariesByProject = {};

        // Iterate on tracks
        (json.tracks || []).forEach(function (t) {
            if (new Date(t.stop).toDateString() === now.toDateString()) {
                const summary = summariesByProject[t.project] || {seconds: 0, comments: []};
                summariesByProject[t.project] = summary;
                summary.seconds += Math.trunc((new Date(t.stop).getTime() - new Date(t.start).getTime()) / 1000);
                if (t.comments && t.comments.length > 0) {
                    summary.comments = summary.comments.concat(t.comments);
                }
            }
        });

        // Add current track
        var currentDuration = 0;
        if (json.current && json.current.project) {
            const project = json.current.project;
            const summary = summariesByProject[project] || {seconds: 0};
            summariesByProject[project] = summary;
            currentDuration = Math.trunc((new Date(now).getTime() - new Date(json.current.start).getTime()) / 1000)
            summary.seconds += currentDuration;
            if (json.current.comments && json.current.comments.length > 0) {
                summary.comments = (summary.comments || []).concat(json.current.comments);
            }
        }

        // Create aliasesByProject
        const aliasesByProject = {};
        Object.keys(json.aliases || {}).forEach(function (alias) {
            const project = json.aliases[alias];
            aliasesByProject[project] = alias;
        });

        // Build report
        const projects = [];
        Object.keys(summariesByProject).forEach(function (project) {
            const s = summariesByProject[project];
            s.project = project;
            const alias = aliasesByProject[project];
            if (alias) {
                s.alias = alias;
            }
            projects.push(s)
        });
        const current = super.hasCurrent(json) ? {
            seconds: currentDuration,
            project: json.current.project,
            alias: aliasesByProject[json.current.project]
        } : undefined;
        const report = {
            projects,
            seconds: projects.reduce((acc, val) => acc + val.seconds, 0),
        };
        if (current) {
            report.current = current;
        }
        return report;
    }
};