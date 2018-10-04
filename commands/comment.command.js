const Command = require('./command');
const Activated = Command.Activated;
const Modified = Command.Modified;

module.exports = class CommentCommand extends Command {

    constructor() {
        super(['comment'], /*aliases*/undefined, /*value*/'"Some comment"', /*type*/ undefined, /*comments*/[]);
    }

    handle(json, minimist, now) {
        return new Promise((resolve, reject) => {
            if (super.isActivated(minimist)) {
                if (super.hasCurrent(json)) {
                    if (minimist.comment === true || minimist.c === true) {
                        reject('/!\\ Missing text to add as comment.');
                    } else {
                        json.current.comments = json.current.comments || [];
                        json.current.comments.push(minimist.comment || minimist.c);
                        resolve(super.status(Activated, Modified, json));
                    }
                } else {
                    reject('/!\\ Can not add comment because there is no current track.');
                }
            } else {
                resolve(super.status(!Activated, !Modified, json));
            }
        });
    }

};
