const AliasCommand = require('./alias.command');
const StartCommand = require('./start.command');
const RestartCommand = require('./restart.command');
const StopCommand = require('./stop.command');
const CommentCommand = require('./comment.command');
const ReportCommand = require('./report.command');

/**
 * Usage:
 *
 * ```
 * const Engine = require('.../commands/engine');
 *
 * engine = new Engine();
 * const minimistOptions = {};
 * const usage = {};
 * engine.cli(minimistOptions, usage);
 * engine.handle(json, minimist(['--alias', 'MyAlias:MyProject']), now)
 *     .then(status => {
 *         // { activated, modified, json }
 *     });
 * ```
 *
 * @type {module.Engine}
 */
module.exports = class Engine {

    constructor() {
        this.commands = [
            new AliasCommand(),
            new StartCommand(),
            new RestartCommand(),
            new StopCommand(),
            new CommentCommand(),
            new ReportCommand()
        ];
    }

    cli(minimistOptions, usage) {
        this.commands.forEach(c => c.cli(minimistOptions, usage))
    }

    handle(json, minimist, now) {
        const cc = [...this.commands];
        const first = cc.pop();

        let promise = first.handle(json, minimist, now);
        cc.forEach(c => {
            promise = promise.then(status => {
                return c.handle(json, minimist, now)
                    .then(status2 => new Promise((resolve, reject) => {
                        const s = {
                            activated: status.activated || status2.activated,
                            modified: status.modified || status2.modified,
                            json: status2.json
                        };
                        if (status.report || status2.report) {
                            s.report = status.report || status2.report;
                        }
                        resolve(s)
                    }));
            });
        });

        return promise;
    }
};
