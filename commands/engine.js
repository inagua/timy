const AliasCommand = require('./alias.command');
const CommentCommand = require('./comment.command');

module.exports = class Engine {

    constructor() {
        this.commands = [
            new AliasCommand(),
            // new StartCommand(),
            // new RestartCommand(),
            // new StopCommand(),
            new CommentCommand()
        ];
    }

    cli(minimistOptions, usage) {
        this.commands.forEach(c => c.cli(minimistOptions, usage))
    }

    handle(json, minimist, now) {
        return new AliasCommand().handle(json, minimist, now)
            .then(status => {
                return new CommentCommand().handle(json, minimist, now)

                    .then(status2 => new Promise((resolve, reject) => resolve({
                        activated: status.activated || status2.activated,
                        modified: status.modified || status2.modified,
                        json: status2.json
                    })));
            })
            // .catch(error => console.error(error.error))
            ;
    }
};
