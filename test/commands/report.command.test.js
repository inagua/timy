const expect = require('chai').expect;
const minimist = require('minimist');
const ReportCommand = require('../../commands/report.command');


describe('Report Command', function () {

    const now = new Date('2018-10-24T14:14:37.075Z');
    var command;
    var json;

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
    });


    describe('.handle()', function () {

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
