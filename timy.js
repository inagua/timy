const fs = require('fs');
const fsExtra = require('fs-extra');
const Changed = true;
const moment = require('moment');
const path = require('path');

function _hasCurrent(json) {
    return json && json.current && json.current.project;
}

function _status(activated, changed, error) {
    return { activated, changed, error };
}

function _stopCurrent(json, now) {
    const previous = json.current;
    if (previous && previous.project) {
        previous.stop = now;
        json.tracks = json.tracks || [];
        json.tracks.push(previous);
        json.current = {};
        hasChanged = true;
    }
}

module.exports = {

    loadJson: function (path) {
        var content;
        try {
            content = fs.readFileSync(path, 'utf8');
        } catch (e) {
            console.error(' /!\\ Json file not found at:', e.path);
            return undefined;
        }
        return JSON.parse(content);
    },

    backupJson: function (jsonPath) {
        const yesterday = moment().add(-1, 'days').format('YYMMDD');
        const fileExtension = path.extname(jsonPath);
        const backupPath = jsonPath.replace(fileExtension, '-' + yesterday + fileExtension);
        if (!fs.existsSync(backupPath)) {
            fsExtra.copySync(jsonPath, backupPath);
            return true;
        }
        return false;
    },

    handleSetup: function (json, arguments) {
        if (arguments.setup) {
            return {
                "aliases": {},
                "tracks": [],
                "current": {}
            };
        }
        return json;
    },

    handleReport: function (json, arguments, now = new Date()) {
        if (!arguments.report && !arguments.r) {
            return undefined;
        }

        const summariesByProject = {};

        // Iterate on tracks
        json.tracks.forEach(function (t) {
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
                summary.comments = (summary.comments||[]).concat(json.current.comments);
            }
        }

        // Create aliasesByProject
        const aliasesByProject = {};
        Object.keys(json.aliases).forEach(function (alias) {
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
        const current = _hasCurrent(json) ? {
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
    },

};