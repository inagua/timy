const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;
const _ = require('lodash');

module.exports = class HelpCommand extends Command {

    constructor() {
        super(['help', 'usage', 'sos'], /*aliases*/['h'], /*value*/undefined, /*type*/ undefined, /*comments*/[]);
    }

    setHelp(help) {
        this.help = help;
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist) || super.isEmpty(minimist)) {
                const report = undefined;
                resolve(super.status(Activated, !Modified, json, report, this.help));
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};