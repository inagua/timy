const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class RestartCommand extends Command {

    constructor() {
        super(['restart'], /*aliases*/undefined, /*value*/ undefined, /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                if (super.hasCurrent(json)) {
                    reject('/!\\ Can not restart because a task is pending.');
                } else if (!json.tracks || json.tracks.length == 0) {
                    reject('/!\\ Can not restart because no closed task.');
                } else {
                    json.current = Object.assign({}, json.tracks[json.tracks.length - 1]);
                    json.current.start = now;
                    json.current.stop = undefined;
                    json.current.comments = undefined;
                    resolve(super.status(Activated, Modified, json));
                }
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};
