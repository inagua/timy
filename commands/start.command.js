const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class StartCommand extends Command {

    constructor() {
        super(['start'], /*aliases*/undefined, /*value*/'AliasOrProject', /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                const projectOrAlias = minimist.start;
                if (!projectOrAlias || projectOrAlias === true) {
                    reject(super.error(Activated, '/!\\ Project is missing!'));
                } else {
                    const project = super.getProjectForAlias(json, projectOrAlias);
                    super.stopCurrent(json, now);
                    json.current = {"start": now, "project": project};
                    resolve(super.status(Activated, Modified, json));
                }
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};