const AliasCommand = require('./alias.command');

module.exports = class Engine {

    constructor() {
    }

    cli(minimistOptions, usage) {
        new AliasCommand().cli(minimistOptions, usage);
    }

    handle(json, minimist, now) {
        return new AliasCommand().handle(json, minimist, now)
        // .then(status => {
        //     hasChanged = hasChanged || status.modified; // StartCommand
        //     return new RestartCommand().handle(json, arguments, now);
        // })
        // .catch(error => console.error(error.error))
        ;
        // return new Promise((resolve, reject) => {
        //     new AliasCommand().handle(json, arguments, now)
        //         // .then(status => {
        //         //     hasChanged = hasChanged || status.modified; // StartCommand
        //         //     return new RestartCommand().handle(json, arguments, now);
        //         // })
        //         // .catch(error => console.error(error.error))
        //     ;
        //
        //
        //
        //
        //     // if (super.isActivated(minimist)) {
        //     //     const tokens = tokensForAlias(minimist.alias || minimist.a);
        //     //     if (tokens) {
        //     //         const alias = tokens[0]; // .toLowerCase();
        //     //
        //     //         const existingAlias = super.getProjectForAlias(json, alias);
        //     //         if (existingAlias === alias) {
        //     //             const project = tokens[1];
        //     //             json.aliases = json.aliases || {};
        //     //             json.aliases[alias] = project;
        //     //
        //     //             if (json.tracks) {
        //     //                 json.tracks.forEach(t => {
        //     //                     if (t.project.toLowerCase() == alias.toLowerCase()) {
        //     //                         t.project = project;
        //     //                     }
        //     //                 });
        //     //             }
        //     //
        //     //             resolve(super.status(Activated, Modified, json));
        //     //
        //     //         } else {
        //     //             reject('/!\\ Alias already exist for project: ' + existingAlias);
        //     //
        //     //         }
        //     //
        //     //     } else {
        //     //         reject('/!\\ Invalid parameter for alias aka alias:project');
        //     //     }
        //     // } else {
        //     //     resolve(super.status(!Activated, !Modified, json));
        //     // }
        //});
    }
};
