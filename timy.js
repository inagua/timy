module.exports = {

    handleComment: function (json, arguments, errorCallback) {
        if (json && json.current && json.current.project) {
            if (arguments.comment || arguments.c) {
                json.current.comments = json.current.comments || [];
                json.current.comments.push(arguments.comment || arguments.c);
            }
        } else if (errorCallback){
            errorCallback(' /!\\ Can not add comment because there is no current track.');
        }
    }

};