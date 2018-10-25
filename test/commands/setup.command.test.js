const expect = require('chai').expect;
const minimist = require('minimist');
const SetupCommand = require('../../commands/setup.command');

describe('Start Command', function () {

    var command;

    beforeEach(function () {
        command = new SetupCommand();
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

        it('should create new JSON and erase previous one if setup argument provided', function (done) {
            command.handle({"aKey": "aValue"}, minimist(['--setup'])).then(status => {
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
            command.handle({"aKey": "aValue"}, minimist(['--toto'])).then(status => {
                    expect(status).to.eql({
                        activated: false,
                        modified: false,
                        json: {"aKey": "aValue"}
                    });
                    done();
                }
            );
        });

        it('should provide an error if JSON is empty and command not activated', function (done) {
            command.handle({}, minimist(['--toto'])).catch(error => {
                expect(error).to.eql({
                    activated: false,
                    error: '/!\\ Original JSON is missing. Try to use the --setup argument.'
                });
                done();
            });
        });

        it('should not create new JSON if not empty but no setup argument provided', function (done) {
            const json = {
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
