const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class StopCommand extends Command {

    constructor() {
        super(['stop'], /*aliases*/undefined, /*value*/'[minutesToRemove]', /*type*/ undefined, /*comments*/['minutesToRemove: optional count of minutes to remove to current date as stop date.']);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                if (!json || !json.current || !json.current.project) {
                    reject('/!\\ No current task to stop');
                } else {
                    if (isNaN(minimist.stop) && minimist.stop !== true) {
                        reject('/!\\ Parameter should be a count of minutes');
                    } else {
                        if (!isNaN(minimist.stop) && minimist.stop !== true) {
                            now = new Date(now.getTime() - parseInt(minimist.stop, 10)*60*1000);
                        }
                        super.stopCurrent(json, now);
                        resolve(super.status(Activated, Modified, json));
                    }
                }
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};