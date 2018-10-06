const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

function tokensForAlias(a) {
    if (a && a !== true) {
        const tokens = a.split(':');
        if (tokens && tokens.length == 2) {
            return tokens;
        }
    }
    return undefined;
}

module.exports = class AliasCommand extends Command {

    constructor() {
        super(['alias'], /*aliases*/['a'], /*value*/'"alias:project"', /*type*/ 'string', /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                const tokens = tokensForAlias(minimist.alias || minimist.a);
                if (tokens) {
                    const alias = tokens[0]; // .toLowerCase();

                    const existingAlias = super.getProjectForAlias(json, alias);
                    if (existingAlias === alias) {
                        const project = tokens[1];
                        json.aliases = json.aliases || {};
                        json.aliases[alias] = project;

                        if (json.tracks) {
                            json.tracks.forEach(t => {
                                if (t.project.toLowerCase() == alias.toLowerCase()) {
                                    t.project = project;
                                }
                            });
                        }

                        resolve(super.status(Activated, Modified, json));

                    } else {
                        reject('/!\\ Alias already exist for project: ' + existingAlias);

                    }

                } else {
                    reject('/!\\ Invalid parameter for alias aka alias:project');
                }
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }
};
