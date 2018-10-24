const expect = require('chai').expect;
const minimist = require('minimist');
const SetupCommand = require('../../commands/setup.command');

describe('Start Command', function () {

    var json, command;

    beforeEach(function () {
        command = new SetupCommand();
        json = {
            "aliases": {
                "myprojectalias": "112505",
            },
            "tracks": [
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "112505",
                    "stop": "2018-09-26T07:06:22.141Z"
                },
            ],
            "current": {
                "project": "110105",
                "start": "2018-09-26T13:04:17.075Z"
            }
        };
    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            command.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {}});
            expect(usage).to.eql({
                command: ' --setup',
                comments: []
            });
        });
    });


    describe('.handle()', function () {

        it('should create new JSON if empty and setup argument provided', function (done) {
            command.handle(json, minimist(['--setup'])).then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {
                            "aliases": {},
                            "tracks": [],
                            "current": {}
                        }
                    });
                    done();
                }
            );
        });

        it('should not create new JSON if empty but no setup argument provided', function (done) {
            command.handle(undefined, minimist(['--toto'])).then(status => {
                    expect(status).to.eql({
                        activated: false,
                        modified: false,
                        json: undefined
                    });
                    done();
                }
            );
        });

        it('should not create new JSON if not empty but no setup argument provided', function (done) {
            command.handle(json, minimist(['--toto'])).then(status => {
                    expect(status).to.eql({
                        activated: false,
                        modified: false,
                        json: {
                            aliases: {myprojectalias: '112505'},
                            tracks: [{
                                "start": "2018-09-26T06:53:13.716Z",
                                "project": "112505",
                                "stop": "2018-09-26T07:06:22.141Z"
                            }],
                            current: {project: '110105', start: '2018-09-26T13:04:17.075Z'}
                        }
                    });
                    done();
                }
            );
        });


    });

});
