const expect = require('chai').expect;
const minimist = require('minimist');
const Engine = require('../../commands/engine');


describe('Engine', function () {

    const now = new Date();
    var engine;
    var jsonWithCurrent;

    beforeEach(function () {
        engine = new Engine();

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
            engine.cli(minimistOptions, usage);
            // expect(minimistOptions).to.eql({alias: {"a": "alias"}, string: ["alias"]});
            expect(usage).to.eql({
                command: "--alias|a \"alias:project\"--start AliasOrProject--restart undefined--stop [minutesToRemove]--comment \"Some comment\"",
                comments: [
                    "minutesToRemove: optional count of minutes to remove to current date as stop date."
                ]
            });
        });
    });


    describe('.handle()', function () {

        it('should handle ALIAS command', function (done) {
            engine.handle({}, minimist(['--alias', 'MyAlias:MyProject']))
                .then(status => {

                    // console.log('>>>>> 1:', JSON.stringify(status));

                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {aliases: {'MyAlias': 'MyProject'}}
                    });
                    done();
                })
        });

        it('should handle START command', function (done) {
            engine.handle({}, minimist(['--start', 'ConquerTheWorld']), now)
                .then(
                    status => {
                        expect(status).to.eql({
                            activated: true,
                            modified: true,
                            json: {
                                "current": { start: now, project: "ConquerTheWorld" }
                            }
                        });
                        done();
                    }
                );
        });

        it('should handle RESTART command', function (done) {
            const json = {
                "aliases": {
                    "myprojectalias": "112505",
                },
                "tracks": [
                    {
                        "start": "2018-09-26T06:53:13.716Z",
                        "project": "ConquerTheWorld",
                        "stop": "2018-09-26T07:06:22.141Z"
                    },
                ],
                "current": {}
            };
            engine.handle(json, minimist(['--restart']), now).then(status => {
                expect(status.activated).to.eql(true);
                expect(status.modified).to.eql(true);
                expect(status.json.current).to.eql({
                    project: "ConquerTheWorld",
                    start: now,
                    stop: undefined,
                    comments: undefined
                });
                done();
            });
        });

        it('should handle STOP command', function (done) {
            engine.handle({
                current: {
                    project: 'GothamProject',
                    start: "2018-09-26T06:53:13.716Z"
                }
            }, minimist(['--stop']), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: true,
                            json: {
                                current: {},
                                tracks: [{project: "GothamProject", start: "2018-09-26T06:53:13.716Z", stop: now}]
                            }
                        }
                    );
                    done();
                })
        });

        it('should handle COMMENT command', function (done) {
            const comment = 'make some refactoring';
            engine.handle(jsonWithCurrent, minimist(['--comment', comment]))
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



    });
});
