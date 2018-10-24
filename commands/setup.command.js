const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class AliasCommand extends Command {

    constructor() {
        super(['setup'], /*aliases*/[], /*value*/undefined, /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                resolve(super.status(Activated, Modified, {
                    "aliases": {},
                    "tracks": [],
                    "current": {}
                }));
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};
