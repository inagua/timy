const expect = require('chai').expect;
const minimist = require('minimist');
const CommentCommand = require('../commands/comment.command');


describe('Comment Command', function () {

    var commentCommand;
    var jsonWithCurrent;

    beforeEach(function () {
        commentCommand = new CommentCommand();
        jsonWithCurrent = {
            current: {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            }
        };
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            commentCommand.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {}});
            expect(usage).to.eql({
                command: '--comment \"Some comment\"',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should put comment on current track', function (done) {
            const comment = 'make some refactoring';
            commentCommand.handle(jsonWithCurrent, minimist(['--comment', comment]))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {
                            current: {
                                "start": "2018-09-26T13:04:17.075Z",
                                "project": "110105",
                                "comments": [comment]
                            }
                        }
                    });
                    done();
                });
        });

        it('should exit on error if no text provided', function (done) {
            commentCommand.handle(jsonWithCurrent, minimist(['--comment']))
                .catch(error => {
                    expect(error).to.eql('/!\\ Missing text to add as comment.');
                    done();
                });
        });

        it('should exit on error if there is no current track', function (done) {
            const json = {current: undefined};
            commentCommand.handle(json, minimist(['--comment', 'some comment']))
                .catch(error => {
                    expect(error).to.eql('/!\\ Can not add comment because there is no current track.');
                    done();
                });
        });

    });

});
