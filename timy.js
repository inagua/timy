const fs = require('fs');

module.exports = {

    loadJson: function (path) {
        var content;
        try {
            content = fs.readFileSync(path, 'utf8');
        } catch (e) {
            console.error(' /!\\ Json file not found at:', e.path);
            return undefined;
        }
        return JSON.parse(content);
    },

    handleComment: function (json, arguments, errorCallback) {
        if (arguments.comment || arguments.c) {
            if (json && json.current && json.current.project) {
                json.current.comments = json.current.comments || [];
                json.current.comments.push(arguments.comment || arguments.c);
            } else if (errorCallback) {
                errorCallback(' /!\\ Can not add comment because there is no current track.');
            }
        }
    },

    handleSetup: function (json, arguments) {
        if (arguments.setup) {
            return {
                "aliases": {},
                "tracks": [],
                "current": {}
            };
        }
        return json;
    }

};