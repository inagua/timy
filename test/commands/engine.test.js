const expect = require('chai').expect;
const minimist = require('minimist');
const Engine = require('../../commands/engine');


describe('Engine', function () {

    const now = new Date();
    var engine;
    var fixtureJson;

    beforeEach(function () {
        engine = new Engine();

        fixtureJson = {
            "tracks": [
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "ConquerTheWorld",
                    "stop": "2018-09-26T07:06:22.141Z"
                }]
        };

    });


    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            engine.cli(minimistOptions, usage);
            expect(usage).to.eql({
                command: " --setup --alias|a \"alias:project\" --start AliasOrProject --restart --stop [minutesToRemove] --comment \"Some comment\" --report|r --help|usage|sos|h",
                comments: [
                    "minutesToRemove: optional count of minutes to remove to current date as stop date."
                ]
            });
        });
    });


    describe('.handle()', function () {

        it('should handle SETUP command', function (done) {
            engine.handle({"aKey": "aValue"}, minimist(['--setup'])).then(status => {
                    // console.log('>>>>> 1:', JSON.stringify(status));
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

        it('should handle SETUP command with error', function (done) {
            engine.handle({}, minimist(['--toto'])).catch(error => {
                expect(error).to.eql({
                    activated: false,
                    error: '/!\\ Original JSON is missing. Try to use the --setup argument.'
                });
                done();
            });
        });

        it('should handle ALIAS command', function (done) {
            engine.handle(fixtureJson, minimist(['--alias', 'MyAlias:MyProject']))
                .then(status => {
                    expect(status).to.eql({
                        activated: true,
                        modified: true,
                        json: {
                            ...fixtureJson,
                            aliases: {'MyAlias': 'MyProject'}
                        }
                    });
                    done();
                });
        });

        it('should handle START command', function (done) {
            engine.handle(fixtureJson, minimist(['--start', 'ConquerTheWorld']), now)
                .then(
                    status => {
                        expect(status).to.eql({
                            activated: true,
                            modified: true,
                            json: {
                                ...fixtureJson,
                                "current": {start: now, project: "ConquerTheWorld"}
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
            engine.handle({
                current: {
                    "project": "110105",
                    "start": "2018-09-26T13:04:17.075Z"
                }
            }, minimist(['--comment', comment]))
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

        it('should handle REPORT command', function (done) {
            const now4report = new Date('2018-10-24T14:14:37.075Z');
            const json = {
                aliases: {'BondProject': '007'},
                tracks: [
                    {
                        project: "110105",
                        start: "2018-09-26T13:04:17.075Z",
                        stop: "2018-09-30T13:04:17.075Z",
                        comments: ['a comment']
                    },
                    {
                        project: "110105",
                        start: "2018-09-26T13:04:17.075Z",
                        stop: now4report, // same date as today
                        comments: ['something']
                    }
                ],
                current: {
                    project: "BondProject",
                    start: "2018-09-26T06:53:13.716Z",
                    comments: ['another comment']
                }
            };
            engine.handle(json, minimist(['--report']), now4report)
                .then(status => {
                    expect(status).to.eql({
                            "activated": true,
                            "modified": true,
                            "json": {
                                "aliases": {"BondProject": "007"},
                                "tracks": [
                                    {
                                        "project": "110105",
                                        "start": "2018-09-26T13:04:17.075Z",
                                        "stop": "2018-09-30T13:04:17.075Z",
                                        "comments": ['a comment']
                                    },
                                    {
                                        "project": "110105",
                                        "start": "2018-09-26T13:04:17.075Z",
                                        "stop": now4report,
                                        "comments": ['something']
                                    }
                                ],
                                "current": {
                                    "project": "BondProject",
                                    "start": "2018-09-26T06:53:13.716Z",
                                    "comments": ["another comment"]
                                }
                            },
                            "report": {
                                "projects": [
                                    {"seconds": 2423420, "comments": ["something"], "project": "110105"},
                                    {"seconds": 2445683, "comments": ["another comment"], "project": "BondProject"}
                                ],
                                "seconds": 4869103,
                                "current": {"seconds": 2445683, "project": "BondProject", "alias": undefined}
                            }
                        }
                    );
                    done();
                })
        });

        it('should handle HELP command', function (done) {
            engine.handle(fixtureJson, minimist(['--help']), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: false,
                            json: fixtureJson,
                            help: {
                                "command": " --setup --alias|a \"alias:project\" --start AliasOrProject --restart --stop [minutesToRemove] --comment \"Some comment\" --report|r --help|usage|sos|h",
                                "comments": ["minutesToRemove: optional count of minutes to remove to current date as stop date."]
                            }
                        }
                    );
                    done();
                })
        });

        it('should handle HELP command without any arguments', function (done) {
            engine.handle(fixtureJson, minimist([]), now)
                .then(status => {
                    expect(status).to.eql({
                            activated: true,
                            modified: false,
                            json: fixtureJson,
                            help: {
                                "command": " --setup --alias|a \"alias:project\" --start AliasOrProject --restart --stop [minutesToRemove] --comment \"Some comment\" --report|r --help|usage|sos|h",
                                "comments": ["minutesToRemove: optional count of minutes to remove to current date as stop date."]
                            }
                        }
                    );
                    done();
                })
        });

    });
});
