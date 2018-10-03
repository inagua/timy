const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class StartCommand extends Command {

    constructor() {
        super(['start'], /*aliases*/undefined, /*value*/'AliasOrProject', /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now, callback) {
        if (super.isActivated(minimist)) {
            const alias = minimist.start;
            const project = (json.aliases || [])[alias] || alias;
            if (!project || alias === true) {
                callback(super.status(Activated, !Modified, '/!\\ Project is missing!'), json);
            } else {
                super.stopCurrent(json, now);
                json.current = {"start": now, "project": project};
                callback(super.status(Activated, Modified), json);
            }
        } else {
            callback(super.status(!Activated, !Modified), json);
        }
    }

};