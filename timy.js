const fs = require('fs');
const Changed = true;

function _hasCurrent(json) {
    return json && json.current && json.current.project;
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

    hasCurrent: _hasCurrent,

    handleComment: function (json, arguments, errorCallback) {
        if (arguments.comment || arguments.c) {
            if (json && json.current && json.current.project) {
                json.current.comments = json.current.comments || [];
                json.current.comments.push(arguments.comment || arguments.c);
                return true;
            } else if (errorCallback) {
                errorCallback(' /!\\ Can not add comment because there is no current track.');
            }
        }
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
            summariesByProject[project] = summariesByProject[project] || {seconds: 0};
            currentDuration = Math.trunc((new Date(now).getTime() - new Date(json.current.start).getTime()) / 1000);
            summariesByProject[project].seconds += currentDuration;
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

    handleRestart: function (json, arguments, now, callback) {
        if (arguments.restart) {
            if (_hasCurrent(json)) {
                callback(!Changed, ' /!\\ Can not restart because a task is pending.');
            } else if (!json.tracks || json.tracks.length == 0) {
                callback(!Changed, ' /!\\ Can not restart because no closed task.');
            } else {
                json.current = Object.assign({}, json.tracks[json.tracks.length - 1]);
                json.current.start = now;
                json.current.stop = undefined;
                json.current.comments = undefined;
                callback(Changed, undefined);
            }
        } else {
            callback(!Changed, undefined);
        }
    }

};