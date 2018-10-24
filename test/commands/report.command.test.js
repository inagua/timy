const expect = require('chai').expect;
const minimist = require('minimist');
const ReportCommand = require('../../commands/report.command');


describe('Report Command', function () {

    const now = new Date('2018-10-24T14:14:37.075Z');
    var command;
    var json;
    var jsonWithTracks;

    beforeEach(function () {
        command = new ReportCommand();
        json = {
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
                    stop: now, // same date as today
                    comments: ['something']
                }
            ],
            current: {
                project: "BondProject",
                start: "2018-09-26T06:53:13.716Z",
                comments: ['another comment']
            }
        };

        jsonWithTracks = {
            "aliases": {
                "gtechna": "112505",
                "CivilCalendar": "110105"
            },
            "tracks": [
                // 2018-09-25
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "112505",
                    "stop": "2018-09-25T07:06:22.141Z",
                    "comments": ["a", "b"]
                },
                {
                    "start": "2018-09-26T07:06:22.141Z",
                    "project": "110105",
                    "stop": "2018-09-25T09:48:30.921Z",
                    "comments": ["c"]
                },
                // 2018-09-26
                {
                    "start": "2018-09-26T06:53:13.716Z",
                    "project": "112505",
                    "stop": "2018-09-26T07:06:22.141Z",
                    "comments": ["d", "e"]
                },
                {
                    "start": "2018-09-26T07:06:22.141Z",
                    "project": "110105",
                    "stop": "2018-09-26T09:48:30.921Z",
                    "comments": ["f"]
                },
                {
                    "start": "2018-09-26T10:43:22.644Z",
                    "project": "110105",
                    "stop": "2018-09-26T11:43:06.945Z",
                    "comments": ["g", "h"]
                },
                {
                    "start": "2018-09-26T11:43:06.945Z",
                    "project": "112505",
                    "stop": "2018-09-26T13:04:17.075Z",
                    "comments": ["i"]
                },
            ],
            "current": {
                "start": "2018-09-26T13:04:17.075Z",
                "project": "110105",
            }

        };

    });

    describe('.cli()', function () {
        it('should complete minimist options and CLI usage', function () {
            const minimistOptions = {};
            const usage = {};
            command.cli(minimistOptions, usage);
            expect(minimistOptions).to.eql({alias: {"r": "report"}});
            expect(usage).to.eql({
                command: ' --report|r',
                comments: []
            });
        });
    });


    describe('.buildReport()', function () {

        it('should generate report synchronously', function () {
            expect(command.buildReport(json, now)).to.eql({
                    "projects": [
                        {"seconds": 2423420, "comments": ["something"], "project": "110105"},
                        {"seconds": 2445683, "comments": ["another comment"], "project": "BondProject"}
                    ],
                    "seconds": 4869103,
                    "current": {"seconds": 2445683, "project": "BondProject", "alias": undefined}
                }
            );
        });

        it('should create an item per project for the current day if report argument is provided', function () {
            const now = new Date('2018-09-26T14:14:37.075Z');
            expect(command.buildReport(jsonWithTracks, now)).to.eql({
                projects: [
                    {project: '110105', alias: 'CivilCalendar', seconds: 17532, comments: ["f", "g", "h"]},
                    {project: '112505', alias: 'gtechna', seconds: 5658, comments: ["d", "e", "i"]}
                ],
                current: {project: "110105", alias: "CivilCalendar", seconds: 4220},
                seconds: 17532 + 5658
            });
        });

        it('should add comments of the current to the report', function () {
            const now = new Date('2018-09-26T14:14:37.075Z');
            const json = {
                aliases: [],
                tracks: [],
                current: {
                    start: "2018-09-26T13:04:17.075Z",
                    project: "110105",
                    comments: [ "Setup local environment" ]
                }
            };
            expect(command.buildReport(json, now)).to.eql({
                projects: [
                    {project: '110105', seconds: 4220, comments: ["Setup local environment"]},
                ],
                current: {project: "110105", seconds: 4220, alias: undefined },
                seconds: 4220
            });
        });

        it('[BUGFIX] should not add empty comments or alias if not present in tracks', function () {
            const now = new Date('2018-09-28T14:14:37.075Z');
            jsonWithTracks.current = undefined;
            jsonWithTracks.tracks.push({
                "start": "2018-09-28T11:43:06.945Z",
                "project": "GothamProject",
                "stop": "2018-09-28T13:04:17.075Z"
            });

            expect(command.buildReport(jsonWithTracks, now)).to.eql({
                projects: [{project: 'GothamProject', seconds: 4870, comments: []}],
                seconds: 4870
            });
        });

    });


    describe('.handle()', function () {

        it('should do nothing if no start argument provided', function (done) {
            command.handle({}, minimist(['--toto']), undefined).then(status => {
                expect(status).to.eql({
                    activated: false,
                    modified: false,
                    json: {}
                });
                done();
            });
        });

        it('should generate report asynchronously', function (done) {
            command.handle(json, minimist(['--report']), now)
                .then(status => {
                    // console.log('>>>>> 1:', JSON.stringify(status));
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
                                        "stop": now,
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

    });

})
;
